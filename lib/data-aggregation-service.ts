/**
 * Data Aggregation & Integration Service
 * Consolidates multi-source monitoring data and prepares for verification workflow
 * Handles temporal alignment, spatial indexing, and readiness assessment
 */

import type { SatelliteAnalysisResult } from "./satellite-data-service"
import type { AggregatedSensorData } from "./iot-sensor-service"
import type { DetectedAnomaly } from "./ml-anomaly-detection"
import type { DataValidationResult, CrossSourceValidation } from "./data-validation-pipeline"

export interface MonitoringPeriod {
  startDate: string
  endDate: string
  durationDays: number
}

export interface AggregatedMonitoringData {
  projectId: string
  location: { latitude: number; longitude: number }
  monitoringPeriod: MonitoringPeriod
  dataSourcesSummary: {
    satellite: SatelliteAnalysisResult | null
    sensors: Map<string, AggregatedSensorData>
    droneData: any[]
    fieldObservations: any[]
  }
  temporalAlignment: TemporalAlignmentInfo
  spatialCoverage: SpatialCoverageInfo
  carbonSequestrationEstimate: CarbonSequestrationEstimate
  dataQualityMetrics: DataQualityMetrics
  readinessForVerification: VerificationReadiness
  recommendations: DataAggregationRecommendation[]
}

export interface TemporalAlignmentInfo {
  aligned: boolean
  dataGaps: DateRange[]
  coveragePercentage: number // How much of monitoring period has data
  consistencyScore: number // 0-100
  recommendations: string[]
}

export interface DateRange {
  start: string
  end: string
  durationDays: number
  reason: string
}

export interface SpatialCoverageInfo {
  totalAreaCovered: number // km²
  coveragePercentage: number // % of project area
  sensorDensity: number // sensors per km²
  spatialGaps: SpatialGap[]
  recommendations: string[]
}

export interface SpatialGap {
  location: { latitude: number; longitude: number }
  radiusKm: number
  importance: "critical" | "high" | "medium" | "low"
  recommendation: string
}

export interface CarbonSequestrationEstimate {
  totalSequestered: number // tons CO₂ per monitoring period
  annualizedRate: number // tons CO₂ per year
  confidence: number // 0-100
  methodology: string
  breakdownByEcosystem?: Record<string, number>
  comparisonToBaseline: {
    baselineRate: number
    currentRate: number
    percentageChange: number
  }
}

export interface DataQualityMetrics {
  overallScore: number // 0-100
  satelliteQuality: number
  sensorQuality: number
  temporalQuality: number
  spatialQuality: number
  consistencyScore: number
  completenessScore: number
  freshness: "real-time" | "current" | "recent" | "stale" // Based on data age
}

export interface VerificationReadiness {
  readyForVerification: boolean
  readinessScore: number // 0-100
  criteriaStatus: {
    sufficientDataSources: boolean
    temporalCoverageAdequate: boolean
    qualityThresholdMet: boolean
    anomaliesResolved: boolean
    crossSourceValidated: boolean
  }
  estimatedVerificationDate: string
  blockers: string[]
  nextSteps: string[]
}

export interface DataAggregationRecommendation {
  priority: "critical" | "high" | "medium" | "low"
  category: "data_collection" | "quality_improvement" | "anomaly_resolution" | "timeline_adjustment"
  description: string
  estimatedImpact: string
  timeToImplement: string
}

/**
 * Assess temporal alignment of multi-source data
 */
