"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeveloperProjects } from "./developer-projects"
import { MrvMonitoring } from "./mrv-monitoring"
import { FieldSites } from "./field-sites"
import { DeveloperAnalytics } from "./developer-analytics"
import { IpfsUploader } from "./ipfs-uploader"
import { getDeveloperService, type DeveloperMetrics } from "@/lib/developer-service"
import { TrendingUp, AlertCircle, CheckCircle, Clock, BarChart3, MapPin, Activity, Database } from "lucide-react"
import { SubFeatureSelector } from "./sub-feature-selector"

interface DeveloperDashboardProps {
  onBack?: () => void
}

export function DeveloperDashboard({ onBack }: DeveloperDashboardProps) {
  const [activeSubFeature, setActiveSubFeature] = useState<"projects" | "mrv" | "sites" | "analytics" | "storage">("projects")
  const [metrics, setMetrics] = useState<DeveloperMetrics>(getDeveloperService().getMetrics())

  const subFeatures = [
    {
      id: "projects",
      label: "Projects",
      icon: BarChart3,
      description: "Monitor your projects",
    },
    {
      id: "mrv",
      label: "MRV Monitoring",
      icon: TrendingUp,
      description: "Track credit generation",
    },
    {
      id: "sites",
      label: "Field Sites",
      icon: MapPin,
      description: "Monitor field sites",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: Activity,
      description: "Analyze performance",
    },
    {
      id: "storage",
      label: "Storage",
      icon: Database,
      description: "IPFS File Storage",
    }
  ]

  return (
    <div className="space-y-8">
      <SubFeatureSelector
        features={subFeatures}
        activeFeature={activeSubFeature}
        onFeatureChange={(feature) => setActiveSubFeature(feature as any)}
        onBack={onBack}
      />

      {/* Key Metrics */}
      {(activeSubFeature === "projects" || activeSubFeature === "mrv" || activeSubFeature === "sites" || activeSubFeature === "analytics") && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{metrics.activeProjects}</p>
              <p className="text-xs text-muted-foreground mt-2">/{metrics.totalProjects} total projects</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Credits Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{metrics.totalCreditsIssued.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Total verified</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pending Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{metrics.pendingVerification}</p>
              <p className="text-xs text-muted-foreground mt-2">Projects under audit</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Next Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{metrics.nextAuditDays}</p>
              <p className="text-xs text-muted-foreground mt-2">Days remaining</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content based on active sub-feature */}
      {activeSubFeature === "projects" && <DeveloperProjects />}
      {activeSubFeature === "mrv" && <MrvMonitoring />}
      {activeSubFeature === "sites" && <FieldSites />}
      {activeSubFeature === "analytics" && <DeveloperAnalytics />}
      {activeSubFeature === "storage" && <IpfsUploader />}
    </div>
  )
}
