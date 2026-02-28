"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuditLog } from "@/lib/audit-logger"
import { CheckCircle, AlertCircle, Clock, User, Code } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/audit-trail')
        if (!response.ok) {
          throw new Error('Failed to fetch audit logs')
        }
        const data = await response.json()
        setLogs(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const getActionColor = (action: string) => {
    switch (action) {
      case "verify":
        return "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "validate":
        return "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "update":
        return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "create":
        return "bg-purple-100/20 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
      case "delete":
        return "bg-red-100/20 text-red-700 dark:bg-red-900/20 dark:text-red-400"
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

  const renderLogs = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
    }
    if (error) {
      return <p className="text-sm text-red-500 text-center py-8">{error}</p>
    }
    if (logs.length === 0) {
      return <p className="text-sm text-muted-foreground text-center py-8">No audit logs yet</p>
    }
    return logs
      .slice()
      .reverse()
      .map((log) => (
        <div key={log.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {getStatusIcon(log.status)}
              <div>
                <p className="font-semibold">{log.action.charAt(0).toUpperCase() + log.action.slice(1)} {log.entityType}</p>
                <p className="text-xs text-muted-foreground">ID: {log.entityId}</p>
              </div>
            </div>
            <Badge className={getActionColor(log.action)}>{log.action}</Badge>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>User: <span className="font-medium text-foreground">{log.userId}</span></span>
            </div>
            {log.details && <p className="text-xs">{log.details}</p>}
            {log.changes && Object.keys(log.changes).length > 0 && (
                <div className="flex items-start gap-2 pt-1">
                    <Code className="w-3 h-3 mt-0.5" />
                    <pre className="text-xs bg-muted/50 p-2 rounded-md"><code>{JSON.stringify(log.changes, null, 2)}</code></pre>
                </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <Clock className="w-3 h-3" />
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Audit Trail</CardTitle>
          <CardDescription>A complete, immutable record of all system actions and changes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[40rem] overflow-y-auto pr-2">
            {renderLogs()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
