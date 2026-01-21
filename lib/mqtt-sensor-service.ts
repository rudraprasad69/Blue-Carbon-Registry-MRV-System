/**
 * REAL-TIME MQTT SENSOR SERVICE
 * 
 * IoT sensor data collection and streaming via MQTT/WebSocket
 * Supports multiple sensor types:
 * - Temperature/Humidity sensors
 * - Soil moisture sensors
 * - CO2 sensors
 * - Light sensors
 * - Precipitation gauges
 * - Weather stations
 * 
 * Usage:
 * import { MqttSensorClient } from '@/lib/mqtt-sensor-service'
 * const client = new MqttSensorClient(config)
 * await client.connect()
 * client.subscribe('sensors/+/data', callback)
 */

export interface SensorData {
  sensorId: string
  sensorType:
    | 'temperature'
    | 'humidity'
    | 'soilMoisture'
    | 'co2'
    | 'light'
    | 'precipitation'
    | 'windSpeed'
    | 'ph'
  value: number
  unit: string
  latitude: number
  longitude: number
  altitude: number
  timestamp: string
  rssi: number // signal strength
  battery: number // battery percentage
  status: 'ok' | 'warning' | 'error'
  quality: number // 0-100
}

export interface SensorLocation {
  sensorId: string
  name: string
  type: string
  latitude: number
  longitude: number
  altitude: number
  installedDate: string
  active: boolean
}

export interface AggregatedSensorReading {
  timestamp: string
  sensors: {
    [sensorId: string]: SensorData
  }
  summary: {
    averageTemperature: number
    averageHumidity: number
    averageSoilMoisture: number
    averageCO2: number
    averageLight: number
    totalPrecipitation: number
    averageWindSpeed: number
    averagePH: number
    alertCount: number
    offlineSensorCount: number
  }
}

export interface MqttConfig {
  brokerUrl: string
  username: string
  password: string
  clientId: string
  reconnectPeriod: number
  keepalive: number
}

export interface SensorAlertThresholds {
  temperature: { min: number; max: number }
  humidity: { min: number; max: number }
  soilMoisture: { min: number; max: number }
  co2: { min: number; max: number }
  light: { min: number; max: number }
  ph: { min: number; max: number }
  rssi: { min: number }
  battery: { min: number }
}

// ============================================================================
// MQTT SENSOR CLIENT
// ============================================================================

export class MqttSensorClient {
  private config: MqttConfig
  private connected: boolean = false
  private sensorData: Map<string, SensorData> = new Map()
  private sensorLocations: Map<string, SensorLocation> = new Map()
  private thresholds: SensorAlertThresholds
  private messageHandlers: ((data: SensorData) => void)[] = []
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5

  constructor(config: MqttConfig) {
    this.config = config
    this.thresholds = this.getDefaultThresholds()
  }

