"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function StakingDashboard() {
  const [stakedAmount, setStakedAmount] = useState(5000)
  const [estimatedAPY, setEstimatedAPY] = useState(18.5)

  const stakingData = [
    { month: "Jan", rewards: 125, totalStaked: 5000 },
    { month: "Feb", rewards: 156, totalStaked: 5312 },
    { month: "Mar", rewards: 189, totalStaked: 5680 },
    { month: "Apr", rewards: 221, totalStaked: 6120 },
    { month: "May", rewards: 256, totalStaked: 6590 },
    { month: "Jun", rewards: 298, totalStaked: 7150 },
  ]

  const accumulatedRewards = 1245

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Total Staked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">${stakedAmount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">7,500 credits locked</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              APY Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{estimatedAPY}%</p>
            <p className="text-xs text-muted-foreground mt-2">Variable based on TVL</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Earned Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">${accumulatedRewards.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Auto-compounding active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Rewards Accumulation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stakingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
              <Line type="monotone" dataKey="rewards" stroke="#1dd3b0" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Stake More</Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Unstake
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Claim Rewards
        </Button>
      </div>
    </div>
  )
}
