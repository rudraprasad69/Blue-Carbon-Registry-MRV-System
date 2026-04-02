
/**
 * Historical Analysis Service
 * Manages time-series data, archival, and trend predictions.
 * Integrates with ML services for advanced analytics.
 */
import mlModelsEngine from './ml-models-engine'
import anomalyDetectionService, { type Anomaly } from './ml-anomaly-detection'

export interface HistoricalDataPoint {
  timestamp: Date
  projectId: string
  metric: string
  value: number
  unit: string
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED'
}

export interface TimeSeriesData {
  projectId: string
  metric: string
  dataPoints: HistoricalDataPoint[]
  period: string
  startDate: Date
  endDate: Date
}

export interface TrendPrediction {
  projectId: string
  metric: string
  currentTrend: 'increasing' | 'decreasing' | 'stable'
  slope: number
  confidence: number // Overall confidence in the model/trend
  rSquared: number // For linear components
  modelType: 'PROPHET' | 'ARIMA' | 'LSTM' // Model used
  // Forecasted values at different horizons
  forecast: {
    days: number
    value: number
    confidenceInterval?: [number, number]
  }[]
  /** @deprecated */
  projectedValue30Days: number
  /** @deprecated */
  projectedValue90Days: number
  /** @deprecated */
  projectedValue1Year: number
}

export { type Anomaly }

export interface SeasonalAnalysis {
  metric: string
  seasonalPattern: number[]
  peakMonth: number
  lowestMonth: number
  seasonalStrength: number
}

export interface DataArchive {
  archiveId: string
  projectId: string
  period: string
  dataPoints: number
  fileSize: number
  createdAt: Date
  retentionDays: number
  status: 'active' | 'archived' | 'deleted'
}

/**
 * Historical Analysis Service - Singleton
 * Manages time-series data and predictions
 */
class HistoricalAnalysisService {
  private static instance: HistoricalAnalysisService
  private timeSeriesData: Map<string, HistoricalDataPoint[]> = new Map()
  private archives: Map<string, DataArchive> = new Map()
  private maxDataPointsInMemory = 10000

  private constructor() {
    this.initializeSampleData()
  }

  static getInstance(): HistoricalAnalysisService {
    if (!this.instance) {
      this.instance = new HistoricalAnalysisService()
    }
    return this.instance
  }

  /**
   * Initialize with sample historical data
   */
  private initializeSampleData() {
    // Sample data for project-001 over 12 months
    const sampleData: HistoricalDataPoint[] = []
    const baseDate = new Date('2024-01-01')

    for (let i = 0; i < 365; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)

      // Simulate increasing trend with seasonal variation
      const trend = i * 0.5 // 0.5 units per day trend
      const yearlySeasonal = Math.sin((i / 365) * Math.PI * 2) * 500 // Yearly variation
      const weeklySeasonal = Math.cos((i / 7) * Math.PI * 2) * 150 // Weekly variation
      const noise = (Math.random() - 0.5) * 200 // Random noise

      sampleData.push({
        timestamp: date,
        projectId: 'project-001',
        metric: 'creditsGenerated',
        value: Math.max(0, 5000 + trend + yearlySeasonal + weeklySeasonal + noise),
        unit: 'credits',
        verificationStatus: 'VERIFIED',
      })
    }

