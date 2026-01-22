'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Clock,
  DollarSign,
  Activity,
  AlertCircle
} from 'lucide-react'

interface Order {
  orderId: string
  type: 'buy' | 'sell'
  creditType: string
  quantity: number
  pricePerCredit: number
  status: 'open' | 'partially-filled' | 'filled'
  creator: string
  timestamp: string
}

interface Trade {
  tradeId: string
  quantity: number
  price: number
  buyer: string
  seller: string
  timestamp: string
}

interface MarketPrice {
  creditType: string
  bid: number
  ask: number
  last: number
  trend: 'up' | 'down' | 'neutral'
}

// Sample price data for charts
const PRICE_HISTORY = [
  { time: '09:00', renewable: 10.2, forestry: 12.5, agriculture: 9.8, efficiency: 8.5 },
  { time: '10:00', renewable: 10.3, forestry: 12.4, agriculture: 9.9, efficiency: 8.6 },
  { time: '11:00', renewable: 10.1, forestry: 12.6, agriculture: 9.7, efficiency: 8.4 },
  { time: '12:00', renewable: 10.4, forestry: 12.3, agriculture: 10.0, efficiency: 8.7 },
  { time: '13:00', renewable: 10.5, forestry: 12.2, agriculture: 10.1, efficiency: 8.8 },
  { time: '14:00', renewable: 10.3, forestry: 12.4, agriculture: 9.9, efficiency: 8.6 },
  { time: '15:00', renewable: 10.6, forestry: 12.5, agriculture: 10.2, efficiency: 8.9 }
]

const VOLUME_DATA = [
  { creditType: 'Renewable', volume: 45000, value: 450000 },
  { creditType: 'Forestry', volume: 32000, value: 400000 },
  { creditType: 'Agriculture', volume: 28000, value: 280000 },
  { creditType: 'Efficiency', volume: 25000, value: 212500 }
]

const RECENT_TRADES: Trade[] = [
  { tradeId: 'trade_001', quantity: 500, price: 10.25, buyer: '0x742d...', seller: '0xAb5c...', timestamp: '14:32' },
  { tradeId: 'trade_002', quantity: 1200, price: 12.45, buyer: '0x5c3E...', seller: '0x8d2A...', timestamp: '14:28' },
  { tradeId: 'trade_003', quantity: 800, price: 9.95, buyer: '0x9f1B...', seller: '0xC4E7...', timestamp: '14:15' },
  { tradeId: 'trade_004', quantity: 300, price: 8.75, buyer: '0xD2F8...', seller: '0x1aA3...', timestamp: '13:58' },
  { tradeId: 'trade_005', quantity: 2000, price: 10.50, buyer: '0x4E9D...', seller: '0xB7c5...', timestamp: '13:42' }
]

