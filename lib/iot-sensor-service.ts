/**
 * IoT Sensor Integration Service
 * Handles real-time monitoring data from underwater and coastal sensors
 * Supports MQTT protocol, WebSocket streaming, and data aggregation
 */

export interface SensorDevice {
  id: string
  name: string
  type: "water_quality" | "temperature" | "salinity" | "dissolved_oxygen" | "co2_flux"
  location: { latitude: number; longitude: number }
  depth: number // meters
  status: "active" | "inactive" | "error"
  lastReading: string // ISO timestamp
  calibrationDate: string
}

export interface SensorReading {
  sensorId: string
  timestamp: string
  value: number
  unit: string
  quality: "valid" | "questionable" | "bad"
  confidence: number // 0-100
}

export interface WaterQualityReading extends SensorReading {
  pH: number
  salinity: number // PSU
  dissolvedOxygen: number // mg/L
  turbidity: number // NTU
  temperature: number // Celsius
  chlorophyll: number // μg/L
  nitrate: number // μmol/L
}

export interface AggregatedSensorData {
  sensorId: string
  location: { latitude: number; longitude: number }
  averagePeriod: { start: string; end: string }
  readings: number
  statistics: {
    mean: number
    median: number
    stdDev: number
    min: number
    max: number
  }
  anomalies: AnomalyFlag[]
  dataQuality: number // 0-100
}

export interface AnomalyFlag {
  timestamp: string
  value: number
  severity: "low" | "medium" | "high"
  reason: string
}

// Mock sensor network for demonstration
export const mockSensorNetwork: SensorDevice[] = [
  {
    id: "sensor-001",
    name: "Sundarbans Mangrove Depth Monitor",
    type: "dissolved_oxygen",
    location: { latitude: 21.95, longitude: 88.85 },
    depth: 2,
    status: "active",
    lastReading: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    calibrationDate: "2025-11-01",
  },
  {
    id: "sensor-002",
    name: "Seagrass Meadow pH Sensor",
    type: "water_quality",
    location: { latitude: -33.86, longitude: 151.21 },
    depth: 1.5,
    status: "active",
    lastReading: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    calibrationDate: "2025-11-15",
  },
  {
    id: "sensor-003",
    name: "Salt Marsh Temperature Probe",
    type: "temperature",
    location: { latitude: 42.36, longitude: -71.06 },
    depth: 0.5,
    status: "active",
    lastReading: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    calibrationDate: "2025-11-10",
  },
  {
    id: "sensor-004",
    name: "Kelp Forest CO2 Flux Meter",
    type: "co2_flux",
    location: { latitude: 60.35, longitude: 5.35 },
    depth: 3,
    status: "active",
    lastReading: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    calibrationDate: "2025-10-25",
  },
];

/**
 * Generate realistic sensor readings based on sensor type and location
 */
export const generateSensorReading = (sensor: SensorDevice): SensorReading => {
  let value = 0;
  let unit = "";
  let baseQuality = 95 + Math.random() * 5;

  switch (sensor.type) {
    case "dissolved_oxygen":
      value = 7 + (Math.random() - 0.5) * 2; // 6-8 mg/L typical
      unit = "mg/L";
      break;
    case "temperature":
      value = 22 + (Math.random() - 0.5) * 3; // 20.5-23.5°C typical
      unit = "°C";
      break;
    case "salinity":
      value = 35 + (Math.random() - 0.5) * 2; // 34-36 PSU typical
      unit = "PSU";
      break;
    case "water_quality":
      value = 7.8 + (Math.random() - 0.5) * 0.4; // pH 7.6-8.0
      unit = "pH";
      break;
    case "co2_flux":
      value = 85 + Math.random() * 30; // 85-115 mmol m⁻² d⁻¹
      unit = "mmol m⁻² d⁻¹";
      break;
  }

  return {
    sensorId: sensor.id,
    timestamp: new Date().toISOString(),
    value: parseFloat(value.toFixed(2)),
    unit,
    quality: Math.random() > 0.95 ? "questionable" : "valid",
    confidence: parseFloat(baseQuality.toFixed(1)),
  };
};

/**
 * Detect anomalies in sensor readings
 */