export const assessTemporalAlignment = (
  satelliteData: SatelliteAnalysisResult | null,
  sensorDataMap: Map<string, AggregatedSensorData>,
  monitoringStartDate: string,
  monitoringEndDate: string
): TemporalAlignmentInfo => {
  const allTimestamps: Date[] = [];
  const dataPoints: { timestamp: Date; source: string }[] = [];

  // Collect satellite data timestamps
  if (satelliteData) {
    satelliteData.ndviTimeSeries.forEach((d) => {
      const date = new Date(d.timestamp);
      allTimestamps.push(date);
      dataPoints.push({ timestamp: date, source: "satellite" });
    });
  }

  // Collect sensor data timestamps
  sensorDataMap.forEach((sensor, sensorId) => {
    const startDate = new Date(sensor.averagePeriod.start);
    const endDate = new Date(sensor.averagePeriod.end);
    allTimestamps.push(startDate, endDate);
    dataPoints.push({ timestamp: startDate, source: sensorId });
    dataPoints.push({ timestamp: endDate, source: sensorId });
  });

  if (allTimestamps.length === 0) {
    return {
      aligned: false,
      dataGaps: [],
      coveragePercentage: 0,
      consistencyScore: 0,
      recommendations: ["No temporal data to assess"],
    };
  }

  // Sort timestamps
  allTimestamps.sort((a, b) => a.getTime() - b.getTime());

  // Identify data gaps (>7 days without data)
  const dataGaps: DateRange[] = [];
  for (let i = 0; i < allTimestamps.length - 1; i++) {
    const gap = (allTimestamps[i + 1].getTime() - allTimestamps[i].getTime()) / (1000 * 60 * 60 * 24);
    if (gap > 7) {
      dataGaps.push({
        start: allTimestamps[i].toISOString(),
        end: allTimestamps[i + 1].toISOString(),
        durationDays: Math.round(gap),
        reason: "Insufficient data points for continuous monitoring",
      });
    }
  }

  // Calculate coverage percentage
  const monitoringStart = new Date(monitoringStartDate);
  const monitoringEnd = new Date(monitoringEndDate);
  const totalMonitoringDays = (monitoringEnd.getTime() - monitoringStart.getTime()) / (1000 * 60 * 60 * 24);
  const gapDays = dataGaps.reduce((sum, gap) => sum + gap.durationDays, 0);
  const coveragePercentage = Math.max(0, 100 - (gapDays / totalMonitoringDays) * 100);

  // Assess temporal alignment between sources
  let consistencyScore = 100;
  const sourceTimestamps = new Map<string, Date[]>();

  dataPoints.forEach(({ timestamp, source }) => {
    if (!sourceTimestamps.has(source)) {
      sourceTimestamps.set(source, []);
    }
    sourceTimestamps.get(source)!.push(timestamp);
  });

  // Check if sources are temporally aligned (within 7 days of each other)
  let sourceCount = 0;
  const sourcesList = Array.from(sourceTimestamps.keys());
  for (let i = 0; i < sourcesList.length; i++) {
    for (let j = i + 1; j < sourcesList.length; j++) {
      const timestamps1 = sourceTimestamps.get(sourcesList[i])!;
      const timestamps2 = sourceTimestamps.get(sourcesList[j])!;

      const recentTimestamp1 = timestamps1[timestamps1.length - 1];
      const recentTimestamp2 = timestamps2[timestamps2.length - 1];

      const daysDiff = Math.abs((recentTimestamp1.getTime() - recentTimestamp2.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 7) {
        consistencyScore -= 10;
        sourceCount++;
      }
    }
  }

  const recommendations: string[] = [];
  if (dataGaps.length > 0) {
    recommendations.push(`${dataGaps.length} data gaps detected - ensure continuous monitoring`);
  }
  if (coveragePercentage < 80) {
    recommendations.push("Monitoring coverage below 80% - extend collection period");
  }
  if (consistencyScore < 70) {
    recommendations.push("Source temporal misalignment detected - synchronize data collection schedules");
  }

  const aligned = dataGaps.length === 0 && coveragePercentage >= 80 && consistencyScore >= 80;

  return {
    aligned,
    dataGaps,
    coveragePercentage: Math.round(coveragePercentage),
    consistencyScore,
    recommendations,
  };
};

/**
 * Assess spatial coverage
 */
export const assessSpatialCoverage = (
  projectArea: number, // km²
  sensorLocations: Array<{ latitude: number; longitude: number }>,
  satelliteAvailable: boolean
): SpatialCoverageInfo => {
  const sensorDensity = sensorLocations.length / projectArea;
  const spatialGaps: SpatialGap[] = [];

  // Simplified spatial coverage calculation
  let effectiveCoverage = Math.min(100, sensorLocations.length * 5 + (satelliteAvailable ? 40 : 0));

  // Identify critical gaps (areas with no nearby sensors)
  // For demo, assuming project grid with 5x5 cells
  const gridCells = 25;
  const cellsWithSensor = Math.min(gridCells, Math.ceil(sensorLocations.length * 1.5));
  const uncoveredCells = gridCells - cellsWithSensor;

  if (uncoveredCells > 5) {
    for (let i = 0; i < uncoveredCells && i < 3; i++) {
      spatialGaps.push({
        location: { latitude: 0 + i * 0.5, longitude: 0 + i * 0.5 }, // Simplified
        radiusKm: 2,
        importance: i === 0 ? "critical" : "high",
        recommendation: `Deploy additional sensor at grid position (${i + 1})`,
      });
    }
  }

  const coveragePercentage = effectiveCoverage;
  const recommendations: string[] = [];

  if (coveragePercentage < 60) {
    recommendations.push("Spatial coverage critically low - deploy additional sensors");
  } else if (coveragePercentage < 80) {
    recommendations.push("Spatial coverage gaps detected - consider drone surveys for unmapped areas");
  }

  if (!satelliteAvailable) {
    recommendations.push("Satellite imagery unavailable - prioritize drone surveys");
  }

  return {
    totalAreaCovered: projectArea,
    coveragePercentage: Math.round(coveragePercentage),
    sensorDensity: parseFloat(sensorDensity.toFixed(3)),
    spatialGaps,
    recommendations,
  };
};

/**
 * Calculate carbon sequestration from aggregated data
 */
export const calculateCarbonSequestration = (
  satelliteData: SatelliteAnalysisResult | null,
  monitoringPeriodDays: number
): CarbonSequestrationEstimate => {
  const baselineAnnualRate = 3.5; // tons CO₂/ha/year (typical for mangroves)
  const projectAreaHa = 100; // Simplified - 100 hectares

  let currentRate = baselineAnnualRate;
  let confidence = 70;

  if (satelliteData) {
    // Use biomass estimate to calculate sequestration
    const currentBiomass = satelliteData.biomassEstimate.estimatedBiomass;
    // Simplified: assume 50% of biomass is carbon
    const carbonContent = currentBiomass * 0.5;
    // Annual sequestration from biomass growth
    currentRate = (carbonContent / projectAreaHa) * (365 / monitoringPeriodDays);
    confidence = satelliteData.biomassEstimate.confidence;
  }

  const annualRate = currentRate * projectAreaHa;
  const monitoringPeriodRate = (annualRate / 365) * monitoringPeriodDays;

  return {
    totalSequestered: parseFloat(monitoringPeriodRate.toFixed(2)),
    annualizedRate: parseFloat(annualRate.toFixed(2)),
    confidence: Math.round(confidence),
    methodology: satelliteData ? "Satellite + Allometric Equations" : "Conservative Estimate",
    comparisonToBaseline: {
      baselineRate: baselineAnnualRate,
      currentRate: parseFloat(currentRate.toFixed(2)),
      percentageChange: parseFloat(((currentRate / baselineAnnualRate - 1) * 100).toFixed(1)),
    },
  };
};

/**
 * Calculate comprehensive data quality metrics
 */
export const calculateDataQualityMetrics = (
  satelliteValidation: DataValidationResult | null,
  sensorValidations: Map<string, DataValidationResult>,
  crossSourceValidation: CrossSourceValidation,
  temporalAlignment: TemporalAlignmentInfo
): DataQualityMetrics => {
  const satelliteQuality = satelliteValidation?.qualityScore || 0;
  const sensorQuality =
    sensorValidations.size > 0
      ? Array.from(sensorValidations.values()).reduce((sum, v) => sum + v.qualityScore, 0) /
        sensorValidations.size
      : 0;

  const temporalQuality = temporalAlignment.coveragePercentage;
  const spatialQuality = 75; // Placeholder

  const overallScore = (satelliteQuality + sensorQuality + temporalQuality + spatialQuality) / 4;

  // Determine freshness
  const now = new Date();
  let freshness: "real-time" | "current" | "recent" | "stale" = "real-time";
  // Would check actual data age in production

  return {
    overallScore: Math.round(overallScore),
    satelliteQuality: Math.round(satelliteQuality),
    sensorQuality: Math.round(sensorQuality),
    temporalQuality: Math.round(temporalQuality),
    spatialQuality: Math.round(spatialQuality),
    consistencyScore: crossSourceValidation.consistencyScore,
    completenessScore: temporalAlignment.coveragePercentage,
    freshness,
  };
};

/**
 * Assess verification readiness
 */
export const assessVerificationReadiness = (
  dataQuality: DataQualityMetrics,
  temporalAlignment: TemporalAlignmentInfo,
  spatialCoverage: SpatialCoverageInfo,
  anomalies: DetectedAnomaly[]
): VerificationReadiness => {
  const criteriaStatus = {
    sufficientDataSources: dataQuality.satelliteQuality > 0 && dataQuality.sensorQuality > 0,
    temporalCoverageAdequate: temporalAlignment.coveragePercentage >= 80 && temporalAlignment.aligned,
    qualityThresholdMet: dataQuality.overallScore >= 70,
    anomaliesResolved: anomalies.filter((a) => a.severity === "high").length === 0,
    crossSourceValidated: dataQuality.consistencyScore >= 70,
  };

  const criteriaCount = Object.values(criteriaStatus).filter((v) => v).length;
  const readinessScore = (criteriaCount / Object.values(criteriaStatus).length) * 100;

  const blockers: string[] = [];
  const nextSteps: string[] = [];

  if (!criteriaStatus.sufficientDataSources) blockers.push("Insufficient data sources - need satellite AND sensor data");
  if (!criteriaStatus.temporalCoverageAdequate) blockers.push("Temporal coverage inadequate - extend monitoring period");
  if (!criteriaStatus.qualityThresholdMet) blockers.push("Data quality below 70% threshold");
  if (!criteriaStatus.anomaliesResolved) blockers.push("Critical anomalies unresolved - investigate flagged data points");
  if (!criteriaStatus.crossSourceValidated) blockers.push("Cross-source consistency low - manual review required");

  if (criteriaStatus.sufficientDataSources) nextSteps.push("✓ Multi-source data collected");
  if (criteriaStatus.temporalCoverageAdequate) nextSteps.push("✓ Temporal coverage sufficient");
  if (criteriaStatus.qualityThresholdMet) nextSteps.push("✓ Data quality meets standard");
  if (criteriaStatus.anomaliesResolved) nextSteps.push("✓ Anomalies resolved");
  if (criteriaStatus.crossSourceValidated) nextSteps.push("✓ Cross-source validated");

  if (blockers.length === 0) {
    nextSteps.push("→ Ready for Smart Contract Verification");
  }

  const readyForVerification = blockers.length === 0 && readinessScore >= 80;

  return {
    readyForVerification,
    readinessScore: Math.round(readinessScore),
    criteriaStatus,
    estimatedVerificationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    blockers,
    nextSteps,
  };
};

/**
 * Generate aggregation recommendations
 */
export const generateRecommendations = (
  dataQuality: DataQualityMetrics,
  temporalAlignment: TemporalAlignmentInfo,
  spatialCoverage: SpatialCoverageInfo,
  readiness: VerificationReadiness
): DataAggregationRecommendation[] => {
  const recommendations: DataAggregationRecommendation[] = [];

  if (dataQuality.overallScore < 80) {
    recommendations.push({
      priority: "high",
      category: "quality_improvement",
      description: "Improve satellite imagery quality by reducing cloud cover through additional acquisitions",
      estimatedImpact: "Could improve quality score by 10-15 points",
      timeToImplement: "2-3 weeks",
    });
  }

  if (temporalAlignment.coveragePercentage < 90) {
    recommendations.push({
      priority: "high",
      category: "data_collection",
      description: "Fill identified temporal gaps with drone surveys",
      estimatedImpact: "Increase coverage to 95%+",
      timeToImplement: "1-2 weeks",
    });
  }

  if (spatialCoverage.coveragePercentage < 85) {
    recommendations.push({
      priority: "medium",
      category: "data_collection",
      description: "Deploy additional IoT sensors in identified spatial gaps",
      estimatedImpact: "Improve spatial coverage by 10 points",
      timeToImplement: "3-4 weeks",
    });
  }

  if (!readiness.readyForVerification) {
    recommendations.push({
      priority: "critical",
      category: "anomaly_resolution",
      description: readiness.blockers[0] || "Address verification readiness blockers",
      estimatedImpact: "Enable smart contract verification",
      timeToImplement: "Varies by blocker",
    });
  }

  return recommendations;
};

/**
 * Comprehensive data aggregation
 */
export const aggregateMonitoringData = async (
  projectId: string,
  location: { latitude: number; longitude: number },
  monitoringStartDate: string,
  monitoringEndDate: string,
  satelliteData: SatelliteAnalysisResult | null,
  sensorData: Map<string, AggregatedSensorData>,
  satelliteValidation: DataValidationResult | null,
  sensorValidations: Map<string, DataValidationResult>,
  crossSourceValidation: CrossSourceValidation,
  detectredAnomalies: DetectedAnomaly[] = []
): Promise<AggregatedMonitoringData> => {
  const monitoringPeriod: MonitoringPeriod = {
    startDate: monitoringStartDate,
    endDate: monitoringEndDate,
    durationDays: Math.floor(
      (new Date(monitoringEndDate).getTime() - new Date(monitoringStartDate).getTime()) / (1000 * 60 * 60 * 24)
    ),
  };

  const temporalAlignment = assessTemporalAlignment(
    satelliteData,
    sensorData,
    monitoringStartDate,
    monitoringEndDate
  );

  const spatialCoverage = assessSpatialCoverage(500, [], satelliteData !== null); // 500 km² project area

  const carbonEstimate = calculateCarbonSequestration(satelliteData, monitoringPeriod.durationDays);

  const dataQuality = calculateDataQualityMetrics(satelliteValidation, sensorValidations, crossSourceValidation, temporalAlignment);

  const readiness = assessVerificationReadiness(dataQuality, temporalAlignment, spatialCoverage, detectredAnomalies);

  const recommendations = generateRecommendations(dataQuality, temporalAlignment, spatialCoverage, readiness);

  return {
    projectId,
    location,
    monitoringPeriod,
    dataSourcesSummary: {
      satellite: satelliteData,
      sensors: sensorData,
      droneData: [],
      fieldObservations: [],
    },
    temporalAlignment,
    spatialCoverage,
    carbonSequestrationEstimate: carbonEstimate,
    dataQualityMetrics: dataQuality,
    readinessForVerification: readiness,
    recommendations,
  };
};

export default {
  assessTemporalAlignment,
  assessSpatialCoverage,
  calculateCarbonSequestration,
  calculateDataQualityMetrics,
  assessVerificationReadiness,
  generateRecommendations,
  aggregateMonitoringData,
};
