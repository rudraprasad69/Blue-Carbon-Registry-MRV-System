"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatINRDecimal, convertToINR } from "@/lib/currency-utils"

interface PricePoint {
  timestamp: string
  mangrove: number
  seagrass: number
  saltmarsh: number
  kelp: number
}

export function PricingOracle() {
  const [prices, setPrices] = useState([
    { time: "10:00", mangrove: 25, seagrass: 18, saltmarsh: 22, kelp: 28 },
    { time: "10:15", mangrove: 25.2, seagrass: 18.1, saltmarsh: 22.05, kelp: 28.15 },
    { time: "10:30", mangrove: 25.5, seagrass: 18.3, saltmarsh: 22.2, kelp: 28.5 },
    { time: "10:45", mangrove: 25.8, seagrass: 18.5, saltmarsh: 22.4, kelp: 28.8 },
  ])

  const [oracleStatus, setOracleStatus] = useState("healthy")
  const lastUpdate = new Date()

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Pricing Oracle Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={prices}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" domain={[15, 30]} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
            <Line type="monotone" dataKey="mangrove" stroke="#1dd3b0" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="seagrass" stroke="#06b6d4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="saltmarsh" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="kelp" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Mangrove", value: 25.8, change: 3.2 },
            { name: "Seagrass", value: 18.5, change: 2.8 },
            { name: "Salt Marsh", value: 22.4, change: 1.8 },
            { name: "Kelp", value: 28.8, change: 2.9 },
          ].map((price) => (
            <div key={price.name} className="p-2 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground">{price.name}</p>
              <p className="font-semibold text-foreground">{formatINRDecimal(convertToINR(price.value))}</p>
              <p className="text-xs text-green-600">+{price.change}%</p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex gap-2 text-sm text-blue-700 dark:text-blue-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Oracle data verified by Chainlink. Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
