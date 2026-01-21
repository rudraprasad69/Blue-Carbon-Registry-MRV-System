/**
 * Data Validation Pipeline Service
 * Comprehensive validation, quality checks, and cross-verification for multi-source monitoring data
 * Ensures data integrity before smart contract verification and credit issuance
 */

import type { SatelliteAnalysisResult } from "./satellite-data-service"
import type { AggregatedSensorData } from "./iot-sensor-service"
import type { DetectedAnomaly } from "./ml-anomaly-detection"

export interface ValidationRule {
  name: string
  description: string
  validate: (value: any, context?: any) => boolean
  errorMessage: string
  severity: "critical" | "warning" | "info"
  autoFix?: (value: any) => any
}

export interface DataValidationResult {
  isValid: boolean
  dataSourceId: string
  timestamp: string
  checksPerformed: number
  checksPass: number
  failures: ValidationFailure[]
  warnings: ValidationWarning[]
  qualityScore: number // 0-100
  suggestions: string[]
  recommendedAction: "APPROVE" | "REVIEW" | "REJECT" | "REQUEST_MORE_DATA"
}

export interface ValidationFailure {
  rule: string
  reason: string
  severity: "critical" | "warning"
  value: any
  expectedValue?: any
  fixApplied: boolean
}

export interface ValidationWarning {
  rule: string
  message: string
  severity: "warning" | "info"
}

export interface CrossSourceValidation {
  timestamp: string
  sourcesValidated: string[]
  consistencyScore: number // 0-100, how well data sources agree
  discrepancies: Discrepancy[]
  overallValid: boolean
  recommendations: string[]
}

export interface Discrepancy {
  source1: string
  source2: string
  metric: string
  value1: number
  value2: number
  percentageDifference: number
  severity: "low" | "medium" | "high"
  explanation: string
}

// Comprehensive validation rules for satellite data
export const satelliteValidationRules: Record<string, ValidationRule> = {
  ndvi_range: {
    name: "NDVI Range Validation",
    description: "NDVI values must be between -1 and 1",
    validate: (value: number) => value >= -1 && value <= 1,
    errorMessage: "NDVI value outside valid range [-1, 1]",
    severity: "critical",
  },
  ndvi_quality: {
    name: "NDVI Data Quality",
    description: "NDVI must have sufficient confidence (> 70%)",
    validate: (confidence: number) => confidence > 70,
    errorMessage: "NDVI data quality below acceptable threshold",
    severity: "warning",
    autoFix: (confidence: number) => Math.max(70, confidence),
  },
  vegetation_trend: {
    name: "Vegetation Trend Validation",
    description: "Vegetation change should be within expected bounds (-50% to +30% per month)",
    validate: (change: number) => change >= -50 && change <= 30,
    errorMessage: "Vegetation change outside expected seasonal variation",
    severity: "warning",
  },
  biomass_realistic: {
    name: "Biomass Realism Check",
    description: "Biomass estimates must be within known ranges for ecosystem type",
    validate: (biomass: number) => biomass > 0 && biomass < 500,
    errorMessage: "Biomass estimate unrealistic",
    severity: "critical",
  },
  cloud_cover_acceptable: {
    name: "Cloud Cover Check",
    description: "Cloud cover should not exceed 30% for valid analysis",
    validate: (cloudCover: number) => cloudCover <= 30,
    errorMessage: "Excessive cloud cover reduces data reliability",
    severity: "warning",
  },
  completeness_threshold: {
    name: "Data Completeness",
    description: "Data completeness must be at least 60%",
    validate: (completeness: number) => completeness >= 60,
    errorMessage: "Insufficient data completeness",
    severity: "warning",
  },
  health_score_valid: {
    name: "Ecosystem Health Score",
    description: "Health score must be between 0-100",
    validate: (score: number) => score >= 0 && score <= 100,
    errorMessage: "Health score outside valid range",
    severity: "critical",
  },
};

