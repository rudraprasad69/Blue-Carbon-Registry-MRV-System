import { NextRequest, NextResponse } from 'next/server'
import { getCarbonMarketplaceService } from '@/lib/carbon-marketplace-service'

/**
 * POST /api/marketplace/order
 * Create a new market order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type, // 'buy' or 'sell'
      creditType,
      quantity,
      pricePerCredit,
      creator,
      timeToLive
    } = body

    const marketplace = getCarbonMarketplaceService()
    const order = await marketplace.createOrder(
      type,
      creditType,
      quantity,
      pricePerCredit,
      creator,
      timeToLive
    )

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        type: order.type,
        creditType: order.creditType,
        quantity: order.quantity,
        pricePerCredit: order.pricePerCredit.toFixed(2),
        total: order.total.toFixed(2),
        status: order.status,
        createdAt: order.createdAt,
        expiresAt: order.expiresAt
      }
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/marketplace/price
 * Get current market prices
 */
export async function getMarketPrices(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creditType = searchParams.get('creditType')

    const marketplace = getCarbonMarketplaceService()

    if (creditType) {
      const price = marketplace.getMarketPrice(creditType)
      if (!price) {
        return NextResponse.json(
          { error: 'Credit type not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        creditType: price.creditType,
        bid: price.bid.toFixed(2),
        ask: price.ask.toFixed(2),
        last: price.last.toFixed(2),
        volume24h: price.volume24h.toFixed(0),
        volumeTotal: price.volumeTotal.toFixed(0),
        volatility: (price.volatility * 100).toFixed(2) + '%',
        trend: price.trend,
        timestamp: price.timestamp
      })
    }

    // Return all credit type prices
    const creditTypes = ['renewable', 'forestry', 'agriculture', 'energy-efficiency']
    const prices = creditTypes.map(ct => {
      const price = marketplace.getMarketPrice(ct)
      return price
        ? {
            creditType: price.creditType,
            bid: price.bid.toFixed(2),
            ask: price.ask.toFixed(2),
            last: price.last.toFixed(2),
            trend: price.trend
          }
        : null
    }).filter(Boolean)

    return NextResponse.json({ prices })
  } catch (error) {
    console.error('Price fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/marketplace/order-book
 * Get order book for a credit type
 */
export async function getOrderBook(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creditType = searchParams.get('creditType') || 'renewable'

    const marketplace = getCarbonMarketplaceService()
    const orderBook = marketplace.getOrderBook(creditType)

    return NextResponse.json({
      creditType,
      bids: orderBook.bids.map(o => ({
        orderId: o.orderId,
        quantity: o.quantity,
        pricePerCredit: o.pricePerCredit.toFixed(2),
        total: o.total.toFixed(2),
        creator: o.creator,
        remainingQuantity: o.remainingQuantity
      })),
      asks: orderBook.asks.map(o => ({
        orderId: o.orderId,
        quantity: o.quantity,
        pricePerCredit: o.pricePerCredit.toFixed(2),
        total: o.total.toFixed(2),
        creator: o.creator,
        remainingQuantity: o.remainingQuantity
      }))
    })
  } catch (error) {
    console.error('Order book fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order book' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/marketplace/trades
 * Get recent trades
 */
export async function getTrades(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const marketplace = getCarbonMarketplaceService()
    const trades = marketplace.getTrades(limit)

    return NextResponse.json({
      trades: trades.map(t => ({
        tradeId: t.tradeId,
        quantity: t.quantity,
        price: t.price.toFixed(2),
        total: t.total.toFixed(2),
        buyer: t.buyer.slice(0, 10) + '...',
        seller: t.seller.slice(0, 10) + '...',
        timestamp: t.timestamp,
        status: t.status
      })),
      count: trades.length
    })
  } catch (error) {
    console.error('Trades fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/marketplace/liquidity
 * Get liquidity pool information
 */
export async function getLiquidity(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creditType = searchParams.get('creditType') || 'renewable'

    const marketplace = getCarbonMarketplaceService()
    const pool = marketplace.getPoolLiquidity(creditType)

    if (!pool) {
      return NextResponse.json(
        { error: 'Pool not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      poolId: pool.poolId,
      pair: `${pool.baseCredit}-${pool.quoteAsset}`,
      baseReserve: pool.baseReserve.toFixed(0),
      quoteReserve: pool.quoteReserve.toFixed(2),
      totalLiquidity: pool.totalLiquidity.toFixed(2),
      feePercentage: (pool.feePercentage * 100).toFixed(3) + '%',
      apy: (pool.apy * 100).toFixed(2) + '%',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Liquidity fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch liquidity' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/marketplace/swap
 * Calculate and execute a swap
 */
export async function executeSwap(request: NextRequest) {
  try {
    const body = await request.json()
    const { creditType, inputAmount, isInputBase = true, slippageTolerance = 0.01 } = body

    const marketplace = getCarbonMarketplaceService()
    const poolId = `pool_${creditType}_usdc`
    const swap = marketplace.calculateSwapPrice(poolId, inputAmount, isInputBase)

    const minOutput = swap.outputAmount * (1 - slippageTolerance)

    return NextResponse.json({
      success: true,
      swap: {
        inputAmount: inputAmount.toFixed(6),
        outputAmount: swap.outputAmount.toFixed(6),
        minOutputAmount: minOutput.toFixed(6),
        priceImpact: (swap.priceImpact * 100).toFixed(2) + '%',
        fee: swap.fee.toFixed(6),
        executionPrice: (swap.outputAmount / inputAmount).toFixed(6),
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Swap error:', error)
    return NextResponse.json(
      { error: 'Failed to execute swap' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/marketplace/settle-trade
 * Settle an executed trade
 */
export async function settleTrade(request: NextRequest) {
  try {
    const body = await request.json()
    const { tradeId, paymentHash } = body

    const marketplace = getCarbonMarketplaceService()
    const result = await marketplace.settleTrade(tradeId, paymentHash)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to settle trade' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      settlement: {
        tradeId,
        settlementHash: result.settlementHash,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Trade settlement error:', error)
    return NextResponse.json(
      { error: 'Failed to settle trade' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/marketplace/order
 * Get order details
 */
export async function getOrder(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      )
    }

    const marketplace = getCarbonMarketplaceService()
    const order = marketplace.getOrder(orderId)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      order: {
        orderId: order.orderId,
        type: order.type,
        creditType: order.creditType,
        quantity: order.quantity,
        pricePerCredit: order.pricePerCredit.toFixed(2),
        total: order.total.toFixed(2),
        creator: order.creator,
        status: order.status,
        remainingQuantity: order.remainingQuantity,
        fillCount: order.fills.length,
        createdAt: order.createdAt,
        expiresAt: order.expiresAt
      }
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/marketplace/order
 * Cancel an order
 */
export async function cancelOrder(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    const marketplace = getCarbonMarketplaceService()
    const result = marketplace.cancelOrder(orderId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    })
  } catch (error) {
    console.error('Order cancellation error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/marketplace/stats
 * Get marketplace statistics
 */
export async function getMarketplaceStats(request: NextRequest) {
  try {
    const marketplace = getCarbonMarketplaceService()
    const stats = marketplace.getMarketStats()

    return NextResponse.json({
      statistics: {
        totalVolume24h: stats.totalVolume24h.toFixed(2),
        totalTrades: stats.totalTrades,
        activeOrders: stats.activeOrders,
        liquidityUSD: stats.liquidityUSD.toFixed(2)
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
