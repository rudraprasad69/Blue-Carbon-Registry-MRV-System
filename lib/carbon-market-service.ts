/**
 * Carbon Market Integration Service
 * Manages credit trading, price feeds, and marketplace transactions
 * 
 * Features:
 * - Credit trading/buying/selling
 * - Dynamic price feeds
 * - Transaction management
 * - Portfolio management
 * - Market analytics
 */

export interface CreditPrice {
  timestamp: Date
  priceUSD: number
  priceEUR: number
  priceGBP: number
  source: string
  volatility: number
}

export interface Transaction {
  transactionId: string
  timestamp: Date
  type: 'buy' | 'sell'
  projectId: string
  creditsAmount: number
  pricePerCredit: number
  totalValue: number
  currency: 'USD' | 'EUR' | 'GBP'
  status: 'pending' | 'completed' | 'failed'
  counterparty?: string
  fee: number
}

export interface MarketOrder {
  orderId: string
  type: 'buy' | 'sell'
  projectId: string
  creditsAmount: number
  pricePerCredit: number
  status: 'open' | 'partially_filled' | 'filled' | 'cancelled'
  createdAt: Date
  expiresAt: Date
  filledAmount: number
}

export interface PortfolioPosition {
  projectId: string
  projectName: string
  creditsOwned: number
  averageCostPerCredit: number
  currentMarketPrice: number
  totalValue: number
  unrealizedGain: number
  unrealizedGainPercent: number
  lastUpdate: Date
}

export interface MarketMetrics {
  timestamp: Date
  totalCreditsTraded: number
  totalValue: number
  averagePrice: number
  priceHigh: number
  priceLow: number
  volatility: number
  buyVolume: number
  sellVolume: number
  activeOrders: number
}

export interface TradingLimits {
  maxCreditsPerTransaction: number
  maxDailyTransactions: number
  minCreditsPerOrder: number
  maxPriceDeviation: number // % from market price
}

/**
 * Carbon Market Service - Singleton
 * Manages marketplace operations and trading
 */
