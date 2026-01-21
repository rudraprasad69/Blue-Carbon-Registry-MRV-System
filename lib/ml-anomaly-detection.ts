/**
 * AI & ML Anomaly Detection Service
 * Implements machine learning models for detecting anomalies in multi-source monitoring data
 * Uses statistical methods and pattern recognition for real-time flagging
 */

export interface TimeSeriesData {
  timestamp: string
  value: number
  source: "satellite" | "sensor" | "drone"
  sensorId?: string
}

export interface AnomalyDetectionModel {
  type: "isolation_forest" | "arima" | "zscore" | "prophet"
  sensitivity: "low" | "medium" | "high"
  windowSize: number
  threshold: number
}

export interface DetectedAnomaly {
  timestamp: string
  value: number
  anomalyScore: number // 0-1, where 1 is most anomalous
  type: "outlier" | "trend_break" | "seasonal_deviation" | "degradation"
  severity: "low" | "medium" | "high"
  explanation: string
  confidence: number // 0-100
  suggestedAction: string
}

export interface ModelPrediction {
  timestamp: string
  predictedValue: number
  confidenceInterval: { lower: number; upper: number }
  confidence: number // 0-100
}

/**
 * Z-Score based anomaly detection
 * Fast, simple statistical method for identifying outliers
 */
export const zScoreAnomalyDetection = (
  data: TimeSeriesData[],
  threshold: number = 3
): DetectedAnomaly[] => {
  if (data.length < 2) return [];

  const values = data.map((d) => d.value);
  const mean = values.reduce((a, b) => a + b) / values.length;
  const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2)) / values.length);

  const anomalies: DetectedAnomaly[] = [];

  data.forEach((point, index) => {
    if (stdDev === 0) return;

    const zScore = Math.abs((point.value - mean) / stdDev);

    if (zScore > threshold) {
      let type: "outlier" | "trend_break" | "seasonal_deviation" | "degradation" = "outlier";
      let explanation = "";

      if (zScore > 5) {
        type = "trend_break";
        explanation = `Extreme deviation: ${zScore.toFixed(2)} standard deviations from mean`;
      } else {
        explanation = `Statistical outlier: ${zScore.toFixed(2)} standard deviations from mean`;
      }

      const severity = zScore > 5 ? "high" : zScore > 3.5 ? "medium" : "low";
      const confidence = Math.min(100, zScore * 15);

      anomalies.push({
        timestamp: point.timestamp,
        value: point.value,
        anomalyScore: Math.min(1, zScore / 5),
        type,
        severity: severity as "low" | "medium" | "high",
        explanation,
        confidence,
        suggestedAction:
          severity === "high"
            ? "IMMEDIATE_REVIEW_REQUIRED"
            : severity === "medium"
              ? "MANUAL_VERIFICATION_RECOMMENDED"
              : "LOG_AND_MONITOR",
      });
    }
  });

  return anomalies;
};

/**
 * Isolation Forest inspired anomaly detection
 * Good for multi-dimensional data
 */
export const isolationForestDetection = (
  data: TimeSeriesData[],
  anomalyPercentile: number = 5
): DetectedAnomaly[] => {
  if (data.length < 10) return zScoreAnomalyDetection(data);

  const values = data.map((d) => d.value);
  const sortedValues = [...values].sort((a, b) => a - b);

  // Calculate percentile thresholds
  const lowerIdx = Math.floor((sortedValues.length * anomalyPercentile) / 100);
  const upperIdx = Math.ceil((sortedValues.length * (100 - anomalyPercentile)) / 100);
  const lowerThreshold = sortedValues[lowerIdx];
  const upperThreshold = sortedValues[upperIdx];

  const mean = values.reduce((a, b) => a + b) / values.length;
  const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2)) / values.length);

  const anomalies: DetectedAnomaly[] = [];

  data.forEach((point, index) => {
    let isAnomaly = false;
    let anomalyScore = 0;
    let explanation = "";

    // Check if value is beyond percentile thresholds
    if (point.value < lowerThreshold || point.value > upperThreshold) {
      isAnomaly = true;
      const distFromMean = Math.abs(point.value - mean);
      anomalyScore = Math.min(1, distFromMean / (3 * stdDev));
      explanation = `Value ${point.value} outside normal percentile range [${lowerThreshold.toFixed(2)}, ${upperThreshold.toFixed(2)}]`;
    }

    // Check for sharp changes
    if (index > 0) {
      const previousValue = values[index - 1];
      const change = Math.abs(point.value - previousValue) / (Math.abs(previousValue) + 0.001);

      if (change > 0.5 && stdDev > 0) {
        isAnomaly = true;
        anomalyScore = Math.max(anomalyScore, Math.min(1, change / 2));
        explanation = `Sharp change of ${(change * 100).toFixed(1)}% from previous value`;
      }
    }

    if (isAnomaly) {
      const severity = anomalyScore > 0.7 ? "high" : anomalyScore > 0.4 ? "medium" : "low";

      anomalies.push({
        timestamp: point.timestamp,
        value: point.value,
        anomalyScore,
        type: "outlier",
        severity: severity as "low" | "medium" | "high",
        explanation,
        confidence: Math.min(100, anomalyScore * 100),
        suggestedAction:
          severity === "high"
            ? "IMMEDIATE_REVIEW_REQUIRED"
            : severity === "medium"
              ? "MANUAL_VERIFICATION_RECOMMENDED"
              : "LOG_AND_MONITOR",
      });
    }
  });

  return anomalies;
};

