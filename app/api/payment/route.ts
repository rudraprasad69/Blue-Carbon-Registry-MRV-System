import { NextRequest, NextResponse } from 'next/server'
import { getPaymentSettlementService } from '@/lib/payment-settlement-service'

/**
 * POST /api/payment/initiate
 * Initiate a new payment transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      projectId,
      credits,
      amount,
      currency = 'USDC',
      buyer,
      seller
    } = body

    // Validate input
    if (!projectId || !buyer || !seller) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const paymentService = getPaymentSettlementService()

    // Validate payment parameters
    const validation = paymentService.validatePayment(amount, credits, amount / credits)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Initiate payment
    const transaction = await paymentService.initiatePayment(
      projectId,
      credits,
      amount,
      currency,
      buyer,
      seller
    )

    return NextResponse.json({
      success: true,
      transaction: {
        transactionId: transaction.transactionId,
        projectId,
        credits,
        amount,
        currency,
        status: transaction.status,
        gasFee: transaction.gasFee.toFixed(6),
        timestamp: transaction.timestamp
      }
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/price-feed
 * Get current stablecoin prices from multiple oracles
 */
export async function getPriceFeed(request: NextRequest) {
  try {
    const paymentService = getPaymentSettlementService()
    const feed = paymentService.getPriceFeed()

    // Calculate weighted averages
    const weightedPrices = {
      usdc: paymentService.getWeightedAveragePrice('USDC'),
      usdt: paymentService.getWeightedAveragePrice('USDT'),
      eth: paymentService.getWeightedAveragePrice('ETH')
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      oracles: feed.map(oracle => ({
        source: oracle.source,
        confidence: oracle.confidence,
        prices: {
          usdc: oracle.usdcPrice,
          usdt: oracle.usdtPrice,
          eth: oracle.ethPrice
        }
      })),
      weightedAverages: weightedPrices
    })
  } catch (error) {
    console.error('Price feed error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price feed' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/payment/confirm
 * Confirm payment after blockchain confirmation
 */
export async function confirmPayment(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, blockchainHash, confirmations } = body

    const paymentService = getPaymentSettlementService()
    const transaction = await paymentService.confirmPayment(
      transactionId,
      blockchainHash,
      confirmations
    )

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        confirmations: transaction.confirmations,
        blockchainHash
      }
    })
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/gas-estimate
 * Estimate gas fees for different currencies
 */
export async function getGasEstimate(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currency = (searchParams.get('currency') || 'USDC') as 'USDC' | 'USDT' | 'ETH'

    const paymentService = getPaymentSettlementService()
    const gasFee = await paymentService.estimateGasFee(currency)

    return NextResponse.json({
      currency,
      gasFee: gasFee.toFixed(6),
      unit: 'USDC equivalent',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Gas estimation error:', error)
    return NextResponse.json(
      { error: 'Failed to estimate gas' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/wallet-balance
 * Get stablecoin balance for a wallet
 */
export async function getWalletBalance(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const paymentService = getPaymentSettlementService()
    const balance = await paymentService.getWalletBalance(walletAddress)

    return NextResponse.json({
      walletAddress,
      balances: {
        usdc: balance.usdc.toFixed(2),
        usdt: balance.usdt.toFixed(2),
        eth: balance.eth.toFixed(4)
      },
      lastUpdated: balance.lastUpdated
    })
  } catch (error) {
    console.error('Balance fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet balance' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/swap-route
 * Find best swap route between currencies
 */
export async function findSwapRoute(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') || 'USDC'
    const to = searchParams.get('to') || 'USDT'
    const amount = parseFloat(searchParams.get('amount') || '1000')

    const paymentService = getPaymentSettlementService()
    const route = paymentService.findBestPaymentRoute(from, to, amount)

    const expectedOutput = amount * route.rate
    const slippageAmount = expectedOutput * route.slippage

    return NextResponse.json({
      from,
      to,
      amount,
      route: {
        routeId: route.routeId,
        expectedOutput: expectedOutput.toFixed(6),
        slippage: (route.slippage * 100).toFixed(2) + '%',
        slippageAmount: slippageAmount.toFixed(6),
        liquidityPool: route.liquidityPool.toLocaleString(),
        estimatedGas: route.estimatedGas.toLocaleString()
      }
    })
  } catch (error) {
    console.error('Swap route error:', error)
    return NextResponse.json(
      { error: 'Failed to find swap route' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/transaction
 * Get transaction details
 */
export async function getTransaction(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('id')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      )
    }

    const paymentService = getPaymentSettlementService()
    const transaction = paymentService.getPaymentDetails(transactionId)

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      transaction: {
        transactionId: transaction.transactionId,
        projectId: transaction.projectId,
        credits: transaction.credits,
        amount: transaction.amount.toFixed(2),
        currency: transaction.currency,
        buyer: transaction.buyer,
        seller: transaction.seller,
        status: transaction.status,
        gasFee: transaction.gasFee.toFixed(6),
        confirmations: transaction.confirmations,
        timestamp: transaction.timestamp
      }
    })
  } catch (error) {
    console.error('Transaction fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/stats
 * Get payment statistics
 */
export async function getPaymentStats(request: NextRequest) {
  try {
    const paymentService = getPaymentSettlementService()
    const stats = paymentService.getPaymentStats()

    return NextResponse.json({
      statistics: {
        totalTransactions: stats.totalTransactions,
        totalValue: stats.totalValue.toFixed(2),
        totalCredits: stats.totalCredits,
        averageTransactionSize: stats.averageTransactionSize.toFixed(2),
        successRate: (stats.successRate * 100).toFixed(2) + '%'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment stats' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/payment/settlement/batch
 * Process settlement batch
 */
export async function processSettlementBatch(request: NextRequest) {
  try {
    const body = await request.json()
    const { batchId } = body

    const paymentService = getPaymentSettlementService()
    const batch = await paymentService.processSettlementBatch(batchId)

    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      batch: {
        batchId: batch.batchId,
        transactionCount: batch.transactions.length,
        totalAmount: batch.totalAmount.toFixed(2),
        totalCredits: batch.totalCredits,
        status: batch.status,
        blockchainHash: batch.blockchainHash,
        timestamp: batch.timestamp
      }
    })
  } catch (error) {
    console.error('Settlement batch error:', error)
    return NextResponse.json(
      { error: 'Failed to process settlement batch' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/payment/refund
 * Refund a transaction
 */
export async function refundTransaction(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, reason } = body

    const paymentService = getPaymentSettlementService()
    const result = await paymentService.refundTransaction(transactionId, reason)

    return NextResponse.json({
      success: result.success,
      refundHash: result.refundHash,
      error: result.error
    })
  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
