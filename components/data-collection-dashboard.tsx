"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Satellite, Bone as Drone, Waves, Cloud, Zap } from "lucide-react"
import { useState } from "react"

interface SensorReading {
  id: string
  location: string
  type: "satellite" | "drone" | "sensor"
  timestamp: string
  status: "active" | "processing" | "completed"
  data: {
    co2Captured: number
    coverage: number
    accuracy: number
    biodiversity: number
  }
}

const mockDataCollections: SensorReading[] = [
  {
    id: "1",
    location: "Sundarbans Mangrove Zone A",
    type: "satellite",
    timestamp: "2024-01-15T14:30:00",
    status: "completed",
    data: { co2Captured: 450, coverage: 98.5, accuracy: 96, biodiversity: 87 },
  },
  {
    id: "2",
    location: "Seagrass Meadow Site B",
    type: "drone",
    timestamp: "2024-01-15T13:45:00",
    status: "processing",
    data: { co2Captured: 320, coverage: 85, accuracy: 94, biodiversity: 92 },
  },
  {
    id: "3",
    location: "Salt Marsh Estuary C",
    type: "sensor",
    timestamp: "2024-01-15T12:00:00",
    status: "active",
    data: { co2Captured: 280, coverage: 100, accuracy: 98, biodiversity: 78 },
  },
]

function getIcon(type: string) {
  switch (type) {
    case "satellite":
      return <Satellite className="w-5 h-5 text-blue-600" />
    case "drone":
      return <Drone className="w-5 h-5 text-teal-600" />
    case "sensor":
      return <Waves className="w-5 h-5 text-cyan-600" />
    default:
      return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-700 dark:text-green-400"
    case "processing":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
    case "active":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
    default:
      return "bg-gray-500/20 text-gray-700"
  }
}

export function DataCollectionDashboard() {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredData =
    selectedType === null ? mockDataCollections : mockDataCollections.filter((item) => item.type === selectedType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Data Collection Layer</h2>
        <p className="text-muted-foreground mt-1">Real-time satellite, drone, and sensor monitoring data</p>
      </div>

      {/* Source Type Filter */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedType === null
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-accent/20"
          }`}
        >
          All Sources
        </button>
        <button
          onClick={() => setSelectedType("satellite")}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedType === "satellite"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-blue-500/20"
          }`}
        >
          <Satellite className="w-4 h-4" />
          Satellite
        </button>
        <button
          onClick={() => setSelectedType("drone")}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedType === "drone"
              ? "bg-teal-600 text-white shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-teal-500/20"
          }`}
        >
          <Drone className="w-4 h-4" />
          Drone
        </button>
        <button
          onClick={() => setSelectedType("sensor")}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedType === "sensor"
              ? "bg-cyan-600 text-white shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-cyan-500/20"
          }`}
        >
          <Waves className="w-4 h-4" />
          Sensors
        </button>
      </div>

      {/* Active Monitoring Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border hover:border-accent/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-600" />
              Active Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{filteredData.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Real-time monitoring</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-accent/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              Total CO₂ Captured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">
              {filteredData.reduce((sum, d) => sum + d.data.co2Captured, 0)}t
            </p>
            <p className="text-xs text-muted-foreground mt-2">This collection cycle</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-accent/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Satellite className="w-4 h-4 text-cyan-600" />
              Avg Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-600">
              {(filteredData.reduce((sum, d) => sum + d.data.coverage, 0) / filteredData.length).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Monitoring accuracy</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-accent/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Drone className="w-4 h-4 text-teal-600" />
              Biodiversity Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teal-600">
              {(filteredData.reduce((sum, d) => sum + d.data.biodiversity, 0) / filteredData.length).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Average health score</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Collection Records */}
      <div className="space-y-4">
        {filteredData.map((collection) => (
          <Card
            key={collection.id}
            className="border-border hover:shadow-md hover:border-accent/50 transition-all duration-300 group"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-lg group-hover:bg-accent/20 transition-colors">
                    {getIcon(collection.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{collection.location}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(collection.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(collection.status)}>
                  {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">CO₂ Captured</p>
                  <p className="font-semibold text-lg text-primary">{collection.data.co2Captured}t</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Coverage</p>
                  <p className="font-semibold text-lg text-blue-600">{collection.data.coverage}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                  <p className="font-semibold text-lg text-teal-600">{collection.data.accuracy}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Biodiversity</p>
                  <p className="font-semibold text-lg text-cyan-600">{collection.data.biodiversity}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
