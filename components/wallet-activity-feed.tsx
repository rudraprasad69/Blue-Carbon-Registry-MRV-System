"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockWalletTransactions } from "@/lib/mock-data"
import { CheckCircle, Clock, Copy, ExternalLink, RefreshCw, ShieldCheckIcon } from "lucide-react"
import { useState } from "react"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"

export function WalletActivityFeed() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const { lastUpdated, handleRefresh } = useAutoRefresh(10000)

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
      default:
        return "bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  const getBlockchainVerificationStatus = (status: string, confirmations?: number) => {
    if (status === "confirmed" && confirmations && confirmations >= 12) {
      return { verified: true, label: "Verified" }
    } else if (status === "confirmed") {
      return { verified: true, label: `${confirmations} confirmations` }
    }
    return { verified: false, label: "Pending" }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction Activity</CardTitle>
          <button onClick={handleRefresh} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockWalletTransactions.slice(0, 5).map((tx) => {
            const verification = getBlockchainVerificationStatus(tx.status, tx.confirmations)
            return (
              <div
                key={tx.id}
                className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{tx.project}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tx.credits} credits @ ${tx.amount / tx.credits}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">${tx.amount.toLocaleString()}</p>
                    <Badge className={`mt-2 ${getStatusColor(tx.status)}`}>
                      {getStatusIcon(tx.status)}
                      <span className="ml-1 capitalize">{tx.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                    <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <span>Gas:</span>
                      <span className="font-mono">{tx.gasUsed} ETH</span>
                    </div>
                    {verification.verified && (
                      <div className="flex items-center gap-1 text-green-600">
                        <ShieldCheckIcon className="w-3 h-3" />
                        <span>{verification.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyHash(tx.hash)}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      <span className="font-mono">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </span>
                      <Copy className={`w-3 h-3 ${copiedHash === tx.hash ? "text-green-500" : ""}`} />
                    </button>
                    <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-accent" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground text-center">
          Last updated: {new Date(lastUpdated || Date.now()).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
