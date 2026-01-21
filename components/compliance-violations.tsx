"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockComplianceViolations } from "@/lib/mock-data"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function ComplianceViolations() {
  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "bg-red-100/20 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    if (severity === "medium") return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
  }

  const getStatusIcon = (status: string) => {
    if (status === "resolved") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "investigating") return <Clock className="w-4 h-4 text-yellow-600" />
    return <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  const getViolationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "data-discrepancy": "Data Discrepancy",
      "boundary-change": "Boundary Change",
      "monitoring-gap": "Monitoring Gap",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-4">
      {mockComplianceViolations.map((violation) => (
        <Card key={violation.id} className="border-border hover:border-red-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Project & Type */}
              <div>
                <h3 className="font-bold text-foreground mb-2">{violation.projectName}</h3>
                <p className="text-sm text-muted-foreground">{getViolationTypeLabel(violation.violationType)}</p>
              </div>

              {/* Severity & Status */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Severity</p>
                <Badge className={getSeverityColor(violation.severity)}>{violation.severity.toUpperCase()}</Badge>
                <div className="flex items-center gap-2 mt-3">
                  {getStatusIcon(violation.status)}
                  <span className="text-xs font-semibold text-foreground capitalize">{violation.status}</span>
                </div>
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <p className="text-xs text-muted-foreground mb-2">Description</p>
                <p className="text-sm text-foreground">{violation.description}</p>
              </div>

              {/* Dates & Resolution */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Reported</p>
                <p className="text-sm font-semibold mb-3">{new Date(violation.reportedDate).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground mb-1">Resolution</p>
                <p className="text-xs text-foreground">{violation.resolution}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