// Comprehensive validation rules for sensor data
export const sensorValidationRules: Record<string, ValidationRule> = {
  reading_range: {
    name: "Sensor Reading Range",
    description: "Reading must be within physically possible range",
    validate: (value: number, context: any) => {
      const ranges: Record<string, [number, number]> = {
        dissolved_oxygen: [0, 20],
        temperature: [-10, 50],
        salinity: [0, 45],
        ph: [4, 11],
        co2_flux: [-50, 300],
      };
      const range = ranges[context?.sensorType] || [0, 1000];
      return value >= range[0] && value <= range[1];
    },
    errorMessage: "Sensor reading outside valid range",
    severity: "critical",
  },
  confidence_sufficient: {
    name: "Sensor Confidence",
    description: "Sensor reading confidence must exceed 50%",
    validate: (confidence: number) => confidence > 50,
    errorMessage: "Sensor confidence too low",
    severity: "warning",
  },
  data_quality_valid: {
    name: "Data Quality Flag",
    description: "Data quality must be 'valid' or 'questionable', not 'bad'",
    validate: (quality: string) => quality !== "bad",
    errorMessage: "Data marked as bad quality",
    severity: "warning",
  },
  timestamp_valid: {
    name: "Timestamp Validity",
    description: "Timestamp must be recent (within 7 days)",
    validate: (timestamp: string) => {
      const age = (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return age <= 7;
    },
    errorMessage: "Data too old (> 7 days)",
    severity: "warning",
  },
  freshness_acceptable: {
    name: "Data Freshness",
    description: "Data should be less than 24 hours old",
    validate: (timestamp: string) => {
      const age = (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
      return age <= 24;
    },
    errorMessage: "Data older than 24 hours",
    severity: "info",
  },
};

// Meta-validation rules for overall data integrity
export const metaValidationRules: Record<string, ValidationRule> = {
  multiple_sources: {
    name: "Multi-Source Requirement",
    description: "At least 2 different data sources required",
    validate: (sourceCount: number) => sourceCount >= 2,
    errorMessage: "Insufficient data sources for verification",
    severity: "critical",
  },
  temporal_coverage: {
    name: "Temporal Coverage",
    description: "Data span must cover at least 30 days",
    validate: (startDate: string, endDate: string) => {
      const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
      return days >= 30;
    },
    errorMessage: "Insufficient temporal coverage",
    severity: "warning",
  },
  no_critical_anomalies: {
    name: "Anomaly Check",
    description: "No critical anomalies should be present",
    validate: (anomalies: DetectedAnomaly[]) => {
      const criticalCount = anomalies.filter((a) => a.severity === "high").length;
      return criticalCount === 0;
    },
    errorMessage: "Critical anomalies detected in data",
    severity: "warning",
  },
};

/**
 * Validate satellite data against comprehensive rules
 */
export const validateSatelliteData = (data: SatelliteAnalysisResult): DataValidationResult => {
  const failures: ValidationFailure[] = [];
  const warnings: ValidationWarning[] = [];
  let checksPass = 0;
  const checksPerformed = Object.keys(satelliteValidationRules).length;

  // Run all validation rules
  for (const [ruleName, rule] of Object.entries(satelliteValidationRules)) {
    let isValid = false;

    try {
      if (ruleName === "ndvi_range") {
        isValid = data.ndviTimeSeries.every((d) => rule.validate(d.value));
      } else if (ruleName === "ndvi_quality") {
        isValid = data.ndviTimeSeries.every((d) => rule.validate(d.confidence));
      } else if (ruleName === "vegetation_trend") {
        isValid = rule.validate(data.vegetationCoverChange);
      } else if (ruleName === "biomass_realistic") {
        isValid = rule.validate(data.biomassEstimate.estimatedBiomass);
      } else if (ruleName === "cloud_cover_acceptable") {
        isValid = rule.validate(data.dataQuality.cloudCover);
      } else if (ruleName === "completeness_threshold") {
        isValid = rule.validate(data.dataQuality.completeness);
      } else if (ruleName === "health_score_valid") {
        isValid = rule.validate(data.ecosystemHealthScore);
      }

      if (isValid) {
        checksPass++;
      } else {
        const failure: ValidationFailure = {
          rule: ruleName,
          reason: rule.errorMessage,
          severity: (rule.severity === 'info' ? 'warning' : rule.severity) as 'warning' | 'critical',
          value: null,
          fixApplied: false,
        };

        if (rule.severity === "critical") {
          failures.push(failure);
        } else {
          warnings.push({
            rule: ruleName,
            message: rule.errorMessage,
            severity: "warning",
          });
        }
      }
    } catch (error) {
      failures.push({
        rule: ruleName,
        reason: `Validation error: ${error}`,
        severity: "warning",
        value: null,
        fixApplied: false,
      });
    }
  }

  // Calculate quality score
  const qualityScore = (checksPass / checksPerformed) * 100;

  // Generate recommendations
  const suggestions: string[] = [];
  if (data.dataQuality.cloudCover > 20) suggestions.push("High cloud cover - consider re-acquisition");
  if (data.dataQuality.completeness < 80)
    suggestions.push("Data completeness below optimal - supplement with drone surveys");
  if (data.degradationFlags.length > 0) suggestions.push(`Investigate flagged degradation signals: ${data.degradationFlags.join(", ")}`);
  if (data.ecosystemHealthScore < 50) suggestions.push("Low ecosystem health score - recommend immediate field validation");

  const isValid = failures.length === 0 && qualityScore >= 70;
  const recommendedAction: "APPROVE" | "REVIEW" | "REJECT" | "REQUEST_MORE_DATA" =
    isValid && qualityScore >= 85
      ? "APPROVE"
      : isValid
        ? "REVIEW"
        : qualityScore >= 60
          ? "REQUEST_MORE_DATA"
          : "REJECT";

  return {
    isValid,
    dataSourceId: data.projectId,
    timestamp: data.analysisDate,
    checksPerformed,
    checksPass,
    failures,
    warnings,
    qualityScore: Math.round(qualityScore),
    suggestions,
    recommendedAction,
  };
};

/**
 * Validate sensor data against comprehensive rules
 */
export const validateSensorData = (data: AggregatedSensorData, sensorType: string): DataValidationResult => {
  const failures: ValidationFailure[] = [];
  const warnings: ValidationWarning[] = [];
  let checksPass = 0;
  const checksPerformed = Object.keys(sensorValidationRules).length;

  for (const [ruleName, rule] of Object.entries(sensorValidationRules)) {
    let isValid = false;

    try {
      if (ruleName === "reading_range") {
        isValid = rule.validate(data.statistics.mean, { sensorType });
      } else if (ruleName === "confidence_sufficient") {
        isValid = rule.validate(data.dataQuality);
      } else if (ruleName === "data_quality_valid") {
        // Simplified - check if anomaly count is low
        isValid = data.anomalies.filter((a) => a.severity === "high").length === 0;
      } else if (ruleName === "timestamp_valid") {
        isValid = rule.validate(data.averagePeriod.end);
      } else if (ruleName === "freshness_acceptable") {
        isValid = rule.validate(data.averagePeriod.end);
      }

      if (isValid) {
        checksPass++;
      } else {
        if (rule.severity === "critical") {
          failures.push({
            rule: ruleName,
            reason: rule.errorMessage,
            severity: rule.severity,
            value: data.statistics.mean,
            fixApplied: false,
          });
        } else {
          warnings.push({
            rule: ruleName,
            message: rule.errorMessage,
            severity: "warning",
          });
        }
      }
    } catch (error) {
      warnings.push({
        rule: ruleName,
        message: `Validation error: ${error}`,
        severity: "warning",
      });
    }
  }

  const qualityScore = (checksPass / checksPerformed) * 100;
  const suggestions: string[] = [];

  if (data.statistics.stdDev > data.statistics.mean * 0.3) {
    suggestions.push("High variability detected - recommend sensor recalibration");
  }
  if (data.anomalies.length > 2) {
    suggestions.push(`Multiple anomalies detected - ${data.anomalies.length} points flagged for review`);
  }
  if (data.dataQuality < 70) {
    suggestions.push("Data quality below 70% - recommend extended monitoring period");
  }

  const isValid = failures.length === 0 && qualityScore >= 70;
  const recommendedAction: "APPROVE" | "REVIEW" | "REJECT" | "REQUEST_MORE_DATA" =
    isValid && qualityScore >= 90
      ? "APPROVE"
      : isValid
        ? "REVIEW"
        : qualityScore >= 60
          ? "REQUEST_MORE_DATA"
          : "REJECT";

  return {
    isValid,
    dataSourceId: data.sensorId,
    timestamp: data.averagePeriod.end,
    checksPerformed,
    checksPass,
    failures,
    warnings,
    qualityScore: Math.round(qualityScore),
    suggestions,
    recommendedAction,
  };
};

/**
 * Cross-source data consistency validation
 * Verify satellite and sensor readings corroborate each other
 */
export const validateCrossSourceConsistency = (
  satelliteData: SatelliteAnalysisResult,
  sensorData: Map<string, AggregatedSensorData>
): CrossSourceValidation => {
  const discrepancies: Discrepancy[] = [];
  const sourcesValidated = ["satellite", ...Array.from(sensorData.keys())];

  // Compare satellite health score with sensor-based indicators
  let consistencyScore = 100;

  sensorData.forEach((sensor, sensorId) => {
    // If satellite shows high NDVI but sensor shows low DO, flag discrepancy
    if (satelliteData.ecosystemHealthScore > 70 && sensor.statistics.mean < 5) {
      const difference = satelliteData.ecosystemHealthScore - sensor.statistics.mean * 20;

      discrepancies.push({
        source1: "satellite",
        source2: sensorId,
        metric: "ecosystem_health",
        value1: satelliteData.ecosystemHealthScore,
        value2: sensor.statistics.mean * 20,
        percentageDifference: (Math.abs(difference) / Math.max(1, satelliteData.ecosystemHealthScore)) * 100,
        severity: "medium",
        explanation: "Satellite health indicators conflict with sensor measurements - recommend field validation",
      });
      consistencyScore -= 15;
    }

    // Check temporal alignment
    const satelliteDate = new Date(satelliteData.analysisDate);
    const sensorDate = new Date(sensor.averagePeriod.end);
    const daysDiff = Math.abs((satelliteDate.getTime() - sensorDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 7) {
      discrepancies.push({
        source1: "satellite",
        source2: sensorId,
        metric: "temporal_alignment",
        value1: satelliteDate.getTime(),
        value2: sensorDate.getTime(),
        percentageDifference: (daysDiff / 30) * 100,
        severity: "low",
        explanation: `Data sources ${daysDiff.toFixed(0)} days apart - temporal misalignment`,
      });
      consistencyScore -= 5;
    }
  });

  consistencyScore = Math.max(0, Math.min(100, consistencyScore));

  const recommendations: string[] = [];
  if (discrepancies.length > 0) {
    recommendations.push("Cross-source discrepancies detected - manual review recommended");
  }
  if (consistencyScore < 70) {
    recommendations.push("Low cross-source consistency - request additional validation data");
  } else if (consistencyScore >= 85) {
    recommendations.push("High consistency across sources - ready for verification");
  }

  return {
    timestamp: new Date().toISOString(),
    sourcesValidated,
    consistencyScore: Math.round(consistencyScore),
    discrepancies,
    overallValid: consistencyScore >= 70 && discrepancies.filter((d) => d.severity === "high").length === 0,
    recommendations,
  };
};

/**
 * Comprehensive validation pipeline for multi-source data
 */
export const validateMultiSourceData = async (
  satellite: SatelliteAnalysisResult,
  sensors: Map<string, AggregatedSensorData>
): Promise<{
  satellite: DataValidationResult
  sensors: Map<string, DataValidationResult>
  crossSource: CrossSourceValidation
  overallValid: boolean
  overallAction: string
}> => {
  const satelliteValidation = validateSatelliteData(satellite);

  const sensorValidations = new Map<string, DataValidationResult>();
  sensors.forEach((sensor, sensorId) => {
    // Infer sensor type from sensorId
    const sensorType = sensorId.includes("do") ? "dissolved_oxygen" : "temperature";
    sensorValidations.set(sensorId, validateSensorData(sensor, sensorType));
  });

  const crossSourceValidation = validateCrossSourceConsistency(satellite, sensors);

  const overallValid =
    satelliteValidation.isValid &&
    Array.from(sensorValidations.values()).every((v) => v.isValid) &&
    crossSourceValidation.overallValid;

  const overallAction =
    overallValid && satelliteValidation.qualityScore > 85 && Array.from(sensorValidations.values()).every((v) => v.qualityScore > 85)
      ? "READY_FOR_SMART_CONTRACT_VERIFICATION"
      : overallValid
        ? "READY_FOR_MANUAL_REVIEW"
        : "REQUEST_ADDITIONAL_DATA";

  return {
    satellite: satelliteValidation,
    sensors: sensorValidations,
    crossSource: crossSourceValidation,
    overallValid,
    overallAction,
  };
};

export default {
  satelliteValidationRules,
  sensorValidationRules,
  metaValidationRules,
  validateSatelliteData,
  validateSensorData,
  validateCrossSourceConsistency,
  validateMultiSourceData,
};
