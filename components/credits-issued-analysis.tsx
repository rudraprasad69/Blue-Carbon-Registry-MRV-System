"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { mockCreditsIssuedTrend } from "@/lib/mock-data"

export function CreditsIssuedAnalysis() {
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockCreditsIssuedTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
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
            <Bar dataKey="issued" fill="var(--color-chart-1)" name="Issued" radius={[8, 8, 0, 0]} />
            <Bar dataKey="retired" fill="var(--color-chart-3)" name="Retired" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
