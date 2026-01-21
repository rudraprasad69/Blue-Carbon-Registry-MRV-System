"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditRecords } from "./audit-records"
import { ComplianceViolations } from "./compliance-violations"
import { RegulatoryReports } from "./regulatory-reports"
import { CheckCircle2, AlertTriangle, Clock, BarChart3, FileText } from "lucide-react"
import { SubFeatureSelector } from "./sub-feature-selector"

interface RegulatorDashboardProps {
  onBack?: () => void
}

export function RegulatorDashboard({ onBack }: RegulatorDashboardProps) {
  const [activeSubFeature, setActiveSubFeature] = useState<"audits" | "violations" | "reports">("audits")

  const subFeatures = [
    {
      id: "audits",
      label: "Audit Records",
      icon: CheckCircle2,
      description: "Verify & audit",
    },
    {
      id: "violations",
      label: "Violations",
      icon: AlertTriangle,
      description: "Compliance issues",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      description: "Regulatory reports",
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Audits Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">8</p>
            <p className="text-xs text-muted-foreground mt-2">This quarter</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Credits Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">18,500</p>
            <p className="text-xs text-muted-foreground mt-2">Compliance rate 94.2%</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">2</p>
            <p className="text-xs text-muted-foreground mt-2">Under investigation</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Audits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground mt-2">Scheduled this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active sub-feature */}
      {activeSubFeature === "audits" && <AuditRecords />}
      {activeSubFeature === "violations" && <ComplianceViolations />}
      {activeSubFeature === "reports" && <RegulatoryReports />}
    </div>
  )
}
