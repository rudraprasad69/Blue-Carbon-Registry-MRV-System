"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockFieldDataCollections } from "@/lib/mock-data"
import { CheckCircle, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FieldDataCollection() {
  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "Excellent":
        return "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "Monitoring":
        return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100/20 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Field Data Collections</h2>
        <p className="text-muted-foreground mt-1">Recent environmental monitoring data from field sites</p>
      </div>

      <div className="space-y-4">
        {mockFieldDataCollections.map((collection) => (
          <Card key={collection.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{collection.location}</CardTitle>
                  <CardDescription>{collection.projectName}</CardDescription>
                </div>
                <Badge variant="outline">{collection.dataType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Collector Info */}
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data Collector</p>
                    <p className="text-sm font-medium">{collection.collectorName}</p>
                  </div>
                </div>

                {/* Collection Date */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Collected</p>
                    <p className="text-sm font-medium">{new Date(collection.dateCollected).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">Measurements</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Water Temp</p>
                    <p className="font-semibold">{collection.measurements.waterTemperature}°C</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Salinity</p>
                    <p className="font-semibold">{collection.measurements.salinity} ppt</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">pH Level</p>
                    <p className="font-semibold">{collection.measurements.phLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Biodiversity</p>
                    <p className="font-semibold">{collection.measurements.biodiversitySpecies} species</p>
                  </div>
                </div>
              </div>

              {/* Health Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Health Status</span>
                </div>
                <Badge className={getHealthStatusColor(collection.measurements.healthStatus)}>
                  {collection.measurements.healthStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
