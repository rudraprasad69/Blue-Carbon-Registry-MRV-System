
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  getHistoricalService,
  type TimeSeriesData,
  type TrendPrediction,
  type SeasonalAnalysis,
  type Anomaly,
} from '@/lib/historical-analysis-service'

interface HistoricalTrendsViewerProps {
  projectId: string
  metric?: string
  showPredictions?: boolean
  showSeasonality?: boolean
  days?: number
}

export function HistoricalTrendsViewer({
  projectId,
  metric = 'creditsGenerated',
  showPredictions = true,
  showSeasonality = true,
  days = 90,
}: HistoricalTrendsViewerProps) {
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData | null>(null)
  const [prediction, setPrediction] = useState<TrendPrediction | null>(null)
  const [seasonal, setSeasonal] = useState<SeasonalAnalysis | null>(null)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingAnomalies, setIsLoadingAnomalies] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'30' | '90' | '365'>('90')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const service = getHistoricalService()
      const periodDays = parseInt(selectedPeriod)

      const ts = service.getTimeSeriesLastDays(projectId, metric, periodDays)
      setTimeSeries(ts)

      if (showPredictions) {
        try {
          const pred = await service.predictTrend(projectId, metric)
          setPrediction(pred)
        } catch (err: any) {
          console.warn('Prediction unavailable:', err.message)
          setPrediction(null)
        }
      }

      if (showSeasonality) {
        const seas = service.analyzeSeasonalPattern(projectId, metric)
        setSeasonal(seas)
      }
    } catch (error) {
      console.error('Failed to load historical data:', error)
      // Here you could set an error state to show in the UI
    } finally {
      setLoading(false)
    }
  }, [projectId, metric, selectedPeriod, showPredictions, showSeasonality])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDetectAnomalies = async () => {
    setIsLoadingAnomalies(true)
    const service = getHistoricalService()
    try {
      const detectedAnomalies = await service.detectAnomalies(projectId, metric, 'medium')
      setAnomalies(detectedAnomalies)
    } catch (error) {
      console.error('Failed to detect anomalies:', error)
    } finally {
      setIsLoadingAnomalies(false)
    }
  }

  if (loading || !timeSeries) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📈</div>
          <p className="text-slate-400">Loading historical data...</p>
        </div>
      </div>
    )
  }

  const stats =
    timeSeries.dataPoints.length > 0
      ? {
          latest: timeSeries.dataPoints[timeSeries.dataPoints.length - 1].value,
          earliest: timeSeries.dataPoints[0].value,
          max: Math.max(...timeSeries.dataPoints.map((dp) => dp.value)),
          min: Math.min(...timeSeries.dataPoints.map((dp) => dp.value)),
          avg: timeSeries.dataPoints.reduce((sum, dp) => sum + dp.value, 0) / timeSeries.dataPoints.length,
        }
      : null

  const changePercent = stats && stats.earliest !== 0 ? ((stats.latest - stats.earliest) / stats.earliest) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-green-900 to-cyan-900 rounded-lg border border-green-700 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Historical Trends & Predictions</h1>
        <p className="text-green-200">Time-series analysis with forecasting and anomaly detection</p>
      </div>

      {/* Period Selector */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-300 font-semibold mb-4">Time Period:</p>
        <div className="flex gap-3">
          {(['30', '90', '365'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {period === '30' && '📅 30 Days'}
              {period === '90' && '📅 90 Days'}
              {period === '365' && '📅 1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Latest</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.latest.toFixed(0)}</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Average</p>
            <p className="text-2xl font-bold text-blue-400">{stats.avg.toFixed(0)}</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Peak</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.max.toFixed(0)}</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Low</p>
            <p className="text-2xl font-bold text-red-400">{stats.min.toFixed(0)}</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Change</p>
            <p className={`text-2xl font-bold ${changePercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {changePercent > 0 ? '+' : ''}
              {changePercent.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Time Series Chart */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Value Progression</h3>

        <div className="flex items-end justify-between gap-0.5 h-40 bg-slate-800 p-4 rounded">
          {timeSeries.dataPoints.map((dp, idx) => {
            const max = Math.max(...timeSeries.dataPoints.map((d) => d.value)) || 1
            const min = Math.min(...timeSeries.dataPoints.map((d) => d.value)) || 0
            const range = max - min || 1
            const height = ((dp.value - min) / range) * 100

            return (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 rounded-t transition-colors group relative"
                style={{ height: `${Math.max(height, 2)}%` }}
                title={`${dp.value.toFixed(0)} on ${new Date(dp.timestamp).toLocaleDateString()}`}
              />
            )
          })}
        </div>

        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>
            {timeSeries.dataPoints.length > 0
              ? new Date(timeSeries.dataPoints[0].timestamp).toLocaleDateString()
              : 'N/A'}
          </span>
          <span>
            {timeSeries.dataPoints.length > 0
              ? new Date(timeSeries.dataPoints[timeSeries.dataPoints.length - 1].timestamp).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>
      </div>

      {/* Predictions */}
      {showPredictions && prediction && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🔮 Trend Predictions ({prediction.modelType})</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {prediction.forecast.map((forecast) => (
              <div key={forecast.days} className="bg-slate-800 rounded p-4">
                <p className="text-slate-400 text-sm mb-2">{forecast.days}-Day Forecast</p>
                <p className="text-2xl font-bold text-blue-400">{forecast.value.toFixed(0)}</p>
                {forecast.confidenceInterval && (
                  <p className="text-xs text-slate-500 mt-1">
                    Range: {forecast.confidenceInterval[0].toFixed(0)} - {forecast.confidenceInterval[1].toFixed(0)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-slate-400 text-xs mb-1">Current Trend</p>
              <p className="text-white font-semibold capitalize flex items-center gap-2">
                {prediction.currentTrend === 'increasing' && '📈'}
                {prediction.currentTrend === 'decreasing' && '📉'}
                {prediction.currentTrend === 'stable' && '➡️'}
                {prediction.currentTrend}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-xs mb-1">Model Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${(prediction.confidence || 0) * 100}%` }}
                  />
                </div>
                <p className="text-white font-semibold text-sm">{(prediction.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anomaly Detection */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🚨 Anomaly Detection</h3>
        <button
          onClick={handleDetectAnomalies}
          disabled={isLoadingAnomalies}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium text-sm disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          {isLoadingAnomalies ? 'Scanning...' : 'Scan for Anomalies'}
        </button>

        {isLoadingAnomalies && <p className="text-slate-400 mt-4">Analyzing data for outliers...</p>}

        {anomalies.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-red-400">Detected {anomalies.length} Anomalies:</h4>
            <ul className="list-disc list-inside bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-sm text-slate-300 space-y-2">
              {anomalies.map((anomaly) => (
                <li key={anomaly.timestamp}>
                  <strong>{new Date(anomaly.timestamp).toLocaleDateString()}:</strong> Value of{' '}
                  <span className="font-bold text-white">{anomaly.value.toFixed(2)}</span> was flagged. (
                  <span className="text-red-400">Severity: {(anomaly.severity * 100).toFixed(0)}%</span>)
                  <p className="text-xs text-slate-400 pl-4">{anomaly.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isLoadingAnomalies && anomalies.length === 0 && (
          <p className="text-slate-400 mt-4">Click the button to scan the time series for anomalies.</p>
        )}
      </div>

      {/* Seasonality */}
      {showSeasonality && seasonal && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🌊 Seasonal Pattern</h3>
          <div className="flex items-end justify-between gap-1 h-32 mb-6">
            {seasonal.seasonalPattern.map((value, month) => {
              const maxVal = Math.max(...seasonal.seasonalPattern)
              const height = (value / maxVal) * 100
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              return (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-orange-600/70 hover:bg-orange-600 rounded-t transition-colors group relative mb-2"
                    style={{ height: `${Math.max(height, 10)}px` }}
                    title={`${monthNames[month]}: ${value.toFixed(0)}`}
                  />
                  <span className="text-xs text-slate-400">{monthNames[month]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📥 Export Data</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
            Export as CSV
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
            Export as JSON
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium text-sm">
            Save Report
          </button>
        </div>
      </div>
    </div>
  )
}
