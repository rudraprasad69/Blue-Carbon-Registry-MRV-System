"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { supportedChains } from "@/lib/cross-chain-sync"

export function CrossChainBridge() {
  const [sourceChain, setSourceChain] = useState("Ethereum")
  const [destChain, setDestChain] = useState("Polygon")
  const [amount, setAmount] = useState("1000")

  const estimateFee = (amt: number) => {
    return (amt * 0.005).toFixed(2)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Cross-Chain Bridge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">From Chain</label>
            <select
              value={sourceChain}
              onChange={(e) => setSourceChain(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            >
              {supportedChains.map((chain) => (
                <option key={chain.chainId}>{chain.chain}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">To Chain</label>
            <select
              value={destChain}
              onChange={(e) => setDestChain(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            >
              {supportedChains.map((chain) => (
                <option key={chain.chainId}>{chain.chain}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            placeholder="Enter amount"
          />
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bridge Fee (0.5%)</span>
            <span className="font-semibold text-foreground">${estimateFee(Number.parseFloat(amount))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Time</span>
            <span className="font-semibold text-foreground">2-5 minutes</span>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Bridge Credits <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