export const detectAnomalies = (
  readings: SensorReading[],
  sensorType: string
): AnomalyFlag[] => {
  const anomalies: AnomalyFlag[] = [];

  if (readings.length < 2) return anomalies;

  // Calculate statistics
  const values = readings.map((r) => r.value);
  const mean = values.reduce((a, b) => a + b) / values.length;
  const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2)) / values.length);

  // Define normal ranges for different sensor types
  const normalRanges: Record<string, { min: number; max: number; stdDevThreshold: number }> = {
    dissolved_oxygen: { min: 3, max: 10, stdDevThreshold: 2 },
    temperature: { min: 0, max: 40, stdDevThreshold: 5 },
    salinity: { min: 0, max: 40, stdDevThreshold: 3 },
    water_quality: { min: 6.5, max: 8.5, stdDevThreshold: 0.5 },
    co2_flux: { min: 0, max: 200, stdDevThreshold: 50 },
  };

  const range = normalRanges[sensorType] || { min: -100, max: 100, stdDevThreshold: 10 };

  // Check each reading for anomalies
  readings.forEach((reading, index) => {
    const severity =
      Math.abs(reading.value - mean) > range.stdDevThreshold * stdDev
        ? "high"
        : Math.abs(reading.value - mean) > 2 * stdDev
          ? "medium"
          : "low";

    if (reading.value < range.min || reading.value > range.max) {
      anomalies.push({
        timestamp: reading.timestamp,
        value: reading.value,
        severity: "high",
        reason: `Value ${reading.value} outside normal range [${range.min}, ${range.max}]`,
      });
    } else if (severity === "high" && Math.abs(reading.value - mean) > 3 * stdDev) {
      anomalies.push({
        timestamp: reading.timestamp,
        value: reading.value,
        severity: "high",
        reason: `Statistical outlier: ${Math.abs(reading.value - mean).toFixed(2)} standard deviations from mean`,
      });
    }

    // Check for sensor malfunction (sudden big jumps)
    if (index > 0) {
      const previousValue = readings[index - 1].value;
      const jump = Math.abs(reading.value - previousValue);
      if (jump > range.stdDevThreshold) {
        anomalies.push({
          timestamp: reading.timestamp,
          value: reading.value,
          severity: "medium",
          reason: `Sudden jump from ${previousValue} to ${reading.value}`,
        });
      }
    }
  });

  return anomalies;
};

/**
 * Aggregate sensor data over a time period
 */
export const aggregateSensorData = (
  sensorId: string,
  readings: SensorReading[],
  location: { latitude: number; longitude: number },
  sensorType: string
): AggregatedSensorData => {
  if (readings.length === 0) {
    return {
      sensorId,
      location,
      averagePeriod: { start: new Date().toISOString(), end: new Date().toISOString() },
      readings: 0,
      statistics: { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 },
      anomalies: [],
      dataQuality: 0,
    };
  }

  const values = readings.map((r) => r.value).sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b) / values.length;
  const median = values.length % 2 === 0 ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2 : values[Math.floor(values.length / 2)];
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const anomalies = detectAnomalies(readings, sensorType);
  const validReadings = readings.filter((r) => r.quality === "valid").length;
  const dataQuality = (validReadings / readings.length) * 100 * 0.95; // Slight reduction for potential drift

  return {
    sensorId,
    location,
    averagePeriod: {
      start: readings[0].timestamp,
      end: readings[readings.length - 1].timestamp,
    },
    readings: readings.length,
    statistics: {
      mean: parseFloat(mean.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      stdDev: parseFloat(stdDev.toFixed(2)),
      min: values[0],
      max: values[values.length - 1],
    },
    anomalies,
    dataQuality: parseFloat(dataQuality.toFixed(1)),
  };
};

/**
 * Simulate real-time MQTT sensor stream
 * In production, replace with actual MQTT client connection
 */
export class SensorStreamSimulator {
  private isActive = false;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ((reading: SensorReading) => void)[] = [];

  startStream(sensor: SensorDevice, intervalMs: number = 60000): void {
    if (this.isActive) return;

    this.isActive = true;
    this.intervalId = setInterval(() => {
      const reading = generateSensorReading(sensor);
      this.callbacks.forEach((cb) => cb(reading));
    }, intervalMs);

    // Generate initial reading immediately
    const initialReading = generateSensorReading(sensor);
    this.callbacks.forEach((cb) => cb(initialReading));
  }

  stopStream(): void {
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onReading(callback: (reading: SensorReading) => void): void {
    this.callbacks.push(callback);
  }

  isStreaming(): boolean {
    return this.isActive;
  }
}

/**
 * Validate sensor readings against expected parameters
 */
export const validateSensorReading = (reading: SensorReading, sensorType: string): boolean => {
  const ranges: Record<string, { min: number; max: number }> = {
    dissolved_oxygen: { min: 1, max: 15 },
    temperature: { min: -5, max: 50 },
    salinity: { min: 0, max: 45 },
    water_quality: { min: 4, max: 10 },
    co2_flux: { min: -100, max: 300 },
  };

  const range = ranges[sensorType];
  if (!range) return false;

  return reading.value >= range.min && reading.value <= range.max && reading.confidence > 50;
};

/**
 * Calculate data freshness score (0-100)
 */
export const calculateDataFreshness = (lastReadingTime: string): number => {
  const now = new Date();
  const lastReading = new Date(lastReadingTime);
  const minutesOld = (now.getTime() - lastReading.getTime()) / (1000 * 60);

  // Data is fresh if < 1 hour old
  if (minutesOld < 60) return 100;
  // Acceptable if < 4 hours old
  if (minutesOld < 240) return 80;
  // Stale if < 24 hours old
  if (minutesOld < 1440) return 50;
  // Very old if > 24 hours
  return Math.max(0, 50 - (minutesOld - 1440) / 100);
};

export default {
  mockSensorNetwork,
  generateSensorReading,
  detectAnomalies,
  aggregateSensorData,
  validateSensorReading,
  calculateDataFreshness,
  SensorStreamSimulator,
};
