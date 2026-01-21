"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar } from "lucide-react"

export function ReportGenerator() {
  const [reportType, setReportType] = useState("compliance")
  const [dateRange, setDateRange] = useState("month")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      alert(`Generated ${reportType} report for the past ${dateRange}`)
    }, 1500)
  }

  const reportTypes = [
    {
      value: "compliance",
      label: "Compliance Report",
      description: "Full audit trails and regulatory compliance data",
    },
    { value: "impact", label: "Impact Report", description: "Environmental impact and social benefit metrics" },
    { value: "financial", label: "Financial Report", description: "Credit pricing, transactions, and market data" },
    { value: "portfolio", label: "Portfolio Report", description: "Holdings analysis and performance metrics" },
    { value: "mrv", label: "MRV Report", description: "Monitoring, Reporting & Verification data" },
    { value: "community", label: "Community Report", description: "Beneficiary data and benefit distribution" },
  ]

  const dateRanges = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
    { value: "year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Type Selection */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">Report Type</label>
          <div className="space-y-2">
            {reportTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  reportType === type.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">Date Range</label>
          <div className="space-y-3 mb-4">
            {dateRanges.map((range) => (
              <div
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  dateRange === range.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium text-sm text-foreground">{range.label}</p>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>

      {/* Report Features */}
      <Card className="border border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm font-semibold text-foreground mb-3">Report includes:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary text-xs">✓</Badge>
              <span className="text-sm text-muted-foreground">Executive Summary</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary text-xs">✓</Badge>
              <span className="text-sm text-muted-foreground">Data Tables</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary text-xs">✓</Badge>
              <span className="text-sm text-muted-foreground">Charts & Graphs</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary text-xs">✓</Badge>
              <span className="text-sm text-muted-foreground">Trend Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary text-xs">✓</Badge>
              <span className="text-sm text-muted-foreground">Audit Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary text-xs">✓</Badge>
              <span className="text-sm text-muted-foreground">Recommendations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
