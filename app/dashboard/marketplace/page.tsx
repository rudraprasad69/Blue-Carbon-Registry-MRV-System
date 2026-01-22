'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MarketplaceTradingDashboard from '@/components/marketplace-trading-dashboard'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Zap, Leaf, Wind } from 'lucide-react'

interface MarketStats {
  totalVolume: number
  totalValue: number
  activeOrders: number
  completedTrades: number
}

interface CreditTypeStats {
  type: string
  price: number
  volume: number
  trend: 'up' | 'down' | 'neutral'
  change: number
}

export default function MarketplacePage() {
  const [stats, setStats] = useState<MarketStats>({
    totalVolume: 0,
    totalValue: 0,
    activeOrders: 0,
    completedTrades: 0
  })

  const [creditStats, setCreditStats] = useState<CreditTypeStats[]>([
    {
      type: 'renewable',
      price: 10.25,
      volume: 15420,
      trend: 'up',
      change: 2.5
    },
    {
      type: 'forestry',
      price: 12.50,
      volume: 8930,
      trend: 'up',
      change: 1.8
    },
    {
      type: 'agriculture',
      price: 10.00,
      volume: 6250,
      trend: 'down',
      change: -1.2
    },
    {
      type: 'efficiency',
      price: 8.80,
      volume: 4100,
      trend: 'neutral',
      change: 0.3
    }
  ])

  const [volumeData, setVolumeData] = useState([
    { hour: '08:00', renewable: 1200, forestry: 890, agriculture: 450, efficiency: 320 },
    { hour: '09:00', renewable: 1500, forestry: 920, agriculture: 520, efficiency: 380 },
    { hour: '10:00', renewable: 1800, forestry: 950, agriculture: 620, efficiency: 420 },
    { hour: '11:00', renewable: 2100, forestry: 1020, agriculture: 680, efficiency: 480 },
    { hour: '12:00', renewable: 1900, forestry: 980, agriculture: 600, efficiency: 440 },
    { hour: '13:00', renewable: 2300, forestry: 1100, agriculture: 750, efficiency: 520 },
    { hour: '14:00', renewable: 2600, forestry: 1200, agriculture: 850, efficiency: 580 }
  ])

  const [priceHistory, setPriceHistory] = useState([
    { date: '2024-01-15', renewable: 9.80, forestry: 12.10, agriculture: 9.90, efficiency: 8.50 },
    { date: '2024-01-16', renewable: 9.95, forestry: 12.20, agriculture: 9.95, efficiency: 8.60 },
    { date: '2024-01-17', renewable: 10.05, forestry: 12.30, agriculture: 10.00, efficiency: 8.70 },
    { date: '2024-01-18', renewable: 10.15, forestry: 12.40, agriculture: 10.05, efficiency: 8.75 },
    { date: '2024-01-19', renewable: 10.25, forestry: 12.50, agriculture: 10.00, efficiency: 8.80 }
  ])

  const [topTraders, setTopTraders] = useState([
    { name: 'GreenCorp Ventures', volume: 45000, value: 450000, trades: 156 },
    { name: 'Carbon Capital Fund', volume: 38000, value: 420000, trades: 128 },
    { name: 'ECO Trading Ltd', volume: 32000, value: 340000, trades: 112 },
    { name: 'Renewable Energy Co', volume: 28000, value: 310000, trades: 98 },
    { name: 'Forest Restoration Fund', volume: 24000, value: 290000, trades: 85 }
  ])

  useEffect(() => {
    // Calculate aggregated stats
    const totalVol = creditStats.reduce((sum, stat) => sum + stat.volume, 0)
    const totalVal = creditStats.reduce((sum, stat) => sum + stat.volume * stat.price, 0)

    setStats({
      totalVolume: totalVol,
      totalValue: totalVal,
      activeOrders: Math.floor(Math.random() * 100) + 150,
      completedTrades: Math.floor(Math.random() * 1000) + 5000
    })
  }, [creditStats])

  const getIconForType = (type: string) => {
    switch (type) {
      case 'renewable':
        return <Wind className="w-4 h-4 text-blue-500" />
      case 'forestry':
        return <Leaf className="w-4 h-4 text-green-600" />
      case 'agriculture':
        return <Zap className="w-4 h-4 text-amber-500" />
      case 'efficiency':
        return <Zap className="w-4 h-4 text-purple-500" />
      default:
        return null
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Carbon Credit Marketplace</h1>
        <p className="text-emerald-200 text-lg">
          Real-time trading platform for verified carbon credits
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-800 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {(stats.totalVolume / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-emerald-400 mt-1">credits traded</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ${(stats.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-emerald-400 mt-1">market capitalization</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.activeOrders}</div>
            <p className="text-xs text-emerald-400 mt-1">open positions</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Completed Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {(stats.completedTrades / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-emerald-400 mt-1">all-time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trading Interface and Analytics */}
      <Tabs defaultValue="trading" className="space-y-4">
        <TabsList className="bg-slate-800 border border-emerald-500/30">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Trading Tab */}
        <TabsContent value="trading">
          <Card className="bg-slate-800 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white">Live Trading Platform</CardTitle>
              <CardDescription>Interactive order book and execution</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketplaceTradingDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Credit Type Performance */}
          <Card className="bg-slate-800 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white">Credit Type Performance</CardTitle>
              <CardDescription>Current pricing and market activity by credit type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creditStats.map(stat => (
                  <div key={stat.type} className="bg-slate-700 rounded-lg p-4 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getIconForType(stat.type)}
                        <span className="font-semibold text-white capitalize">{stat.type}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                        {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Price</span>
                        <span className="text-white font-semibold">${stat.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Volume</span>
                        <span className="text-emerald-400 font-semibold">{stat.volume.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hourly Volume Chart */}
          <Card className="bg-slate-800 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white">Hourly Trading Volume</CardTitle>
              <CardDescription>Trading activity by credit type (last 7 hours)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="renewable" stackId="a" fill="#0088FE" />
                  <Bar dataKey="forestry" stackId="a" fill="#00C49F" />
                  <Bar dataKey="agriculture" stackId="a" fill="#FFBB28" />
                  <Bar dataKey="efficiency" stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Price History */}
          <Card className="bg-slate-800 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white">Price History</CardTitle>
              <CardDescription>5-day price trends by credit type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="renewable" stroke="#0088FE" strokeWidth={2} />
                  <Line type="monotone" dataKey="forestry" stroke="#00C49F" strokeWidth={2} />
                  <Line type="monotone" dataKey="agriculture" stroke="#FFBB28" strokeWidth={2} />
                  <Line type="monotone" dataKey="efficiency" stroke="#FF8042" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Market Distribution Pie Chart */}
          <Card className="bg-slate-800 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white">Market Share by Credit Type</CardTitle>
              <CardDescription>Distribution of trading volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={creditStats}
                    dataKey="volume"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {creditStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Card className="bg-slate-800 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white">Top Traders</CardTitle>
              <CardDescription>Marketplace leaderboard by trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topTraders.map((trader, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between border border-emerald-500/10 hover:border-emerald-500/30 transition">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{trader.name}</p>
                        <p className="text-xs text-slate-400">{trader.trades} trades</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{trader.volume.toLocaleString()} credits</p>
                      <p className="text-xs text-slate-400">${(trader.value / 1000).toFixed(1)}K value</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
