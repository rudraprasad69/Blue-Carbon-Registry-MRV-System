"use client"

import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import type React from "react"

interface SubFeature {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

interface SubFeatureSelectorProps {
  features: SubFeature[]
  activeFeature: string
  onFeatureChange: (featureId: string) => void
  onBack?: () => void
}

export function SubFeatureSelector({ features, activeFeature, onFeatureChange, onBack }: SubFeatureSelectorProps) {
  return (
    <div className="space-y-4 mb-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Accounts</span>
        </button>
      )}

      <div className="flex flex-wrap gap-2">
        {features.map((feature) => {
          const Icon = feature.icon
          const isActive = activeFeature === feature.id

          return (
            <button
              key={feature.id}
              onClick={() => onFeatureChange(feature.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 border-2",
                isActive
                  ? "border-primary bg-primary/10 text-primary shadow-md"
                  : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:bg-card hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{feature.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
