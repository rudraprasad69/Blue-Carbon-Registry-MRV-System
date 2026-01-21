"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle } from "lucide-react"

interface AuditEvent {
  id: string
  timestamp: string
  action: string
  status: "completed" | "pending" | "failed"
  details: string
  actor: string
}

interface TransactionAuditTrailProps {
  events: AuditEvent[]
}

export function TransactionAuditTrail({ events }: TransactionAuditTrailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-700"
      case "pending":
        return "bg-blue-500/20 text-blue-700"
      case "failed":
        return "bg-red-500/20 text-red-700"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {index !== events.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      event.status === "completed"
                        ? "bg-green-500/20"
                        : event.status === "pending"
                          ? "bg-blue-500/20"
                          : "bg-red-500/20"
                    }`}
                  >
                    <CheckCircle
                      className={`w-6 h-6 ${
                        event.status === "completed"
                          ? "text-green-600"
                          : event.status === "pending"
                            ? "text-blue-600"
                            : "text-red-600"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{event.action}</h4>
                    <Badge className={`text-xs ${getStatusColor(event.status)}`}>{event.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{event.details}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    <span>By: {event.actor}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
