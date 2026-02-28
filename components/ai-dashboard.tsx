"use client"

import { useState } from "react"
import { AiProjectAssistant } from "./ai-project-assistant"
import { AnomalyDetectionViewer } from "./anomaly-detection-viewer"
import { SatelliteAnalysisViewer } from "./satellite-analysis-viewer"
import { SubFeatureSelector } from "./sub-feature-selector"
import { BrainCircuit, ShieldAlert, Satellite } from "lucide-react"

export function AiDashboard() {
  const [activeSubFeature, setActiveSubFeature] = useState<"assistant" | "anomaly" | "satellite">("assistant")

  const subFeatures = [
    {
      id: "assistant",
      label: "AI Assistant",
      icon: BrainCircuit,
      description: "Conversational AI for insights",
    },
    {
      id: "anomaly",
      label: "Anomaly Detection",
      icon: ShieldAlert,
      description: "Detect anomalies in data",
    },
    {
      id: "satellite",
      label: "Satellite Analysis",
      icon: Satellite,
      description: "Analyze satellite imagery",
    },
  ]
  
  const areaOfInterest = {
    north: 45.5,
    south: 45.4,
    east: -75.6,
    west: -75.7,
  };

  return (
    <div className="space-y-8">
      <SubFeatureSelector
        features={subFeatures}
        activeFeature={activeSubFeature}
        onFeatureChange={setActiveSubFeature}
      />

      {activeSubFeature === "assistant" && <AiProjectAssistant />}
      {activeSubFeature === "anomaly" && <AnomalyDetectionViewer />}
      {activeSubFeature === "satellite" && <SatelliteAnalysisViewer areaOfInterest={areaOfInterest} startDate="2023-01-01" endDate="2023-12-31" />}
    </div>
  )
}
