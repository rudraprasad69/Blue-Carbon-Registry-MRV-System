'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import type { CreditPrice, MarketMetrics } from '@/lib/carbon-market-service'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface MarketAnalyticsDashboardProps {
  showPriceHistory?: boolean
  showVolume?: boolean
}

export function MarketAnalyticsDashboard({
  showPriceHistory = true,
  showVolume = true,
}: MarketAnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null)
  const [priceHistory, setPriceHistory] = useState<CreditPrice[]>([])
  const [currentPrice, setCurrentPrice] = useState<CreditPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const ws = useWebSocket({ autoConnect: true })

  useEffect(() => {
    if (ws.isConnected) {
      ws.subscribe(['price_updates', 'market_metrics'])
      ws.getMarketMetrics()
      ws.getCurrentPrice()
    }
  }, [ws.isConnected, ws])

  useEffect(() => {
    const unsubscribe = ws.onMessage((msg) => {
      switch (msg.type) {
        case 'price_update':
        case 'price_data':
          setCurrentPrice(msg.data)
          setPriceHistory((prev) => {
            const newHistory = [...prev, msg.data]
            return newHistory.slice(-30) // Keep history to a reasonable length
          })
          if (loading) setLoading(false)
          break
        case 'market_metrics':
          setMetrics(msg.data)
          if (loading) setLoading(false)
          break
      }
    })
    return unsubscribe
  }, [ws, loading])

  const chartData = useMemo(() => {
    return priceHistory.map((p) => ({
      ...p,
      timestamp: new Date(p.timestamp).toLocaleDateString(),
    }))
  }, [priceHistory])

  if (loading || !metrics || !currentPrice) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📊</div>
          <p className="text-slate-400">Loading market data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-emerald-900 rounded-lg border border-blue-700 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">💱 Carbon Market Analytics</h1>
        <p className="text-blue-200">Real-time market data and trading insights</p>
      </div>

      {/* Price Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Price */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Current Price</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-emerald-400">${currentPrice.priceUSD.toFixed(2)}</p>
            <p className="text-sm text-slate-400 mb-1">per credit</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {new Date(currentPrice.timestamp).toLocaleTimeString()}
          </p>
        </div>

        {/* Price High */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">24h High</p>
          <p className="text-3xl font-bold text-emerald-400">${metrics.priceHigh.toFixed(2)}</p>
          <div className="mt-3 bg-slate-800 rounded h-1">
            <div
              className="bg-emerald-600 h-1 rounded"
              style={{
                width: `${
                  ((currentPrice.priceUSD - metrics.priceLow) /
                    (metrics.priceHigh - metrics.priceLow)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Price Low */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">24h Low</p>
          <p className="text-3xl font-bold text-red-400">${metrics.priceLow.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-4">
            Range: ${(metrics.priceHigh - metrics.priceLow).toFixed(2)}
          </p>
        </div>

        {/* Volatility */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Volatility</p>
          <p className="text-3xl font-bold text-orange-400">
            {(metrics.volatility * 100).toFixed(2)}%
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                metrics.volatility > 1 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
            />
            <p className="text-xs text-slate-400">
              {metrics.volatility > 1 ? 'High volatility' : 'Moderate volatility'}
            </p>
          </div>
        </div>
      </div>

      {/* Volume & Orders */}
      {showVolume && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buy Volume */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-3">Buy Volume (24h)</p>
            <p className="text-2xl font-bold text-green-400">
              {metrics.buyVolume.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-2">Credits purchased</p>
          </div>

          {/* Sell Volume */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-3">Sell Volume (24h)</p>
            <p className="text-2xl font-bold text-red-400">
              {metrics.sellVolume.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-2">Credits sold</p>
          </div>

          {/* Active Orders */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-3">Active Orders</p>
            <p className="text-2xl font-bold text-blue-400">{metrics.activeOrders}</p>
            <p className="text-xs text-slate-500 mt-2">Open market orders</p>
          </div>
        </div>
      )}

      {/* Total Value */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-400 text-sm mb-3">Total Market Value (24h)</p>
        <p className="text-4xl font-bold text-emerald-400">
          ${metrics.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </p>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            {metrics.totalCreditsTraded.toLocaleString()} credits traded
          </p>
        </div>
      </div>

      {/* Price History Chart */}
      {showPriceHistory && priceHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">30-Day Price Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="priceUSD"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Market Status */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Market Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-slate-400 text-sm">Status</p>
              <p className="text-white font-semibold">Active</p>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Last Update</p>
            <p className="text-white font-semibold">
              {new Date(metrics.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Buy/Sell Ratio</p>
            <p className="text-white font-semibold">
              {metrics.sellVolume > 0
                ? (metrics.buyVolume / metrics.sellVolume).toFixed(2)
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Average Price</p>
            <p className="text-white font-semibold">${metrics.averagePrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
