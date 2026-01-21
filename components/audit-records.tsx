"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockAuditRecords } from "@/lib/mock-data"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

export function AuditRecords() {
  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "in-progress") return <Clock className="w-4 h-4 text-yellow-600" />
    return <AlertCircle className="w-4 h-4 text-blue-600" />
  }

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    if (status === "in-progress") return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
  }

  return (
    <div className="space-y-4">
      {mockAuditRecords.map((audit) => (
        <Card key={audit.id} className="border-border hover:border-accent/50 transition-colors">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Project Info */}
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">{audit.projectName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge className={getStatusColor(audit.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(audit.status)}
                      {audit.status}
                    </span>
                  </Badge>
                </div>
              </div>

              {/* Auditor Info */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Auditor</p>
                <p className="font-semibold text-foreground">{audit.auditorName}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(audit.auditDate).toLocaleDateString()}</p>
              </div>

              {/* Compliance Score */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Compliance Score</p>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{audit.complianceScore}%</p>
                  <Progress value={audit.complianceScore} className="h-2" />
                </div>
              </div>

              {/* Credit Status */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Credit Audit Status</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground">Verified:</span>
                    <span className="font-semibold text-green-600">{audit.creditsVerified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Rejected:</span>
                    <span className="font-semibold text-red-600">{audit.creditsRejected}</span>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Findings</p>
                <p className="text-sm text-foreground">{audit.findings}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Next Review: {new Date(audit.nextReviewDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
