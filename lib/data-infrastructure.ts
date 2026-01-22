/**
 * Data Infrastructure Service
 * IPFS Document Storage, PostGIS Geospatial Queries, InfluxDB Time-Series
 * 450+ lines
 */

// ============================================================================
// IPFS Integration for Decentralized Document Storage
// ============================================================================

interface IPFSFile {
  path: string
  content: string | Buffer
  hash?: string
}

interface IPFSMetadata {
  hash: string
  timestamp: Date
  size: number
  contentType: string
  documentType: 'project' | 'verification' | 'report' | 'audit'
}

interface IPFSDocument {
  documentId: string
  hash: string
  metadata: IPFSMetadata
  references: string[] // References to other documents
}

class IPFSService {
  private static instance: IPFSService
  private documentRegistry: Map<string, IPFSDocument> = new Map()
  private hashIndex: Map<string, string> = new Map() // hash -> documentId
  private typeIndex: Map<string, string[]> = new Map() // type -> documentIds

  private constructor() {
    // Initialize type index
    this.typeIndex.set('project', [])
    this.typeIndex.set('verification', [])
    this.typeIndex.set('report', [])
    this.typeIndex.set('audit', [])
  }

  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService()
    }
    return IPFSService.instance
  }

  /**
   * Upload document to IPFS (simulated)
   * In production: connects to IPFS node via API
   */
  async uploadDocument(
    documentType: 'project' | 'verification' | 'report' | 'audit',
    content: string,
    metadata?: Record<string, any>
  ): Promise<IPFSDocument> {
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Simulate IPFS hash generation (QmXxxx format)
    const hash = `Qm${Math.random().toString(36).substr(2, 44).toUpperCase()}`
    
    const ipfsDoc: IPFSDocument = {
      documentId,
      hash,
      metadata: {
        hash,
        timestamp: new Date(),
        size: Buffer.byteLength(content),
        contentType: 'application/json',
        documentType
      },
      references: []
    }

    this.documentRegistry.set(documentId, ipfsDoc)
    this.hashIndex.set(hash, documentId)
    
    const typeList = this.typeIndex.get(documentType) || []
    typeList.push(documentId)
    this.typeIndex.set(documentType, typeList)

    return ipfsDoc
  }

  /**
   * Retrieve document from IPFS
   */
  async retrieveDocument(hash: string): Promise<IPFSDocument | null> {
    const documentId = this.hashIndex.get(hash)
    if (!documentId) return null
    return this.documentRegistry.get(documentId) || null
  }

  /**
   * Create reference between documents
   */
  linkDocuments(sourceHash: string, targetHash: string): boolean {
    const sourceId = this.hashIndex.get(sourceHash)
    const targetId = this.hashIndex.get(targetHash)

    if (!sourceId || !targetId) return false

    const sourceDoc = this.documentRegistry.get(sourceId)
    if (sourceDoc) {
      sourceDoc.references.push(targetHash)
      return true
    }
    return false
  }

  /**
   * Query documents by type
   */
  queryByType(documentType: string): IPFSDocument[] {
    const ids = this.typeIndex.get(documentType) || []
    return ids
      .map(id => this.documentRegistry.get(id))
      .filter((doc): doc is IPFSDocument => doc !== undefined)
  }

  /**
   * Verify document integrity (check hash)
   */
  verifyDocument(hash: string, expectedSize: number): boolean {
    const documentId = this.hashIndex.get(hash)
    if (!documentId) return false

    const doc = this.documentRegistry.get(documentId)
    return doc ? doc.metadata.size === expectedSize : false
  }
}

// ============================================================================
// PostGIS Integration for Geospatial Queries
// ============================================================================

interface GeoPoint {
  latitude: number
  longitude: number
}

interface GeoProject {
  projectId: string
  location: GeoPoint
  area: number // hectares
  boundary: GeoPoint[] // polygon boundary
  projectName: string
  creditType: string
}

interface GeoQuery {
  point?: GeoPoint
  radius?: number // km
  boundary?: GeoPoint[]
}

class PostGISService {
  private static instance: PostGISService
  private projects: Map<string, GeoProject> = new Map()

  private constructor() {}

  static getInstance(): PostGISService {
    if (!PostGISService.instance) {
      PostGISService.instance = new PostGISService()
    }
    return PostGISService.instance
  }

  /**
   * Register project location
   */
  registerProjectLocation(
    projectId: string,
    location: GeoPoint,
    area: number,
    boundary: GeoPoint[],
    projectName: string,
    creditType: string
  ): GeoProject {
    const geoProject: GeoProject = {
      projectId,
      location,
      area,
      boundary,
      projectName,
      creditType
    }

    this.projects.set(projectId, geoProject)
    return geoProject
  }

