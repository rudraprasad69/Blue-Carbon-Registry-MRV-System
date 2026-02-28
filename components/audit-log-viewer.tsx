"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { auditLogger } from "@/lib/audit-logger"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

export function AuditLogViewer() {
  const logs = auditLogger.getLogs()
  const stats = auditLogger.getStats()

  const getActionColor = (action: string) => {
    switch (action) {
      case "verify":
        return "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "validate":
        return "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "update":
        return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100/20 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "success" ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-600" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Actions</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Successful</p>
            <p className="text-3xl font-bold text-green-600">{stats.successful}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Failed</p>
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Complete record of all system actions and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No audit logs yet</p>
            ) : (
              logs
                .slice(-20)
                .reverse()
                .map((log) => (
                  <div key={log.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <div>
                          <p className="text-sm font-semibold">{log.action.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{log.entityType}</p>
                        </div>
                      </div>
                      <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
