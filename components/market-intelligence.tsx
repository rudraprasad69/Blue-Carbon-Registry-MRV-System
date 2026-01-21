"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockMarketIntelligence } from "@/lib/mock-data"
import { TrendingUp, AlertCircle, Zap } from "lucide-react"

export function MarketIntelligence() {
  const getCategoryIcon = (category: string) => {
    if (category === "market-trend") return <TrendingUp className="w-4 h-4" />
    if (category === "regulatory") return <AlertCircle className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-red-100/20 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
  }

  return (
    <div className="space-y-4">
      {mockMarketIntelligence.map((intel) => (
        <Card key={intel.id} className="border-border hover:border-accent/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getCategoryIcon(intel.category)}
                  <h3 className="font-bold text-lg text-foreground">{intel.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{intel.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(intel.date).toLocaleDateString()}</p>
              </div>
              <Badge className={getImpactColor(intel.impact)}>{intel.impact.toUpperCase()}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
