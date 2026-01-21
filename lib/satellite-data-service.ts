/**
 * Satellite Data Integration Service
 * Handles Sentinel-1/2 imagery processing for NDVI, SAR, and vegetation analysis
 * Integrates with Google Earth Engine API for automated satellite data retrieval
 */

export interface SatelliteDataRequest {
  projectId: string
  location: { latitude: number; longitude: number }
  radius: number // in meters
  startDate: string // ISO format
  endDate: string // ISO format
  dataType: "optical" | "radar" | "both"
}

export interface NDVIData {
  timestamp: string
  value: number // -1 to 1, where 1 is highest vegetation density
  confidence: number // 0-100
  pixelCount: number
  quality: "high" | "medium" | "low"
}

export interface SARData {
  timestamp: string
  backscatter: number // VV/VH ratio
  confidence: number
  noiseFloor: number
  quality: "high" | "medium" | "low"
}

export interface BiomassEstimate {
  estimatedBiomass: number // tons per hectare
  method: "allometric" | "lidar" | "calibrated"
  confidence: number
  lastUpdated: string
}

export interface SatelliteAnalysisResult {
  projectId: string
  location: { latitude: number; longitude: number }
  analysisDate: string
  ndviTimeSeries: NDVIData[]
  sarAnalysis: SARData[]
  biomassEstimate: BiomassEstimate
  vegetationCoverChange: number // percentage change from baseline
  degradationFlags: string[]
  ecosystemHealthScore: number // 0-100
  dataQuality: {
    overallScore: number
    cloudCover: number
    completeness: number
  }
}

/**
 * Simulated Google Earth Engine API integration
 * In production, replace with actual GEE API calls
 */
export const calculateNDVI = async (
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<NDVIData[]> => {
  // Simulates NDVI calculation from Sentinel-2 imagery
  // Formula: NDVI = (NIR - RED) / (NIR + RED)
  // Range: -1 to 1

  const daysDiff = Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const dataPoints = Math.max(1, Math.floor(daysDiff / 10)); // Data every 10 days

  const results: NDVIData[] = [];

  for (let i = 0; i < dataPoints; i++) {
    const daysOffset = Math.floor((i / dataPoints) * daysDiff);
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysOffset);

    // Simulate realistic NDVI values for blue carbon ecosystems
    // Mangroves: 0.6-0.8, Seagrass: 0.4-0.6, Salt marshes: 0.3-0.5
    const baseNDVI = 0.65;
    const seasonalVariation = Math.sin((i / dataPoints) * Math.PI) * 0.15;
    const noise = (Math.random() - 0.5) * 0.1;
    const ndviValue = Math.max(-1, Math.min(1, baseNDVI + seasonalVariation + noise));

    results.push({
      timestamp: date.toISOString(),
      value: parseFloat(ndviValue.toFixed(3)),
      confidence: 85 + Math.random() * 15,
      pixelCount: Math.floor(Math.random() * 5000) + 2000,
      quality: ndviValue > 0.7 ? "high" : ndviValue > 0.5 ? "medium" : "low",
    });
  }

  return results;
};

/**
 * SAR (Synthetic Aperture Radar) analysis for biomass estimation
 * Independent of cloud cover, useful for tropical regions
 */
export const analyzeSAR = async (
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<SARData[]> => {
  const daysDiff = Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const dataPoints = Math.max(1, Math.floor(daysDiff / 12)); // Sentinel-1 every 12 days

  const results: SARData[] = [];

  for (let i = 0; i < dataPoints; i++) {
    const daysOffset = Math.floor((i / dataPoints) * daysDiff);
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysOffset);

    // VV/VH ratio correlates with biomass
    // Higher values = higher biomass
    const baseBackscatter = -8 + Math.random() * 4;
    const trend = (i / dataPoints) * 2; // Slight increase over time
    const backscatterValue = baseBackscatter + trend;

    results.push({
      timestamp: date.toISOString(),
      backscatter: parseFloat(backscatterValue.toFixed(2)),
      confidence: 90 + Math.random() * 10,
      noiseFloor: -20 + Math.random() * 2,
      quality: "high",
    });
  }

  return results;
};

/**
 * Allometric equation for biomass estimation from NDVI
 * Common for mangroves and coastal vegetation
 */
