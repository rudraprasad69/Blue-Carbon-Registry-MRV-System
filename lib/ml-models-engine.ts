
/**
 * ML Models Engine
 *
 * This service simulates a sophisticated machine learning engine for time-series
 * forecasting. In a real-world application, this would be a client for a
 * dedicated model serving endpoint (e.g., TensorFlow Serving, a custom FastAPI/Flask API,
 * or a cloud service like Google AI Platform).
 *
 * This mock engine uses a combination of sinusoidal functions and injected noise
 * to generate more complex and realistic-looking forecasts than simple linear regression.
 */

export interface TimeSeriesPredictionInput {
  dataPoints: { value: number; timestamp: number }[] // Past data
  forecastHorizon: number // Number of future periods to predict
  modelType: 'ARIMA' | 'PROPHET' | 'LSTM' // Type of model to simulate
}

export interface TimeSeriesPredictionOutput {
  forecast: { value: number; timestamp: number; confidenceInterval?: [number, number] }[]
  modelType: 'ARIMA' | 'PROPHET' | 'LSTM'
  executionTime: number // in ms
  modelFit: {
    aic: number // Akaike Information Criterion
    bic: number // Bayesian Information Criterion
  }
}

class MLModelsEngine {
  /**
   * Simulates running a time-series forecasting model.
   *
   * @param input The historical data and forecast parameters.
   * @returns A simulated prediction output.
   */
  public async predict(input: TimeSeriesPredictionInput): Promise<TimeSeriesPredictionOutput> {
    const startTime = Date.now()

    const { dataPoints, forecastHorizon, modelType } = input

    // Simulate model logic based on type
    let forecast: { value: number; timestamp: number; confidenceInterval?: [number, number] }[]
    switch (modelType) {
      case 'LSTM':
        forecast = this.simulateLSTMPrediction(dataPoints, forecastHorizon)
        break
      case 'PROPHET':
        forecast = this.simulateProphetPrediction(dataPoints, forecastHorizon)
        break
      case 'ARIMA':
      default:
        forecast = this.simulateArimaPrediction(dataPoints, forecastHorizon)
        break
    }

    const executionTime = Date.now() - startTime

    // Fake model fit statistics
    const modelFit = {
      aic: Math.random() * 100 + 500,
      bic: Math.random() * 100 + 600,
    }

    return {
      forecast,
      modelType,
      executionTime,
      modelFit,
    }
  }

  private getLastTimestamp(dataPoints: Array<Record<string, unknown>>): number {
    if (dataPoints.length === 0) return Date.now()
    const lastPoint = dataPoints[dataPoints.length - 1]
    return typeof lastPoint.timestamp === 'number' ? lastPoint.timestamp : Date.now()
  }

  private getDayInMillis(): number {
    return 24 * 60 * 60 * 1000
  }

  /**
   * Simulate a simple ARIMA-like model (AutoRegressive Integrated Moving Average)
   * This will mostly follow a linear trend with some noise.
   */
  private simulateArimaPrediction(
    dataPoints: { value: number }[],
    horizon: number
  ): { value: number; timestamp: number; confidenceInterval: [number, number] }[] {
    const lastValue = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].value : 5000
    const slope = dataPoints.length > 1 ? (lastValue - dataPoints[0].value) / dataPoints.length : 0.5
    const lastTimestamp = this.getLastTimestamp(dataPoints)
    const dayInMillis = this.getDayInMillis()

    const forecast = Array.from({ length: horizon }, (_, i) => {
      const value = lastValue + slope * (i + 1) + (Math.random() - 0.5) * 250 // Trend + noise
      const confidenceRange = 150 + i * 2
      return {
        value: Math.max(0, value),
        timestamp: lastTimestamp + (i + 1) * dayInMillis,
        confidenceInterval: [Math.max(0, value - confidenceRange), value + confidenceRange] as [number, number],
      }
    })

    return forecast
  }

  /**
   * Simulate a Prophet-like model, good at handling multiple seasonalities.
   * This will have daily, weekly, and yearly seasonality components.
   */
  private simulateProphetPrediction(
    dataPoints: { value: number; timestamp: number }[],
    horizon: number
  ): { value: number; timestamp: number; confidenceInterval: [number, number] }[] {
    const lastValue = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].value : 5000
    const slope = dataPoints.length > 1 ? (lastValue - dataPoints[0].value) / dataPoints.length : 0.5
    const lastTimestamp = this.getLastTimestamp(dataPoints)
    const dayInMillis = this.getDayInMillis()

    const forecast = Array.from({ length: horizon }, (_, i) => {
      const futureDate = new Date(lastTimestamp + (i + 1) * dayInMillis)
      const dayOfYear = (futureDate.getTime() - new Date(futureDate.getFullYear(), 0, 0).getTime()) / dayInMillis
      
      const yearlySeasonality = Math.sin((dayOfYear / 365.25) * 2 * Math.PI) * 400
      const weeklySeasonality = Math.cos((futureDate.getDay() / 7) * 2 * Math.PI) * 150
      
      const value = lastValue + slope * (i + 1) + yearlySeasonality + weeklySeasonality + (Math.random() - 0.5) * 100
      const confidenceRange = 200 + i * 1.5
      return {
        value: Math.max(0, value),
        timestamp: futureDate.getTime(),
        confidenceInterval: [Math.max(0, value - confidenceRange), value + confidenceRange] as [number, number],
      }
    })

    return forecast
  }

  /**
   * Simulates an LSTM-like model (Long Short-Term Memory).
   * This is good for learning complex, non-linear patterns. We'll simulate this with
   * a mix of several sinusoidal functions.
   */
  private simulateLSTMPrediction(
    dataPoints: { value: number }[],
    horizon: number
  ): { value: number; timestamp: number; confidenceInterval: [number, number] }[] {
    const lastValue = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].value : 5000
    const overallTrend = dataPoints.length > 1 ? (lastValue - dataPoints[0].value) / dataPoints.length : 0.2
    const lastTimestamp = this.getLastTimestamp(dataPoints)
    const dayInMillis = this.getDayInMillis()

    const forecast = Array.from({ length: horizon }, (_, i) => {
      const factor = i + 1
      const complexPattern =
        Math.sin(factor / 30) * 200 + // Monthly cycle
        Math.cos(factor / 90) * 150 + // Quarterly cycle
        Math.sin(factor / 7) * 50     // Weekly noise
      
      const value = lastValue + overallTrend * factor + complexPattern + (Math.random() - 0.5) * 80
      const confidenceRange = 250 + i * 1
      return {
        value: Math.max(0, value),
        timestamp: lastTimestamp + factor * dayInMillis,
        confidenceInterval: [Math.max(0, value - confidenceRange), value + confidenceRange] as [number, number],
      }
    })

    return forecast
  }
}

// Export a singleton instance of the engine
const mlModelsEngine = new MLModelsEngine()

// Backward-compatible named accessor used by API routes
export function getMLEngine() {
  return mlModelsEngine
}

export default mlModelsEngine
