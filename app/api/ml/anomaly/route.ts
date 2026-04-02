import { NextRequest, NextResponse } from 'next/server'
import { getMLEngine } from '@/lib/ml-models-engine'

/**
 * POST /api/ml/detect-anomaly
 * Detect anomalies in sensor data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      value,
      sensorId,
      sensorType,
      historicalValues = [],
      expectedMin,
      expectedMax
    } = body

    // Validate inputs
    if (value === undefined) {
      return NextResponse.json(
        { error: 'Missing required field: value' },
        { status: 400 }
      )
    }

    if (!sensorId || !sensorType) {
      return NextResponse.json(
        { error: 'Missing required fields: sensorId, sensorType' },
        { status: 400 }
      )
    }

    if (historicalValues.length === 0) {
      return NextResponse.json(
        { error: 'Anomaly detection requires historical values (minimum 3 readings)' },
        { status: 400 }
      )
    }

    const mlEngine = getMLEngine()

    // Detect anomaly
    const result = await mlEngine.detectAnomaly({
      value,
      timestamp: new Date().toISOString(),
      sensorId,
      sensorType,
      historicalValues,
      expectedRange: {
        min: expectedMin !== undefined ? expectedMin : Math.min(...historicalValues),
        max: expectedMax !== undefined ? expectedMax : Math.max(...historicalValues)
      }
    })

    // Calculate statistics for context
    const sorted = [...historicalValues].sort((a, b) => a - b)
    const mean = historicalValues.reduce((a, b) => a + b) / historicalValues.length
    const variance = historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalValues.length
    const stdDev = Math.sqrt(variance)

    return NextResponse.json({
      success: true,
      anomaly: {
        isAnomaly: result.isAnomaly,
        severity: result.severity,
        anomalyScore: Math.round(result.anomalyScore * 10000) / 100 + '%',
        explanation: result.explanation,
        timestamp: result.timestamp
      },
      context: {
        currentValue: value,
        historicalMean: Math.round(mean * 100) / 100,
        historicalStdDev: Math.round(stdDev * 100) / 100,
        historicalCount: historicalValues.length,
        percentageDeviation: Math.round(((value - mean) / mean) * 10000) / 100 + '%'
      },
      recommendation: result.isAnomaly ? {
        action: result.severity === 'critical' ? 'IMMEDIATE_INVESTIGATION' : 'MONITOR',
        priority: result.severity === 'critical' ? 'high' : 'normal',
        suggestedSteps: getSuggestedSteps(result.severity, sensorType)
      } : null
    })
  } catch (error) {
    console.error('Anomaly detection error:', error)
    return NextResponse.json(
      { error: 'Failed to detect anomaly: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ml/detect-anomaly
 * Get model information
 */
export async function GET(request: NextRequest) {
  try {
    const mlEngine = getMLEngine()
    const metadata = mlEngine.getModelMetadata('anomalyDetection')

    return NextResponse.json({
      success: true,
      model: metadata,
      description: 'Multi-method anomaly detection using statistical analysis and outlier detection',
      methods: [
        'Z-score analysis',
        'Interquartile Range (IQR)',
        'Expected range validation',
        'Composite scoring'
      ],
      inputSchema: {
        value: {
          type: 'number',
          description: 'Current sensor reading',
          required: true
        },
        sensorId: {
          type: 'string',
          description: 'Unique sensor identifier',
          required: true
        },
        sensorType: {
          type: 'string',
          description: 'Type of sensor (water_quality, temperature, salinity, etc)',
          required: true,
          enum: ['water_quality', 'temperature', 'salinity', 'dissolved_oxygen', 'co2_flux']
        },
        historicalValues: {
          type: 'array',
          description: 'Historical values for comparison (minimum 3 values)',
          required: true,
          minLength: 3
        },
        expectedMin: {
          type: 'number',
          description: 'Expected minimum value (optional)',
          required: false
        },
        expectedMax: {
          type: 'number',
          description: 'Expected maximum value (optional)',
          required: false
        }
      },
      severityLevels: {
        none: 'No anomaly detected',
        low: 'Minor deviation, continuous monitoring recommended',
        medium: 'Moderate anomaly detected, investigation suggested',
        high: 'Significant anomaly, prompt investigation required',
        critical: 'Critical anomaly, immediate action required'
      },
      example: {
        value: 45.5,
        sensorId: 'sensor_001',
        sensorType: 'temperature',
        historicalValues: [20, 21, 22, 21, 20, 22, 21, 20],
        expectedMin: 15,
        expectedMax: 25
      }
    })
  } catch (error) {
    console.error('Model info error:', error)
    return NextResponse.json(
      { error: 'Failed to get model information' },
      { status: 500 }
    )
  }
}

/**
 * Generate suggested steps based on anomaly severity and sensor type
 */
function getSuggestedSteps(severity: string, sensorType: string): string[] {
  const baseSteps = [
    'Verify sensor calibration',
    'Check data transmission quality',
    'Review environmental conditions',
    'Confirm data entry accuracy'
  ]

  const sensorSpecificSteps: Record<string, string[]> = {
    water_quality: [
      'Check water source status',
      'Verify filtration system operation',
      'Test for contamination'
    ],
    temperature: [
      'Check thermometer accuracy',
      'Verify ambient temperature',
      'Look for sun exposure changes'
    ],
    salinity: [
      'Check salt content levels',
      'Verify water mixing',
      'Test for water source change'
    ],
    dissolved_oxygen: [
      'Check aerator operation',
      'Verify water circulation',
      'Test for algal bloom'
    ],
    co2_flux: [
      'Verify sensor stability',
      'Check for equipment malfunction',
      'Review environmental changes'
    ]
  }

  let steps = [...baseSteps]

  if (sensorType in sensorSpecificSteps) {
    steps = [...steps, ...sensorSpecificSteps[sensorType]]
  }

  if (severity === 'critical') {
    steps.unshift('ALERT: Contact system administrator immediately')
    steps.push('Prepare incident report with full context')
  } else if (severity === 'high') {
    steps.unshift('Schedule urgent maintenance inspection')
  } else if (severity === 'medium') {
    steps.push('Schedule routine maintenance within 24 hours')
  }

  return steps
}
