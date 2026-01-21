/**
 * DASHBOARD CARDS - Reusable Components
 * 
 * Individual cards for verification dashboard
 */

'use client'

import React from 'react'
import type { AggregatedMonitoringData, VerificationReadiness } from '@/lib/data-aggregation-service'
import type { DetectedAnomaly } from '@/lib/ml-anomaly-detection'

// ============================================================================
// DATA QUALITY CARD
// ============================================================================

interface DataQualityCardProps {
  data: AggregatedMonitoringData
  className?: string
}

export function DataQualityCard({ data, className }: DataQualityCardProps) {
  const metrics = data.dataQualityMetrics
  const scores = [
    { label: 'Overall', value: metrics.overallScore },
    { label: 'Satellite', value: metrics.satelliteQuality },
    { label: 'Sensors', value: metrics.sensorQuality },
    { label: 'Temporal', value: metrics.temporalQuality },
    { label: 'Spatial', value: metrics.spatialQuality },
    { label: 'Consistency', value: metrics.consistencyScore },
  ]

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Data Quality Assessment</h3>
      
      <div className="space-y-3">
        {scores.map((score) => (
          <div key={score.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{score.label}</span>
              <span className="text-sm font-bold text-gray-900">{score.value.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  score.value >= 85
                    ? 'bg-green-500'
                    : score.value >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(score.value, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Data Quality: {((data?.dataQualityMetrics?.overallScore || 0) * 100).toFixed(0)}% average
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// ANOMALY ALERT PANEL
// ============================================================================

interface AnomalyAlertPanelProps {
  anomalies: DetectedAnomaly[]
  className?: string
  maxDisplay?: number
}

export function AnomalyAlertPanel({
  anomalies,
  className,
  maxDisplay = 5,
}: AnomalyAlertPanelProps) {
  if (anomalies.length === 0) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className || ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">✅</span>
          <p className="text-green-900 font-medium">No anomalies detected</p>
        </div>
      </div>
    )
  }

  const displayed = anomalies.slice(0, maxDisplay)
  const remaining = anomalies.length - maxDisplay

  const severityColor = {
    high: 'bg-red-50 border-red-200 text-red-900',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    low: 'bg-blue-50 border-blue-200 text-blue-900',
  }

  const severityIcon = {
    high: '🚨',
    medium: '⚠️',
    low: 'ℹ️',
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900">
        🔍 Detected Anomalies ({anomalies.length})
      </h3>
      
      {displayed.map((anomaly, i) => (
        <div key={i} className={`border rounded-lg p-4 ${severityColor[anomaly.severity]}`}>
          <div className="flex gap-3">
            <span className="text-xl">{severityIcon[anomaly.severity]}</span>
            <div className="flex-1">
              <div className="font-semibold capitalize">
                {anomaly.severity} Severity - {anomaly.type}
              </div>
              <p className="text-sm mt-1 opacity-90">{anomaly.explanation}</p>
              <div className="text-xs opacity-75 mt-2">
                Confidence: {anomaly.confidence}%
              </div>
            </div>
          </div>
        </div>
      ))}

      {remaining > 0 && (
        <div className="text-sm text-gray-600 italic">
          +{remaining} more anomalies (expand to view all)
        </div>
      )}
    </div>
  )
}

// ============================================================================
// VERIFICATION READINESS GAUGE
// ============================================================================

interface VerificationReadinessGaugeProps {
  readiness: VerificationReadiness
  className?: string
}

export function VerificationReadinessGauge({
  readiness,
  className,
}: VerificationReadinessGaugeProps) {
  const criteria = [
    {
      label: 'Sufficient Data Sources',
      met: readiness.criteriaStatus.sufficientDataSources,
    },
    {
      label: 'Temporal Coverage Adequate',
      met: readiness.criteriaStatus.temporalCoverageAdequate,
    },
    {
      label: 'Quality Threshold Met',
      met: readiness.criteriaStatus.qualityThresholdMet,
    },
    {
      label: 'Anomalies Resolved',
      met: readiness.criteriaStatus.anomaliesResolved,
    },
    {
      label: 'Cross-Source Validated',
      met: readiness.criteriaStatus.crossSourceValidated,
    },
  ]

  const metCount = criteria.filter((c) => c.met).length
  const readyPercentage = (metCount / criteria.length) * 100

  return (
    <div style={{backgroundImage: 'linear-gradient(to bottom right, rgb(243, 232, 255), rgb(224, 231, 255))'}} className={`border border-purple-200 rounded-lg p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Verification Readiness</h3>

      {/* Gauge */}
      <div className="mb-6">
        <div className="flex items-end gap-4">
          <div>
            <div className="text-4xl font-bold text-purple-900">
              {readiness.readinessScore.toFixed(0)}%
            </div>
            <div className="text-sm text-purple-700 mt-1">
              {readiness.readyForVerification ? (
                <span className="font-semibold text-green-700">✅ READY FOR VERIFICATION</span>
              ) : (
                <span className="font-semibold text-yellow-700">⏳ NEEDS MORE DATA</span>
              )}
            </div>
          </div>
          
          {/* Circular Progress */}
          <div className="w-24 h-24 rounded-full border-4 border-purple-300 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-900">{metCount}/{criteria.length}</div>
              <div className="text-xs text-purple-700">criteria met</div>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="space-y-2">
        {criteria.map((criterion) => (
          <div key={criterion.label} className="flex items-center gap-3 p-2 rounded">
            <span className="text-lg">{criterion.met ? '✅' : '❌'}</span>
            <span className={criterion.met ? 'text-gray-900' : 'text-gray-600'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>

      {/* Blockers */}
      {readiness.blockers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-200">
          <p className="text-sm font-semibold text-red-900 mb-2">Blockers:</p>
          <ul className="space-y-1">
            {readiness.blockers.map((blocker, i) => (
              <li key={i} className="text-sm text-red-800">
                🚫 {blocker}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CARBON SEQUESTRATION DISPLAY
// ============================================================================

interface CarbonSequestrationDisplayProps {
  data: AggregatedMonitoringData
  className?: string
}

export function CarbonSequestrationDisplay({
  data,
  className,
}: CarbonSequestrationDisplayProps) {
  const carbon = data.carbonSequestrationEstimate
  const baselineComparison = carbon.comparisonToBaseline

  return (
    <div style={{backgroundImage: 'linear-gradient(to bottom right, rgb(240, 253, 244), rgb(236, 252, 245))'}} className={`border border-green-200 rounded-lg p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🌱 Carbon Sequestration</h3>

      <div className="space-y-4">
        {/* Main Metric */}
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <p className="text-sm text-gray-600">Total Sequestered</p>
          <p className="text-3xl font-bold text-green-900">
            {carbon.totalSequestered.toFixed(1)}
            <span className="text-lg ml-1">tons CO₂e</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Confidence: {carbon.confidence}%
          </p>
        </div>

        {/* Annualized Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <p className="text-xs text-gray-600">Annualized Rate</p>
            <p className="text-xl font-bold text-green-900">
              {carbon.annualizedRate.toFixed(1)}
              <span className="text-sm">/year</span>
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <p className="text-xs text-gray-600">Monitoring Period</p>
            <p className="text-xl font-bold text-green-900">
              {data.monitoringPeriod.durationDays}
              <span className="text-sm"> days</span>
            </p>
          </div>
        </div>

        {/* Baseline Comparison */}
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <p className="text-xs text-gray-600 mb-2">Vs. Baseline</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-900">
              {baselineComparison.percentageChange > 0 ? '+' : ''}
              {baselineComparison.percentageChange.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-600">
              ({baselineComparison.currentRate.toFixed(2)} vs {baselineComparison.baselineRate.toFixed(2)})
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${Math.min((baselineComparison.currentRate / (baselineComparison.baselineRate * 1.5)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Methodology */}
        <div className="text-xs text-gray-600 p-3 bg-white rounded border border-gray-200">
          <span className="font-medium">Methodology:</span> {carbon.methodology}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// BENEFIT DISTRIBUTION DISPLAY
// ============================================================================

interface BenefitDistributionDisplayProps {
  creditsIssuable: number
  className?: string
}

export function BenefitDistributionDisplay({
  creditsIssuable,
  className,
}: BenefitDistributionDisplayProps) {
  const distribution = {
    projectOwner: creditsIssuable * 0.65,
    community: creditsIssuable * 0.25,
    conservation: creditsIssuable * 0.1,
  }

  const categories = [
    {
      label: 'Project Owner',
      value: distribution.projectOwner,
      percentage: 65,
      icon: '🏢',
      color: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    {
      label: 'Local Community',
      value: distribution.community,
      percentage: 25,
      icon: '👥',
      color: 'bg-green-100 text-green-900 border-green-300',
    },
    {
      label: 'Conservation Fund',
      value: distribution.conservation,
      percentage: 10,
      icon: '🌍',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
  ]

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎁 Benefit Distribution</h3>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className={`border rounded-lg p-4 ${cat.color}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-semibold">{cat.label}</span>
                </div>
                <span className="font-bold">{cat.percentage}%</span>
              </div>
              <div className="text-lg font-bold">{cat.value.toFixed(2)} credits</div>
              <div className="mt-2 h-2 bg-gray-300 rounded-full overflow-hidden opacity-30">
                <div className="h-full bg-current" style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total Credits</span>
          <span className="text-2xl font-bold text-gray-900">{creditsIssuable.toFixed(2)}</span>
        </div>
      </div>

      {/* Vesting Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <p className="font-medium">📅 Vesting Schedule</p>
        <p className="mt-1">Community credits unlock over 12 months from issuance date</p>
      </div>
    </div>
  )
}

// ============================================================================
// RECOMMENDATION LIST
// ============================================================================

interface RecommendationListProps {
  data: AggregatedMonitoringData
  className?: string
  maxDisplay?: number
}

export function RecommendationList({
  data,
  className,
  maxDisplay = 5,
}: RecommendationListProps) {
  if (!data.recommendations || data.recommendations.length === 0) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className || ''}`}>
        <p className="text-green-900 font-medium">✅ All systems optimal - no recommendations</p>
      </div>
    )
  }

  const displayed = data.recommendations.slice(0, maxDisplay)
  const remaining = data.recommendations.length - maxDisplay

  const priorityColor = {
    critical: 'bg-red-50 border-red-200 text-red-900',
    high: 'bg-orange-50 border-orange-200 text-orange-900',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    low: 'bg-blue-50 border-blue-200 text-blue-900',
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900">💡 Recommendations</h3>

      {displayed.map((rec, i) => (
        <div key={i} className={`border rounded-lg p-4 ${priorityColor[rec.priority]}`}>
          <div className="flex items-start justify-between mb-2">
            <p className="font-semibold capitalize">{rec.priority} Priority</p>
            <p className="text-xs opacity-75">{rec.timeToImplement}</p>
          </div>
          <p className="text-sm mb-2">{rec.description}</p>
          <p className="text-xs opacity-75">Impact: {rec.estimatedImpact}</p>
        </div>
      ))}

      {remaining > 0 && (
        <div className="text-sm text-gray-600 italic p-3 bg-gray-50 rounded border border-gray-200">
          +{remaining} more recommendations
        </div>
      )}
    </div>
  )
}

export {}