/**
 * Trend-based anomaly detection
 * Detects breaks in expected trends and degradation patterns
 */
export const trendAnomalyDetection = (
  data: TimeSeriesData[],
  windowSize: number = 7
): DetectedAnomaly[] => {
  if (data.length < windowSize * 2) return [];

  const anomalies: DetectedAnomaly[] = [];
  const values = data.map((d) => d.value);

  // Calculate moving average trend
  for (let i = windowSize; i < values.length; i++) {
    const previousWindow = values.slice(i - windowSize * 2, i - windowSize);
    const currentWindow = values.slice(i - windowSize, i);

    const prevAvg = previousWindow.reduce((a, b) => a + b) / previousWindow.length;
    const currAvg = currentWindow.reduce((a, b) => a + b) / currentWindow.length;

    const trendChange = ((currAvg - prevAvg) / (Math.abs(prevAvg) + 0.001)) * 100;

    // If trend reverses significantly or breaks, flag it
    if (Math.abs(trendChange) > 20) {
      // Calculate trend velocity (rate of change)
      const trendVelocity = Math.abs(trendChange) / windowSize;

      let type: "outlier" | "trend_break" | "seasonal_deviation" | "degradation" = "trend_break";
      let severity: "low" | "medium" | "high" = "medium";

      if (trendChange < -15) {
        type = "degradation";
        severity = "high";
      }

      const anomalyScore = Math.min(1, Math.abs(trendChange) / 100);

      anomalies.push({
        timestamp: data[i - 1].timestamp,
        value: values[i - 1],
        anomalyScore,
        type,
        severity,
        explanation: `Trend change of ${trendChange.toFixed(1)}% detected (velocity: ${trendVelocity.toFixed(2)}/period)`,
        confidence: Math.min(100, anomalyScore * 90),
        suggestedAction:
          severity === "high"
            ? "VERIFY_DATA_AND_INVESTIGATE_DEGRADATION"
            : "MONITOR_TREND_CONTINUATION",
      });
    }
  }

  return anomalies;
};

/**
 * Seasonal decomposition anomaly detection
 * For data with known seasonal patterns
 */
export const seasonalAnomalyDetection = (
  data: TimeSeriesData[],
  seasonalPeriod: number = 30
): DetectedAnomaly[] => {
  if (data.length < seasonalPeriod * 2) return [];

  const anomalies: DetectedAnomaly[] = [];
  const values = data.map((d) => d.value);

  for (let i = seasonalPeriod; i < values.length; i++) {
    // Compare with same point in previous cycle
    const previousCycleValue = values[i - seasonalPeriod];
    const currentValue = values[i];

    const deviation = Math.abs(currentValue - previousCycleValue) / (Math.abs(previousCycleValue) + 0.001);

    // If seasonal deviation is > 30%, flag it
    if (deviation > 0.3) {
      const severity = deviation > 0.6 ? "high" : deviation > 0.4 ? "medium" : "low";
      const anomalyScore = Math.min(1, deviation / 1.5);

      anomalies.push({
        timestamp: data[i].timestamp,
        value: currentValue,
        anomalyScore,
        type: "seasonal_deviation",
        severity: severity as "low" | "medium" | "high",
        explanation: `${(deviation * 100).toFixed(1)}% deviation from seasonal pattern`,
        confidence: Math.min(100, anomalyScore * 85),
        suggestedAction:
          severity === "high"
            ? "INVESTIGATE_SEASONAL_ANOMALY"
            : "MONITOR_SEASONAL_PATTERN",
      });
    }
  }

  return anomalies;
};

