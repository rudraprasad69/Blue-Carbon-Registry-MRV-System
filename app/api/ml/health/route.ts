import { NextRequest, NextResponse } from 'next/server'
import { getMLEngine } from '@/lib/ml-models-engine'

/**
 * POST /api/ml/assess-health
 * Assess vegetation health and forecast trends
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      ndvi,
      evi,
      moisture,
      temperature,
      historicalValues = [],
      projectId
    } = body

    // Validate inputs
    if (ndvi === undefined || evi === undefined || moisture === undefined || temperature === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: ndvi, evi, moisture, temperature' },
        { status: 400 }
      )
    }

    const mlEngine = getMLEngine()

    // Assess vegetation health
    const healthAssessment = await mlEngine.assessVegetationHealth({
      ndvi,
      evi,
      moisture,
      temperature
    })

    // Forecast trend if historical data provided
    let trendForecast = null
    if (historicalValues.length >= 3) {
      trendForecast = mlEngine.forecastTrend(historicalValues, 12)
    }

    return NextResponse.json({
      success: true,
      projectId,
      healthAssessment: {
        healthIndex: healthAssessment.healthIndex,
        condition: healthAssessment.condition,
        factors: {
          vegetation: {
            ndvi: Math.round(healthAssessment.factors.ndvi),
            evi: Math.round(healthAssessment.factors.evi),
            description: getVegetationDescription(healthAssessment.factors.ndvi)
          },
          soilMoisture: {
            score: Math.round(healthAssessment.factors.moisture),
            status: getMoistureStatus(healthAssessment.factors.moisture)
          },
          temperature: {
            score: Math.round(healthAssessment.factors.temperature),
            status: getTemperatureStatus(temperature)
          }
        }
      },
      trend: trendForecast ? {
        direction: trendForecast.trend,
        slope: trendForecast.slope,
        forecast: trendForecast.forecast.map(f => ({
          date: new Date(f.timestamp).toLocaleDateString(),
          estimatedValue: f.value
        }))
      } : null,
      recommendations: getHealthRecommendations(
        healthAssessment.condition,
        healthAssessment.factors
      ),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to assess vegetation health: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ml/assess-health
 * Get health assessment model information
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    description: 'Vegetation health assessment and trend forecasting service',
    methods: [
      'Multi-factor health scoring',
      'Vegetation index analysis',
      'Moisture and temperature assessment',
      'Linear trend forecasting'
    ],
    inputSchema: {
      ndvi: {
        type: 'number',
        description: 'Normalized Difference Vegetation Index (0-1)',
        required: true
      },
      evi: {
        type: 'number',
        description: 'Enhanced Vegetation Index (0-1)',
        required: true
      },
      moisture: {
        type: 'number',
        description: 'Soil moisture percentage (0-100)',
        required: true
      },
      temperature: {
        type: 'number',
        description: 'Temperature in Celsius',
        required: true
      },
      historicalValues: {
        type: 'array',
        description: 'Historical health scores for trend analysis (minimum 3)',
        required: false,
        minLength: 3
      },
      projectId: {
        type: 'string',
        description: 'Project identifier',
        required: false
      }
    },
    healthConditions: {
      excellent: 'Optimal vegetation health (80-100)',
      good: 'Good vegetation health (60-79)',
      fair: 'Moderate vegetation health (40-59)',
      poor: 'Poor vegetation health (20-39)',
      critical: 'Critical condition (0-19)'
    },
    example: {
      ndvi: 0.7,
      evi: 0.6,
      moisture: 65,
      temperature: 22,
      historicalValues: [72, 73, 71, 74, 72, 75],
      projectId: 'project_001'
    }
  })
}

/**
 * Helper functions
 */

function getVegetationDescription(score: number): string {
  if (score >= 80) return 'Lush vegetation with excellent canopy coverage'
  if (score >= 60) return 'Good vegetation density'
  if (score >= 40) return 'Moderate vegetation with some sparse areas'
  if (score >= 20) return 'Sparse vegetation, recovery potential needed'
  return 'Severely degraded, urgent restoration required'
}

function getMoistureStatus(score: number): string {
  if (score >= 70) return 'Optimal soil moisture'
  if (score >= 50) return 'Good moisture levels'
  if (score >= 30) return 'Suboptimal, monitoring needed'
  return 'Stress regime, intervention needed'
}

function getTemperatureStatus(temp: number): string {
  if (temp >= 15 && temp <= 25) return 'Optimal growing conditions'
  if (temp >= 10 && temp <= 30) return 'Acceptable conditions'
  if (temp >= 5 || temp <= 35) return 'Stress conditions'
  return 'Critical stress regime'
}

function getHealthRecommendations(
  condition: string,
  factors: Record<string, number>
): string[] {
  const recommendations: string[] = []

  if (condition === 'critical' || condition === 'poor') {
    recommendations.push('URGENT: Initiate restoration intervention program')
    recommendations.push('Increase monitoring frequency (weekly)')
  } else if (condition === 'fair') {
    recommendations.push('Enhance water management practices')
    recommendations.push('Increase monitoring frequency (bi-weekly)')
  } else {
    recommendations.push('Continue current management practices')
    recommendations.push('Maintain regular monitoring schedule (monthly)')
  }

  if (factors.moisture < 50) {
    recommendations.push('Improve irrigation or water management')
    recommendations.push('Consider mulching to retain soil moisture')
  }

  if (factors.ndvi < 60) {
    recommendations.push('Assess fertilizer requirements')
    recommendations.push('Check for pest or disease issues')
  }

  if (factors.temperature < 50) {
    recommendations.push('Verify temperature measurement accuracy')
    recommendations.push('Check for unexpected cold weather events')
  }

  recommendations.push('Continue satellite and ground-based monitoring')
  recommendations.push('Document all management interventions')

  return recommendations
}
