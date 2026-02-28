"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { ReportHistory } from "./report-history"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function RegulatoryReports() {
  const [reportType, setReportType] = useState("all")
  const { toast } = useToast()

  const handleExport = () => {
    toast({
      title: "Exporting Reports",
      description: "Your report is being generated and will be downloaded shortly.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Rate Trend */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Compliance Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockRegulatoryReports}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[90, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: `1px solid hsl(var(--border))`,
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="complianceRate"
                  stroke="hsl(var(--primary))"
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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: `1px solid hsl(var(--border))`,
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Bar
                  dataKey="projectsAudited"
                  fill="hsl(var(--chart-1))"
                  name="Projects Audited"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="violationsFound"
                  fill="hsl(var(--chart-2))"
                  name="Violations Found"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Browse and download historical reports</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="mrv">MRV</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
              <DatePicker />
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ReportHistory />
        </CardContent>
      </Card>
    </div>
  )
}
