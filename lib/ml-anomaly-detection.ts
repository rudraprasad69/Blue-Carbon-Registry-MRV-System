
/**
 * ML Anomaly Detection Service
 *
 * This service simulates a machine learning model for detecting anomalies in
 * time-series data. In a real-world scenario, this might use algorithms like
 * Isolation Forest, One-Class SVM, or autoencoders to identify points that
 * deviate significantly from normal patterns.
 *
 * This mock service uses a simpler statistical approach (standard deviation)
 * to find outliers.
 */

export interface AnomalyDetectionInput {
  dataPoints: { value: number; timestamp: number }[]
  sensitivity?: 'low' | 'medium' | 'high' // Controls the threshold
}

export interface Anomaly {
  timestamp: number
  value: number
  severity: number // A score from 0 to 1 indicating how anomalous the point is
  reason: string // A human-readable explanation
}

export interface AnomalyDetectionOutput {
  anomalies: Anomaly[]
  modelType: 'IsolationForest' | 'StandardDeviation' // Simulated model type
  executionTime: number // in ms
}

class AnomalyDetectionService {
  /**
   * Simulates running an anomaly detection model on time-series data.
   *
   * @param input The time-series data and detection parameters.
   * @returns A list of detected anomalies.
   */
  public async detect(input: AnomalyDetectionInput): Promise<AnomalyDetectionOutput> {
    const startTime = Date.now()
    const { dataPoints, sensitivity = 'medium' } = input

    if (dataPoints.length < 10) {
      return {
        anomalies: [],
        modelType: 'StandardDeviation',
        executionTime: Date.now() - startTime,
      }
    }

    const thresholdMultiplier = this.getThresholdMultiplier(sensitivity)

    // Calculate mean and standard deviation of the dataset
    const values = dataPoints.map(dp => dp.value)
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length
    const stdDev = Math.sqrt(
      values.map(v => Math.pow(v - mean, 2)).reduce((sum, v) => sum + v, 0) / values.length
    )

    const anomalies: Anomaly[] = []

    dataPoints.forEach(dp => {
      const deviation = Math.abs(dp.value - mean)
      const deviationInStds = deviation / stdDev

      if (deviationInStds > thresholdMultiplier) {
        const severity = Math.min(1, (deviationInStds - thresholdMultiplier) / 3) // Normalize severity
        anomalies.push({
          timestamp: dp.timestamp,
          value: dp.value,
          severity,
          reason: `Value ${dp.value.toFixed(2)} is ${deviationInStds.toFixed(1)} standard deviations from the mean (${mean.toFixed(2)}), exceeding the ${thresholdMultiplier.toFixed(1)}x threshold.`,
        })
      }
    })

    const executionTime = Date.now() - startTime

    return {
      anomalies,
      modelType: 'StandardDeviation', // We are explicitly using this simple model
      executionTime,
    }
  }

  private getThresholdMultiplier(sensitivity: 'low' | 'medium' | 'high'): number {
    switch (sensitivity) {
      case 'low':
        return 4.0 // Less sensitive, requires larger deviation
      case 'medium':
        return 3.0 // A common choice
      case 'high':
        return 2.0 // More sensitive, will flag smaller deviations
    }
  }
}

// Export a singleton instance of the service
const anomalyDetectionService = new AnomalyDetectionService()
export default anomalyDetectionService
