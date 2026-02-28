"use client"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { mockMrvData } from "@/lib/mock-data"
import { InteractiveChartWrapper } from "./interactive-chart-wrapper"
import { SatelliteAnalysisViewer } from "./satellite-analysis-viewer"
import type { AreaOfInterest } from "@/lib/earth-engine-service"

const mockAreaOfInterest: AreaOfInterest = {
  north: 12.5,
  south: 12.0,
  east: -61.0,
  west: -61.5,
}

export function MrvMonitoring() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Generation Trend */}
        <InteractiveChartWrapper
          title="Credit Generation Trend"
          description="Monthly credits generated vs verified"
          stats={[
            { label: "Total Generated", value: "1444", trend: "up" },
            { label: "Total Verified", value: "1380", trend: "up" },
            { label: "Pending", value: "64", trend: "down" },
          ]}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockMrvData} className="transition-all duration-300">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(29, 211, 176, 0.1)",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
                cursor={{ stroke: "var(--color-accent)", strokeWidth: 2 }}
              />
              <Legend wrapperStyle={{ paddingTop: "16px" }} />
              <Line
                type="monotone"
                dataKey="creditsGenerated"
                stroke="var(--color-chart-1)"
                name="Generated"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-chart-1)", r: 4 }}
                activeDot={{ r: 6, fill: "var(--color-chart-1)" }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="creditsVerified"
                stroke="var(--color-chart-3)"
                name="Verified"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-chart-3)", r: 4 }}
                activeDot={{ r: 6, fill: "var(--color-chart-3)" }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </InteractiveChartWrapper>

        {/* Monitoring Coverage */}
        <InteractiveChartWrapper
          title="Monitoring Coverage"
          description="Data collection completeness per month"
          stats={[
            { label: "Avg Coverage", value: "97.3%", trend: "up" },
            { label: "Current Month", value: "99%", trend: "up" },
            { label: "Target", value: "95%", trend: "up" },
          ]}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockMrvData} className="transition-all duration-300">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(29, 211, 176, 0.1)",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
                cursor={{ fill: "rgba(29, 211, 176, 0.1)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "16px" }} />
              <Bar
                dataKey="monitored"
                fill="var(--color-chart-1)"
                name="Monitored (%)"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </InteractiveChartWrapper>
      </div>

      {/* Satellite Analysis */}
      <div className="pt-6 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Satellite Analysis</h2>
        <SatelliteAnalysisViewer 
          areaOfInterest={mockAreaOfInterest}
          startDate="2025-01-01"
          endDate="2025-12-31"
        />
      </div>
    </div>
  )
}
