"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Eye, EyeOff, CheckCircle } from "lucide-react"
import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { mockWalletState } from "@/lib/mock-data"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { formatINR, convertToINR } from "@/lib/currency-utils"

interface WalletBalanceDisplayProps {
  onRefresh?: () => void
}

export function WalletBalanceDisplay({ onRefresh }: WalletBalanceDisplayProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { lastUpdated } = useAutoRefresh(30000)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
    onRefresh?.()
  }

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Wallet Balance
              <Badge variant="secondary">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1 inline-block"></span>
                Live
              </Badge>
            </CardTitle>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 hover:bg-muted rounded-lg transition-all ${isRefreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-accent/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Blue Carbon Credits</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {showBalance ? mockWalletState.balance.toFixed(2) : "••••"}
            </div>
            <div className="text-sm text-accent mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Worth {showBalance ? formatINR(convertToINR(mockWalletState.ethValue)) : "••••"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
              <p className="text-sm font-mono text-foreground truncate">
                {mockWalletState.address.slice(0, 10)}...{mockWalletState.address.slice(-8)}
              </p>
              {mockWalletState.networkVerified && (
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified on-chain</span>
                </div>
              )}
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Network</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-foreground">Ethereum</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <span>Last updated:</span>
              <span className="font-mono">
                {new Date(lastUpdated || mockWalletState.connectedAt).toLocaleTimeString()}
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-700 text-xs">
              Real-time
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
