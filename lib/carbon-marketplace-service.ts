/**
 * Carbon Marketplace Service
 * Handles carbon credit trading, price discovery, and order matching
 * Integrates with: Payment System, Blockchain, Price Oracles
 */

interface CarbonCredit {
  creditId: string
  projectId: string
  issuer: string
  amount: number
  vintage: string // Year of credit generation
  type: 'renewable' | 'forestry' | 'agriculture' | 'energy-efficiency'
  verified: boolean
  certificationBody: string
  metadata: {
    location?: string
    biodiversity?: number
    communityBenefit?: number
  }
}

interface MarketOrder {
  orderId: string
  type: 'buy' | 'sell'
  creditType: string
  quantity: number
  pricePerCredit: number
  total: number
  creator: string
  status: 'open' | 'partially-filled' | 'filled' | 'cancelled'
  createdAt: string
  expiresAt: string
  remainingQuantity: number
  fills: OrderFill[]
}

interface OrderFill {
  fillId: string
  quantity: number
  pricePerCredit: number
  filledAt: string
  counterparty: string
  transactionId: string
}

interface MarketPrice {
  creditType: string
  bid: number // Highest buy price
  ask: number // Lowest sell price
  last: number // Last executed price
  volume24h: number
  volumeTotal: number
  timestamp: string
  volatility: number
  trend: 'up' | 'down' | 'neutral'
}

interface PoolLiquidity {
  poolId: string
  baseCredit: string
  quoteAsset: string
  baseReserve: number
  quoteReserve: number
  totalLiquidity: number
  feePercentage: number
  apy: number
}

interface TradeExecution {
  tradeId: string
  buyOrder: string
  sellOrder: string
  quantity: number
  price: number
  total: number
  buyer: string
  seller: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'settled'
  blockchainHash?: string
}

class CarbonMarketplaceService {
  private static instance: CarbonMarketplaceService
  private orders: Map<string, MarketOrder> = new Map()
  private prices: Map<string, MarketPrice> = new Map()
  private trades: Map<string, TradeExecution> = new Map()
  private liquidity: Map<string, PoolLiquidity> = new Map()
  private orderBook: Map<string, MarketOrder[]> = new Map()

  private constructor() {
    this.initializePrices()
    this.initializeLiquidityPools()
    this.startPriceUpdater()
    this.startOrderMatcher()
  }

  public static getInstance(): CarbonMarketplaceService {
    if (!CarbonMarketplaceService.instance) {
      CarbonMarketplaceService.instance = new CarbonMarketplaceService()
    }
    return CarbonMarketplaceService.instance
  }

  /**
   * Initialize market prices for different credit types
   */
  private initializePrices(): void {
    const creditTypes = ['renewable', 'forestry', 'agriculture', 'energy-efficiency']
    const basePrice = 10 // $10 per credit base

    for (const type of creditTypes) {
      const volatility = 0.05 + Math.random() * 0.1

      this.prices.set(type, {
        creditType: type,
        bid: basePrice - volatility,
        ask: basePrice + volatility,
        last: basePrice,
        volume24h: 50000 + Math.random() * 100000,
        volumeTotal: 5000000,
        timestamp: new Date().toISOString(),
        volatility,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })

      this.orderBook.set(type, [])
    }
  }

  /**
   * Initialize liquidity pools (AMM for continuous trading)
   */
  private initializeLiquidityPools(): void {
    const creditTypes = ['renewable', 'forestry', 'agriculture', 'energy-efficiency']

    for (const type of creditTypes) {
      const poolId = `pool_${type}_usdc`

      this.liquidity.set(poolId, {
        poolId,
        baseCredit: type,
        quoteAsset: 'USDC',
        baseReserve: 100000 + Math.random() * 500000, // Credits
        quoteReserve: 1000000 + Math.random() * 5000000, // USDC
        totalLiquidity: 10000000, // Total USD value
        feePercentage: 0.003, // 0.3% swap fee
        apy: 0.15 + Math.random() * 0.2 // 15-35% APY from trading fees
      })
    }
  }

  /**
   * Create a market order (buy or sell)
   */
  public async createOrder(
    type: 'buy' | 'sell',
    creditType: string,
    quantity: number,
    pricePerCredit: number,
    creator: string,
    timeToLive: number = 86400000 // 24 hours default
  ): Promise<MarketOrder> {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    const expiresAt = new Date(now.getTime() + timeToLive)

    const order: MarketOrder = {
      orderId,
      type,
      creditType,
      quantity,
      pricePerCredit,
      total: quantity * pricePerCredit,
      creator,
      status: 'open',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      remainingQuantity: quantity,
      fills: []
    }

    this.orders.set(orderId, order)

    // Add to order book
    if (!this.orderBook.has(creditType)) {
      this.orderBook.set(creditType, [])
    }
    this.orderBook.get(creditType)!.push(order)

    // Attempt matching
    this.matchOrder(orderId)

    return order
  }