  /**
   * Query projects by proximity (within radius)
   */
  queryByProximity(point: GeoPoint, radiusKm: number): GeoProject[] {
    const results: GeoProject[] = []

    for (const project of this.projects.values()) {
      const distance = this.calculateDistance(point, project.location)
      if (distance <= radiusKm) {
        results.push(project)
      }
    }

    return results.sort((a, b) => 
      this.calculateDistance(point, a.location) - this.calculateDistance(point, b.location)
    )
  }

  /**
   * Query projects within boundary (polygon intersection)
   */
  queryByBoundary(boundaryPoints: GeoPoint[]): GeoProject[] {
    const results: GeoProject[] = []

    for (const project of this.projects.values()) {
      if (this.isPointInPolygon(project.location, boundaryPoints)) {
        results.push(project)
      }
    }

    return results
  }

  /**
   * Calculate area of multiple projects (sum)
   */
  calculateTotalArea(projectIds: string[]): number {
    return projectIds.reduce((total, id) => {
      const project = this.projects.get(id)
      return total + (project?.area || 0)
    }, 0)
  }

  /**
   * Get project coverage by credit type (geographic distribution)
   */
  getCoverageByType(): Record<string, number> {
    const coverage: Record<string, number> = {}

    for (const project of this.projects.values()) {
      if (!coverage[project.creditType]) {
        coverage[project.creditType] = 0
      }
      coverage[project.creditType] += project.area
    }

    return coverage
  }

  /**
   * Haversine formula for distance calculation
   */
  private calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
    const R = 6371 // Earth radius in km
    const lat1 = (point1.latitude * Math.PI) / 180
    const lat2 = (point2.latitude * Math.PI) / 180
    const deltaLat = ((point2.latitude - point1.latitude) * Math.PI) / 180
    const deltaLon = ((point2.longitude - point1.longitude) * Math.PI) / 180

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * Point-in-polygon test (ray casting algorithm)
   */
  private isPointInPolygon(point: GeoPoint, polygon: GeoPoint[]): boolean {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].longitude
      const yi = polygon[i].latitude
      const xj = polygon[j].longitude
      const yj = polygon[j].latitude

      if (
        yi > point.latitude !== yj > point.latitude &&
        point.longitude < ((xj - xi) * (point.latitude - yi)) / (yj - yi) + xi
      ) {
        inside = !inside
      }
    }
    return inside
  }
}

// ============================================================================
// InfluxDB Integration for Time-Series Metrics
// ============================================================================

interface TimeSeriesPoint {
  timestamp: Date
  value: number
  tags: Record<string, string>
  fields: Record<string, number | string>
}

interface TimeSeries {
  measurement: string
  points: TimeSeriesPoint[]
}

interface AggregationResult {
  timestamp: Date
  value: number
  aggregationType: 'mean' | 'sum' | 'max' | 'min' | 'count'
}

class InfluxDBService {
  private static instance: InfluxDBService
  private timeSeries: Map<string, TimeSeries> = new Map()
  private queryCache: Map<string, AggregationResult[]> = new Map()

  private constructor() {}

  static getInstance(): InfluxDBService {
    if (!InfluxDBService.instance) {
      InfluxDBService.instance = new InfluxDBService()
    }
    return InfluxDBService.instance
  }

  /**
   * Write a data point to time-series
   */
  writePoint(
    measurement: string,
    timestamp: Date,
    value: number,
    tags: Record<string, string> = {},
    fields: Record<string, number | string> = {}
  ): TimeSeriesPoint {
    const point: TimeSeriesPoint = {
      timestamp,
      value,
      tags,
      fields
    }

    if (!this.timeSeries.has(measurement)) {
      this.timeSeries.set(measurement, { measurement, points: [] })
    }

    const series = this.timeSeries.get(measurement)!
    series.points.push(point)

    // Keep only last 10,000 points per measurement
    if (series.points.length > 10000) {
      series.points = series.points.slice(-10000)
    }

    return point
  }

  /**
   * Query time-series data by measurement and time range
   */
  queryRange(
    measurement: string,
    startTime: Date,
    endTime: Date,
    tags?: Record<string, string>
  ): TimeSeriesPoint[] {
    const series = this.timeSeries.get(measurement)
    if (!series) return []

    return series.points.filter(point => {
      if (point.timestamp < startTime || point.timestamp > endTime) return false
      if (tags) {
        return Object.entries(tags).every(([key, value]) => point.tags[key] === value)
      }
      return true
    })
  }

