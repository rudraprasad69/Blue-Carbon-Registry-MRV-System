"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileJson, FileSpreadsheet, File, Database } from "lucide-react"

export function ExportOptions() {
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = (format: string) => {
    setExporting(format)
    setTimeout(() => {
      setExporting(null)
      alert(`Exported data as ${format.toUpperCase()}`)
    }, 1000)
  }

  const exportFormats = [
    {
      id: "csv",
      name: "CSV Export",
      description: "Spreadsheet-friendly comma-separated values",
      icon: FileSpreadsheet,
      color: "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      id: "excel",
      name: "Excel Export",
      description: "Microsoft Excel format with charts and formatting",
      icon: FileSpreadsheet,
      color: "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      id: "json",
      name: "JSON Export",
      description: "JSON format for API integration and data pipelines",
      icon: FileJson,
      color: "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    {
      id: "pdf",
      name: "PDF Export",
      description: "Professional PDF report with formatting and branding",
      icon: File,
      color: "bg-red-100/20 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    },
    {
      id: "database",
      name: "Database Dump",
      description: "Full database export for backup and analytics",
      icon: Database,
      color: "bg-purple-100/20 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exportFormats.map((format) => {
        const Icon = format.icon
        return (
          <Card key={format.id} className="border-border hover:border-accent/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${format.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2">{format.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{format.description}</p>
              <Button
                onClick={() => handleExport(format.id)}
                disabled={exporting === format.id}
                variant="outline"
                className="w-full"
              >
                {exporting === format.id ? "Exporting..." : "Export"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