export function MarketplaceTradingDashboard() {
  const [selectedCreditType, setSelectedCreditType] = useState('renewable')
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades' | 'charts' | 'create'>('orderbook')
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [orderForm, setOrderForm] = useState({
    type: 'buy' as 'buy' | 'sell',
    creditType: 'renewable',
    quantity: '',
    pricePerCredit: ''
  })
  const [mockOrders, setMockOrders] = useState<Order[]>([
    {
      orderId: 'order_001',
      type: 'buy',
      creditType: 'renewable',
      quantity: 1000,
      pricePerCredit: 10.15,
      status: 'open',
      creator: '0x742d35Cc6634C0532925a3b844Bc0e8b1E55e2e9',
      timestamp: '14:30'
    },
    {
      orderId: 'order_002',
      type: 'sell',
      creditType: 'renewable',
      quantity: 500,
      pricePerCredit: 10.35,
      status: 'open',
      creator: '0xAb5801a7d398351b8be11c63050f4155b3dd4e5b',
      timestamp: '14:25'
    },
    {
      orderId: 'order_003',
      type: 'buy',
      creditType: 'forestry',
      quantity: 750,
      pricePerCredit: 12.40,
      status: 'partially-filled',
      creator: '0x5c3E91C2FCC9D74d1B8b1c7E5e7e3E5e5e5e5e5e',
      timestamp: '14:20'
    }
  ])

  const marketPrices: Record<string, MarketPrice> = {
    renewable: { creditType: 'renewable', bid: 10.15, ask: 10.35, last: 10.25, trend: 'up' },
    forestry: { creditType: 'forestry', bid: 12.40, ask: 12.60, last: 12.50, trend: 'up' },
    agriculture: { creditType: 'agriculture', bid: 9.90, ask: 10.10, last: 10.00, trend: 'down' },
    efficiency: { creditType: 'efficiency', bid: 8.70, ask: 8.90, last: 8.80, trend: 'neutral' }
  }

  const currentPrice = marketPrices[selectedCreditType]
  const bid_ask_spread = ((currentPrice.ask - currentPrice.bid) / currentPrice.bid * 100).toFixed(2)

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderForm.quantity || !orderForm.pricePerCredit) return

    const newOrder: Order = {
      orderId: `order_${Date.now()}`,
      type: orderForm.type,
      creditType: orderForm.creditType,
      quantity: parseInt(orderForm.quantity),
      pricePerCredit: parseFloat(orderForm.pricePerCredit),
      status: 'open',
      creator: '0x742d35Cc6634C0532925a3b844Bc0e8b1E55e2e9',
      timestamp: new Date().toLocaleTimeString()
    }

    setMockOrders([...mockOrders, newOrder])
    setOrderForm({ type: 'buy', creditType: 'renewable', quantity: '', pricePerCredit: '' })
    setShowCreateOrder(false)
  }

  const cancelOrder = (orderId: string) => {
    setMockOrders(mockOrders.filter(o => o.orderId !== orderId))
  }

  const buyOrders = mockOrders.filter(o => o.type === 'buy' && o.creditType === selectedCreditType && o.status !== 'filled')
  const sellOrders = mockOrders.filter(o => o.type === 'sell' && o.creditType === selectedCreditType && o.status !== 'filled')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Carbon Credit Marketplace
            </h1>
            <p className="text-gray-600">
              Real-time order book, price discovery, and trading interface
            </p>
          </div>
          <Button
            onClick={() => setShowCreateOrder(true)}
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.values(marketPrices).map(price => (
            <Card key={price.creditType} className="border-l-4 border-l-emerald-500">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1 capitalize">{price.creditType}</div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  ${price.last.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {price.trend === 'up' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">+2.4%</span>
                    </>
                  ) : price.trend === 'down' ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">-1.2%</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Neutral</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Bid: ${price.bid.toFixed(2)} | Ask: ${price.ask.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credit Type Selection */}
        <div className="flex gap-2 flex-wrap">
          {['renewable', 'forestry', 'agriculture', 'efficiency'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedCreditType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCreditType === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-500'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {(['orderbook', 'trades', 'charts', 'create'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 font-medium transition-all ${
                activeTab === tab
                  ? 'border-b-emerald-600 text-emerald-600'
                  : 'border-b-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Order Book Tab */}
        {activeTab === 'orderbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buy Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                  Buy Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {buyOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No buy orders</p>
                ) : (
                  buyOrders.map(order => (
                    <div
                      key={order.orderId}
                      className="p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.quantity} credits @ ${order.pricePerCredit.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Total: ${(order.quantity * order.pricePerCredit).toFixed(2)}
                          </p>
                        </div>
                        <Badge className={order.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>{order.creator.slice(0, 10)}...</span>
                        <span>{order.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Sell Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  Sell Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {sellOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No sell orders</p>
                ) : (
                  sellOrders.map(order => (
                    <div
                      key={order.orderId}
                      className="p-3 bg-gradient-to-r from-red-50 to-transparent rounded-lg border border-red-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.quantity} credits @ ${order.pricePerCredit.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Total: ${(order.quantity * order.pricePerCredit).toFixed(2)}
                          </p>
                        </div>
                        <Badge className={order.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>{order.creator.slice(0, 10)}...</span>
                        <button
                          onClick={() => cancelOrder(order.orderId)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Time</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Quantity</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Price</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Buyer</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Seller</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_TRADES.map(trade => (
                      <tr key={trade.tradeId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">{trade.timestamp}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{trade.quantity}</td>
                        <td className="px-4 py-3 text-emerald-600 font-semibold">${trade.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-900">${(trade.quantity * trade.price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono">{trade.buyer}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono">{trade.seller}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Trends (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={PRICE_HISTORY}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="renewable" stroke="#10b981" name="Renewable" strokeWidth={2} />
                    <Line type="monotone" dataKey="forestry" stroke="#8b5cf6" name="Forestry" strokeWidth={2} />
                    <Line type="monotone" dataKey="agriculture" stroke="#f59e0b" name="Agriculture" strokeWidth={2} />
                    <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" name="Efficiency" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Volume by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={VOLUME_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="creditType" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="volume" fill="#10b981" name="Volume (credits)" />
                    <Bar dataKey="value" fill="#3b82f6" name="Value (USD)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Order Modal */}
        {showCreateOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Create New Order</CardTitle>
                <button
                  onClick={() => setShowCreateOrder(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['buy', 'sell'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, type })}
                          className={`px-3 py-2 rounded-lg font-medium transition-all ${
                            orderForm.type === type
                              ? type === 'buy'
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Type
                    </label>
                    <select
                      value={orderForm.creditType}
                      onChange={e => setOrderForm({ ...orderForm, creditType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="renewable">Renewable Energy</option>
                      <option value="forestry">Forestry</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="efficiency">Energy Efficiency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity (Credits)
                    </label>
                    <input
                      type="number"
                      value={orderForm.quantity}
                      onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })}
                      placeholder="Enter quantity"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Credit ($)
                    </label>
                    <input
                      type="number"
                      value={orderForm.pricePerCredit}
                      onChange={e => setOrderForm({ ...orderForm, pricePerCredit: e.target.value })}
                      placeholder="Enter price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      step="0.01"
                      min="0.01"
                    />
                  </div>

                  {orderForm.quantity && orderForm.pricePerCredit && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${(parseFloat(orderForm.quantity) * parseFloat(orderForm.pricePerCredit)).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Create Order
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateOrder(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Market Stats Footer */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Bid/Ask Spread</p>
                <p className="text-lg font-semibold text-emerald-600">{bid_ask_spread}%</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">24h Volume</p>
                <p className="text-lg font-semibold text-gray-900">125,500 Credits</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Total Trades</p>
                <p className="text-lg font-semibold text-gray-900">3,425</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Liquidity</p>
                <p className="text-lg font-semibold text-gray-900">$10.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MarketplaceTradingDashboard
