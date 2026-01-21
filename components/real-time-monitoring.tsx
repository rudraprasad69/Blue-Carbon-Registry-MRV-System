/**
 * REAL-TIME MONITORING INTERFACE
 * 
 * Live updates with status tracking
 */

'use client'

import { useState, useEffect } from 'react'
import { getVerificationStatus } from '@/lib/smart-contract-verification'
import type { VerificationStatus } from '@/lib/smart-contract-verification'

interface RealTimeMonitoringProps {
  transactionHash: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function RealTimeMonitoring({
  transactionHash,
  autoRefresh = true,
  refreshInterval = 5000, // 5 seconds
}: RealTimeMonitoringProps) {
  const [status, setStatus] = useState<VerificationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<VerificationStatus[]>([])

  const updateStatus = async () => {
    try {
      setLoading(true)
      const newStatus = await getVerificationStatus(transactionHash)
      setStatus(newStatus)
      setHistory((prev) => [newStatus, ...prev].slice(0, 10)) // Keep last 10
    } catch (error) {
      console.error('Failed to fetch status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateStatus()

    if (autoRefresh) {
      const interval = setInterval(updateStatus, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [transactionHash, autoRefresh, refreshInterval])

  if (!status) {
    return <div className="text-center p-4">Loading status...</div>
  }

  const statusColors = {
    pending: 'bg-gray-100 text-gray-900',
    submitted: 'bg-blue-100 text-blue-900',
    confirmed: 'bg-yellow-100 text-yellow-900',
    finalized: 'bg-green-100 text-green-900',
    failed: 'bg-red-100 text-red-900',
  }

  const progressPercentage = (status.confirmations / status.requiredConfirmations) * 100

  return (
    <div className="space-y-4">
      {/* Main Status */}
      <div className={`rounded-lg p-6 border ${statusColors[status.status]}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold capitalize">
              {status.status === 'finalized'
                ? '✅ Verification Complete'
                : status.status === 'confirmed'
                  ? '🔄 Verification Confirmed'
                  : status.status === 'submitted'
                    ? '⏳ Transaction Submitted'
                    : '⏰ Pending'}
            </h3>
            <p className="text-sm mt-1 opacity-75">{status.message}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {status.confirmations}/{status.requiredConfirmations} Confirmations
            </div>
            <div className="text-xs mt-1 opacity-75">
              Est. completion: {new Date(status.estimatedCompletion).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-3 bg-gray-300 rounded-full overflow-hidden opacity-30">
            <div
              className="h-full bg-current transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Credits */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-75">Credits Issued</p>
            <p className="text-2xl font-bold">{status.creditsIssued}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Credits Issuable</p>
            <p className="text-2xl font-bold">{status.creditsIssuable}</p>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">📋 Transaction Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Hash:</span>
            <code className="text-gray-900 font-mono break-all">
              {transactionHash.slice(0, 20)}...{transactionHash.slice(-10)}
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Block Number:</span>
            <span className="text-gray-900 font-medium">{status.blockNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="text-gray-900 font-medium capitalize">{status.status}</span>
          </div>
        </div>
      </div>

      {/* Status History */}
      {history.length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">📊 Status History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="text-xs text-gray-600 flex justify-between">
                <span>{new Date(h.lastUpdated).toLocaleTimeString()}</span>
                <span className="font-medium">
                  {h.confirmations}/{h.requiredConfirmations} confirmations
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={updateStatus}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {loading ? '🔄 Updating...' : '🔄 Refresh Status'}
      </button>
    </div>
  )
}

export {}
