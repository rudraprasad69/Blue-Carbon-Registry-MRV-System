"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { mockImpactMetrics } from "@/lib/mock-data"

export function ImpactMetrics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CO2 & Biodiversity */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={mockImpactMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="co2Sequestered" fill="var(--color-chart-1)" name="CO₂ (t)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="biodiversityScore"
                stroke="var(--color-chart-2)"
                name="Biodiversity Score"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Community Benefits */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockImpactMetrics}>
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
              <Bar
                dataKey="communityBenefits"
                fill="var(--color-chart-3)"
                name="Community Benefits ($)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
