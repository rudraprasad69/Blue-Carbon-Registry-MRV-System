"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { mockPriceHistory } from "@/lib/mock-data"

export function PriceAnalysis() {
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={mockPriceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Legend />
            <Line type="monotone" dataKey="mangrove" stroke="var(--color-chart-1)" name="Mangrove" strokeWidth={2} />
            <Line type="monotone" dataKey="seagrass" stroke="var(--color-chart-2)" name="Seagrass" strokeWidth={2} />
            <Line type="monotone" dataKey="saltmarsh" stroke="var(--color-chart-3)" name="Salt Marsh" strokeWidth={2} />
            <Line type="monotone" dataKey="kelp" stroke="var(--color-chart-4)" name="Kelp" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
