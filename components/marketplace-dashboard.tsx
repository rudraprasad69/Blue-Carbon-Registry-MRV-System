"use client"

import { useState } from "react"
import { MarketplaceTradingDashboard } from "./marketplace-trading-dashboard"
import { CreditRetirement } from "./credit-retirement"
import { RegistryInteroperability } from "./registry-interoperability"
import { SubFeatureSelector } from "./sub-feature-selector"
import { ShoppingCart, Recycle, GitMerge } from "lucide-react"

export function MarketplaceDashboard() {
  const [activeSubFeature, setActiveSubFeature] = useState<"trading" | "retire" | "interoperability">("trading")

  const subFeatures = [
    {
      id: "trading",
      label: "Trading",
      icon: ShoppingCart,
      description: "Decentralized trading platform",
    },
    {
      id: "retire",
      label: "Retire Credits",
      icon: Recycle,
      description: "Retire carbon credits",
    },
    {
      id: "interoperability",
      label: "Interoperability",
      icon: GitMerge,
      description: "Cross-registry interoperability",
    },
  ]

  return (
    <div className="space-y-8">
      <SubFeatureSelector
        features={subFeatures}
        activeFeature={activeSubFeature}
        onFeatureChange={setActiveSubFeature}
      />

      {activeSubFeature === "trading" && <MarketplaceTradingDashboard />}
      {activeSubFeature === "retire" && <CreditRetirement />}
      {activeSubFeature === "interoperability" && <RegistryInteroperability />}
    </div>
  )
}
