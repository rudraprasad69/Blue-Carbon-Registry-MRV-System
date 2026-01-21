"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceAnalysis } from "./price-analysis"
import { CreditsIssuedAnalysis } from "./credits-issued-analysis"
import { ImpactMetrics } from "./impact-metrics"
import { MarketIntelligence } from "./market-intelligence"
import { PortfolioAnalytics } from "./portfolio-analytics"
import { TrendingUp, Leaf, Users, Target } from "lucide-react"

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Market Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">$2.3M</p>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Total CO₂ Sequestered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">17.5K</p>
            <p className="text-xs text-muted-foreground mt-2">Metric tons this year</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community Beneficiaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">5,470</p>
            <p className="text-xs text-muted-foreground mt-2">Direct impact beneficiaries</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Avg Portfolio Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">8.2/10</p>
            <p className="text-xs text-muted-foreground mt-2">Diversification score</p>
          </CardContent>
        </Card>
      </div>

      {/* Price & Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Historical Price Analysis</h2>
          <PriceAnalysis />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Credits Issued & Retired</h2>
          <CreditsIssuedAnalysis />
        </div>
      </div>

      {/* Impact Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Environmental Impact Trends</h2>
        <ImpactMetrics />
      </div>

      {/* Market Intelligence */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Market Intelligence & Insights</h2>
        <MarketIntelligence />
      </div>

      {/* Portfolio Analytics */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Portfolio Analytics & Recommendations</h2>
        <PortfolioAnalytics />
      </div>
    </div>
  )
}
