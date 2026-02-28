/**
 * REAL-TIME SENSOR MONITORING DASHBOARD
 *
 * Live IoT sensor data visualization and monitoring
 * - Multi-sensor overview
 * - Real-time data streaming
 * - Alert management
 * - Geographic heat maps
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getMqttSensorClient,
  type AggregatedSensorReading,
  type SensorData,
  type SensorLocation,
} from '@/lib/mqtt-sensor-service'

interface SensorMonitoringDashboardProps {
  projectId: string
  autoRefresh?: boolean
  refreshInterval?: number
  onAnomalyDetected?: (anomalies: SensorData[]) => void
}

const SensorCard = ({ sensor, threshold }: { sensor: SensorData; threshold?: Record<string, number> }) => {
  const getStatusColor = () => {
    if (sensor.status === 'error') return 'from-red-500 to-red-600 text-red-900'
    if (sensor.status === 'warning') return 'from-yellow-500 to-yellow-600 text-yellow-900'
    return 'from-green-500 to-green-600 text-green-900'
  }

  const getIcon = () => {
    switch (sensor.sensorType) {
      case 'temperature':
        return '🌡️'
      case 'humidity':
        return '💧'
      case 'soilMoisture':
        return '🌱'
      case 'co2':
        return '🔬'
      case 'light':
        return '💡'
      case 'precipitation':
        return '🌧️'
      case 'windSpeed':
        return '💨'
      case 'ph':
        return '⚗️'
      default:
        return '📊'
    }
  }

  return (
    <div className={`${getStatusColor()} rounded-lg p-3 sm:p-4 border border-opacity-20 border-white shadow-lg h-full flex flex-col`} style={{backgroundImage: `linear-gradient(to bottom right, ${getStatusColor().includes('red') ? 'rgb(239, 68, 68), rgb(220, 38, 38)' : getStatusColor().includes('yellow') ? 'rgb(234, 179, 8), rgb(202, 138, 4)' : 'rgb(34, 197, 94), rgb(22, 163, 74)'})`}}>
      <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm opacity-80">
            {sensor.sensorId}
          </p>
          <p className="text-xl sm:text-2xl font-bold leading-tight">{sensor.value.toFixed(2)}</p>
          <p className="text-xs sm:text-sm opacity-80">{sensor.unit}</p>
        </div>
        <span className="text-2xl sm:text-3xl flex-shrink-0">{getIcon()}</span>
      </div>

      <div className="space-y-1 sm:space-y-2 text-xs opacity-80 flex-1">
        <div className="flex justify-between gap-1 flex-wrap">
          <span>Signal: {sensor.rssi}dBm</span>
          <span className="flex-shrink-0">Bat: {sensor.battery}%</span>
        </div>
        <div className="flex justify-between gap-1 flex-wrap">
          <span>Q: {sensor.quality}%</span>
          <span className="flex-shrink-0 whitespace-nowrap">{new Date(sensor.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {sensor.battery < 20 && (
        <div className="mt-2 sm:mt-3 p-1.5 sm:p-2 bg-red-500/30 rounded text-xs border border-red-400/50">
          ⚠️ Low battery
        </div>
      )}
    </div>
  )
}

const AlertBadge = ({ count, type }: { count: number; type: 'warning' | 'error' }) => {
  if (count === 0) return null
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
      type === 'error'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {type === 'error' ? '🚨' : '⚠️'} {count}
    </div>
  )
}

const SensorSummaryCard = ({ label, value, unit, icon }: { label: string; value: number; unit: string; icon: string }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4 h-full">
    <div className="flex justify-between items-start gap-1.5">
      <div className="flex justify-between items-start gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs sm:text-sm">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-white leading-tight">{value.toFixed(1)}</p>
        <p className="text-slate-500 text-xs">{unit}</p>
      </div>
      <span className="text-2xl sm:text-3xl flex-shrink-0">{icon}</span>
    </div>
  </div>
)

const SensorLocationMap = ({ sensors }: { sensors: SensorLocation[] }) => (
  <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 sm:p-6 min-h-56 sm:h-80">
    <p className="text-slate-400 text-sm mb-3 sm:mb-4">🗺️ Sensor Network Map</p>
    <div className="w-full h-full rounded-lg flex items-center justify-center border border-slate-700" style={{backgroundImage: 'linear-gradient(to bottom right, rgb(30, 41, 59), rgb(15, 23, 42))'}}>
      <div className="text-center px-4">
        <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🛰️</div>
        <p className="text-slate-400 text-sm sm:text-base">{sensors.length} sensors active</p>
        <p className="text-slate-600 text-xs sm:text-sm mt-2">Geographic distribution</p>
      </div>
    </div>
  </div>
)

const TimeSeriesChart = ({ title, data }: { title: string; data: number[] }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4">
    <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3 truncate">{title}</p>
    <div className="w-full h-24 sm:h-32 bg-slate-900 rounded flex items-end justify-around gap-0.5 sm:gap-1 p-2 border border-slate-700">
      {data.map((value, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-t-lg min-h-1 opacity-80"
          style={{ height: `${(value / Math.max(...data, 100)) * 100}%`, backgroundImage: 'linear-gradient(to top, rgb(59, 130, 246), rgb(96, 165, 250))' }}
          title={value.toFixed(1)}
        />
      ))}
    </div>
  </div>
)

export function SensorMonitoringDashboard({
  projectId,
  autoRefresh = true,
  refreshInterval = 5000,
  onAnomalyDetected,
}: SensorMonitoringDashboardProps) {
  const [reading, setReading] = useState<AggregatedSensorReading | null>(null)
  const [sensors, setSensors] = useState<SensorData[]>([])
  const [locations, setLocations] = useState<SensorLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSensorType, setSelectedSensorType] = useState<string | null>(null)
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([])
  const [humidityHistory, setHumidityHistory] = useState<number[]>([])

  const loadSensorData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const client = getMqttSensorClient()
      await client.connect()

      // Subscribe to sensor data
      await client.subscribe('sensors/+/data', () => {
        const aggregated = client.getAggregatedReadings()
        setReading(aggregated)

        // Update sensor list
        const sensorArray = Object.values(aggregated.sensors)
        setSensors(sensorArray)

        // Track anomalies
        const anomalies = sensorArray.filter(
          (s) => s.status === 'warning' || s.status === 'error'
        )
        if (anomalies.length > 0) {
          onAnomalyDetected?.(anomalies)
        }

        // Update history (keep last 20 readings)
        setTemperatureHistory((prev) => [
          ...prev.slice(-19),
          aggregated.summary.averageTemperature,
        ])
        setHumidityHistory((prev) => [
          ...prev.slice(-19),
          aggregated.summary.averageHumidity,
        ])
      })

      // Get sensor locations
      setLocations(client.getSensorLocations())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sensor data')
    } finally {
      setLoading(false)
    }
  }, [onAnomalyDetected])

  useEffect(() => {
    loadSensorData()

    if (autoRefresh) {
      const interval = setInterval(loadSensorData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [loadSensorData, autoRefresh, refreshInterval])

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin text-4xl">📡</div>
          <p className="text-slate-300">Connecting to sensor network...</p>
          <p className="text-slate-500 text-sm">Setting up MQTT stream</p>
        </div>
      </div>
    )
  }

  if (error || !reading) {
    return (
      <div className="bg-slate-900 rounded-lg border border-red-500/30 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-400 font-semibold">Connection Error</p>
        </div>
        <p className="text-slate-400 mb-4">{error || 'Failed to connect to sensors'}</p>
        <button
          onClick={loadSensorData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  const filteredSensors = selectedSensorType
    ? sensors.filter((s) => s.sensorType === selectedSensorType)
    : sensors

  const warnings = sensors.filter((s) => s.status === 'warning').length
  const errors = sensors.filter((s) => s.status === 'error').length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 sm:p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Sensor Network</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Real-time IoT monitoring</p>
            <p className="text-slate-500 text-xs sm:text-sm">
              {sensors.length} sensors • {locations.length} locations
            </p>
          </div>
          <div className="flex gap-2">
            <AlertBadge count={warnings} type="warning" />
            <AlertBadge count={errors} type="error" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <SensorSummaryCard
          label="Temperature"
          value={reading.summary.averageTemperature}
          unit="°C"
          icon="🌡️"
        />
        <SensorSummaryCard
          label="Humidity"
          value={reading.summary.averageHumidity}
          unit="%"
          icon="💧"
        />
        <SensorSummaryCard
          label="Soil Moisture"
          value={reading.summary.averageSoilMoisture}
          unit="%"
          icon="🌱"
        />
        <SensorSummaryCard
          label="CO₂ Level"
          value={reading.summary.averageCO2}
          unit="ppm"
          icon="🔬"
        />
      </div>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
        <TimeSeriesChart title="Temperature Trend" data={temperatureHistory} />
        <TimeSeriesChart title="Humidity Trend" data={humidityHistory} />
      </div>

      {/* Sensor Map */}
      <SensorLocationMap sensors={locations} />

      {/* Sensor Type Filter */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 sm:p-4">
        <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">Filter by Sensor Type</p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <button
            onClick={() => setSelectedSensorType(null)}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
              selectedSensorType === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            All ({sensors.length})
          </button>
          {['temperature', 'humidity', 'soilMoisture', 'co2', 'light', 'precipitation'].map((type) => {
            const count = sensors.filter((s) => s.sensorType === type).length
            if (count === 0) return null
            const typeLabel = type === 'soilMoisture' ? 'Soil' : type.charAt(0).toUpperCase() + type.slice(1)
            return (
              <button
                key={type}
                onClick={() => setSelectedSensorType(type)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                  selectedSensorType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {typeLabel} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Sensor Grid */}
      <div>
        <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">
          {filteredSensors.length} {selectedSensorType || 'active'} sensor(s)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filteredSensors.map((sensor) => (
            <SensorCard key={sensor.sensorId} sensor={sensor} />
          ))}
        </div>
      </div>

      {/* Status Footer */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-500 space-y-2">
        <p>
          Last updated: {new Date(reading.timestamp).toLocaleString()} • Auto-refresh: every{' '}
          {(refreshInterval / 1000).toFixed(0)}s
        </p>
        <p>
          Offline sensors: {reading.summary.offlineSensorCount} • Active alerts: {reading.summary.alertCount}
        </p>
      </div>
    </div>
  )
}
