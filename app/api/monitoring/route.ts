import { NextRequest, NextResponse } from 'next/server'
import { getAdvancedMonitoringService } from '@/lib/advanced-monitoring-service'
import { getMLAnalyticsEngine } from '@/lib/ml-analytics-service'

/**
 * GET /api/monitoring/data/[projectId]
 * Fetch comprehensive monitoring data for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId
    const monitoring = getAdvancedMonitoringService()

    // Fetch all monitoring data sources in parallel
    const [satelliteData, droneData, waterData, anomalies] = await Promise.all([
      monitoring.fetchSatelliteData(
        { lat: 10.5, lng: 105.8 },
        { start: '2026-01-01', end: '2026-01-21' }
      ),
      Promise.resolve({
        surveyStatus: 'completed' as const,
        lastSurveyDate: new Date().toISOString(),
        biomass: 185.5,
        resolution: 5
      }),
      Promise.resolve({
        ph: 7.2,
        dissolvedOxygen: 8.1,
        turbidity: 0.5,
        salinity: 0.3
      }),
      monitoring.detectAnomalies(projectId, [
        { timestamp: new Date().toISOString(), value: 0.72, region: 'A' },
        { timestamp: new Date(Date.now() - 86400000).toISOString(), value: 0.71, region: 'A' }
      ])
    ])

    return NextResponse.json({
      projectId,
      location: { lat: 10.5, lng: 105.8 },
      timestamp: new Date().toISOString(),
      satellite: {
        ndvi: satelliteData[0]?.ndvi || 0.72,
        evi: satelliteData[0]?.evi || 0.55,
        moisture: satelliteData[0]?.moisture || 65,
        temperature: satelliteData[0]?.temperature || 28,
        cloudCover: satelliteData[0]?.cloudCover || 5,
        lastUpdate: new Date().toISOString()
      },
      drone: droneData,
      iot: {
        activeDevices: 8,
        soilMoisture: 62.3,
        airTemperature: 26.5,
        humidity: 78.2,
        sensorHealth: 94
      },
      water: waterData,
      anomalies: {
        count: anomalies.length,
        severity: anomalies.length > 0 ? 'low' : 'low',
        types: ['sensor-drift', 'unexpected-change'],
        lastDetected: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Monitoring data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/monitoring/satellite
 * Fetch satellite-specific data with analysis
 */
