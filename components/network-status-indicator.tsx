"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle, RefreshCw } from "lucide-react"
import { mockNetworkStatus } from "@/lib/mock-data"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"

export function NetworkStatusIndicator() {
  const { lastUpdated, handleRefresh } = useAutoRefresh(5000)

  const isHealthy = mockNetworkStatus.status === "healthy"

  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isHealthy ? (
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">{mockNetworkStatus.chain}</p>
              <p className="text-xs text-muted-foreground">Network Status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={isHealthy ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}>
              {isHealthy ? "Healthy" : "Congested"}
            </Badge>
            <button onClick={handleRefresh} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <span className="text-muted-foreground">Block Time</span>
            <p className="font-mono font-semibold mt-1">{mockNetworkStatus.blockTime}s</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <span className="text-muted-foreground">Latest Block</span>
            <p className="font-mono font-semibold mt-1">#{mockNetworkStatus.lastBlock}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground text-center">
          Status updated: {new Date(lastUpdated || mockNetworkStatus.lastUpdated).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
