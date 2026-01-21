/**
 * API Integration Layer
 * 
 * Server-side API handlers that expose services via HTTP endpoints
 * These can be used as API routes in Next.js app/api directory
 * 
 * Usage: Create files in app/api/* directory and implement these handlers
 */

import { getCarbonMarketService } from '@/lib/carbon-market-service'
import { getComparisonService } from '@/lib/comparison-service'
import { getHistoricalService } from '@/lib/historical-analysis-service'
import { getAdminService } from '@/lib/admin-service'
import { getExportService } from '@/lib/export-service'

// ============================================================================
// RESPONSE TYPES
// ============================================================================

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

interface ApiError {
  success: false
  error: string
  timestamp: string
  statusCode: number
}

// ============================================================================
// CARBON MARKET API HANDLERS
// ============================================================================

/**
 * GET /api/market/price
 * Get current carbon credit market price
 */
export async function handleGetMarketPrice(): Promise<ApiResponse<any>> {
  try {
    const service = getCarbonMarketService()
    const price = service.getCurrentPrice()

    return {
      success: true,
      data: price,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch market price',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/market/price-history?days=30
 * Get historical price data
 */
export async function handleGetPriceHistory(days: number = 30): Promise<ApiResponse<any>> {
  try {
    if (days < 1 || days > 365) {
      throw new Error('Days must be between 1 and 365')
    }

    const service = getCarbonMarketService()
    const history = service.getPriceHistory(days)

    return {
      success: true,
      data: history,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch price history',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/market/metrics
 * Get current market metrics and statistics
 */
export async function handleGetMarketMetrics(): Promise<ApiResponse<any>> {
  try {
    const service = getCarbonMarketService()
    const metrics = service.getMarketMetrics()

    return {
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch market metrics',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * POST /api/market/order
 * Place a buy or sell order
 */
export async function handlePlaceOrder(orderData: {
  type: 'buy' | 'sell'
  projectId: string
  creditsAmount: number
  pricePerCredit: number
}): Promise<ApiResponse<any>> {
  try {
    const service = getCarbonMarketService()
    const order = service.placeOrder({
      ...orderData,
      status: 'open',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return {
      success: true,
      data: order,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to place order',
      timestamp: new Date().toISOString(),
    }
  }
}

// ============================================================================
// PROJECT COMPARISON API HANDLERS
// ============================================================================

/**
 * GET /api/comparison?baselineId=proj-001&ids=proj-002,proj-003
 * Compare multiple projects
 */
export async function handleCompareProjects(
  baselineProjectId: string,
  comparisonProjectIds: string[],
): Promise<ApiResponse<any>> {
  try {
    if (!baselineProjectId || !comparisonProjectIds.length) {
      throw new Error('Baseline project ID and comparison IDs required')
    }

    const service = getComparisonService()
    const comparison = service.compareProjects(baselineProjectId, comparisonProjectIds)

    return {
      success: true,
      data: comparison,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to compare projects',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/comparison/rankings?projectIds=proj-001,proj-002,proj-003
 * Get project rankings
 */
export async function handleGetRankings(projectIds: string[]): Promise<ApiResponse<any>> {
  try {
    const service = getComparisonService()
    const allProjects = service.getAllProjects()

    const rankings = allProjects
      .filter((p) => projectIds.includes(p.projectId))
      .map((p) => ({
        projectId: p.projectId,
        projectName: p.projectName,
        score: service.calculatePerformanceScore(p.projectId),
        rating: service.getBenchmarkRating('creditsGenerated', p.creditsGenerated),
      }))
      .sort((a, b) => b.score - a.score)

    return {
      success: true,
      data: rankings,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch rankings',
      timestamp: new Date().toISOString(),
    }
  }
}

// ============================================================================
// HISTORICAL ANALYSIS API HANDLERS
// ============================================================================

/**
 * GET /api/history/timeseries?projectId=proj-001&metric=creditsGenerated&days=90
 * Get time-series data
 */
export async function handleGetTimeSeries(
  projectId: string,
  metric: string,
  days: number = 90,
): Promise<ApiResponse<any>> {
  try {
    const service = getHistoricalService()
    const timeSeries = service.getTimeSeriesLastDays(projectId, metric, days)

    return {
      success: true,
      data: timeSeries,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch time-series data',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/history/prediction?projectId=proj-001&metric=creditsGenerated
 * Get trend prediction
 */
export async function handleGetPrediction(projectId: string, metric: string): Promise<ApiResponse<any>> {
  try {
    const service = getHistoricalService()
    const prediction = service.predictTrend(projectId, metric, 90)

    return {
      success: true,
      data: prediction,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate prediction',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/history/seasonal?projectId=proj-001&metric=creditsGenerated
 * Get seasonal analysis
 */
export async function handleGetSeasonalAnalysis(projectId: string, metric: string): Promise<ApiResponse<any>> {
  try {
    const service = getHistoricalService()
    const seasonal = service.analyzeSeasonalPattern(projectId, metric)

    return {
      success: true,
      data: seasonal,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze seasonal pattern',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/history/statistics?projectId=proj-001&metric=creditsGenerated
 * Get statistical analysis
 */
export async function handleGetStatistics(projectId: string, metric: string): Promise<ApiResponse<any>> {
  try {
    const service = getHistoricalService()
    const stats = service.getStatistics(projectId, metric)

    return {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get statistics',
      timestamp: new Date().toISOString(),
    }
  }
}

// ============================================================================
// ADMIN API HANDLERS
// ============================================================================

/**
 * GET /api/admin/metrics
 * Get system metrics
 */
export async function handleGetSystemMetrics(): Promise<ApiResponse<any>> {
  try {
    const service = getAdminService()
    const metrics = service.getMetrics()

    return {
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch system metrics',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/admin/users
 * Get all users
 */
export async function handleGetUsers(): Promise<ApiResponse<any>> {
  try {
    const service = getAdminService()
    const users = service.getAllUsers()

    return {
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * POST /api/admin/users
 * Create new user
 */
export async function handleCreateUser(userData: {
  email: string
  name: string
  role: 'admin' | 'verifier' | 'project_manager' | 'viewer'
  organization: string
}): Promise<ApiResponse<any>> {
  try {
    const service = getAdminService()
    const user = service.createUser(userData)

    return {
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/admin/projects
 * Get all projects
 */
export async function handleGetProjects(): Promise<ApiResponse<any>> {
  try {
    const service = getAdminService()
    const projects = service.getAllProjects()

    return {
      success: true,
      data: projects,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch projects',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * GET /api/admin/audit?resourceType=project&limit=100
 * Get audit logs
 */
export async function handleGetAuditLogs(
  resourceType?: string,
  limit: number = 100,
): Promise<ApiResponse<any>> {
  try {
    const service = getAdminService()
    const logs = service.getAuditLogs(resourceType as any, undefined, limit)

    return {
      success: true,
      data: logs,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch audit logs',
      timestamp: new Date().toISOString(),
    }
  }
}

// ============================================================================
// EXPORT API HANDLERS
// ============================================================================

/**
 * POST /api/export
 * Export data in specified format
 */
export async function handleExport(exportData: {
  data: any
  format: 'csv' | 'json' | 'pdf' | 'excel'
  projectId: string
}): Promise<ApiResponse<any>> {
  try {
    const service = getExportService()
    let result: any

    switch (exportData.format) {
      case 'csv':
        result = await service.exportToCSV(exportData.data, {})
        break
      case 'json':
        result = await service.exportToJSON(exportData.data, {})
        break
      case 'pdf':
        result = await service.exportToPDF(exportData.data, {})
        break
      case 'excel':
        result = await service.exportToExcel(exportData.data, {})
        break
      default:
        throw new Error('Unsupported export format')
    }

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export data',
      timestamp: new Date().toISOString(),
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create Next.js API route handler
 * Usage: export const GET = createHandler(handleGetMarketPrice)
 */
export function createHandler(handler: () => Promise<ApiResponse<any>>) {
  return async (request: Request) => {
    try {
      const result = await handler()
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      const errorResponse: ApiError = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
        statusCode: 500,
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}

/**
 * Parse query parameters
 */
export function getQueryParam(url: string, param: string): string | null {
  const searchParams = new URL(url).searchParams
  return searchParams.get(param)
}

/**
 * Parse multiple query parameters
 */
export function getQueryParams(url: string, ...params: string[]): Record<string, string | null> {
  const searchParams = new URL(url).searchParams
  const result: Record<string, string | null> = {}

  params.forEach((param) => {
    result[param] = searchParams.get(param)
  })

  return result
}

// ============================================================================
// EXAMPLE API ROUTE FILES
// ============================================================================

/*
 * Example 1: app/api/market/price/route.ts
 * 
 * import { createHandler, handleGetMarketPrice } from '@/lib/api-integration'
 * 
 * export const GET = createHandler(handleGetMarketPrice)
 * 
 * // Usage: GET /api/market/price
 * // Response: { success: true, data: { timestamp, priceUSD, ... } }
 */

/*
 * Example 2: app/api/comparison/route.ts
 * 
 * import { handleCompareProjects, getQueryParams } from '@/lib/api-integration'
 * 
 * export async function GET(request: Request) {
 *   const { baselineId, ids } = getQueryParams(request.url, 'baselineId', 'ids')
 *   const comparisonIds = ids?.split(',') || []
 *   return handleCompareProjects(baselineId!, comparisonIds)
 * }
 * 
 * // Usage: GET /api/comparison?baselineId=proj-001&ids=proj-002,proj-003
 * // Response: { success: true, data: { metrics, rankings, trends } }
 */

/*
 * Example 3: app/api/export/route.ts
 * 
 * import { handleExport } from '@/lib/api-integration'
 * 
 * export async function POST(request: Request) {
 *   const body = await request.json()
 *   return handleExport(body)
 * }
 * 
 * // Usage: POST /api/export
 * // Body: { data: {...}, format: 'csv', projectId: '...' }
 * // Response: { success: true, data: { fileName, downloadUrl, ... } }
 */
