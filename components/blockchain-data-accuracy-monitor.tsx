"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Zap } from "lucide-react"
import { supportedChains } from "@/lib/cross-chain-sync"
import { getOracleHealthStatus, chainlinkOracles } from "@/lib/oracle-feeds"

export function BlockchainDataAccuracyMonitor() {
  const accuracyData = [
    { time: "00:00", accuracy: 99.2 },
    { time: "04:00", accuracy: 99.1 },
    { time: "08:00", accuracy: 99.3 },
    { time: "12:00", accuracy: 99.2 },
    { time: "16:00", accuracy: 99.4 },
    { time: "20:00", accuracy: 99.3 },
  ]

  const oracleHealth = getOracleHealthStatus(chainlinkOracles)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              Oracle Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{oracleHealth.healthy}/4</p>
            <p className="text-xs text-muted-foreground mt-2">Feeds operational</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{supportedChains.length}/3</p>
            <p className="text-xs text-muted-foreground mt-2">Chains synced</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">99.3%</p>
            <p className="text-xs text-muted-foreground mt-2">24h average</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Accuracy Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis domain={[98.9, 99.5]} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
              <Line type="monotone" dataKey="accuracy" stroke="#1dd3b0" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Chain Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {supportedChains.map((chain) => (
            <div key={chain.chainId} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">{chain.chain}</p>
                <p className="text-xs text-muted-foreground">Block #{chain.blockHeight.toLocaleString()}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-700 border-0">
                {chain.status.charAt(0).toUpperCase() + chain.status.slice(1)}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