  /**
   * Match incoming order against existing orders
   */
  private async matchOrder(orderId: string): Promise<void> {
    const order = this.orders.get(orderId)
    if (!order || order.status === 'filled') return

    const oppositeOrders = this.getOppositeOrders(
      order.type,
      order.creditType,
      order.pricePerCredit
    )

    for (const oppositeOrder of oppositeOrders) {
      if (order.remainingQuantity === 0) break

      const fillQuantity = Math.min(
        order.remainingQuantity,
        oppositeOrder.remainingQuantity
      )

      // Execute trade
      const trade = await this.executeTrade(
        order.type === 'buy' ? oppositeOrder.orderId : orderId,
        order.type === 'buy' ? orderId : oppositeOrder.orderId,
        fillQuantity,
        oppositeOrder.pricePerCredit,
        oppositeOrder.type === 'sell' ? oppositeOrder.creator : order.creator,
        oppositeOrder.type === 'sell' ? order.creator : oppositeOrder.creator
      )

      // Record fills
      const fill: OrderFill = {
        fillId: trade.tradeId,
        quantity: fillQuantity,
        pricePerCredit: oppositeOrder.pricePerCredit,
        filledAt: trade.timestamp,
        counterparty:
          order.type === 'buy' ? oppositeOrder.creator : order.creator,
        transactionId: trade.tradeId
      }

      order.fills.push(fill)
      order.remainingQuantity -= fillQuantity

      if (oppositeOrder.remainingQuantity > 0) {
        oppositeOrder.fills.push({
          ...fill,
          counterparty: order.creator
        })
        oppositeOrder.remainingQuantity -= fillQuantity
      }
    }

    // Update order status
    if (order.remainingQuantity === 0) {
      order.status = 'filled'
    } else if (order.fills.length > 0) {
      order.status = 'partially-filled'
    }
  }

  /**
   * Get opposite orders for matching
   */
  private getOppositeOrders(
    orderType: 'buy' | 'sell',
    creditType: string,
    maxPrice: number
  ): MarketOrder[] {
    const orderBook = this.orderBook.get(creditType) || []
    const oppositeType = orderType === 'buy' ? 'sell' : 'buy'

    return orderBook
      .filter(
        o =>
          o.type === oppositeType &&
          o.status !== 'filled' &&
          o.remainingQuantity > 0 &&
          (orderType === 'buy' ? o.pricePerCredit <= maxPrice : o.pricePerCredit >= maxPrice)
      )
      .sort(
        (a, b) =>
          (orderType === 'buy' ? a.pricePerCredit : b.pricePerCredit) -
          (orderType === 'buy' ? b.pricePerCredit : a.pricePerCredit)
      )
  }

  /**
   * Execute a trade
   */
  private async executeTrade(
    sellOrderId: string,
    buyOrderId: string,
    quantity: number,
    price: number,
    buyer: string,
    seller: string
  ): Promise<TradeExecution> {
    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const trade: TradeExecution = {
      tradeId,
      buyOrder: buyOrderId,
      sellOrder: sellOrderId,
      quantity,
      price,
      total: quantity * price,
      buyer,
      seller,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }

    this.trades.set(tradeId, trade)

    // Update market price
    this.updateMarketPrice(
      this.orders.get(sellOrderId)?.creditType || 'renewable',
      price
    )

    return trade
  }

  /**
   * Settle a trade (transfer credits and payment)
   */
  public async settleTrade(
    tradeId: string,
    paymentHash: string
  ): Promise<{ success: boolean; settlementHash?: string }> {
    const trade = this.trades.get(tradeId)
    if (!trade) {
      return { success: false }
    }

    try {
      // In production: call smart contract to settle
      const settlementHash = `0x${Math.random().toString(16).substr(2, 64)}`
      trade.status = 'settled'
      trade.blockchainHash = settlementHash

      return { success: true, settlementHash }
    } catch (error) {
      console.error('Trade settlement error:', error)
      return { success: false }
    }
  }

  /**
   * Update market price based on executed trade
   */
  private updateMarketPrice(creditType: string, executedPrice: number): void {
    const price = this.prices.get(creditType)
    if (!price) return

    // Move last price and adjust bid/ask spread
    price.last = executedPrice
    price.bid = executedPrice - 0.5
    price.ask = executedPrice + 0.5
    price.timestamp = new Date().toISOString()

    // Determine trend
    if (executedPrice > price.ask) {
      price.trend = 'up'
    } else if (executedPrice < price.bid) {
      price.trend = 'down'
    } else {
      price.trend = 'neutral'
    }
  }

  /**
   * Get market price for a credit type
   */
  public getMarketPrice(creditType: string): MarketPrice | null {
    return this.prices.get(creditType) || null
  }

