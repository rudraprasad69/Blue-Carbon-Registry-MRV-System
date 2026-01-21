"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheckIcon, ExternalLink } from "lucide-react"

interface BlockchainVerificationProps {
  transactionHash: string
  blockNumber: number
  confirmations: number
  status: "confirmed" | "pending" | "failed"
  timestamp: string
}

export function BlockchainVerification({
  transactionHash,
  blockNumber,
  confirmations,
  status,
  timestamp,
}: BlockchainVerificationProps) {
  const isVerified = status === "confirmed" && confirmations >= 12

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-700"
      case "pending":
        return "bg-blue-500/20 text-blue-700"
      case "failed":
        return "bg-red-500/20 text-red-700"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-accent" />
            Blockchain Verification
          </CardTitle>
          <Badge className={getStatusColor(status)}>
            {isVerified ? "Verified" : status === "pending" ? "Verifying" : "Failed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-foreground break-all">
                  {transactionHash.slice(0, 20)}...{transactionHash.slice(-20)}
                </code>
                <ExternalLink className="w-4 h-4 text-accent cursor-pointer hover:text-accent/80" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Block Number</p>
              <p className="text-sm font-mono font-semibold text-foreground">#{blockNumber}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Confirmations</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((confirmations / 12) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-foreground min-w-fit">{confirmations}/12</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Timestamp</p>
              <p className="text-sm font-mono text-foreground">{new Date(timestamp).toLocaleString()}</p>
            </div>
          </div>

          {isVerified && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Transaction Verified</p>
                  <p className="text-xs text-green-600 mt-1">
                    This transaction has been confirmed on the Ethereum blockchain with sufficient confirmations for
                    security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
