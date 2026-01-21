"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { mockRegulatoryReports } from "@/lib/mock-data"

export function RegulatoryReports() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Compliance Rate Trend */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Compliance Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRegulatoryReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" domain={[90, 100]} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="complianceRate"
                stroke="var(--color-primary)"
                name="Compliance %"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audit Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Audit Activity by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockRegulatoryReports}>
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
                dataKey="projectsAudited"
                fill="var(--color-chart-1)"
                name="Projects Audited"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="violationsFound"
                fill="var(--color-chart-2)"
                name="Violations Found"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
