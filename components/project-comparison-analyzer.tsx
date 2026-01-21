'use client'

import React, { useState, useEffect } from 'react'
import { getComparisonService, type ComparisonResult, type ProjectMetrics } from '@/lib/comparison-service'

interface ProjectComparisonAnalyzerProps {
  baselineProjectId: string
  comparisonProjectIds: string[]
  onComparison?: (result: ComparisonResult) => void
}

export function ProjectComparisonAnalyzer({
  baselineProjectId,
  comparisonProjectIds,
  onComparison,
}: ProjectComparisonAnalyzerProps) {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<
    'creditsGenerated' | 'forestCover' | 'biomassEstimate' | 'carbonSequestered' | 'costPerCredit'
  >('creditsGenerated')

  useEffect(() => {
    loadComparison()
  }, [baselineProjectId, comparisonProjectIds])

  function loadComparison() {
    try {
      const service = getComparisonService()
      const result = service.compareProjects(baselineProjectId, comparisonProjectIds)
      setComparison(result)
      onComparison?.(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison')
      setComparison(null)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📊</div>
          <p className="text-slate-400">Analyzing projects...</p>
        </div>
      </div>
    )
  }

  if (error || !comparison) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
        <p className="text-red-300">{error || 'No comparison data available'}</p>
      </div>
    )
  }

  const metrics = comparison.metrics[selectedMetric]
  const unit = {
    creditsGenerated: 'credits',
    forestCover: '%',
    biomassEstimate: 'tons/ha',
    carbonSequestered: 'tons CO₂',
    costPerCredit: '$/credit',
  }[selectedMetric]

  const maxValue = Math.max(...metrics.comparison, metrics.baseline)
  const minValue = Math.min(...metrics.comparison, metrics.baseline)
  const range = maxValue - minValue || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-900 to-indigo-900 rounded-lg border border-purple-700 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Project Comparison Analysis</h1>
        <p className="text-purple-200">Benchmark performance across multiple projects</p>
      </div>

      {/* Metric Selector */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-300 font-semibold mb-4">Select Metric:</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(['creditsGenerated', 'forestCover', 'biomassEstimate', 'carbonSequestered', 'costPerCredit'] as const).map(
            (metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {metric === 'creditsGenerated' && '🎖️ Credits'}
                {metric === 'forestCover' && '🌲 Forest'}
                {metric === 'biomassEstimate' && '📦 Biomass'}
                {metric === 'carbonSequestered' && '♻️ Carbon'}
                {metric === 'costPerCredit' && '💰 Cost'}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">{selectedMetric}</h3>

        {/* Horizontal bar chart */}
        <div className="space-y-4">
          {/* Baseline Project */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-slate-300 font-medium">Baseline: {baselineProjectId}</p>
              <p className="text-slate-400">
                {metrics.baseline.toFixed(2)} {unit}
              </p>
            </div>
            <div className="bg-slate-800 rounded-full h-8 overflow-hidden">
              <div
                className="bg-blue-600 h-full flex items-center px-3"
                style={{ width: `${((metrics.baseline - minValue) / range) * 100 + 5}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {((metrics.baseline / maxValue) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Comparison Projects */}
          {metrics.comparison.map((value, idx) => {
            const project = comparison.comparisonProjects[idx]
            const percentileDiff = metrics.percentileDifference[idx]
            const isHigher = percentileDiff > 0

            return (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <p className="text-slate-300 font-medium">{project.projectName}</p>
                  <div className="text-right">
                    <p className="text-slate-400">
                      {value.toFixed(2)} {unit}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        isHigher ? 'text-emerald-400' : percentileDiff < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}
                    >
                      {isHigher ? '+' : ''}{percentileDiff.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full flex items-center px-3 ${
                      isHigher ? 'bg-emerald-600' : percentileDiff < 0 ? 'bg-red-600' : 'bg-slate-700'
                    }`}
                    style={{ width: `${((value - minValue) / range) * 100 + 5}%` }}
                  >
                    <span className="text-xs font-bold text-white">
                      {((value / maxValue) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Statistics */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-xs mb-1">Average</p>
              <p className="text-white font-semibold">
                {metrics.average.toFixed(2)} {unit}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Min</p>
              <p className="text-white font-semibold">
                {metrics.min.toFixed(2)} {unit}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Max</p>
              <p className="text-white font-semibold">
                {metrics.max.toFixed(2)} {unit}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Range</p>
              <p className="text-white font-semibold">
                {(metrics.max - metrics.min).toFixed(2)} {unit}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Rankings ({selectedMetric})</h3>

        <div className="space-y-2">
          {comparison.rankings
            .filter((r) => r.metric === selectedMetric)
            .slice(0, 5)
            .map((ranking) => (
              <div key={ranking.projectId} className="flex items-center justify-between p-3 bg-slate-800 rounded">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-yellow-400 w-8">#{ranking.rank}</div>
                  <div>
                    <p className="text-white font-medium">{ranking.projectName}</p>
                    <p className="text-xs text-slate-400">
                      {ranking.value.toFixed(2)} {unit}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {ranking.rank === 1 && <span className="text-2xl">🏆</span>}
                  {ranking.rank === 2 && <span className="text-2xl">🥈</span>}
                  {ranking.rank === 3 && <span className="text-2xl">🥉</span>}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recommendations */}
      {comparison.recommendations.length > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Recommendations</h3>

          <div className="space-y-3">
            {comparison.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
                <span className="text-lg">💭</span>
                <p className="text-blue-200 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      {comparison.trends.length > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📈 Trends</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparison.trends.map((trend) => (
              <div key={trend.projectId} className="p-4 bg-slate-800 rounded">
                <p className="text-white font-medium mb-2">{trend.projectName}</p>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-2xl ${
                      trend.trendDirection === 'up'
                        ? '📈 text-emerald-400'
                        : trend.trendDirection === 'down'
                          ? '📉 text-red-400'
                          : '➡️ text-slate-400'
                    }`}
                  >
                    {trend.trendDirection === 'up' ? '📈' : trend.trendDirection === 'down' ? '📉' : '➡️'}
                  </span>
                  <div>
                    <p className="text-slate-300 text-sm capitalize">{trend.trendDirection}</p>
                    <p className="text-xs text-slate-500">{trend.percentageChange.toFixed(1)}% change</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{trend.period}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
