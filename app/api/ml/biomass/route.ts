import { NextRequest, NextResponse } from 'next/server'
import { getMLEngine } from '@/lib/ml-models-engine'

/**
 * POST /api/ml/predict-biomass
 * Predict carbon sequestration biomass from satellite/sensor data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      ndvi,
      evi,
      lai,
      temperature,
      precipitation,
      soilMoisture,
      slope,
      elevation,
      projectId,
      areaHectares = 1
    } = body

    // Validate inputs
    if (ndvi === undefined || evi === undefined || lai === undefined) {
      return NextResponse.json(
        { error: 'Missing required vegetation indices (NDVI, EVI, LAI)' },
        { status: 400 }
      )
    }

    if (temperature === undefined || precipitation === undefined) {
      return NextResponse.json(
        { error: 'Missing required climate data (temperature, precipitation)' },
        { status: 400 }
      )
    }

    const mlEngine = getMLEngine()

    // Perform biomass prediction
    const prediction = await mlEngine.predictBiomass({
      ndvi,
      evi,
      lai,
      temperature,
      precipitation,
      soilMoisture: soilMoisture || 50,
      slope: slope || 0,
      elevation: elevation || 0
    })

    // Scale by area if provided
    const totalBiomass = prediction.prediction * areaHectares
    const totalCarbon = totalBiomass * 0.47 // Carbon is ~47% of dry biomass

    return NextResponse.json({
      success: true,
      projectId,
      prediction: {
        biomassPerHectare: prediction.prediction,
        totalBiomass: Math.round(totalBiomass * 100) / 100,
        carbonSequestered: Math.round(totalCarbon * 100) / 100,
        carbonCreditsEquivalent: Math.round(totalCarbon), // 1 credit = 1 ton CO2e
        confidence: Math.round(prediction.confidence * 10000) / 100 + '%',
        range: {
          min: Math.round(totalBiomass * 0.47 * prediction.range.min * 100) / 100,
          max: Math.round(totalBiomass * 0.47 * prediction.range.max * 100) / 100
        },
        methodology: prediction.methodology,
        timestamp: prediction.timestamp
      },
      inputs: {
        ndvi,
        evi,
        lai,
        temperature,
        precipitation,
        soilMoisture: soilMoisture || 50,
        slope: slope || 0,
        elevation: elevation || 0,
        areaHectares
      }
    })
  } catch (error) {
    console.error('Biomass prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to predict biomass: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ml/predict-biomass
 * Get model information
 */
export async function GET(request: NextRequest) {
  try {
    const mlEngine = getMLEngine()
    const metadata = mlEngine.getModelMetadata('biomassPrediction')

    return NextResponse.json({
      success: true,
      model: metadata,
      description: 'Biomass prediction model using neural networks and multi-source sensor fusion',
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
        lai: {
          type: 'number',
          description: 'Leaf Area Index (0-8)',
          required: true
        },
        temperature: {
          type: 'number',
          description: 'Temperature in Celsius',
          required: true
        },
        precipitation: {
          type: 'number',
          description: 'Precipitation in millimeters',
          required: true
        },
        soilMoisture: {
          type: 'number',
          description: 'Soil moisture percentage (0-100)',
          required: false,
          default: 50
        },
        slope: {
          type: 'number',
          description: 'Terrain slope in degrees',
          required: false,
          default: 0
        },
        elevation: {
          type: 'number',
          description: 'Elevation in meters',
          required: false,
          default: 0
        },
        areaHectares: {
          type: 'number',
          description: 'Project area in hectares',
          required: false,
          default: 1
        }
      },
      outputSchema: {
        biomassPerHectare: 'tons dry biomass per hectare',
        totalBiomass: 'total tons of dry biomass',
        carbonSequestered: 'total tons of CO2e sequestered',
        carbonCreditsEquivalent: 'equivalent carbon credits (1:1 ratio)',
        confidence: 'prediction confidence percentage',
        range: 'min/max carbon sequestration estimate'
      },
      example: {
        ndvi: 0.65,
        evi: 0.55,
        lai: 4.5,
        temperature: 22,
        precipitation: 1800,
        soilMoisture: 65,
        slope: 5,
        elevation: 100,
        areaHectares: 500
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
