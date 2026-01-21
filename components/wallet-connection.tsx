"use client"

import { useState } from "react"
import { Wallet, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WalletBalanceDisplay } from "./wallet-balance-display"
import { GasFeeEstimator } from "./gas-fee-estimator"
import { WalletActivityFeed } from "./wallet-activity-feed"
import { NetworkStatusIndicator } from "./network-status-indicator"

interface WalletConnectionProps {
  onConnect: (address: string) => void
  onBack?: () => void
}

export function WalletConnection({ onConnect, onBack }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const walletOptions = [
    {
      name: "MetaMask",
      icon: "🦊",
      id: "metamask",
    },
    {
      name: "WalletConnect",
      icon: "📱",
      id: "walletconnect",
    },
    {
      name: "Coinbase Wallet",
      icon: "⚫",
      id: "coinbase",
    },
  ]

  const handleConnect = (walletId: string) => {
    setIsConnecting(true)
    setTimeout(() => {
      const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
      onConnect(mockAddress)
      setIsConnected(true)
      setIsConnecting(false)
    }, 1000)
  }

  if (isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-muted bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletBalanceDisplay />
          <GasFeeEstimator />
        </div>
        <NetworkStatusIndicator />
        <WalletActivityFeed />
      </div>
    )
  }

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to start trading verified blue carbon credits on the blockchain
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/20">
            <Wallet className="w-6 h-6 text-accent" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:border-accent hover:bg-accent/5"
            >
              <span className="text-2xl">{wallet.icon}</span>
              <span className="text-sm font-medium">{wallet.name}</span>
            </Button>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground">
            By connecting, you agree to our Terms of Service. Your wallet will be used to sign transactions and manage
            your carbon credit portfolio.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
