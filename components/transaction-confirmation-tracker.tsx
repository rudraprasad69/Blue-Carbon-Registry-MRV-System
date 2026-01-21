"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"

interface TransactionStatus {
  id: string
  hash: string
  status: "pending" | "confirming" | "confirmed" | "failed"
  confirmations: number
  requiredConfirmations: number
  gasUsed?: number
  timestamp: string
  project: string
  credits: number
  amount: number
}

interface TransactionConfirmationTrackerProps {
  transactions: TransactionStatus[]
  onRefresh?: () => void
}

export function TransactionConfirmationTracker({ transactions, onRefresh }: TransactionConfirmationTrackerProps) {
  const { lastUpdated, handleRefresh } = useAutoRefresh(3000)
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const getProgressPercentage = (confirmations: number, required: number) => {
    return Math.min((confirmations / required) * 100, 100)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "confirming":
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-700"
      case "confirming":
        return "bg-blue-500/20 text-blue-700"
      case "failed":
        return "bg-red-500/20 text-red-700"
      default:
        return "bg-yellow-500/20 text-yellow-700"
    }
  }

  const estimatedTimeRemaining = (confirmations: number, required: number) => {
    const remaining = required - confirmations
    const avgBlockTime = 12.5
    const secondsRemaining = remaining * avgBlockTime
    const minutes = Math.ceil(secondsRemaining / 60)
    return minutes > 0 ? `~${minutes} min remaining` : "Almost there..."
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction Confirmations</CardTitle>
          <button
            onClick={() => {
              handleRefresh()
              onRefresh?.()
            }}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id}>
              <button
                onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(tx.status)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{tx.project}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {tx.credits} credits • ${tx.amount.toLocaleString()}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 max-w-xs">
                          <Progress
                            value={getProgressPercentage(tx.confirmations, tx.requiredConfirmations)}
                            className="h-1.5"
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {tx.confirmations}/{tx.requiredConfirmations}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status === "confirmed" ? "Confirmed" : tx.status === "failed" ? "Failed" : "Confirming"}
                    </Badge>
                    {tx.status !== "confirmed" && tx.status !== "failed" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {estimatedTimeRemaining(tx.confirmations, tx.requiredConfirmations)}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {expandedTx === tx.id && (
                <div className="mt-2 p-4 rounded-lg bg-muted/30 border border-border space-y-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Transaction Hash</p>
                      <code className="text-xs font-mono text-foreground break-all">{tx.hash}</code>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Gas Used</p>
                      <p className="text-xs font-mono text-foreground">{tx.gasUsed} ETH</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Time</p>
                      <p className="text-xs text-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Status</p>
                      <p className="text-xs font-semibold text-foreground capitalize">{tx.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground text-center">
          Auto-refreshing: {new Date(lastUpdated || Date.now()).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
