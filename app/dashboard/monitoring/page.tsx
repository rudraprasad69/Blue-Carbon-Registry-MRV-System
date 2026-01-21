'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AdvancedMonitoringDashboard from '@/components/advanced-monitoring-dashboard'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'
import {
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

// Sample data for charts
const VEGETATION_TRENDS = [
  { date: 'Jan 1', ndvi: 0.65, evi: 0.48, moisture: 55 },
  { date: 'Jan 5', ndvi: 0.68, evi: 0.50, moisture: 58 },
  { date: 'Jan 10', ndvi: 0.70, evi: 0.52, moisture: 62 },
  { date: 'Jan 15', ndvi: 0.72, evi: 0.55, moisture: 65 },
  { date: 'Jan 20', ndvi: 0.74, evi: 0.57, moisture: 68 },
  { date: 'Jan 21', ndvi: 0.72, evi: 0.55, moisture: 65 }
]

const BIOMASS_ESTIMATES = [
  { source: 'Satellite', value: 180, confidence: 85 },
  { source: 'Drone (LiDAR)', value: 195, confidence: 92 },
  { source: 'SAR', value: 175, confidence: 78 },
  { source: 'Ensemble', value: 185, confidence: 91 }
]

const CARBON_SEQUESTRATION = [
  { month: 'Jan', accumulated: 12, rate: 0.4 },
  { month: 'Feb', accumulated: 24, rate: 0.4 },
  { month: 'Mar', accumulated: 38, rate: 0.47 },
  { month: 'Apr', accumulated: 54, rate: 0.53 },
  { month: 'May', accumulated: 72, rate: 0.6 },
  { month: 'Jun', accumulated: 92, rate: 0.67 }
]

export default function MonitoringPage() {
  const [selectedProject] = useState('project-001')
  const [timeRange, setTimeRange] = useState('30days')
  const [isExporting, setIsExporting] = useState(false)

  const handleExportReport = async () => {
    setIsExporting(true)
    try {
      // In a real app, this would generate a PDF/Excel report
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Report exported successfully!')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Advanced Environmental Monitoring
            </h1>
            <p className="text-gray-600">
              Real-time satellite, drone, and IoT sensor data integration
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportReport}
              disabled={isExporting}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 mb-2">Vegetation Health</div>
              <div className="text-3xl font-bold text-green-600 mb-1">78%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                +2.5% this week
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 mb-2">Biomass Estimate</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">185.3 t/ha</div>
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <TrendingUp className="w-3 h-3" />
                +4.2 t/ha this month
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 mb-2">Carbon Sequestered</div>
              <div className="text-3xl font-bold text-cyan-600 mb-1">72 tCO₂e</div>
              <div className="flex items-center gap-1 text-xs text-cyan-600">
                <TrendingUp className="w-3 h-3" />
                +2.1 tCO₂e/month
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 mb-2">Data Quality</div>
              <div className="text-3xl font-bold text-purple-600 mb-1">94%</div>
              <div className="text-xs text-gray-600 mt-1">
                8/8 sensors operational
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Monitoring Dashboard */}
        <AdvancedMonitoringDashboard projectId={selectedProject} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vegetation Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Vegetation Indices Trend</span>
                <Badge variant="outline">30 days</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={VEGETATION_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ndvi" stroke="#10b981" name="NDVI" />
                  <Line type="monotone" dataKey="evi" stroke="#06b6d4" name="EVI" />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="#f59e0b"
                    name="Soil Moisture (%)"
                    yAxisId="right"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Biomass Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Biomass Estimates Comparison</span>
                <Badge variant="outline">Multi-source</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={BIOMASS_ESTIMATES}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Biomass (t/ha)" />
                  <Bar dataKey="confidence" fill="#10b981" name="Confidence (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Carbon Sequestration Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Carbon Sequestration Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={CARBON_SEQUESTRATION}>
                <defs>
                  <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="accumulated"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorAccumulated)"
                  name="Accumulated (tCO₂e)"
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorRate)"
                  name="Monthly Rate (tCO₂e)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-medium text-sm text-yellow-900">Sensor Drift Detected</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Temperature sensor in Region B showing calibration drift
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-sm text-blue-900">Cloud Coverage</p>
                <p className="text-xs text-blue-700 mt-1">
                  95% clear views this week - optimal satellite data quality
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-sm text-gray-700">
                  Schedule drone survey within 2 weeks for high-resolution validation
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-sm text-gray-700">
                  Calibrate soil moisture sensors in Region B
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-sm text-gray-700">
                  Continue satellite monitoring - trends are positive
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Last Update</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Data Sources</p>
                <p className="font-semibold text-gray-900">Satellite + Drone + IoT</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Coverage Area</p>
                <p className="font-semibold text-gray-900">2,500 hectares</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Monitoring Stations</p>
                <p className="font-semibold text-gray-900">8 Active Sensors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
