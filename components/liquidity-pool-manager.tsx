"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplet } from "lucide-react"

export function LiquidityPoolManager() {
  const pools = [
    {
      id: "pool-1",
      pair: "MGV/ETH",
      tvl: 2500000,
      apy: 18.5,
      volume24h: 145230,
      myLiquidity: 15000,
    },
    {
      id: "pool-2",
      pair: "SGR/USDC",
      tvl: 1850000,
      apy: 22.3,
      volume24h: 98450,
      myLiquidity: 8500,
    },
    {
      id: "pool-3",
      pair: "SMR/ETH",
      tvl: 1200000,
      apy: 15.8,
      volume24h: 56780,
      myLiquidity: 5200,
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-accent" />
          Liquidity Pools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pools.map((pool) => (
            <div key={pool.id} className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground">{pool.pair}</h3>
                <Badge className="bg-green-500/20 text-green-700 border-0">{pool.apy}% APY</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">TVL</p>
                  <p className="font-semibold text-primary">${(pool.tvl / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                  <p className="font-semibold text-accent">${(pool.volume24h / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Position</p>
                  <p className="font-semibold text-foreground">${(pool.myLiquidity / 1000).toFixed(0)}K</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Add
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
