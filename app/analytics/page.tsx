'use client'

import { useEffect, useState } from 'react'
import { ProjectComparisonAnalyzer } from '@/components/project-comparison-analyzer'
import { HistoricalTrendsViewer } from '@/components/historical-trends-viewer'

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<'creditsGenerated' | 'forestCoverArea' | 'biomassTotal' | 'carbonSequestered' | 'costPerCredit'>('creditsGenerated')

  const metrics = [
    { id: 'creditsGenerated', label: 'Credits Generated', icon: '📊' },
    { id: 'forestCoverArea', label: 'Forest Cover', icon: '🌲' },
    { id: 'biomassTotal', label: 'Biomass Total', icon: '📈' },
    { id: 'carbonSequestered', label: 'Carbon Sequestered', icon: '💨' },
    { id: 'costPerCredit', label: 'Cost per Credit', icon: '💰' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-900 to-slate-900 p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
        <p className="text-green-300">Deep dive into project performance and market trends</p>
      </div>

      {/* Metric Selector */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Select Metric</h3>
          <div className="grid grid-cols-5 gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id as any)}
                className={`p-3 rounded border transition text-center ${
                  selectedMetric === metric.id
                    ? 'bg-green-600 border-green-400 text-white'
                    : 'bg-slate-700 border-green-500/20 text-gray-300 hover:border-green-500/50'
                }`}
              >
                <div className="text-xl mb-1">{metric.icon}</div>
                <div className="text-xs font-medium">{metric.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6">
        {/* Comparison Analyzer */}
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Project Benchmarking</h2>
          <ProjectComparisonAnalyzer
            baselineProjectId="project-001"
            comparisonProjectIds={['project-002', 'project-003', 'project-004', 'project-005']}
          />
        </div>

        {/* Historical Trends */}
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Historical Trends & Predictions</h2>
          <HistoricalTrendsViewer
            projectId="project-001"
            metric={selectedMetric}
            showPredictions={true}
            showSeasonality={true}
            days={90}
          />
        </div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4">
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300 text-sm font-medium">Average Growth Rate</p>
          <p className="text-3xl font-bold text-white mt-2">+12.4%</p>
          <p className="text-green-300 text-xs mt-1">Quarter over Quarter</p>
        </div>
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300 text-sm font-medium">Market Volatility</p>
          <p className="text-3xl font-bold text-white mt-2">3.2%</p>
          <p className="text-green-300 text-xs mt-1">30-day standard deviation</p>
        </div>
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300 text-sm font-medium">Prediction Confidence</p>
          <p className="text-3xl font-bold text-white mt-2">94.6%</p>
          <p className="text-green-300 text-xs mt-1">90-day forecast accuracy</p>
        </div>
      </div>
    </div>
  )
}
