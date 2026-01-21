export interface AuditLog {
  id: string
  timestamp: string
  action: "create" | "update" | "verify" | "validate" | "delete"
  entityType: string
  entityId: string
  changes: Record<string, any>
  userId?: string
  status: "success" | "failed"
  details?: string
}

class AuditLogger {
  private logs: AuditLog[] = []

  log(
    action: AuditLog["action"],
    entityType: string,
    entityId: string,
    changes: Record<string, any>,
    status: "success" | "failed" = "success",
    userId?: string,
    details?: string,
  ): AuditLog {
    const auditLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      entityType,
      entityId,
      changes,
      userId,
      status,
      details,
    }

    this.logs.push(auditLog)
    return auditLog
  }

  getLogs(entityType?: string, entityId?: string): AuditLog[] {
    return this.logs.filter((log) => {
      if (entityType && log.entityType !== entityType) return false
      if (entityId && log.entityId !== entityId) return false
      return true
    })
  }

  getStats() {
    const total = this.logs.length
    const successful = this.logs.filter((l) => l.status === "success").length
    const failed = this.logs.filter((l) => l.status === "failed").length

    const byAction = this.logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      byAction,
    }
  }

  clear(): void {
    this.logs = []
  }
}

export const auditLogger = new AuditLogger()
