/**
 * VERIFICATION DASHBOARD PAGE EXAMPLE
 * 
 * Complete dashboard page showing all components in action
 * 
 * Usage in app router:
 * Place in: app/dashboard/page.tsx or pages/dashboard.tsx
 */

'use client'

import React, { useState } from 'react'
import VerificationDashboard from '@/components/verification-dashboard'
import {
  DataQualityCard,
  AnomalyAlertPanel,
  VerificationReadinessGauge,
  CarbonSequestrationDisplay,
  BenefitDistributionDisplay,
  RecommendationList,
} from '@/components/dashboard-cards'
import { RealTimeMonitoring } from '@/components/real-time-monitoring'
import { runCompleteVerificationPipeline } from '@/lib/verification-orchestrator'
import type { VerificationPipelineResult } from '@/lib/verification-orchestrator'

export default function DashboardPage() {
  const [projectId, setProjectId] = useState('sundarbans-2025')
  const [result, setResult] = useState<VerificationPipelineResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'tracking'>('overview')

  const handleRunVerification = async () => {
    try {
      setLoading(true)
      const pipelineResult = await runCompleteVerificationPipeline(projectId)
      setResult(pipelineResult)
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{backgroundImage: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(30, 41, 59), rgb(15, 23, 42))'}} className="min-h-screen">
      {/* Header */}
      <div style={{backgroundImage: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))'}} className="text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">🌊 Blue Carbon Registry</h1>
              <p className="text-blue-100 mt-2">Verification & Monitoring Dashboard</p>
            </div>
            <div className="text-right">
              <div className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <p className="text-sm opacity-90">Real-time Data Verification</p>
                <p className="text-2xl font-bold">v2.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Project Input */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Select Project</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter project ID..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRunVerification}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? '🔄 Running...' : '▶️ Run Verification'}
            </button>
          </div>
        </div>

        {/* Full Dashboard Component */}
        {!result && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <VerificationDashboard projectId={projectId} />
          </div>
        )}

        {result && (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-200">
              {(['overview', 'details', 'tracking'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'details' && '📋 Details'}
                  {tab === 'tracking' && '⛓️ Blockchain'}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <VerificationDashboard projectId={projectId} autoRefresh={false} />
                  </div>
                </div>

                {result.phases.dataAggregation && (
                  <>
                    <CarbonSequestrationDisplay
                      data={result.phases.dataAggregation}
                      className="shadow-lg"
                    />
                    <BenefitDistributionDisplay
                      creditsIssuable={result.creditsIssuable}
                      className="shadow-lg"
                    />
                  </>
                )}
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-3 gap-6">
                {result.phases.dataAggregation && (
                  <>
                    <div className="col-span-2 space-y-6">
                      <DataQualityCard
                        data={result.phases.dataAggregation}
                        className="shadow-lg"
                      />
                      <AnomalyAlertPanel
                        anomalies={result.phases.anomalyDetection}
                        className="shadow-lg"
                      />
                    </div>

                    <div className="space-y-6">
                      <VerificationReadinessGauge
                        readiness={result.phases.dataAggregation.readinessForVerification}
                        className="shadow-lg"
                      />
                    </div>
                  </>
                )}

                {result.phases.dataAggregation && (
                  <div className="col-span-3">
                    <RecommendationList
                      data={result.phases.dataAggregation}
                      className="shadow-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Blockchain Tracking Tab */}
            {activeTab === 'tracking' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  {result.phases.contractVerification?.contractResult?.transactionHash ? (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <RealTimeMonitoring
                        transactionHash={
                          result.phases.contractVerification.contractResult.transactionHash
                        }
                      />
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className="font-semibold text-yellow-900">⏳ Awaiting Submission</h3>
                      <p className="text-yellow-800 mt-2">
                        Smart contract has not been submitted yet. Run verification above to
                        submit.
                      </p>
                      <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                        Submit to Blockchain
                      </button>
                    </div>
                  )}
                </div>

                {/* Contract Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">📝 Smart Contract Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium text-gray-900">
                        {result.status.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Credits Issued</p>
                      <p className="font-medium text-gray-900">
                        {result.creditsIssued.toFixed(2)} /{' '}
                        {result.creditsIssuable.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">
                        {result.durationSeconds.toFixed(2)}s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {result.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg">
                    <h3 className="font-semibold text-red-900 mb-4">⚠️ Errors</h3>
                    <div className="space-y-2">
                      {result.errors.map((err, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium text-red-900">{err.phase}</p>
                          <p className="text-red-800">{err.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRunVerification}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                🔄 Run Another Verification
              </button>
              {result.phases.dataAggregation?.readinessForVerification.readyForVerification && (
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  ✅ Submit to Blockchain
                </button>
              )}
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900">ℹ️ About This Dashboard</h3>
          <div className="mt-3 space-y-2 text-sm text-blue-800">
            <p>• Real-time verification of blue carbon ecosystem data</p>
            <p>• Combines satellite imagery, IoT sensors, and ML analytics</p>
            <p>• Calculates carbon credits ready for blockchain issuance</p>
            <p>• Tracks smart contract submission and confirmations</p>
            <p>• Automatically distributes credits to stakeholders</p>
          </div>
        </div>
      </div>
    </div>
  )
}
