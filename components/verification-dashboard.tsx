/**
 * VERIFICATION DASHBOARD - Main Component
 * 
 * Displays complete verification status with all 6 phases
 * and blockchain submission details
 * 
 * Usage:
 * <VerificationDashboard projectId="project-123" />
 */

'use client'

import { useState, useEffect } from 'react'
import { runCompleteVerificationPipeline } from '@/lib/verification-orchestrator'
import type { VerificationPipelineResult } from '@/lib/verification-orchestrator'

interface VerificationDashboardProps {
  projectId: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function VerificationDashboard({
  projectId,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: VerificationDashboardProps) {
  const [result, setResult] = useState<VerificationPipelineResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const runVerification = async () => {
    try {
      setLoading(true)
      setError(null)

      const pipelineResult = await runCompleteVerificationPipeline(projectId)
      setResult(pipelineResult)
      setLastUpdated(new Date())
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Verification failed'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runVerification()

    if (autoRefresh) {
      const interval = setInterval(runVerification, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [projectId, autoRefresh, refreshInterval])

  if (loading && !result) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Verification Error</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={runVerification}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!result) {
    return <div>No data available</div>
  }

  const aggregated = result.phases.dataAggregation
  const readiness = aggregated?.readinessForVerification
  const carbon = aggregated?.carbonSequestrationEstimate

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-linear-to-br from-slate-50 to-slate-100 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            🌊 Verification Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Project: {projectId}</p>
        </div>
        <div className="text-right">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              result.status === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {result.status.toUpperCase()}
          </div>
          {lastUpdated && (
            <p className="text-xs text-slate-600 mt-2">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard
          label="Carbon Sequestered"
          value={`${carbon?.totalSequestered.toFixed(1) || '-'} tons`}
          subtext={`${carbon?.confidence || '-'}% confidence`}
          icon="🌱"
          color="green"
        />
        <StatusCard
          label="Data Quality"
          value={`${aggregated?.dataQualityMetrics.overallScore.toFixed(0) || '-'}%`}
          subtext="Multi-source average"
          icon="✔️"
          color="blue"
        />
        <StatusCard
          label="Readiness Score"
          value={`${readiness?.readinessScore.toFixed(0) || '-'}%`}
          subtext={readiness?.readyForVerification ? 'READY' : 'PENDING'}
          icon="🔍"
          color={readiness?.readyForVerification ? 'green' : 'yellow'}
        />
        <StatusCard
          label="Credits Issuable"
          value={`${result.creditsIssuable.toFixed(2)}`}
          subtext="eBlue Carbon tokens"
          icon="💰"
          color="purple"
        />
      </div>

      {/* Pipeline Phases */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Verification Pipeline</h2>
        <div className="space-y-2">
          <PhaseIndicator phase="1" name="Satellite Analysis" status="complete" />
          <PhaseIndicator phase="2" name="Sensor Aggregation" status="complete" />
          <PhaseIndicator phase="3" name="Anomaly Detection" status="complete" />
          <PhaseIndicator phase="4" name="Data Validation" status="complete" />
          <PhaseIndicator phase="5" name="Data Aggregation" status="complete" />
          <PhaseIndicator
            phase="6"
            name="Smart Contract"
            status={readiness?.readyForVerification ? 'ready' : 'pending'}
          />
        </div>
      </div>

      {/* Data Quality Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <QualityMetric
          label="Satellite Quality"
          value={aggregated?.dataQualityMetrics.satelliteQuality || 0}
        />
        <QualityMetric
          label="Sensor Quality"
          value={aggregated?.dataQualityMetrics.sensorQuality || 0}
        />
        <QualityMetric
          label="Cross-Source Consistency"
          value={aggregated?.dataQualityMetrics.consistencyScore || 0}
        />
      </div>

      {/* Anomalies */}
      {result.phases.anomalyDetection.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900">
            ⚠️ Anomalies Detected ({result.phases.anomalyDetection.length})
          </h3>
          <div className="mt-2 space-y-1">
            {result.phases.anomalyDetection.slice(0, 3).map((anomaly, i) => (
              <div key={i} className="text-sm text-yellow-800">
                <span className="font-medium">{anomaly.type}:</span> {anomaly.explanation}
              </div>
            ))}
            {result.phases.anomalyDetection.length > 3 && (
              <div className="text-sm text-yellow-700 italic">
                +{result.phases.anomalyDetection.length - 3} more...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blockers */}
      {readiness?.blockers && readiness.blockers.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900">🚫 Blockers</h3>
          <ul className="mt-2 space-y-1">
            {readiness.blockers.map((blocker, i) => (
              <li key={i} className="text-sm text-red-800">
                • {blocker}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {aggregated?.recommendations && aggregated.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900">💡 Recommendations</h3>
          <div className="mt-2 space-y-2">
            {aggregated.recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-blue-900">[{rec.priority}]</span>
                <p className="text-blue-800 mt-1">{rec.description}</p>
                <p className="text-blue-700 text-xs">
                  Impact: {rec.estimatedImpact} | Timeline: {rec.timeToImplement}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockchain Status */}
      {result.phases.contractVerification && (
        <div className="bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900">⛓️ Blockchain Status</h3>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-purple-700">Status</p>
              <p className="text-lg font-bold text-purple-900">
                {result.phases.contractVerification?.contractResult?.transactionHash
                  ? 'SUBMITTED'
                  : 'PENDING'}
              </p>
            </div>
            <div>
              <p className="text-xs text-purple-700">Credits Issued</p>
              <p className="text-lg font-bold text-purple-900">
                {result.creditsIssued.toFixed(2)} / {result.creditsIssuable.toFixed(2)}
              </p>
            </div>
          </div>
          {result.phases.contractVerification?.contractResult?.transactionHash && (
            <p className="text-xs text-purple-700 mt-3 break-all">
              TX: {result.phases.contractVerification.contractResult.transactionHash}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={runVerification}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Running...' : 'Run Verification'}
        </button>
        {readiness?.readyForVerification && (
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Submit to Blockchain
          </button>
        )}
      </div>

      {/* Duration */}
      <div className="text-xs text-slate-600 text-center">
        Verification completed in {result.durationSeconds.toFixed(2)}s
      </div>
    </div>
  )
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface StatusCardProps {
  label: string
  value: string
  subtext: string
  icon: string
  color: 'green' | 'blue' | 'purple' | 'yellow'
}

function StatusCard({ label, value, subtext, icon, color }: StatusCardProps) {
  const bgColors = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  }

  const textColors = {
    green: 'text-green-900',
    blue: 'text-blue-900',
    purple: 'text-purple-900',
    yellow: 'text-yellow-900',
  }

  return (
    <div className={`border ${bgColors[color]} rounded-lg p-4`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className={`text-2xl font-bold ${textColors[color]} mt-1`}>{value}</p>
      <p className="text-xs text-gray-600 mt-2">{subtext}</p>
    </div>
  )
}

interface PhaseIndicatorProps {
  phase: string
  name: string
  status: 'complete' | 'ready' | 'pending' | 'failed'
}

function PhaseIndicator({ phase, name, status }: PhaseIndicatorProps) {
  const statusIcons = {
    complete: '✅',
    ready: '🟢',
    pending: '⏳',
    failed: '❌',
  }

  const statusColors = {
    complete: 'bg-green-100 text-green-800',
    ready: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${statusColors[status]}`}>
      <div className="text-2xl">{statusIcons[status]}</div>
      <div className="flex-1">
        <div className="font-medium">Phase {phase}: {name}</div>
        <div className="text-xs opacity-75 capitalize">{status}</div>
      </div>
    </div>
  )
}

interface QualityMetricProps {
  label: string
  value: number
}

function QualityMetric({ label, value }: QualityMetricProps) {
  const getColor = (v: number) => {
    if (v >= 85) return 'bg-green-500'
    if (v >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {value.toFixed(0)}%
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor(value)} transition-all`}
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default VerificationDashboard
