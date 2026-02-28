"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export function MongoDbGeoJsonViewer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MongoDB GeoJSON Viewer</CardTitle>
        <CardDescription>
          Displaying and interacting with GeoJSON data from a MongoDB collection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {/* In a real app, this would be an interactive map component */}
            <Image
                src="/placeholder.svg"
                alt="Map placeholder"
                width={800}
                height={450}
                className="rounded-lg"
            />
        </div>
        <div>
            <h4 className="font-semibold">Active GeoJSON Layers</h4>
            <div className="text-sm text-muted-foreground mt-2 p-4 border rounded-md bg-muted/50">
                <pre>
{`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Project Area A" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [/*...coordinates...*/]
      }
    }
  ]
}`}
                </pre>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
