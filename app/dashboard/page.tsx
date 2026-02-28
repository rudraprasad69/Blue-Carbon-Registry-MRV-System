'use client'

import { useEffect, useState } from 'react'
import { MarketAnalyticsDashboard } from '@/components/market-analytics-dashboard'
import { ProjectComparisonAnalyzer } from '@/components/project-comparison-analyzer'
import { HistoricalTrendsViewer } from '@/components/historical-trends-viewer'
import { AdvancedReportBuilder } from '@/components/advanced-report-builder'
import { AdminDashboard } from '@/components/admin-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('market')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-800 to-slate-900 p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Carbon Analytics Dashboard</h1>
        <p className="text-green-300">Real-time market data, project analysis, and performance tracking</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-green-500/20">
            <TabsTrigger value="market" className="data-[state=active]:bg-green-600">
              Market
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-green-600">
              Compare
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-green-600">
              Trends
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-green-600">
              Reports
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-green-600">
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-4">
            <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Market Analytics</h2>
              <MarketAnalyticsDashboard refreshInterval={30000} showPriceHistory={true} showVolume={true} />
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Project Comparison</h2>
              <ProjectComparisonAnalyzer
                baselineProjectId="project-001"
                comparisonProjectIds={['project-002', 'project-003', 'project-004']}
              />
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Historical Trends & Predictions</h2>
              <HistoricalTrendsViewer
                projectId="project-001"
                metric="creditsGenerated"
                showPredictions={true}
                showSeasonality={true}
                days={90}
              />
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Export & Reports</h2>
              <AdvancedReportBuilder />
            </div>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="space-y-4">
            <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Administration</h2>
              <AdminDashboard />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            Last updated: {new Date().toLocaleTimeString()} | Dashboard Status: Operational ✓
          </p>
        </div>
      </div>
    </div>
  )
}
