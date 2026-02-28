"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export function PostGisViewer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PostGIS Geospatial Data Viewer</CardTitle>
        <CardDescription>
          Visualizing geospatial data from a PostGIS database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {/* In a real app, this would be an interactive map component like Leaflet or Mapbox */}
            <Image
                src="/placeholder.svg"
                alt="Map placeholder"
                width={800}
                height={450}
                className="rounded-lg"
            />
        </div>
        <div>
            <h4 className="font-semibold">Data Layers</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2">
                <li>Project Boundaries (GeoJSON)</li>
                <li>Monitoring Sites (Points)</li>
                <li>Vegetation Density (Raster)</li>
            </ul>
        </div>
      </CardContent>
    </Card>
  )
}
