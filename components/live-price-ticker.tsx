'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'

interface PriceData {
  priceUSD: number
  priceEUR: number
  priceGBP: number
  change24h: number
  changePercent: number
  lastUpdated: string
}

interface MarketMetrics {
  totalVolume: number
  buyVolume: number
  sellVolume: number
  tradingPairs: number
  activeTraders: number
  volatility: number
}

export function LivePriceTicker() {
  const ws = useWebSocket()
  const [price, setPrice] = useState<PriceData | null>(null)
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)

  // Subscribe to updates on connect
  useEffect(() => {
    if (ws.isConnected && !isSubscribed) {
      ws.subscribe(['price_updates', 'market_metrics'])
      setIsSubscribed(true)
      
      // Request initial data
      ws.getCurrentPrice()
      ws.getMarketMetrics()
    }
  }, [ws.isConnected, isSubscribed, ws])

  // Listen for messages
  useEffect(() => {
    const unsubscribe = ws.onMessage((msg) => {
      if (msg.type === 'price_update' || msg.type === 'price_data') {
        setPrice(msg.data)
        setUpdateCount((c) => c + 1)
      } else if (msg.type === 'market_metrics') {
        setMetrics(msg.data)
      }
    })
    return unsubscribe
  }, [ws])

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPriceChangeBgColor = (change: number) => {
    return change >= 0 ? 'bg-green-900/20' : 'bg-red-900/20'
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Live Market Data</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${ws.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-300">{ws.isConnected ? 'Connected' : 'Disconnected'}</span>
          <span className="text-xs text-gray-500 ml-2">(Updates: {updateCount})</span>
        </div>
      </div>

      {/* Main Price Display */}
      {price ? (
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6 space-y-4">
          {/* Primary Price in USD */}
          <div className="space-y-2">
            <p className="text-green-300 text-sm font-medium">Current Price (USD)</p>
            <div className="flex items-baseline gap-4">
              <p className="text-5xl font-bold text-white">${price.priceUSD.toFixed(2)}</p>
              <div className={`${getPriceChangeColor(price.change24h)} flex items-center gap-1`}>
                <span className="text-2xl">
                  {price.change24h >= 0 ? '▲' : '▼'}
                </span>
                <span className="text-lg font-semibold">
                  {Math.abs(price.change24h).toFixed(2)} ({Math.abs(price.changePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-xs">Last updated: {new Date(price.lastUpdated).toLocaleTimeString()}</p>
          </div>

          {/* Multi-Currency Display */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`${getPriceChangeBgColor(price.change24h)} border border-green-500/10 rounded p-3`}>
              <p className="text-green-300 text-xs font-medium mb-1">EUR Price</p>
              <p className="text-xl font-bold text-white">€{price.priceEUR.toFixed(2)}</p>
            </div>
            <div className={`${getPriceChangeBgColor(price.change24h)} border border-green-500/10 rounded p-3`}>
              <p className="text-green-300 text-xs font-medium mb-1">GBP Price</p>
              <p className="text-xl font-bold text-white">£{price.priceGBP.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
          <p className="text-gray-400">Loading price data...</p>
        </div>
      )}

      {/* Market Metrics */}
      {metrics ? (
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Market Metrics</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/40 border border-green-500/10 rounded p-3">
              <p className="text-green-300 text-xs font-medium mb-1">Total Volume</p>
              <p className="text-lg font-bold text-white">{(metrics.totalVolume / 1000).toFixed(1)}K</p>
            </div>
            <div className="bg-slate-900/40 border border-green-500/10 rounded p-3">
              <p className="text-green-300 text-xs font-medium mb-1">Buy / Sell Ratio</p>
              <p className="text-lg font-bold text-white">
                {(metrics.buyVolume / metrics.sellVolume).toFixed(2)}x
              </p>
            </div>
            <div className="bg-slate-900/40 border border-green-500/10 rounded p-3">
              <p className="text-green-300 text-xs font-medium mb-1">Volatility</p>
              <p className="text-lg font-bold text-white">{metrics.volatility.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-900/40 border border-green-500/10 rounded p-3">
              <p className="text-green-300 text-xs font-medium mb-1">Trading Pairs</p>
              <p className="text-lg font-bold text-white">{metrics.tradingPairs}</p>
            </div>
            <div className="bg-slate-900/40 border border-green-500/10 rounded p-3">
              <p className="text-green-300 text-xs font-medium mb-1">Active Traders</p>
              <p className="text-lg font-bold text-white">{metrics.activeTraders}</p>
            </div>
            <div className="bg-slate-900/40 border border-green-500/10 rounded p-3">
              <p className="text-green-300 text-xs font-medium mb-1">Buy Volume</p>
              <p className="text-lg font-bold text-green-400">{(metrics.buyVolume / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
          <p className="text-gray-400">Loading market metrics...</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            ws.disconnect()
          }}
          disabled={!ws.isConnected}
          className={`flex-1 py-2 px-4 rounded font-medium transition ${
            ws.isConnected
              ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
              : 'bg-slate-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Disconnect
        </button>
        <button
          onClick={() => {
            ws.getCurrentPrice()
            ws.getMarketMetrics()
          }}
          disabled={!ws.isConnected}
          className={`flex-1 py-2 px-4 rounded font-medium transition ${
            ws.isConnected
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
              : 'bg-slate-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Refresh Now
        </button>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-500 bg-slate-900/40 rounded p-2 border border-green-500/10">
        <p>Client ID: {ws.clientId || 'Connecting...'}</p>
        <p>Updates received: {updateCount}</p>
      </div>
    </div>
  )
}

/**
 * Example integration in your page:
 * 
 * import { LivePriceTicker } from '@/components/live-price-ticker'
 * 
 * export default function MyPage() {
 *   return (
 *     <div className="p-6">
 *       <LivePriceTicker />
 *     </div>
 *   )
 * }
 */