  /**
   * Get order book for a credit type
   */
  public getOrderBook(creditType: string): { bids: MarketOrder[]; asks: MarketOrder[] } {
    const orders = this.orderBook.get(creditType) || []

    const bids = orders
      .filter(o => o.type === 'buy' && o.status !== 'filled' && o.remainingQuantity > 0)
      .sort((a, b) => b.pricePerCredit - a.pricePerCredit)
      .slice(0, 10)

    const asks = orders
      .filter(o => o.type === 'sell' && o.status !== 'filled' && o.remainingQuantity > 0)
      .sort((a, b) => a.pricePerCredit - b.pricePerCredit)
      .slice(0, 10)

    return { bids, asks }
  }

  /**
   * Get liquidity pool for a trading pair
   */
  public getPoolLiquidity(creditType: string): PoolLiquidity | null {
    return this.liquidity.get(`pool_${creditType}_usdc`) || null
  }

  /**
   * Swap credits using AMM (Automated Market Maker)
   */
  public calculateSwapPrice(
    poolId: string,
    inputAmount: number,
    isInputBase: boolean = true
  ): { outputAmount: number; priceImpact: number; fee: number } {
    const pool = this.liquidity.get(poolId)
    if (!pool) {
      return { outputAmount: 0, priceImpact: 0, fee: 0 }
    }

    // Constant product formula: x * y = k
    const inputReserve = isInputBase ? pool.baseReserve : pool.quoteReserve
    const outputReserve = isInputBase ? pool.quoteReserve : pool.baseReserve

    const fee = inputAmount * pool.feePercentage
    const inputAfterFee = inputAmount - fee

    const outputAmount =
      outputReserve - (inputReserve * outputReserve) / (inputReserve + inputAfterFee)

    // Calculate price impact
    const spotPrice = outputReserve / inputReserve
    const executionPrice = outputAmount / inputAfterFee
    const priceImpact = 1 - executionPrice / spotPrice

    return { outputAmount, priceImpact, fee }
  }

  /**
   * Get all trades
   */
  public getTrades(limit: number = 50): TradeExecution[] {
    return Array.from(this.trades.values()).slice(-limit)
  }

  /**
   * Get market statistics
   */
  public getMarketStats(): {
    totalVolume24h: number
    totalTrades: number
    activeOrders: number
    liquidityUSD: number
  } {
    let totalVolume24h = 0
    for (const price of this.prices.values()) {
      totalVolume24h += price.volume24h * price.last
    }

    let liquidityUSD = 0
    for (const pool of this.liquidity.values()) {
      liquidityUSD += pool.totalLiquidity
    }

    return {
      totalVolume24h,
      totalTrades: this.trades.size,
      activeOrders: Array.from(this.orders.values()).filter(
        o => o.status !== 'filled' && o.status !== 'cancelled'
      ).length,
      liquidityUSD
    }
  }

  /**
   * Cancel an order
   */
  public cancelOrder(orderId: string): { success: boolean; error?: string } {
    const order = this.orders.get(orderId)
    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    if (order.status === 'filled') {
      return { success: false, error: 'Cannot cancel filled order' }
    }

    order.status = 'cancelled'
    order.remainingQuantity = 0

    return { success: true }
  }

  /**
   * Start automatic price updater
   */
  private startPriceUpdater(): void {
    setInterval(() => {
      for (const [creditType, price] of this.prices.entries()) {
        // Simulate price movement based on volume and trend
        const volumeInfluence = price.volume24h / 1000000
        const trendMultiplier = price.trend === 'up' ? 1.02 : price.trend === 'down' ? 0.98 : 1.0
        const volatility = (Math.random() - 0.5) * 2 * price.volatility

        const newPrice = price.last * trendMultiplier * (1 + volatility / 100)

        price.last = newPrice
        price.bid = newPrice - 0.5
        price.ask = newPrice + 0.5
        price.timestamp = new Date().toISOString()
      }
    }, 60000) // Update every minute
  }

  /**
   * Start automatic order matching
   */
  private startOrderMatcher(): void {
    setInterval(() => {
      for (const orders of this.orderBook.values()) {
        for (const order of orders) {
          if (order.status !== 'filled') {
            this.matchOrder(order.orderId)
          }
        }
      }
    }, 30000) // Match every 30 seconds
  }

  /**
   * Get order by ID
   */
  public getOrder(orderId: string): MarketOrder | null {
    return this.orders.get(orderId) || null
  }

  /**
   * Get trades for a user
   */
  public getUserTrades(userAddress: string): TradeExecution[] {
    return Array.from(this.trades.values()).filter(
      t => t.buyer === userAddress || t.seller === userAddress
    )
  }
}

export function getCarbonMarketplaceService(): CarbonMarketplaceService {
  return CarbonMarketplaceService.getInstance()
}

export type {
  CarbonCredit,
  MarketOrder,
  OrderFill,
  MarketPrice,
  PoolLiquidity,
  TradeExecution
}
