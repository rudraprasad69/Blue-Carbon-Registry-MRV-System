"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

interface Report {
  id: string
  name: string
  type: string
  generatedDate: string
  size: string
  status: "completed" | "processing"
}

export function ReportHistory() {
  const reports: Report[] = [
    {
      id: "1",
      name: "Q2 2024 Compliance Report",
      type: "compliance",
      generatedDate: "2024-06-30",
      size: "2.4 MB",
      status: "completed",
    },
    {
      id: "2",
      name: "Impact Metrics - June 2024",
      type: "impact",
      generatedDate: "2024-06-28",
      size: "1.8 MB",
      status: "completed",
    },
    {
      id: "3",
      name: "Portfolio Performance Analysis",
      type: "portfolio",
      generatedDate: "2024-06-25",
      size: "3.2 MB",
      status: "completed",
    },
    {
      id: "4",
      name: "Financial Summary - H1 2024",
      type: "financial",
      generatedDate: "2024-06-20",
      size: "4.1 MB",
      status: "completed",
    },
    {
      id: "5",
      name: "MRV Data Export",
      type: "mrv",
      generatedDate: "2024-06-15",
      size: "5.6 MB",
      status: "completed",
    },
    {
      id: "6",
      name: "Community Benefits Report",
      type: "community",
      generatedDate: "2024-06-10",
      size: "2.1 MB",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card key={report.id} className="border-border hover:border-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{report.name}</h3>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <Badge variant="outline" className="text-xs capitalize">
                    {report.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{report.generatedDate}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{report.size}</span>
                  {report.status === "completed" && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <Badge className="bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs">
                        Ready
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
