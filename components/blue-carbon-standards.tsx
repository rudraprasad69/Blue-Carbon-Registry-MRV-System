"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function BlueCarbonStandards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Blue Carbon Standards Framework</CardTitle>
        <CardDescription>
          Adhering to the latest scientific and policy frameworks for blue carbon ecosystems.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
            We actively incorporate guidance from the Blue Carbon Initiative, the International Blue Carbon Partnership, and other leading scientific bodies to ensure that our projects deliver real, measurable, and long-term climate benefits while promoting biodiversity and supporting coastal communities.
        </p>
      </CardContent>
    </Card>
  )
}