  /**
   * Connect to MQTT broker
   */
  async connect(): Promise<void> {
    if (this.connected) return

    try {
      // In production, use paho-mqtt or mqtt.js library
      // For now, use WebSocket connection to backend relay
      const wsUrl = this.config.brokerUrl.replace('mqtt://', 'ws://')
      const response = await fetch(`${wsUrl}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: this.config.clientId,
          username: this.config.username,
          keepalive: this.config.keepalive,
        }),
      })

      if (!response.ok) {
        throw new Error('MQTT connection failed')
      }

      this.connected = true
      this.reconnectAttempts = 0

      // Start listening for sensor data
      this.startListening()
    } catch (error) {
      console.error('MQTT connection error:', error)
      this.handleReconnect()
    }
  }

  /**
   * Subscribe to sensor topics
   */
  async subscribe(
    topic: string,
    callback: (data: SensorData) => void
  ): Promise<void> {
    if (!this.connected) {
      await this.connect()
    }

    try {
      const response = await fetch('/api/mqtt/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          clientId: this.config.clientId,
        }),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

      this.messageHandlers.push(callback)
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }

  /**
   * Unsubscribe from topic
   */
  async unsubscribe(topic: string): Promise<void> {
    try {
      const response = await fetch('/api/mqtt/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          clientId: this.config.clientId,
        }),
      })

      if (!response.ok) {
        throw new Error('Unsubscribe failed')
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
    }
  }

  /**
   * Get aggregated sensor readings
   */
  getAggregatedReadings(): AggregatedSensorReading {
    const readings = Array.from(this.sensorData.values())
    const timestamp = new Date().toISOString()

    const summary = {
      averageTemperature: this.calculateAverage(readings, 'temperature'),
      averageHumidity: this.calculateAverage(readings, 'humidity'),
      averageSoilMoisture: this.calculateAverage(readings, 'soilMoisture'),
      averageCO2: this.calculateAverage(readings, 'co2'),
      averageLight: this.calculateAverage(readings, 'light'),
      totalPrecipitation: this.calculateSum(readings, 'precipitation'),
      averageWindSpeed: this.calculateAverage(readings, 'windSpeed'),
      averagePH: this.calculateAverage(readings, 'ph'),
      alertCount: readings.filter((r) => r.status === 'warning' || r.status === 'error').length,
      offlineSensorCount: readings.filter((r) => r.battery < 10).length,
    }

    const sensors: { [key: string]: SensorData } = {}
    readings.forEach((reading) => {
      sensors[reading.sensorId] = reading
    })

    return {
      timestamp,
      sensors,
      summary,
    }
  }

  /**
   * Get all registered sensors
   */
  getSensorLocations(): SensorLocation[] {
    return Array.from(this.sensorLocations.values())
  }

  /**
   * Get sensor data by ID
   */
  getSensorData(sensorId: string): SensorData | undefined {
    return this.sensorData.get(sensorId)
  }

  /**
   * Register new sensor location
   */
  registerSensor(location: SensorLocation): void {
    this.sensorLocations.set(location.sensorId, location)
  }

  /**
   * Update sensor thresholds
   */
  setThresholds(thresholds: Partial<SensorAlertThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }

  /**
   * Check if reading exceeds thresholds
   */
  checkThresholds(data: SensorData): SensorData['status'] {
    const threshold = (this.thresholds as any)[data.sensorType]
    if (!threshold) return 'ok'

    const numThreshold = threshold as Record<string, number>

    if ('min' in threshold && data.value < numThreshold.min) return 'warning'
    if ('max' in threshold && data.value > numThreshold.max) return 'warning'
    if (data.battery < 10) return 'warning'
    if (data.rssi < -100) return 'warning'

    return 'ok'
  }

  /**
   * Disconnect from broker
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return

    try {
      const response = await fetch('/api/mqtt/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: this.config.clientId }),
      })

      if (!response.ok) {
        throw new Error('Disconnect failed')
      }

      this.connected = false
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================

  /**
   * Start listening for incoming sensor data via polling
   */
  private startListening(): void {
    const pollInterval = setInterval(async () => {
      if (!this.connected) {
        clearInterval(pollInterval)
        return
      }

      try {
        const response = await fetch(
          `/api/mqtt/messages?clientId=${this.config.clientId}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch messages')
        }

        const messages = await response.json()

        messages.forEach((msg: any) => {
          try {
            const sensorData = this.parseSensorMessage(msg)
            if (sensorData) {
              sensorData.status = this.checkThresholds(sensorData)
              this.sensorData.set(sensorData.sensorId, sensorData)
              this.messageHandlers.forEach((handler) => handler(sensorData))
            }
          } catch (error) {
            console.error('Failed to parse sensor message:', error)
          }
        })
      } catch (error) {
        console.error('Listening error:', error)
      }
    }, 5000) // Poll every 5 seconds
  }

  /**
   * Parse MQTT message to SensorData
   */
  private parseSensorMessage(msg: any): SensorData | null {
    try {
      const payload = typeof msg.payload === 'string' ? JSON.parse(msg.payload) : msg.payload

      return {
        sensorId: payload.id || msg.topic.split('/')[1],
        sensorType: payload.type || this.inferSensorType(payload),
        value: payload.value,
        unit: payload.unit || this.getDefaultUnit(payload.type),
        latitude: payload.latitude || 0,
        longitude: payload.longitude || 0,
        altitude: payload.altitude || 0,
        timestamp: payload.timestamp || new Date().toISOString(),
        rssi: payload.rssi || 0,
        battery: payload.battery || 100,
        status: 'ok',
        quality: payload.quality || 100,
      }
    } catch (error) {
      console.error('Failed to parse sensor message:', error)
      return null
    }
  }

  /**
   * Infer sensor type from payload
   */
  private inferSensorType(
    payload: any
  ): SensorData['sensorType'] {
    if ('temperature' in payload) return 'temperature'
    if ('humidity' in payload) return 'humidity'
    if ('moisture' in payload) return 'soilMoisture'
    if ('co2' in payload) return 'co2'
    if ('light' in payload) return 'light'
    if ('precipitation' in payload) return 'precipitation'
    if ('wind' in payload) return 'windSpeed'
    if ('ph' in payload) return 'ph'
    return 'temperature'
  }

  /**
   * Get default unit for sensor type
   */
  private getDefaultUnit(sensorType: string): string {
    const units: Record<string, string> = {
      temperature: '°C',
      humidity: '%',
      soilMoisture: '%',
      co2: 'ppm',
      light: 'lux',
      precipitation: 'mm',
      windSpeed: 'm/s',
      ph: 'pH',
    }
    return units[sensorType] || ''
  }

  /**
   * Calculate average value for sensor type
   */
  private calculateAverage(readings: SensorData[], sensorType: SensorData['sensorType']): number {
    const filtered = readings.filter((r) => r.sensorType === sensorType)
    if (filtered.length === 0) return 0
    const sum = filtered.reduce((acc, r) => acc + r.value, 0)
    return sum / filtered.length
  }

  /**
   * Calculate sum value for sensor type
   */
  private calculateSum(readings: SensorData[], sensorType: SensorData['sensorType']): number {
    return readings
      .filter((r) => r.sensorType === sensorType)
      .reduce((acc, r) => acc + r.value, 0)
  }

  /**
   * Handle reconnection attempts
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.pow(2, this.reconnectAttempts) * 1000 // Exponential backoff
      console.log(
        `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      )

      setTimeout(() => {
        this.connect()
      }, delay)
    }
  }

  /**
   * Get default alert thresholds
   */
  private getDefaultThresholds(): SensorAlertThresholds {
    return {
      temperature: { min: 10, max: 40 },
      humidity: { min: 20, max: 95 },
      soilMoisture: { min: 15, max: 85 },
      co2: { min: 200, max: 1000 },
      light: { min: 0, max: 100000 },
      ph: { min: 4.5, max: 8.5 },
      rssi: { min: -120 },
      battery: { min: 10 },
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let clientInstance: MqttSensorClient | null = null

export function getMqttSensorClient(): MqttSensorClient {
  if (!clientInstance) {
    clientInstance = new MqttSensorClient({
      brokerUrl: process.env.NEXT_PUBLIC_MQTT_BROKER_URL || 'mqtt://localhost:1883',
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME || '',
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD || '',
      clientId: `bcr-client-${Date.now()}`,
      reconnectPeriod: 5000,
      keepalive: 30,
    })
  }
  return clientInstance
}

/**
 * Initialize and connect sensor network
 */
export async function initializeSensorNetwork(): Promise<MqttSensorClient> {
  const client = getMqttSensorClient()
  await client.connect()
  return client
}

/**
 * Stream sensor data in real-time
 */
export async function streamSensorData(
  callback: (reading: AggregatedSensorReading) => void
): Promise<() => Promise<void>> {
  const client = getMqttSensorClient()
  await client.connect()

  // Subscribe to all sensor topics
  await client.subscribe('sensors/+/data', () => {
    const aggregated = client.getAggregatedReadings()
    callback(aggregated)
  })

  // Return unsubscribe function
  return async () => {
    await client.unsubscribe('sensors/+/data')
    await client.disconnect()
  }
}
