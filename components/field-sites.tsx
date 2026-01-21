"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockFieldSiteData } from "@/lib/mock-data"
import { Activity, Droplet, Leaf } from "lucide-react"

export function FieldSites() {
  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case "Good":
        return "bg-green-500/20 text-green-700 dark:text-green-400"
      case "Fair":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
      case "Poor":
        return "bg-red-500/20 text-red-700 dark:text-red-400"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Field Sites Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockFieldSiteData.map((site) => (
            <div key={site.id} className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">{site.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {site.ecosystem} • {site.areaHa} ha
                  </p>
                </div>
                <Badge className={getWaterQualityColor(site.waterQuality)}>
                  <Droplet className="w-3 h-3 mr-1" />
                  {site.waterQuality}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-accent" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Biodiversity</p>
                    <p className="font-semibold text-foreground">{site.biodiversityScore}/10</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">CO₂ Stored</p>
                    <p className="font-semibold text-foreground">{site.co2Sequestered}t</p>
                  </div>
                </div>
                <div className="text-sm text-right">
                  <p className="text-muted-foreground">Last Monitored</p>
                  <p className="font-semibold text-foreground text-xs">
                    {new Date(site.lastMonitored).toLocaleDateString()}
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
