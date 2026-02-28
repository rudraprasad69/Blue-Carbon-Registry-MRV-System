"use client"

import { IsoStandards } from "./iso-standards"
import { VerraGoldStandard } from "./verra-gold-standard"
import { BlueCarbonStandards } from "./blue-carbon-standards"

export function StandardsDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold tracking-tight">Certification & Standards</h2>
        <p className="text-muted-foreground">
          Ensuring credibility and compliance with global carbon accounting standards.
        </p>
      </div>
      <IsoStandards />
      <VerraGoldStandard />
      <div className="lg:col-span-2">
        <BlueCarbonStandards />
      </div>
    </div>
  )
}
