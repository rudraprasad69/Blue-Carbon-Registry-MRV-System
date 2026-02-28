"use client"

import { DerivativeInstruments } from "./derivative-instruments"
import { LongTermCommitments } from "./long-term-commitments"
import { CoBenefits } from "./co-benefits"
import { EnvironmentalImpact } from "./environmental-impact"

export function AdvancedFeaturesDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold tracking-tight">Advanced Features</h2>
        <p className="text-muted-foreground">
          Next-generation tools for a sophisticated carbon market.
        </p>
      </div>
      <div className="lg:col-span-2">
        <EnvironmentalImpact />
      </div>
      <CoBenefits />
      <div className="space-y-6">
        <DerivativeInstruments />
        <LongTermCommitments />
      </div>
    </div>
  )
}
