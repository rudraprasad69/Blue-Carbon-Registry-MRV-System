/**
 * COMPLETE VERIFICATION ORCHESTRATOR
 * 
 * End-to-end pipeline combining:
 * 1. Data Integration & Validation Layer (5 services)
 * 2. Smart Contract Verification Layer
 * 
 * Usage:
 * import { runCompleteVerificationPipeline } from '@/lib/verification-orchestrator'
 * const result = await runCompleteVerificationPipeline('project-123')
 */

import {
  analyzeSatelliteData,
  type SatelliteAnalysisResult,
} from './satellite-data-service'

import {
  mockSensorNetwork,
  aggregateSensorData,
  SensorStreamSimulator,
  type AggregatedSensorData,
} from './iot-sensor-service'

import {
  detectMultiSourceAnomalies,
  type DetectedAnomaly,
} from './ml-anomaly-detection'

import {
  validateMultiSourceData,
  type DataValidationResult,
} from './data-validation-pipeline'

import {
  aggregateMonitoringData,
  type AggregatedMonitoringData,
} from './data-aggregation-service'

import {
  executeFullVerificationWorkflow,
  type BenefitDistribution,
  type VerificationPayload,
  type CarbonCreditToken,
} from './smart-contract-verification'

// ============================================================================
// TYPES
// ============================================================================

export interface VerificationPipelineResult {
  projectId: string
  status: 'success' | 'failed' | 'partial'
  
  // Phase results
  phases: {
    satelliteAnalysis: SatelliteAnalysisResult | null
    sensorAggregation: Map<string, AggregatedSensorData> | null
    anomalyDetection: DetectedAnomaly[]
    validation: DataValidationResult | null
    dataAggregation: AggregatedMonitoringData | null
    contractVerification: any // Contract submission result
  }
  
  // Final outputs
  verification?: VerificationPayload
  creditsIssuable: number
  creditsIssued: number
  carbonCreditTokens: CarbonCreditToken[]
  
  // Timing
  startTime: string
  endTime: string
  durationSeconds: number
  
  // Error tracking
  errors: { phase: string; error: string }[]
}

// ============================================================================
// ORCHESTRATION
// ============================================================================

/**
 * Run the complete verification pipeline from data collection to contract submission
 * 
 * @param projectId - Project identifier
 * @param options - Configuration options
 * @returns Complete pipeline result with all phase outputs
 */