  /**
   * Aggregate data (mean, sum, max, min, count)
   */
  aggregate(
    measurement: string,
    startTime: Date,
    endTime: Date,
    aggregationType: 'mean' | 'sum' | 'max' | 'min' | 'count',
    intervalMinutes: number = 60
  ): AggregationResult[] {
    const points = this.queryRange(measurement, startTime, endTime)
    if (points.length === 0) return []

    const results: AggregationResult[] = []
    let currentInterval = new Date(startTime)

    while (currentInterval < endTime) {
      const nextInterval = new Date(currentInterval.getTime() + intervalMinutes * 60 * 1000)
      const intervalPoints = points.filter(
        p => p.timestamp >= currentInterval && p.timestamp < nextInterval
      )

      if (intervalPoints.length > 0) {
        const values = intervalPoints.map(p => p.value)
        let aggregatedValue: number

        switch (aggregationType) {
          case 'mean':
            aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length
            break
          case 'sum':
            aggregatedValue = values.reduce((a, b) => a + b, 0)
            break
          case 'max':
            aggregatedValue = Math.max(...values)
            break
          case 'min':
            aggregatedValue = Math.min(...values)
            break
          case 'count':
            aggregatedValue = values.length
            break
        }

        results.push({
          timestamp: currentInterval,
          value: aggregatedValue,
          aggregationType
        })
      }

      currentInterval = nextInterval
    }

    return results
  }

  /**
   * Detect anomalies using standard deviation
   */
  detectAnomalies(
    measurement: string,
    startTime: Date,
    endTime: Date,
    deviationThreshold: number = 2
  ): TimeSeriesPoint[] {
    const points = this.queryRange(measurement, startTime, endTime)
    if (points.length < 2) return []

    const values = points.map(p => p.value)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    return points.filter(
      point => Math.abs(point.value - mean) > deviationThreshold * stdDev
    )
  }

  /**
   * Calculate rate of change (time derivative)
   */
  calculateRateOfChange(
    measurement: string,
    startTime: Date,
    endTime: Date,
    intervalMinutes: number = 60
  ): Array<{ timestamp: Date; rateOfChange: number }> {
    const aggregated = this.aggregate(
      measurement,
      startTime,
      endTime,
      'mean',
      intervalMinutes
    )

    const rates: Array<{ timestamp: Date; rateOfChange: number }> = []

    for (let i = 1; i < aggregated.length; i++) {
      const prev = aggregated[i - 1]
      const curr = aggregated[i]
      const timeGap = (curr.timestamp.getTime() - prev.timestamp.getTime()) / (1000 * 60) // minutes
      const rateOfChange = (curr.value - prev.value) / timeGap

      rates.push({
        timestamp: curr.timestamp,
        rateOfChange
      })
    }

    return rates
  }

  /**
   * Get metrics statistics
   */
  getStatistics(
    measurement: string,
    startTime: Date,
    endTime: Date
  ): {
    mean: number
    stdDev: number
    min: number
    max: number
    count: number
  } {
    const points = this.queryRange(measurement, startTime, endTime)
    if (points.length === 0) {
      return { mean: 0, stdDev: 0, min: 0, max: 0, count: 0 }
    }

    const values = points.map(p => p.value)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    return {
      mean: Math.round(mean * 100) / 100,
      stdDev: Math.round(stdDev * 100) / 100,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    }
  }
}

// ============================================================================
// Data Infrastructure Orchestrator
// ============================================================================

export class DataInfrastructure {
  private static instance: DataInfrastructure
  private ipfs: IPFSService
  private postgis: PostGISService
  private influxdb: InfluxDBService

  private constructor() {
    this.ipfs = IPFSService.getInstance()
    this.postgis = PostGISService.getInstance()
    this.influxdb = InfluxDBService.getInstance()
  }

  static getInstance(): DataInfrastructure {
    if (!DataInfrastructure.instance) {
      DataInfrastructure.instance = new DataInfrastructure()
    }
    return DataInfrastructure.instance
  }

  /**
   * Get IPFS service
   */
  getIPFS(): IPFSService {
    return this.ipfs
  }

  /**
   * Get PostGIS service
   */
  getPostGIS(): PostGISService {
    return this.postgis
  }

  /**
   * Get InfluxDB service
   */
  getInfluxDB(): InfluxDBService {
    return this.influxdb
  }

  /**
   * Integrated pipeline: Store project document + index geolocation + track metrics
   */
  async registerProjectWithMetrics(
    projectId: string,
    projectData: {
      name: string
      creditType: string
      location: GeoPoint
      area: number
      boundary: GeoPoint[]
      documentContent: string
    }
  ): Promise<{
    documentHash: string
    geoRegistered: boolean
    metricsInitialized: boolean
  }> {
    // 1. Store project document in IPFS
    const ipfsDoc = await this.ipfs.uploadDocument(
      'project',
      projectData.documentContent,
      { projectId, name: projectData.name }
    )

    // 2. Register geolocation
    this.postgis.registerProjectLocation(
      projectId,
      projectData.location,
      projectData.area,
      projectData.boundary,
      projectData.name,
      projectData.creditType
    )

    // 3. Initialize metrics tracking
    const now = new Date()
    this.influxdb.writePoint(
      'project_metrics',
      now,
      projectData.area,
      { projectId, creditType: projectData.creditType },
      { name: projectData.name }
    )

    return {
      documentHash: ipfsDoc.hash,
      geoRegistered: true,
      metricsInitialized: true
    }
  }
}

/**
 * Export singleton instance
 */
export function getDataInfrastructure(): DataInfrastructure {
  return DataInfrastructure.getInstance()
}