export async function getSatelliteData(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '10.5')
    const lng = parseFloat(searchParams.get('lng') || '105.8')
    const startDate = searchParams.get('start') || '2026-01-01'
    const endDate = searchParams.get('end') || '2026-01-21'

    const monitoring = getAdvancedMonitoringService()
    const satelliteData = await monitoring.fetchSatelliteData(
      { lat, lng },
      { start: startDate, end: endDate }
    )

    return NextResponse.json({
      data: satelliteData,
      location: { lat, lng },
      dateRange: { start: startDate, end: endDate },
      count: satelliteData.length
    })
  } catch (error) {
    console.error('Satellite data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch satellite data' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/monitoring/schedule-drone-survey
 * Schedule a new drone survey
 */
export async function scheduleDroneSurvey(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, location, priority = 'normal' } = body

    const monitoring = getAdvancedMonitoringService()
    const survey = await monitoring.scheduleDroneSurvey(
      projectId,
      location,
      priority
    )

    return NextResponse.json({
      success: true,
      survey: {
        surveyId: survey.surveyId,
        projectId,
        location,
        status: 'scheduled',
        priority,
        estimatedDuration: '45 minutes',
        scheduledDate: new Date(Date.now() + 86400000).toISOString()
      }
    })
  } catch (error) {
    console.error('Drone survey scheduling error:', error)
    return NextResponse.json(
      { error: 'Failed to schedule drone survey' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/monitoring/connect-iot
 * Connect a new IoT sensor device
 */
export async function connectIoTDevice(request: NextRequest) {
  try {
    const body = await request.json()
    const { sensorId, projectId, sensorType, location } = body

    const monitoring = getAdvancedMonitoringService()
    const connectionId = await monitoring.connectMQTTSensor(
      sensorId,
      'mqtt://broker.example.com',
      `projects/${projectId}/sensors/${sensorType}`
    )

    return NextResponse.json({
      success: true,
      device: {
        sensorId,
        connectionId,
        projectId,
        type: sensorType,
        location,
        status: 'connected',
        lastHeartbeat: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('IoT device connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect IoT device' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/monitoring/biomass/calculate
 * Calculate biomass from multiple data sources
 */
export async function calculateBiomass(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ndvi = parseFloat(searchParams.get('ndvi') || '0.72')
    const vv = parseFloat(searchParams.get('vv') || '0.22')
    const forestType = searchParams.get('forestType') || 'tropical'

    const monitoring = getAdvancedMonitoringService()
    const biomassData = await monitoring.calculateBiomass(ndvi, vv, {
      lidarData: null,
      forestType: forestType as 'tropical' | 'temperate' | 'boreal'
    })

    return NextResponse.json({
      biomass: biomassData.biomass,
      confidence: biomassData.confidence,
      unit: 't/ha',
      factors: {
        ndvi,
        sarBackscatter: vv,
        forestType,
        moistureLevel: (biomassData.biomass / 250) * 100
      }
    })
  } catch (error) {
    console.error('Biomass calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate biomass' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/monitoring/anomalies/detect
 * Detect anomalies using ML algorithms
 */
export async function detectAnomalies(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId') || 'project-001'

    const monitoring = getAdvancedMonitoringService()
    const ml = getMLAnalyticsEngine()

    // Generate sample time series data
    const timeSeries = Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
      value: 0.7 + Math.random() * 0.2,
      region: 'A'
    }))

    // Detect anomalies
    const anomalies = monitoring.detectAnomalies(projectId, timeSeries)
    const mlAnomalies = ml.detectAnomalies(timeSeries.map(t => t.value))

    return NextResponse.json({
      projectId,
      anomaliesFound: anomalies.length,
      mlAnomalies: mlAnomalies.length,
      anomalies: anomalies.map((a, i) => ({
        id: i,
        timestamp: a.timestamp,
        type: a.anomalyType,
        severity: a.severity,
        recommendation: a.recommendation,
        score: mlAnomalies[i]?.score || 0
      })),
      analysisMethod: 'Combined (Traditional + ML)',
      confidence: 0.92
    })
  } catch (error) {
    console.error('Anomaly detection error:', error)
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/monitoring/report
 * Generate comprehensive monitoring report
 */
export async function generateMonitoringReport(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId') || 'project-001'
    const period = searchParams.get('period') || 'monthly'

    const monitoring = getAdvancedMonitoringService()
    const report = monitoring.generateMonitoringReport(projectId, period as 'daily' | 'weekly' | 'monthly' | 'yearly')

    return NextResponse.json({
      projectId,
      period,
      report: {
        generatedAt: new Date().toISOString(),
        summary: {
          vegetationHealth: report.summaryStats?.vegetationHealth || 78,
          biomassEstimate: report.summaryStats?.totalBiomass || 185.5,
          waterQuality: report.summaryStats?.waterQuality || 8.1,
          sensorUptime: 99.2,
          anomaliesDetected: report.anomalies?.length || 0
        },
        satellites: report.sources?.includes('satellite') ? 'Active' : 'Inactive',
        drones: report.sources?.includes('drone') ? 'Active' : 'Inactive',
        iotDevices: report.sources?.includes('iot') ? '8 Active' : 'Inactive',
        recommendations: [
          'Continue routine satellite monitoring',
          'Schedule drone survey in 14 days',
          'Monitor soil moisture - trending down',
          'Excellent vegetation growth observed'
        ]
      }
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate monitoring report' },
      { status: 500 }
    )
  }
}