export async function runCompleteVerificationPipeline(
  projectId: string,
  options?: {
    location?: { latitude: number; longitude: number }
    daysOfData?: number
    benefitDistribution?: BenefitDistribution
    skipPhase?: 'satellite' | 'sensors' | 'validation' | 'contract'
  }
): Promise<VerificationPipelineResult> {
  const startTime = new Date()
  const errors: { phase: string; error: string }[] = []

  const result: VerificationPipelineResult = {
    projectId,
    status: 'success',
    phases: {
      satelliteAnalysis: null,
      sensorAggregation: null,
      anomalyDetection: [],
      validation: null,
      dataAggregation: null,
      contractVerification: null,
    },
    creditsIssuable: 0,
    creditsIssued: 0,
    carbonCreditTokens: [],
    startTime: startTime.toISOString(),
    endTime: new Date().toISOString(),
    durationSeconds: 0,
    errors,
  }

  try {
    console.log(`\n${'█'.repeat(80)}`)
    console.log('██  🌊 BLUE CARBON REGISTRY VERIFICATION PIPELINE')
    console.log(`${'█'.repeat(80)}\n`)

    const location = options?.location || { latitude: 21.95, longitude: 88.85 }
    const daysOfData = options?.daysOfData || 90
    const durationDays = daysOfData

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 1: SATELLITE DATA ANALYSIS
    // ─────────────────────────────────────────────────────────────────────
    if (options?.skipPhase !== 'satellite') {
      console.log('PHASE 1️⃣  📡 SATELLITE DATA ANALYSIS')
      console.log('-'.repeat(80))

      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - durationDays)
        const endDate = new Date()

        result.phases.satelliteAnalysis = await analyzeSatelliteData({
          projectId,
          location,
          radius: 5000,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          dataType: 'both',
        })

        console.log(`✅ Sentinel-1/2 satellite imagery analyzed`)
        
        console.log(
          `   Biomass: ${result.phases.satelliteAnalysis.biomassEstimate.estimatedBiomass.toFixed(2)} t/ha`
        )
        console.log(
          `   Health Score: ${result.phases.satelliteAnalysis.ecosystemHealthScore}/100\n`
        )
      } catch (error) {
        const err = String(error)
        errors.push({ phase: 'satellite', error: err })
        console.log(`⚠️  Satellite analysis: ${err}\n`)
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 2: IOT SENSOR DATA AGGREGATION
    // ─────────────────────────────────────────────────────────────────────
    if (options?.skipPhase !== 'sensors') {
      console.log('PHASE 2️⃣  🌡️  IOT SENSOR DATA AGGREGATION')
      console.log('-'.repeat(80))

      try {
        const sensorDataMap = new Map<string, AggregatedSensorData>()

        for (const sensor of mockSensorNetwork.slice(0, 3)) {
          // Generate readings for monitoring period
          const readings = []
          for (let i = 0; i < durationDays; i++) {
            const readingDate = new Date()
            readingDate.setDate(readingDate.getDate() - (durationDays - i))

            const baseValue =
              sensor.type === 'dissolved_oxygen'
                ? 7 + Math.random() * 2
                : sensor.type === 'temperature'
                  ? 25 + Math.random() * 5
                  : sensor.type === 'salinity'
                    ? 35 + Math.random() * 2
                    : sensor.type === 'water_quality'
                      ? 7.5 + Math.random() * 1
                      : 50 + Math.random() * 100

            readings.push({
              sensorId: sensor.id,
              timestamp: readingDate.toISOString(),
              value: baseValue + (Math.random() - 0.5),
              unit: sensor.type,
              quality: Math.random() > 0.05 ? ('valid' as const) : ('questionable' as const),
              confidence:
                (sensor as any).confidence + (Math.random() - 0.5) * 5,
            })
          }

          const aggregated = aggregateSensorData(
            sensor.id,
            readings,
            sensor.location,
            sensor.type
          )

          sensorDataMap.set(sensor.id, aggregated)
          console.log(`✅ ${sensor.name}`)
          console.log(
            `   Mean: ${aggregated.statistics.mean.toFixed(2)} ${readings[0].unit}`
          )
          console.log(
            `   Quality: ${aggregated.dataQuality.toFixed(1)}%`
          )
        }

        result.phases.sensorAggregation = sensorDataMap
        console.log('')
      } catch (error) {
        const err = String(error)
        errors.push({ phase: 'sensors', error: err })
        console.log(`⚠️  Sensor aggregation: ${err}\n`)
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 3: ANOMALY DETECTION
    // ─────────────────────────────────────────────────────────────────────
    console.log('PHASE 3️⃣  🧠 ANOMALY DETECTION')
    console.log('-'.repeat(80))

    try {
      if (result.phases.satelliteAnalysis?.ndviTimeSeries) {
        const timeSeries = result.phases.satelliteAnalysis.ndviTimeSeries.map(
          (d) => ({
            timestamp: d.timestamp,
            value: d.value,
            source: 'satellite' as const,
          })
        )

        result.phases.anomalyDetection = detectMultiSourceAnomalies(
          timeSeries,
          {
            type: 'isolation_forest',
            sensitivity: 'medium',
            windowSize: 7,
            threshold: 2.5,
          }
        )

        console.log(
          `✅ Anomalies detected: ${result.phases.anomalyDetection.length}`
        )

        const severity = {
          high: result.phases.anomalyDetection.filter(
            (a) => a.severity === 'high'
          ).length,
          medium: result.phases.anomalyDetection.filter(
            (a) => a.severity === 'medium'
          ).length,
          low: result.phases.anomalyDetection.filter((a) => a.severity === 'low')
            .length,
        }

        console.log(
          `   Severity: ${severity.high} HIGH | ${severity.medium} MEDIUM | ${severity.low} LOW\n`
        )
      } else {
        console.log(`✅ No satellite time series for anomaly detection\n`)
      }
    } catch (error) {
      const err = String(error)
      errors.push({ phase: 'anomaly', error: err })
      console.log(`⚠️  Anomaly detection: ${err}\n`)
    }

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 4: MULTI-SOURCE VALIDATION
    // ─────────────────────────────────────────────────────────────────────
    if (options?.skipPhase !== 'validation') {
      console.log('PHASE 4️⃣  ✔️  MULTI-SOURCE DATA VALIDATION')
      console.log('-'.repeat(80))

      try {
        const satelliteData = result.phases.satelliteAnalysis || null
        const sensorData = result.phases.sensorAggregation || new Map()
        
        if (satelliteData) {
          const validationResult = await validateMultiSourceData(
            satelliteData,
            sensorData
          )
          
          // Handle validation result safely - don't assign incompatible type
          if (validationResult && typeof validationResult === 'object') {
            const satellite = (validationResult as any).satellite
            const sensorsData = (validationResult as any).sensors
            const crossSourceData = (validationResult as any).crossSource

            if (satellite) {
              console.log(`Satellite Quality: ${satellite.qualityScore}%`)
              console.log(
                `   Status: ${satellite.isValid ? '✅ VALID' : '❌ INVALID'}`
              )
            }

            if (sensorsData && typeof sensorsData.forEach === 'function') {
              let sensorCount = 0
              let sensorQualityAvg = 0
              sensorsData.forEach((validation: any) => {
                sensorCount++
                sensorQualityAvg += validation.qualityScore || 0
              })
              sensorQualityAvg = sensorQualityAvg / Math.max(sensorCount, 1)

              if (sensorCount > 0) {
                console.log(
                  `Sensor Data: ${sensorQualityAvg.toFixed(1)}% avg quality across ${sensorCount} sensors`
                )
              }
            }

            if (crossSourceData) {
              console.log(
                `Cross-Source Consistency: ${crossSourceData.consistencyScore}%`
              )
              console.log(
                `   Validation: ${crossSourceData.overallValid ? '✅ CONSISTENT' : '⚠️  INCONSISTENT'}\n`
              )
            }
          }
        }
      } catch (error) {
        const err = String(error)
        errors.push({ phase: 'validation', error: err })
        console.log(`⚠️  Validation: ${err}\n`)
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 5: DATA AGGREGATION & READINESS
    // ─────────────────────────────────────────────────────────────────────
    console.log('PHASE 5️⃣  📊 DATA AGGREGATION & READINESS ASSESSMENT')
    console.log('-'.repeat(80))

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - durationDays)
      const endDate = new Date()

      const satelliteData = result.phases.satelliteAnalysis || null
      const sensorData = result.phases.sensorAggregation || new Map()
      const validationSatellite = (result.phases.validation as any)?.satellite || null
      const validationSensors = (result.phases.validation as any)?.sensors || new Map()
      const validationCrossSource = (result.phases.validation as any)?.crossSource || null

      result.phases.dataAggregation = await aggregateMonitoringData(
        projectId,
        location,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        satelliteData,
        sensorData,
        validationSatellite,
        validationSensors,
        validationCrossSource,
        result.phases.anomalyDetection
      )

      const aggregated = result.phases.dataAggregation

      console.log(`📈 Carbon Sequestration:`)
      console.log(`   Total: ${aggregated.carbonSequestrationEstimate.totalSequestered} tons CO₂e`)
      console.log(
        `   Annual Rate: ${aggregated.carbonSequestrationEstimate.annualizedRate} tons/year`
      )
      console.log(`   Confidence: ${aggregated.carbonSequestrationEstimate.confidence}%`)

      console.log(`\n📊 Data Quality:`)
      console.log(`   Overall: ${aggregated.dataQualityMetrics.overallScore}%`)
      console.log(`   Satellite: ${aggregated.dataQualityMetrics.satelliteQuality}%`)
      console.log(`   Sensors: ${aggregated.dataQualityMetrics.sensorQuality}%`)
      console.log(`   Consistency: ${aggregated.dataQualityMetrics.consistencyScore}%`)

      const readiness = aggregated.readinessForVerification
      console.log(`\n🔍 Verification Readiness:`)
      console.log(`   Score: ${readiness.readinessScore}%`)
      console.log(`   Ready: ${readiness.readyForVerification ? '✅ YES' : '❌ NO'}`)

      if (readiness.blockers.length > 0) {
        console.log(`   Blockers: ${readiness.blockers.length}`)
        readiness.blockers.slice(0, 3).forEach((b) => console.log(`     - ${b}`))
      }
      console.log('')
    } catch (error) {
      const err = String(error)
      errors.push({ phase: 'aggregation', error: err })
      console.log(`⚠️  Aggregation: ${err}\n`)
      result.status = 'partial'
    }

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 6: SMART CONTRACT VERIFICATION
    // ─────────────────────────────────────────────────────────────────────
    if (options?.skipPhase !== 'contract' && result.phases.dataAggregation) {
      console.log('PHASE 6️⃣  ⛓️  SMART CONTRACT VERIFICATION & ISSUANCE')
      console.log('-'.repeat(80))

      try {
        const contractResult = await executeFullVerificationWorkflow(
          result.phases.dataAggregation,
          options?.benefitDistribution
        )

        result.phases.contractVerification = contractResult

        if (contractResult.success && contractResult.tokens) {
          result.creditsIssuable = contractResult.tokens.reduce(
            (sum, t) => sum + t.carbonAmount,
            0
          )
          result.creditsIssued =
            contractResult.status?.creditsIssued || result.creditsIssuable
          result.carbonCreditTokens = contractResult.tokens

          console.log(`✅ Contract verification successful`)
          console.log(`   Credits issued: ${result.creditsIssued}`)
          console.log(`   Tokens minted: ${contractResult.tokens.length}`)
        } else {
          console.log(
            `⚠️  Contract submission: ${contractResult.error || 'Unknown error'}\n`
          )
          result.status = 'partial'
        }
      } catch (error) {
        const err = String(error)
        errors.push({ phase: 'contract', error: err })
        console.log(`⚠️  Contract verification: ${err}\n`)
        result.status = 'partial'
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // FINAL SUMMARY
    // ─────────────────────────────────────────────────────────────────────
    const endTime = new Date()
    result.endTime = endTime.toISOString()
    result.durationSeconds =
      (endTime.getTime() - startTime.getTime()) / 1000

    console.log(`${'█'.repeat(80)}`)
    console.log('📋 VERIFICATION PIPELINE SUMMARY')
    console.log(`${'█'.repeat(80)}\n`)

    console.log(`Project ID: ${projectId}`)
    console.log(`Status: ${result.status === 'success' ? '✅ SUCCESS' : '⚠️  ' + result.status.toUpperCase()}`)
    console.log(`Duration: ${result.durationSeconds.toFixed(1)}s`)

    if (result.creditsIssuable > 0) {
      console.log(`\n💰 Carbon Credits:`)
      console.log(`   Issuable: ${result.creditsIssuable}`)
      console.log(`   Issued: ${result.creditsIssued}`)
    }

    if (errors.length > 0) {
      console.log(`\n⚠️  Errors (${errors.length}):`)
      errors.forEach((e) => {
        console.log(`   [${e.phase}] ${e.error}`)
      })
    }

    console.log(`\n${'█'.repeat(80)}\n`)

    return result
  } catch (error) {
    const err = String(error)
    errors.push({ phase: 'orchestration', error: err })
    console.error(`❌ Pipeline failed: ${err}`)

    result.status = 'failed'
    result.endTime = new Date().toISOString()
    result.durationSeconds =
      (new Date().getTime() - startTime.getTime()) / 1000

    return result
  }
}

export {}
