"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportGenerator } from "./report-generator"
import { ExportOptions } from "./export-options"
import { ReportHistory } from "./report-history"
import { FileText, Download, Clock } from "lucide-react"

export function ReportingDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground mt-2">This quarter</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exports Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">87</p>
            <p className="text-xs text-muted-foreground mt-2">All data formats</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground">2 hours ago</p>
            <p className="text-xs text-muted-foreground mt-2">Compliance Report</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generator */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Generate New Report</h2>
        <ReportGenerator />
      </div>

      {/* Export Options */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Export Data</h2>
        <ExportOptions />
      </div>

      {/* Report History */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Recent Reports</h2>
        <ReportHistory />
      </div>
    </div>
  )
}
