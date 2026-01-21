"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"
import { chainlinkOracles } from "@/lib/oracle-feeds"

export function OracleDataDisplay() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Oracle Price Feeds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chainlinkOracles.map((oracle) => (
            <div key={oracle.id} className="p-3 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{oracle.ecosystem.toUpperCase()}</h4>
                  <p className="text-xs text-muted-foreground">{oracle.provider} Oracle</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">${oracle.price.toFixed(2)}</p>
                  {oracle.status === "healthy" && (
                    <Badge className="bg-green-500/20 text-green-700 border-0 text-xs mt-1">
                      <CheckCircle className="w-2 h-2 mr-1" />
                      Live
                    </Badge>
                  )}
                  {oracle.status === "delayed" && (
                    <Badge className="bg-yellow-500/20 text-yellow-700 border-0 text-xs mt-1">
                      <AlertCircle className="w-2 h-2 mr-1" />
                      Delayed
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="font-semibold text-foreground">{oracle.confidence}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data Age</p>
                  <p className="font-semibold text-foreground">{oracle.dataAge}s</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Update</p>
                  <p className="font-semibold text-foreground">
                    {new Date(oracle.lastUpdate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
