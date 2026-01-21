'use client'

import React, { useState, useEffect } from 'react'
import { getCarbonMarketService, type CreditPrice, type MarketMetrics } from '@/lib/carbon-market-service'

interface MarketAnalyticsDashboardProps {
  refreshInterval?: number
  showPriceHistory?: boolean
  showVolume?: boolean
}

export function MarketAnalyticsDashboard({
  refreshInterval = 60000,
  showPriceHistory = true,
  showVolume = true,
}: MarketAnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null)
  const [priceHistory, setPriceHistory] = useState<CreditPrice[]>([])
  const [currentPrice, setCurrentPrice] = useState<CreditPrice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarketData()
    const interval = setInterval(loadMarketData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  function loadMarketData() {
    const marketService = getCarbonMarketService()
    setMetrics(marketService.getMarketMetrics())
    setCurrentPrice(marketService.getCurrentPrice())
    setPriceHistory(marketService.getPriceHistory(30))
    setLoading(false)
  }

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
      <div className="bg-linear-to-r from-blue-900 to-emerald-900 rounded-lg border border-blue-700 p-6">
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
                width: `${((currentPrice.priceUSD - metrics.priceLow) / (metrics.priceHigh - metrics.priceLow)) * 100}%`,
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
          <p className="text-3xl font-bold text-orange-400">{(metrics.volatility * 100).toFixed(2)}%</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${metrics.volatility > 1 ? 'bg-red-500' : 'bg-yellow-500'}`} />
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
            <p className="text-2xl font-bold text-green-400">{metrics.buyVolume.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Credits purchased</p>
          </div>

          {/* Sell Volume */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-3">Sell Volume (24h)</p>
            <p className="text-2xl font-bold text-red-400">{metrics.sellVolume.toLocaleString()}</p>
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

          {/* Simple bar chart representation */}
          <div className="flex items-end justify-between gap-1 h-32">
            {priceHistory.map((price, idx) => {
              const minPrice = Math.min(...priceHistory.map((p) => p.priceUSD))
              const maxPrice = Math.max(...priceHistory.map((p) => p.priceUSD))
              const range = maxPrice - minPrice
              const height = range === 0 ? 50 : ((price.priceUSD - minPrice) / range) * 100

              return (
                <div
                  key={idx}
                  className="flex-1 bg-blue-600/50 hover:bg-blue-600 rounded-t transition-colors group relative"
                  style={{ height: `${Math.max(height, 10)}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 px-2 py-1 rounded text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${price.priceUSD.toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between mt-4 text-xs text-slate-500">
            <span>30 days ago</span>
            <span>Today</span>
          </div>

          {/* Price range info */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
            <div>
              <p className="text-slate-400 text-xs mb-1">Min</p>
              <p className="text-white font-semibold">
                ${Math.min(...priceHistory.map((p) => p.priceUSD)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Avg</p>
              <p className="text-white font-semibold">
                $
                {(
                  priceHistory.reduce((sum, p) => sum + p.priceUSD, 0) / priceHistory.length
                ).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Max</p>
              <p className="text-white font-semibold">
                ${Math.max(...priceHistory.map((p) => p.priceUSD)).toFixed(2)}
              </p>
            </div>
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
              {metrics.sellVolume > 0 ? (metrics.buyVolume / metrics.sellVolume).toFixed(2) : 'N/A'}
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