    this.storeTimeSeries('project-001-creditsGenerated', sampleData)
  }

  /**
   * Store time series data
   */
  private storeTimeSeries(key: string, data: HistoricalDataPoint[]) {
    const existing = this.timeSeriesData.get(key) || []
    const combined = [...existing, ...data]

    // Limit data in memory
    if (combined.length > this.maxDataPointsInMemory) {
      combined.splice(0, combined.length - this.maxDataPointsInMemory)
    }

    this.timeSeriesData.set(key, combined)
  }

  /**
   * Add data point to time series
   */
  addDataPoint(dataPoint: HistoricalDataPoint) {
    const key = `${dataPoint.projectId}-${dataPoint.metric}`
    const existing = this.timeSeriesData.get(key) || []
    existing.push(dataPoint)
    this.storeTimeSeries(key, [])
  }

  /**
   * Get time series data for a period
   */
  getTimeSeriesData(projectId: string, metric: string, startDate: Date, endDate: Date): TimeSeriesData {
    const key = `${projectId}-${metric}`
    const data = this.timeSeriesData.get(key) || []

    const filtered = data.filter((dp) => {
      const dpDate = new Date(dp.timestamp)
      return dpDate >= startDate && dpDate <= endDate
    })

    return {
      projectId,
      metric,
      dataPoints: filtered,
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      startDate,
      endDate,
    }
  }

  /**
   * Get time series for last N days
   */
  getTimeSeriesLastDays(projectId: string, metric: string, days: number): TimeSeriesData {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    return this.getTimeSeriesData(projectId, metric, startDate, endDate)
  }

  /**
   * Predict future values using the ML Models Engine.
   */
  async predictTrend(
    projectId: string,
    metric: string,
    modelType: 'PROPHET' | 'ARIMA' | 'LSTM' = 'PROPHET'
  ): Promise<TrendPrediction> {
    const key = `${projectId}-${metric}`
    const data = this.timeSeriesData.get(key) || []

    if (data.length < 10) {
      throw new Error('Not enough data points to make a prediction.')
    }

    // Prepare input for the ML model
    const mlInput = {
      dataPoints: data.map((dp) => ({ value: dp.value, timestamp: dp.timestamp.getTime() })),
      forecastHorizon: 365, // Predict for a full year
      modelType,
    }

    const predictionOutput = await mlModelsEngine.predict(mlInput)

    // Analyze the trend from the forecast
    const firstForecast = predictionOutput.forecast[0].value
    const lastForecast = predictionOutput.forecast[predictionOutput.forecast.length - 1].value
    const slope = (lastForecast - firstForecast) / predictionOutput.forecast.length
    const currentTrend = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable'

    // Extract specific forecast points
    const forecast30 = predictionOutput.forecast[29]
    const forecast90 = predictionOutput.forecast[89]
    const forecast365 = predictionOutput.forecast[364]

    return {
      projectId,
      metric,
      currentTrend,
      slope,
      // Confidence could be a mix of model fit and forecast variance
      confidence: (predictionOutput.modelFit.aic + predictionOutput.modelFit.bic) / 2000,
      rSquared: 0, // R-squared is less relevant for complex models, but kept for compatibility
      modelType: predictionOutput.modelType,
      forecast: [
        {
          days: 30,
          value: forecast30.value,
          confidenceInterval: forecast30.confidenceInterval,
        },
        {
          days: 90,
          value: forecast90.value,
          confidenceInterval: forecast90.confidenceInterval,
        },
        {
          days: 365,
          value: forecast365.value,
          confidenceInterval: forecast365.confidenceInterval,
        },
      ],
      // Deprecated fields for backward compatibility
      projectedValue30Days: forecast30.value,
      projectedValue90Days: forecast90.value,
      projectedValue1Year: forecast365.value,
    }
  }

  /**
   * Detect anomalies in the time-series data.
   */
  async detectAnomalies(
    projectId: string,
    metric: string,
    sensitivity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<Anomaly[]> {
    const key = `${projectId}-${metric}`
    const data = this.timeSeriesData.get(key) || []

    if (data.length < 10) {
      return []
    }

    const detectionInput = {
      dataPoints: data.map((dp) => ({ value: dp.value, timestamp: dp.timestamp.getTime() })),
      sensitivity,
    }

    const result = await anomalyDetectionService.detect(detectionInput)
    return result.anomalies
  }

  /**
   * Analyze seasonal patterns
   */
  analyzeSeasonalPattern(projectId: string, metric: string): SeasonalAnalysis {
    const key = `${projectId}-${metric}`
    const data = this.timeSeriesData.get(key) || []

    // Group by month
    const monthlyData: { [month: number]: number[] } = {}

    data.forEach((dp) => {
      const date = new Date(dp.timestamp)
      const month = date.getMonth()

      if (!monthlyData[month]) {
        monthlyData[month] = []
      }
      monthlyData[month].push(dp.value)
    })

    // Calculate monthly averages
    const monthlyAverages = Object.entries(monthlyData).map(([_, values]) => {
      return values.reduce((a, b) => a + b, 0) / values.length
    })

    // Pad to 12 months
    while (monthlyAverages.length < 12) {
      monthlyAverages.push(0)
    }

    // Find peak and lowest
    const peakMonth = monthlyAverages.indexOf(Math.max(...monthlyAverages))
    const lowestMonth = monthlyAverages.indexOf(Math.min(...monthlyAverages))

    // Calculate seasonal strength (coefficient of variation)
    const mean = monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length
    const variance = monthlyAverages.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlyAverages.length
    const stdDev = Math.sqrt(variance)
    const seasonalStrength = mean !== 0 ? stdDev / mean : 0

    return {
      metric,
      seasonalPattern: monthlyAverages,
      peakMonth,
      lowestMonth,
      seasonalStrength,
    }
  }

  /**
   * Archive historical data
   */
  archiveData(projectId: string, period: string): DataArchive {
    const key = `${projectId}-*`
    const archiveId = `archive-${projectId}-${Date.now()}`

    // Count total data points for this project
    let totalPoints = 0
    for (const [k, v] of this.timeSeriesData.entries()) {
      if (k.startsWith(projectId)) {
        totalPoints += v.length
      }
    }

    const archive: DataArchive = {
      archiveId,
      projectId,
      period,
      dataPoints: totalPoints,
      fileSize: totalPoints * 200, // Approximate 200 bytes per point
      createdAt: new Date(),
      retentionDays: 2555, // 7 years default
      status: 'active',
    }

    this.archives.set(archiveId, archive)
    return archive
  }

  /**
   * Get archival history
   */
  getArchives(projectId: string): DataArchive[] {
    return Array.from(this.archives.values()).filter((a) => a.projectId === projectId)
  }

  /**
   * Delete archived data (purge)
   */
  purgeOldData(projectId: string, olderThanDays: number): number {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    let deletedPoints = 0

    for (const [key, dataPoints] of this.timeSeriesData.entries()) {
      if (key.startsWith(projectId)) {
        const filtered = dataPoints.filter((dp) => new Date(dp.timestamp) > cutoffDate)
.
        deletedPoints += dataPoints.length - filtered.length
        this.timeSeriesData.set(key, filtered)
      }
    }

    return deletedPoints
  }

  /**
   * Export time series data
   */
  exportTimeSeries(projectId: string, metric: string, format: 'csv' | 'json'): string {
    const key = `${projectId}-${metric}`
    const data = this.timeSeriesData.get(key) || []

    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    }

    // CSV format
    let csv = 'timestamp,projectId,metric,value,unit,verificationStatus\n'
    data.forEach((dp) => {
      csv += `${dp.timestamp.toISOString()},${dp.projectId},${dp.metric},${dp.value},${dp.unit},${dp.verificationStatus}\n`
    })

    return csv
  }

  /**
   * Get statistics for a time series
   */
  getStatistics(projectId: string, metric: string): {
    mean: number
    median: number
    stdDev: number
    min: number
    max: number
    dataPoints: number
  } {
    const key = `${projectId}-${metric}`
    const data = this.timeSeriesData.get(key) || []

    if (data.length === 0) {
      return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, dataPoints: 0 }
    }

    const values = data.map((dp) => dp.value).sort((a, b) => a - b)
    const n = values.length
    const mean = values.reduce((a, b) => a + b, 0) / n
    const median = n % 2 === 0 ? (values[n / 2 - 1] + values[n / 2]) / 2 : values[Math.floor(n / 2)]
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)
    const min = values[0]
    const max = values[n - 1]

    return { mean, median, stdDev, min, max, dataPoints: n }
  }
}

// Export singleton instance getter
export function getHistoricalService(): HistoricalAnalysisService {
  return HistoricalAnalysisService.getInstance()
}