/**
 * Comprehensive multi-method anomaly detection
 * Combines multiple detection methods for robust anomaly flagging
 */
export const detectMultiSourceAnomalies = (
  data: TimeSeriesData[],
  model: AnomalyDetectionModel = {
    type: "isolation_forest",
    sensitivity: "high",
    windowSize: 7,
    threshold: 3,
  }
): DetectedAnomaly[] => {
  const allAnomalies: DetectedAnomaly[] = [];

  switch (model.type) {
    case "zscore":
      allAnomalies.push(
        ...zScoreAnomalyDetection(
          data,
          model.sensitivity === "high" ? 2.5 : model.sensitivity === "medium" ? 3 : 3.5
        )
      );
      break;

    case "isolation_forest":
      allAnomalies.push(
        ...isolationForestDetection(
          data,
          model.sensitivity === "high" ? 3 : model.sensitivity === "medium" ? 5 : 7
        )
      );
      break;

    case "prophet":
      // Time series forecasting approach
      allAnomalies.push(...trendAnomalyDetection(data, model.windowSize));
      break;

    case "arima":
      // Trend and seasonal decomposition
      allAnomalies.push(...trendAnomalyDetection(data, model.windowSize));
      allAnomalies.push(...seasonalAnomalyDetection(data, Math.floor(model.windowSize * 4)));
      break;
  }

  // Sort by anomaly score and remove duplicates
  return allAnomalies
    .sort((a, b) => b.anomalyScore - a.anomalyScore)
    .filter(
      (anomaly, index, self) =>
        index === self.findIndex((a) => a.timestamp === anomaly.timestamp && a.type === anomaly.type)
    );
};

/**
 * Cross-source anomaly validation
 * Verify anomalies are corroborated across multiple data sources
 */
export const validateAnomalyAcrossSources = (
  anomalies: Map<string, DetectedAnomaly[]>,
  confidenceThreshold: number = 0.6
): DetectedAnomaly[] => {
  const validatedAnomalies: DetectedAnomaly[] = [];

  // For each anomaly, check if it appears in multiple sources
  anomalies.forEach((sourceAnomalies) => {
    sourceAnomalies.forEach((anomaly) => {
      // Count how many sources report similar anomalies at similar times
      let supportingSourceCount = 1;
      let avgConfidence = anomaly.confidence;

      anomalies.forEach((otherAnomalies, source) => {
        const supporting = otherAnomalies.find(
          (a) =>
            Math.abs(
              new Date(a.timestamp).getTime() - new Date(anomaly.timestamp).getTime()
            ) < 3600000 && // Within 1 hour
            Math.abs(a.value - anomaly.value) / (Math.abs(anomaly.value) + 0.001) < 0.2 // Within 20%
        );

        if (supporting) {
          supportingSourceCount++;
          avgConfidence += supporting.confidence;
        }
      });

      avgConfidence /= supportingSourceCount;

      // Boost confidence if corroborated by multiple sources
      if (supportingSourceCount > 1 && avgConfidence >= confidenceThreshold * 100) {
        validatedAnomalies.push({
          ...anomaly,
          confidence: Math.min(100, avgConfidence),
          suggestedAction:
            supportingSourceCount >= 3
              ? "HIGH_PRIORITY_IMMEDIATE_ACTION_REQUIRED"
              : "VERIFIED_ANOMALY_INVESTIGATE",
        });
      }
    });
  });

  return validatedAnomalies.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Calculate anomaly confidence based on supporting evidence
 */
export const calculateAnomalyConfidence = (
  anomaly: DetectedAnomaly,
  supportingEvidence: number = 1
): number => {
  let confidence = anomaly.confidence;

  // Increase confidence for each additional supporting source
  confidence += supportingEvidence * 10;

  // Severity adjustments
  if (anomaly.severity === "high") confidence += 15;
  else if (anomaly.severity === "medium") confidence += 10;

  return Math.min(100, confidence);
};

export default {
  zScoreAnomalyDetection,
  isolationForestDetection,
  trendAnomalyDetection,
  seasonalAnomalyDetection,
  detectMultiSourceAnomalies,
  validateAnomalyAcrossSources,
  calculateAnomalyConfidence,
};