export const estimateBiomassFromNDVI = (ndviValues: NDVIData[]): BiomassEstimate => {
  if (ndviValues.length === 0) {
    return {
      estimatedBiomass: 0,
      method: "allometric",
      confidence: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Average NDVI
  const avgNDVI = ndviValues.reduce((sum, d) => sum + d.value, 0) / ndviValues.length;

  // Allometric equation: Biomass = a * NDVI^b
  // Typical values for mangroves: a=5, b=2
  const a = 5.2;
  const b = 2.1;
  const estimatedBiomass = a * Math.pow(Math.max(0, avgNDVI), b);

  const avgConfidence = ndviValues.reduce((sum, d) => sum + d.confidence, 0) / ndviValues.length;

  return {
    estimatedBiomass: parseFloat(estimatedBiomass.toFixed(2)),
    method: "allometric",
    confidence: parseFloat(avgConfidence.toFixed(1)),
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Detect degradation signals in satellite data
 */
export const detectDegradationSignals = (
  currentNDVI: NDVIData[],
  historicalNDVI: NDVIData[] | null
): string[] => {
  const flags: string[] = [];

  // Check for sudden NDVI drop
  if (currentNDVI.length > 1) {
    const recent = currentNDVI[currentNDVI.length - 1].value;
    const previous = currentNDVI[currentNDVI.length - 2].value;
    if (previous - recent > 0.15) {
      flags.push("NDVI_DROP_DETECTED");
    }
  }

  // Check for low vegetation density
  const avgNDVI = currentNDVI.reduce((sum, d) => sum + d.value, 0) / currentNDVI.length;
  if (avgNDVI < 0.4) {
    flags.push("LOW_VEGETATION_DENSITY");
  }

  // Check for high cloud cover affecting data quality
  const lowQualityCount = currentNDVI.filter((d) => d.quality === "low").length;
  if (lowQualityCount / currentNDVI.length > 0.3) {
    flags.push("HIGH_CLOUD_COVER");
  }

  // Compare with historical if available
  if (historicalNDVI && historicalNDVI.length > 0) {
    const historicalAvg =
      historicalNDVI.reduce((sum, d) => sum + d.value, 0) / historicalNDVI.length;
    const decline = ((avgNDVI - historicalAvg) / historicalAvg) * 100;
    if (decline < -10) {
      flags.push("SIGNIFICANT_NDVI_DECLINE");
    }
  }

  return flags;
};

/**
 * Calculate ecosystem health score based on multiple indicators
 */
export const calculateEcosystemHealthScore = (
  ndviData: NDVIData[],
  sarData: SARData[],
  degradationFlags: string[]
): number => {
  let score = 100;

  // NDVI component (40% weight)
  if (ndviData.length > 0) {
    const avgNDVI = ndviData.reduce((sum, d) => sum + d.value, 0) / ndviData.length;
    const ndviScore = (avgNDVI + 1) * 50; // Normalize -1 to 1 into 0-100
    score = score * 0.6 + ndviScore * 0.4;
  }

  // SAR component (30% weight)
  if (sarData.length > 0) {
    const avgBackscatter = sarData.reduce((sum, d) => sum + d.backscatter, 0) / sarData.length;
    const sarScore = Math.max(0, Math.min(100, (avgBackscatter + 20) * 3)); // Normalize
    score = score * 0.7 + sarScore * 0.3;
  }

  // Degradation flags (30% penalty)
  const flagPenalty = degradationFlags.length * 5; // 5 points per flag
  score = Math.max(0, score - flagPenalty);

  return Math.round(score);
};

/**
 * Comprehensive satellite analysis pipeline
 */
export const analyzeSatelliteData = async (
  request: SatelliteDataRequest,
  historicalData?: SatelliteAnalysisResult
): Promise<SatelliteAnalysisResult> => {
  const ndviData =
    request.dataType === "optical" || request.dataType === "both"
      ? await calculateNDVI(
          request.location.latitude,
          request.location.longitude,
          request.startDate,
          request.endDate
        )
      : [];

  const sarData =
    request.dataType === "radar" || request.dataType === "both"
      ? await analyzeSAR(
          request.location.latitude,
          request.location.longitude,
          request.startDate,
          request.endDate
        )
      : [];

  const biomassEstimate = estimateBiomassFromNDVI(ndviData);
  const degradationFlags = detectDegradationSignals(
    ndviData,
    historicalData?.ndviTimeSeries || null
  );
  const ecosystemHealthScore = calculateEcosystemHealthScore(ndviData, sarData, degradationFlags);

  // Calculate vegetation cover change
  let vegetationCoverChange = 0;
  if (historicalData && ndviData.length > 0 && historicalData.ndviTimeSeries.length > 0) {
    const currentAvg = ndviData.reduce((sum, d) => sum + d.value, 0) / ndviData.length;
    const historicalAvg =
      historicalData.ndviTimeSeries.reduce((sum, d) => sum + d.value, 0) /
      historicalData.ndviTimeSeries.length;
    vegetationCoverChange = ((currentAvg - historicalAvg) / historicalAvg) * 100;
  }

  // Calculate data quality metrics
  const highQualityNDVI = ndviData.filter((d) => d.quality === "high").length;
  const completeness = (highQualityNDVI / Math.max(1, ndviData.length)) * 100;
  const avgCloudCover = 100 - completeness; // Simplified cloud cover calculation

  return {
    projectId: request.projectId,
    location: request.location,
    analysisDate: new Date().toISOString(),
    ndviTimeSeries: ndviData,
    sarAnalysis: sarData,
    biomassEstimate,
    vegetationCoverChange: parseFloat(vegetationCoverChange.toFixed(2)),
    degradationFlags,
    ecosystemHealthScore,
    dataQuality: {
      overallScore: (biomassEstimate.confidence + 90) / 2, // Average of component scores
      cloudCover: parseFloat(avgCloudCover.toFixed(1)),
      completeness: parseFloat(completeness.toFixed(1)),
    },
  };
};

export default {
  calculateNDVI,
  analyzeSAR,
  estimateBiomassFromNDVI,
  detectDegradationSignals,
  calculateEcosystemHealthScore,
  analyzeSatelliteData,
};
