"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, RefreshCw } from "lucide-react"
import { mockNetworkStatus } from "@/lib/mock-data"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"

interface GasFeeEstimatorProps {
  transactionSize?: "small" | "medium" | "large"
}

export function GasFeeEstimator({ transactionSize = "medium" }: GasFeeEstimatorProps) {
  const { isRefreshing, lastUpdated, handleRefresh } = useAutoRefresh(5000)

  const estimateGasCost = (speed: number, transactionSize: string) => {
    const baseCost = (speed * 21000) / 1e9
    const multiplier = transactionSize === "small" ? 1 : transactionSize === "large" ? 1.5 : 1.2
    return (baseCost * multiplier).toFixed(4)
  }

  const getTxSpeedLabel = (value: number) => {
    if (value <= 35) return "Economy"
    if (value <= 42) return "Standard"
    return "Express"
  }

  const dataAgeMinutes = lastUpdated ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 60000) : 0
  const dataQuality = dataAgeMinutes < 2 ? "excellent" : dataAgeMinutes < 5 ? "good" : "fair"

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Gas Fees
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {mockNetworkStatus.status === "healthy" ? "Healthy" : "Congested"}
            </Badge>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-1 hover:bg-muted rounded-lg transition-all ${isRefreshing ? "animate-spin" : ""}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(mockNetworkStatus.gasPrice).map(([speed, price]) => (
              <div key={speed} className="p-3 rounded-lg border border-border hover:border-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground capitalize">{speed}</span>
                  <TrendingUp className="w-3 h-3 text-accent" />
                </div>
                <div className="text-lg font-bold text-foreground">{price}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getTxSpeedLabel(price)} ({estimateGasCost(price, transactionSize)} ETH)
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Network Latency</span>
              <span className="font-mono font-medium">{mockNetworkStatus.blockTime}s</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Latest Block</span>
              <span className="font-mono font-medium">#{mockNetworkStatus.lastBlock}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <span className="text-xs">Data Quality:</span>
              <Badge
                variant="secondary"
                className={`text-xs ${dataQuality === "excellent" ? "bg-green-500/20 text-green-700" : dataQuality === "good" ? "bg-blue-500/20 text-blue-700" : "bg-yellow-500/20 text-yellow-700"}`}
              >
                {dataQuality}
              </Badge>
            </div>
            <span className="text-xs">{lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "Loading..."}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
