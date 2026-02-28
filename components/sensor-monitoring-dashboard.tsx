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
import { useWebSocket } from '@/hooks/useWebSocket'
import {
  type SensorData,
  type SensorLocation,
} from '@/lib/mqtt-sensor-service'

interface SensorMonitoringDashboardProps {
  projectId: string
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
  onAnomalyDetected,
}: SensorMonitoringDashboardProps) {
  const [sensors, setSensors] = useState<SensorData[]>([])
  const [locations, setLocations] = useState<SensorLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSensorType, setSelectedSensorType] = useState<string | null>(null)
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([])
  const [humidityHistory, setHumidityHistory] = useState<number[]>([])
  const ws = useWebSocket({ autoConnect: true });

  useEffect(() => {
    if (ws.isConnected) {
      ws.subscribe(['sensor_data']);
      setLoading(false);
    }
  }, [ws.isConnected, ws.subscribe]);

  useEffect(() => {
    const unsubscribe = ws.onMessage((msg) => {
      if (msg.type === 'sensor_data') {
        const newSensorData = msg.data as SensorData;
        setSensors(prevSensors => {
            const index = prevSensors.findIndex(s => s.sensorId === newSensorData.sensorId);
            if (index > -1) {
                const newSensors = [...prevSensors];
                newSensors[index] = newSensorData;
                return newSensors;
            }
            return [...prevSensors, newSensorData];
        });
      }
    });
    return unsubscribe;
  }, [ws.onMessage]);

  const filteredSensors = selectedSensorType
    ? sensors.filter((s) => s.sensorType === selectedSensorType)
    : sensors;

  const warnings = sensors.filter((s) => s.status === 'warning').length
  const errors = sensors.filter((s) => s.status === 'error').length

  const summary = {
    averageTemperature: sensors.filter(s => s.sensorType === 'temperature').reduce((acc, s) => acc + s.value, 0) / (sensors.filter(s => s.sensorType === 'temperature').length || 1),
    averageHumidity: sensors.filter(s => s.sensorType === 'humidity').reduce((acc, s) => acc + s.value, 0) / (sensors.filter(s => s.sensorType === 'humidity').length || 1),
    averageSoilMoisture: sensors.filter(s => s.sensorType === 'soilMoisture').reduce((acc, s) => acc + s.value, 0) / (sensors.filter(s => s.sensorType === 'soilMoisture').length || 1),
    averageCO2: sensors.filter(s => s.sensorType === 'co2').reduce((acc, s) => acc + s.value, 0) / (sensors.filter(s => s.sensorType === 'co2').length || 1),
    offlineSensorCount: sensors.filter(s => s.battery < 10).length,
    alertCount: warnings + errors,
  };


  if (loading) {
    return (
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-3xl sm:text-4xl">📡</div>
          <p className="text-slate-300 text-sm sm:text-base text-center">Connecting to sensor network...</p>
          <p className="text-slate-500 text-xs sm:text-sm text-center">Establishing WebSocket connection</p>
        </div>
      </div>
    )
  }
  
    if (error) {
    return (
      <div className="bg-slate-900 rounded-lg border border-red-500/30 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-400 font-semibold">Connection Error</p>
        </div>
        <p className="text-slate-400 mb-4">{error}</p>
      </div>
    )
  }

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
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap text-slate-300">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-slate-500" />
                <span className="hidden sm:inline">{ws.isConnected ? 'Live' : 'Disconnected'}</span>
                <span className="sm:hidden">{ws.isConnected ? 'On' : 'Off'}</span>
            </div>
            <AlertBadge count={warnings} type="warning" />
            <AlertBadge count={errors} type="error" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <SensorSummaryCard
          label="Temperature"
          value={summary.averageTemperature}
          unit="°C"
          icon="🌡️"
        />
        <SensorSummaryCard
          label="Humidity"
          value={summary.averageHumidity}
          unit="%"
          icon="💧"
        />
        <SensorSummaryCard
          label="Soil Moisture"
          value={summary.averageSoilMoisture}
          unit="%"
          icon="🌱"
        />
        <SensorSummaryCard
          label="CO₂ Level"
          value={summary.averageCO2}
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
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-slate-500 space-y-1.5 sm:space-y-2">
        <p className="break-words">
          Last updated: {new Date().toLocaleString()}
        </p>
        <p className="flex flex-col sm:flex-row gap-1 sm:gap-3">
          <span>Offline: {summary.offlineSensorCount}</span>
          <span className="hidden sm:inline">•</span>
          <span>Alerts: {summary.alertCount}</span>
        </p>
      </div>
    </div>
  )
}
