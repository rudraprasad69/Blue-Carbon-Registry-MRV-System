"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield } from "lucide-react"

export function SmartContractTrader() {
  const [selectedContract, setSelectedContract] = useState<string | null>(null)

  const contracts = [
    {
      id: "trader-1",
      name: "Mangrove Credits Trading",
      ecosystem: "mangrove",
      contractAddress: "0x7a2c8f9e1d4b6c3e5f2a8b9d7c6e4f1a",
      liquidity: 2500000,
      volume24h: 145230,
      verified: true,
    },
    {
      id: "trader-2",
      name: "Seagrass Trading Pool",
      ecosystem: "seagrass",
      contractAddress: "0x3e9f1c7d4b2a6e8f5c3d1a9b7e6f4c2a",
      liquidity: 1850000,
      volume24h: 98450,
      verified: true,
    },
    {
      id: "trader-3",
      name: "Salt Marsh Exchange",
      ecosystem: "saltmarsh",
      contractAddress: "0x5d6c7b4e1f3a2c8d9e6f4a1b3c5d7e8f",
      liquidity: 1200000,
      volume24h: 56780,
      verified: true,
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Smart Contract Trading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => setSelectedContract(contract.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{contract.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{contract.contractAddress}</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
                  <p className="font-semibold text-primary">${(contract.liquidity / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
                  <p className="font-semibold text-accent">${(contract.volume24h / 1000).toFixed(0)}K</p>
                </div>
                <div className="text-right">
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Trade <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
