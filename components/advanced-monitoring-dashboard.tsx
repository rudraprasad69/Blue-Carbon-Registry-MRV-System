'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertTriangle, 
  Activity, 
  Satellite, 
  Airplay,
  AlertCircle,
  TrendingUp,
  Droplets,
  Wind,
  Eye
} from 'lucide-react'

interface MonitoringData {
  projectId: string
  location: { lat: number; lng: number }
  timestamp: string
  satellite: {
    ndvi: number
    evi: number
    moisture: number
    temperature: number
    cloudCover: number
    lastUpdate: string
  }
  drone: {
    surveyStatus: 'idle' | 'scheduled' | 'in-progress' | 'completed'
    lastSurveyDate: string
    biomass: number
    resolution: number
  }
  iot: {
    activeDevices: number
    soilMoisture: number
    airTemperature: number
    humidity: number
    sensorHealth: number
  }
  water: {
    ph: number
    dissolvedOxygen: number
    turbidity: number
    salinity: number
  }
  anomalies: {
    count: number
    severity: 'low' | 'medium' | 'high' | 'critical'
    types: string[]
    lastDetected: string
  }
}

export function AdvancedMonitoringDashboard({ projectId }: { projectId: string }) {
  const [monitoring, setMonitoring] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'satellite' | 'drone' | 'iot' | 'water'>('satellite')

  const fetchMonitoringData = useCallback(async () => {
    try {
      setRefreshing(true)
      const response = await fetch(`/api/monitoring/data/${projectId}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        const data = await response.json()
        setMonitoring(data)
      }
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchMonitoringData()
    const interval = setInterval(fetchMonitoringData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetchMonitoringData])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-500">Loading monitoring data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!monitoring) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-red-500">Failed to load monitoring data</p>
        </CardContent>
      </Card>
    )
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  const getHealthStatus = (value: number) => {
    if (value >= 80) return { color: 'text-green-600', label: 'Excellent' }
    if (value >= 60) return { color: 'text-blue-600', label: 'Good' }
    if (value >= 40) return { color: 'text-yellow-600', label: 'Fair' }
    return { color: 'text-red-600', label: 'Poor' }
  }

  const satelliteHealth = getHealthStatus(((1 + monitoring.satellite.ndvi) / 2) * 100)
  const sensorHealth = getHealthStatus(monitoring.iot.sensorHealth)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Monitoring</h2>
          <p className="text-sm text-gray-500">Real-time environmental monitoring data</p>
        </div>
        <Button
          onClick={fetchMonitoringData}
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Anomalies Alert */}
      {monitoring.anomalies.count > 0 && (
        <Card className={`border-l-4 ${monitoring.anomalies.severity === 'critical' ? 'border-l-red-500 bg-red-50' : monitoring.anomalies.severity === 'high' ? 'border-l-orange-500 bg-orange-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${monitoring.anomalies.severity === 'critical' ? 'text-red-600' : monitoring.anomalies.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'}`} />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  {monitoring.anomalies.count} Anomal{monitoring.anomalies.count > 1 ? 'ies' : 'y'} Detected
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Types: {monitoring.anomalies.types.join(', ')}
                </p>
                <p className="text-xs text-gray-600">
                  Last detected: {new Date(monitoring.anomalies.lastDetected).toLocaleString()}
                </p>
              </div>
              <Badge className={getSeverityColor(monitoring.anomalies.severity)}>
                {monitoring.anomalies.severity}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monitoring Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setActiveTab('satellite')}
          className={`p-3 rounded-lg border-2 transition-all ${activeTab === 'satellite' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <Satellite className="w-5 h-5 mb-1 mx-auto text-blue-600" />
          <p className="text-xs font-medium">Satellite</p>
        </button>
        <button
          onClick={() => setActiveTab('drone')}
          className={`p-3 rounded-lg border-2 transition-all ${activeTab === 'drone' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <Airplay className="w-5 h-5 mb-1 mx-auto text-purple-600" />
          <p className="text-xs font-medium">Drone</p>
        </button>
        <button
          onClick={() => setActiveTab('iot')}
          className={`p-3 rounded-lg border-2 transition-all ${activeTab === 'iot' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <Activity className="w-5 h-5 mb-1 mx-auto text-green-600" />
          <p className="text-xs font-medium">IoT Sensors</p>
        </button>
        <button
          onClick={() => setActiveTab('water')}
          className={`p-3 rounded-lg border-2 transition-all ${activeTab === 'water' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <Droplets className="w-5 h-5 mb-1 mx-auto text-cyan-600" />
          <p className="text-xs font-medium">Water Quality</p>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'satellite' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Satellite className="w-5 h-5 text-blue-600" />
                Satellite Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">NDVI</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {monitoring.satellite.ndvi.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Vegetation Index</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">EVI</p>
                  <p className="text-2xl font-bold text-green-600">
                    {monitoring.satellite.evi.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Enhanced Vegetation</p>
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Moisture</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {monitoring.satellite.moisture.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Soil Moisture</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Temperature</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {monitoring.satellite.temperature.toFixed(1)}°C
                  </p>
                  <p className="text-xs text-gray-500">Land Surface</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cloud Cover</span>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-lg font-semibold">
                      {(100 - monitoring.satellite.cloudCover).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {new Date(monitoring.satellite.lastUpdate).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Vegetation Health Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Vegetation Status</span>
                    <span className={`text-sm font-semibold ${satelliteHealth.color}`}>
                      {satelliteHealth.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        satelliteHealth.label === 'Excellent' ? 'bg-green-600' :
                        satelliteHealth.label === 'Good' ? 'bg-blue-600' :
                        satelliteHealth.label === 'Fair' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${((1 + monitoring.satellite.ndvi) / 2) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Trend</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Healthy vegetation growth detected</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Recommendations</p>
                  <ul className="text-xs space-y-1 text-gray-700">
                    <li>• Optimal moisture levels maintained</li>
                    <li>• Temperature within normal range</li>
                    <li>• Low cloud cover ensures clear monitoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'drone' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Airplay className="w-5 h-5 text-purple-600" />
              Drone Survey Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Survey Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    monitoring.drone.surveyStatus === 'completed' ? 'bg-green-600' :
                    monitoring.drone.surveyStatus === 'in-progress' ? 'bg-blue-600' :
                    monitoring.drone.surveyStatus === 'scheduled' ? 'bg-yellow-600' :
                    'bg-gray-400'
                  }`} />
                  <p className="font-semibold capitalize">{monitoring.drone.surveyStatus}</p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Biomass Estimate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {monitoring.drone.biomass.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">t/ha</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Resolution</p>
                <p className="text-2xl font-bold text-purple-600">
                  {monitoring.drone.resolution}
                </p>
                <p className="text-xs text-gray-500">cm</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Last Survey Date</p>
              <p className="font-semibold">
                {new Date(monitoring.drone.lastSurveyDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="mt-3 space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Schedule New Survey
                </Button>
                <Button className="w-full" variant="outline">
                  View LiDAR Point Cloud
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'iot' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Sensor Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Active Devices</p>
                  <p className="text-2xl font-bold text-green-600">
                    {monitoring.iot.activeDevices}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${sensorHealth.label === 'Excellent' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <p className="text-xs text-gray-600 mb-1">Health</p>
                  <p className={`text-2xl font-bold ${sensorHealth.color}`}>
                    {monitoring.iot.sensorHealth}%
                  </p>
                </div>
              </div>
              <div className="border-t pt-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Add New Sensor
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Readings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Soil Moisture</span>
                <span className="font-semibold text-gray-900">
                  {monitoring.iot.soilMoisture.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Air Temperature</span>
                <span className="font-semibold text-gray-900">
                  {monitoring.iot.airTemperature.toFixed(1)}°C
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Humidity</span>
                <span className="font-semibold text-gray-900">
                  {monitoring.iot.humidity.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'water' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-600" />
              Water Quality Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyan-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">pH Level</p>
                <p className="text-2xl font-bold text-cyan-600">{monitoring.water.ph.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {monitoring.water.ph < 7 ? 'Acidic' : monitoring.water.ph > 7 ? 'Alkaline' : 'Neutral'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Dissolved Oxygen</p>
                <p className="text-2xl font-bold text-blue-600">
                  {monitoring.water.dissolvedOxygen.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">mg/L</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Turbidity</p>
                <p className="text-2xl font-bold text-amber-600">
                  {monitoring.water.turbidity.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">NTU</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Salinity</p>
                <p className="text-2xl font-bold text-teal-600">
                  {monitoring.water.salinity.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">PSU</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Water Quality Status</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Water parameters are within acceptable ranges for project monitoring.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdvancedMonitoringDashboard
