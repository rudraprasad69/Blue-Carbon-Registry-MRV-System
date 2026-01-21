"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTransactions } from "@/lib/mock-data"
import { CheckCircle, Clock, Copy } from "lucide-react"
import { useState } from "react"

export function TransactionHistory() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

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

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-muted/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{tx.projectName}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tx.quantity} credits @ ${tx.pricePerUnit} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">${tx.totalAmount.toLocaleString()}</p>
                  <Badge className={`mt-2 ${getStatusColor(tx.status)}`}>
                    {getStatusIcon(tx.status)}
                    <span className="ml-1">{tx.status}</span>
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleDateString()} at{" "}
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <button
                  onClick={() => handleCopyHash(tx.hash)}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  <span className="font-mono">
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                  </span>
                  <Copy className={`w-3 h-3 ${copiedHash === tx.hash ? "text-green-500" : ""}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
