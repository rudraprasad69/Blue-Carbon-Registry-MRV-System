"use client"

import { useState } from "react"
import { CommunityProjects } from "./community-projects"
import { FieldDataCollection } from "./field-data-collection"
import { BenefitDistribution } from "./benefit-distribution"
import { SubFeatureSelector } from "./sub-feature-selector"
import { Users, Database, Gift } from "lucide-react"

interface CommunityDashboardProps {
  onBack?: () => void
}

export function CommunityDashboard({ onBack }: CommunityDashboardProps) {
  const [activeSubFeature, setActiveSubFeature] = useState<"projects" | "field-data" | "benefits">("projects")

  const subFeatures = [
    {
      id: "projects",
      label: "Projects",
      icon: Users,
      description: "Active community projects",
    },
    {
      id: "field-data",
      label: "Field Data",
      icon: Database,
      description: "Environmental monitoring",
    },
    {
      id: "benefits",
      label: "Benefit Distribution",
      icon: Gift,
      description: "Community fund allocation",
    },
  ]

  return (
    <div className="space-y-8">
      <SubFeatureSelector
        features={subFeatures}
        activeFeature={activeSubFeature}
        onFeatureChange={setActiveSubFeature}
        onBack={onBack}
      />

      {/* Content based on active sub-feature */}
      {activeSubFeature === "projects" && <CommunityProjects />}
      {activeSubFeature === "field-data" && <FieldDataCollection />}
      {activeSubFeature === "benefits" && <BenefitDistribution />}
    </div>
  )
}