class CarbonMarketService {
  private static instance: CarbonMarketService
  private creditPrices: CreditPrice[] = []
  private transactions: Map<string, Transaction> = new Map()
  private openOrders: Map<string, MarketOrder> = new Map()
  private portfolios: Map<string, PortfolioPosition[]> = new Map()
  private tradingLimits: TradingLimits = {
    maxCreditsPerTransaction: 100000,
    maxDailyTransactions: 50,
    minCreditsPerOrder: 100,
    maxPriceDeviation: 10,
  }
  private currentMarketPrice: number = 25.5 // USD per credit
  private priceUpdateInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.initializePriceHistory()
    this.startPriceUpdates()
  }

  static getInstance(): CarbonMarketService {
    if (!this.instance) {
      this.instance = new CarbonMarketService()
    }
    return this.instance
  }

  /**
   * Initialize historical price data
   */
  private initializePriceHistory() {
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() - 30)

    for (let i = 0; i < 30; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)

      // Simulate price with trend and volatility
      const trend = i * 0.1
      const volatility = (Math.random() - 0.5) * 2
      const price = 25 + trend + volatility

      this.creditPrices.push({
        timestamp: date,
        priceUSD: price,
        priceEUR: price * 0.92,
        priceGBP: price * 0.79,
        source: 'market-feed',
        volatility: Math.abs(volatility),
      })
    }
  }

  /**
   * Start automatic price updates
   */
  private startPriceUpdates() {
    // Simulated price updates every hour
    this.priceUpdateInterval = setInterval(() => {
      const lastPrice = this.creditPrices[this.creditPrices.length - 1]?.priceUSD || 25
      const change = (Math.random() - 0.5) * 1 // ±0.5 variation
      const newPrice = Math.max(20, lastPrice + change)

      this.creditPrices.push({
        timestamp: new Date(),
        priceUSD: newPrice,
        priceEUR: newPrice * 0.92,
        priceGBP: newPrice * 0.79,
        source: 'market-feed',
        volatility: Math.abs(change),
      })

      // Keep last 365 days
      if (this.creditPrices.length > 365 * 24) {
        this.creditPrices.shift()
      }

      this.currentMarketPrice = newPrice
    }, 3600000) // 1 hour in production
  }

  /**
   * Get current market price
   */
  getCurrentPrice(): CreditPrice {
    const latest = this.creditPrices[this.creditPrices.length - 1]
    return (
      latest || {
        timestamp: new Date(),
        priceUSD: 25.5,
        priceEUR: 23.46,
        priceGBP: 20.145,
        source: 'market-feed',
        volatility: 0.5,
      }
    )
  }

  /**
   * Get price history
   */
  getPriceHistory(days: number = 30): CreditPrice[] {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    return this.creditPrices.filter((p) => p.timestamp >= cutoff)
  }

  /**
   * Place a market order
   */
  placeOrder(order: Omit<MarketOrder, 'orderId' | 'filledAmount'>): MarketOrder {
    // Validate order
    if (order.creditsAmount < this.tradingLimits.minCreditsPerOrder) {
      throw new Error(`Minimum order size is ${this.tradingLimits.minCreditsPerOrder} credits`)
    }

    if (order.creditsAmount > this.tradingLimits.maxCreditsPerTransaction) {
      throw new Error(`Maximum order size is ${this.tradingLimits.maxCreditsPerTransaction} credits`)
    }

    const priceDeviation = Math.abs((order.pricePerCredit - this.currentMarketPrice) / this.currentMarketPrice) * 100
    if (priceDeviation > this.tradingLimits.maxPriceDeviation) {
      throw new Error(
        `Price deviation exceeds ${this.tradingLimits.maxPriceDeviation}%. Current market price: $${this.currentMarketPrice.toFixed(2)}`,
      )
    }

    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newOrder: MarketOrder = {
      orderId,
      ...order,
      status: 'open',
      filledAmount: 0,
      createdAt: new Date(),
    }

    this.openOrders.set(orderId, newOrder)

    // Simulate automatic filling for market orders
    this.processOrderFilling(orderId)

    return newOrder
  }

  /**
   * Process order filling
   */
  private processOrderFilling(orderId: string) {
    const order = this.openOrders.get(orderId)
    if (!order) return

    // Simulate partial or full fill
    const fillPercentage = Math.random() * 1 // 0-100%
    const filledAmount = Math.floor(order.creditsAmount * fillPercentage)

    order.filledAmount = filledAmount
    order.status = filledAmount >= order.creditsAmount ? 'filled' : filledAmount > 0 ? 'partially_filled' : 'open'

    // Create transaction for filled amount
    if (filledAmount > 0) {
      this.createTransaction({
        type: order.type,
        projectId: order.projectId,
        creditsAmount: filledAmount,
        pricePerCredit: order.pricePerCredit,
        currency: 'USD',
      })
    }
  }

  /**
   * Cancel an open order
   */
  cancelOrder(orderId: string): boolean {
    const order = this.openOrders.get(orderId)
    if (!order) return false

    order.status = 'cancelled'
    this.openOrders.delete(orderId)
    return true
  }

  /**
   * Create a transaction
   */
  private createTransaction(data: {
    type: 'buy' | 'sell'
    projectId: string
    creditsAmount: number
    pricePerCredit: number
    currency: 'USD' | 'EUR' | 'GBP'
  }) {
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const fee = data.creditsAmount * data.pricePerCredit * 0.01 // 1% fee

    const transaction: Transaction = {
      transactionId,
      timestamp: new Date(),
      type: data.type,
      projectId: data.projectId,
      creditsAmount: data.creditsAmount,
      pricePerCredit: data.pricePerCredit,
      totalValue: data.creditsAmount * data.pricePerCredit,
      currency: data.currency,
      status: 'completed',
      fee,
    }

    this.transactions.set(transactionId, transaction)

    // Update portfolio
    this.updatePortfolio(data.projectId, data.type, data.creditsAmount, data.pricePerCredit)

    return transaction
  }

  /**
   * Update portfolio with transaction
   */
  private updatePortfolio(projectId: string, type: 'buy' | 'sell', credits: number, price: number) {
    const key = `${projectId}-portfolio`
    let positions = this.portfolios.get(key) || []

    let position = positions.find((p) => p.projectId === projectId)

    if (!position) {
      position = {
        projectId,
        projectName: `Project ${projectId}`,
        creditsOwned: 0,
        averageCostPerCredit: price,
        currentMarketPrice: this.currentMarketPrice,
        totalValue: 0,
        unrealizedGain: 0,
        unrealizedGainPercent: 0,
        lastUpdate: new Date(),
      }
      positions.push(position)
    }

    if (type === 'buy') {
      // Update cost basis
      const totalCost = position.creditsOwned * position.averageCostPerCredit + credits * price
      position.creditsOwned += credits
      position.averageCostPerCredit = totalCost / position.creditsOwned
    } else {
      position.creditsOwned = Math.max(0, position.creditsOwned - credits)
    }

    // Update market value
    position.currentMarketPrice = this.currentMarketPrice
    position.totalValue = position.creditsOwned * position.currentMarketPrice
    position.unrealizedGain = position.totalValue - position.creditsOwned * position.averageCostPerCredit
    position.unrealizedGainPercent =
      position.creditsOwned > 0 ? (position.unrealizedGain / (position.creditsOwned * position.averageCostPerCredit)) * 100 : 0
    position.lastUpdate = new Date()

    this.portfolios.set(key, positions)
  }

  /**
   * Get portfolio for a project
   */
  getPortfolio(projectId: string): PortfolioPosition | null {
    const key = `${projectId}-portfolio`
    const positions = this.portfolios.get(key) || []
    return positions.find((p) => p.projectId === projectId) || null
  }

  /**
   * Get all transactions
   */
  getTransactions(type?: 'buy' | 'sell', limit: number = 100): Transaction[] {
    let txns = Array.from(this.transactions.values())

    if (type) {
      txns = txns.filter((t) => t.type === type)
    }

    return txns.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
  }

  /**
   * Get market metrics
   */
  getMarketMetrics(): MarketMetrics {
    const prices = this.getPriceHistory(1)
    const txns = this.getTransactions()

    const buyVolume = txns.filter((t) => t.type === 'buy').reduce((sum, t) => sum + t.creditsAmount, 0)
    const sellVolume = txns.filter((t) => t.type === 'sell').reduce((sum, t) => sum + t.creditsAmount, 0)
    const totalValue = txns.reduce((sum, t) => sum + t.totalValue, 0)

    const pricesUSD = prices.map((p) => p.priceUSD)
    const priceHigh = Math.max(...pricesUSD)
    const priceLow = Math.min(...pricesUSD)

    const volatilityData = prices.map((p) => p.volatility)
    const avgVolatility = volatilityData.reduce((a, b) => a + b, 0) / volatilityData.length

    return {
      timestamp: new Date(),
      totalCreditsTraded: buyVolume + sellVolume,
      totalValue,
      averagePrice: this.currentMarketPrice,
      priceHigh,
      priceLow,
      volatility: avgVolatility,
      buyVolume,
      sellVolume,
      activeOrders: this.openOrders.size,
    }
  }

  /**
   * Get open orders
   */
  getOpenOrders(): MarketOrder[] {
    return Array.from(this.openOrders.values()).filter((o) => o.status === 'open' || o.status === 'partially_filled')
  }

  /**
   * Update trading limits
   */
  updateTradingLimits(limits: Partial<TradingLimits>) {
    this.tradingLimits = { ...this.tradingLimits, ...limits }
  }

  /**
   * Get trading limits
   */
  getTradingLimits(): TradingLimits {
    return this.tradingLimits
  }

  /**
   * Calculate portfolio value
   */
  calculatePortfolioValue(portfolios: PortfolioPosition[]): {
    totalValue: number
    totalCost: number
    unrealizedGain: number
    unrealizedGainPercent: number
  } {
    const totalValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
    const totalCost = portfolios.reduce((sum, p) => sum + p.creditsOwned * p.averageCostPerCredit, 0)
    const unrealizedGain = totalValue - totalCost
    const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0

    return {
      totalValue,
      totalCost,
      unrealizedGain,
      unrealizedGainPercent,
    }
  }

  /**
   * Cleanup on destroy
   */
  destroy() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval)
    }
  }
}

// Export singleton instance getter
export function getCarbonMarketService(): CarbonMarketService {
  return CarbonMarketService.getInstance()
}
