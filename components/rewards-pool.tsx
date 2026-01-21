"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, CheckCircle } from "lucide-react"

export function RewardsPool() {
  const rewardDistributions = [
    {
      id: "dist-1",
      date: "2024-06-15",
      amount: 298,
      credits: 750,
      rate: 0.397,
      status: "completed",
    },
    {
      id: "dist-2",
      date: "2024-05-15",
      amount: 256,
      credits: 650,
      rate: 0.394,
      status: "completed",
    },
    {
      id: "dist-3",
      date: "2024-04-15",
      amount: 221,
      credits: 580,
      rate: 0.381,
      status: "completed",
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-accent" />
          Rewards Distribution History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rewardDistributions.map((dist) => (
            <div key={dist.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">${dist.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(dist.date).toLocaleDateString()}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-700 border-0 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Distributed
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-xs">
                <div>
                  <p className="text-muted-foreground">Credits Earned</p>
                  <p className="font-semibold text-foreground">{dist.credits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rate per Credit</p>
                  <p className="font-semibold text-accent">${dist.rate.toFixed(3)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
