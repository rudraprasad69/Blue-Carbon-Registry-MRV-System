"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, TrendingUp } from "lucide-react"

export function TokenSwapInterface() {
  const [fromAmount, setFromAmount] = useState("100")
  const [toAmount, setToAmount] = useState("1800")

  const ecosystems = [
    { name: "Mangrove", symbol: "MGV", price: 25 },
    { name: "Seagrass", symbol: "SGR", price: 18 },
    { name: "Salt Marsh", symbol: "SMR", price: 22 },
    { name: "Kelp", symbol: "KLP", price: 28 },
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Token Swap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>From</Label>
          <div className="flex gap-2">
            <Input type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} />
            <select className="px-3 rounded-md border border-border bg-background text-foreground">
              {ecosystems.map((eco) => (
                <option key={eco.symbol}>{eco.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button size="sm" variant="ghost" className="rounded-full">
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>To</Label>
          <div className="flex gap-2">
            <Input type="number" value={toAmount} onChange={(e) => setToAmount(e.target.value)} disabled />
            <select className="px-3 rounded-md border border-border bg-background text-foreground">
              <option>Seagrass</option>
            </select>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Price Impact</span>
            <span>0.12%</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimum Received</span>
            <span>{toAmount}</span>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Swap</Button>
      </CardContent>
    </Card>
  )
}
