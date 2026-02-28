"use client"

import { useState } from "react"
import { PostGisViewer } from "./post-gis-viewer"
import { InfluxDbViewer } from "./influx-db-viewer"
import { MongoDbGeoJsonViewer } from "./mongodb-geo-json-viewer"
import { SubFeatureSelector } from "./sub-feature-selector"
import { Database, Waypoints, AreaChart } from "lucide-react"

export function DataInfrastructureDashboard() {
  const [activeSubFeature, setActiveSubFeature] = useState<"postgis" | "influxdb" | "mongodb">("postgis")

  const subFeatures = [
    {
      id: "postgis",
      label: "PostGIS",
      icon: Waypoints,
      description: "Geospatial Data",
    },
    {
      id: "influxdb",
      label: "InfluxDB",
      icon: AreaChart,
      description: "Time-Series Data",
    },
    {
      id: "mongodb",
      label: "MongoDB",
      icon: Database,
      description: "GeoJSON Documents",
    },
  ]

  return (
    <div className="space-y-8">
      <SubFeatureSelector
        features={subFeatures}
        activeFeature={activeSubFeature}
        onFeatureChange={setActiveSubFeature}
      />

      {activeSubFeature === "postgis" && <PostGisViewer />}
      {activeSubFeature === "influxdb" && <InfluxDbViewer />}
      {activeSubFeature === "mongodb" && <MongoDbGeoJsonViewer />}
    </div>
  )
}
