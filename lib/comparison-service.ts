/**
 * Multi-Project Comparison Service
 * Provides benchmarking and comparative analysis across multiple projects
 * 
 * Features:
 * - Metrics alignment and normalization
 * - Comparative benchmarking
 * - Trend analysis across projects
 * - Performance ranking
 */

// Types are defined locally in this service

export interface ProjectMetrics {
  projectId: string
  projectName: string
  location: string
  creditsGenerated: number
  forestCover: number
  biomassEstimate: number
  carbonSequestered: number
  verificationStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
  lastAnalysisDate: Date
  teamSize: number
  costPerCredit: number
}

export interface ComparisonResult {
  baselineProjectId: string
  comparisonProjects: ProjectMetrics[]
  metrics: {
    creditsGenerated: MetricComparison
    forestCover: MetricComparison
    biomassEstimate: MetricComparison
    carbonSequestered: MetricComparison
    costPerCredit: MetricComparison
  }
  rankings: RankingData[]
  trends: TrendAnalysis[]
  recommendations: string[]
}

export interface MetricComparison {
  baseline: number
  comparison: number[]
  average: number
  min: number
  max: number
  percentileDifference: number[]
}

export interface RankingData {
  projectId: string
  projectName: string
  rank: number
  score: number
  metric: string
  value: number
}

export interface TrendAnalysis {
  projectId: string
  projectName: string
  metric: string
  trendDirection: 'up' | 'down' | 'stable'
  percentageChange: number
  dataPoints: number[]
  period: string
}

export interface BenchmarkThreshold {
  metric: string
  excellent: number
  good: number
  average: number
  poor: number
}

/**
 * Multi-Project Comparison Service - Singleton
 * Manages comparative analysis across projects
 */
class MultiProjectComparisonService {
  private static instance: MultiProjectComparisonService
  private projectsData: Map<string, ProjectMetrics> = new Map()
  private historicalData: Map<string, number[]> = new Map()
  private benchmarkThresholds: Map<string, BenchmarkThreshold> = new Map()

  private constructor() {
    this.initializeBenchmarks()
  }

  static getInstance(): MultiProjectComparisonService {
    if (!this.instance) {
      this.instance = new MultiProjectComparisonService()
    }
    return this.instance
  }

  /**
   * Initialize benchmark thresholds for each metric
   */
  private initializeBenchmarks() {
    this.benchmarkThresholds.set('creditsGenerated', {
      metric: 'creditsGenerated',
      excellent: 10000,
      good: 7500,
      average: 5000,
      poor: 2500,
    })

    this.benchmarkThresholds.set('forestCover', {
      metric: 'forestCover',
      excellent: 90,
      good: 75,
      average: 60,
      poor: 40,
    })

    this.benchmarkThresholds.set('biomassEstimate', {
      metric: 'biomassEstimate',
      excellent: 200,
      good: 150,
      average: 100,
      poor: 50,
    })

    this.benchmarkThresholds.set('carbonSequestered', {
      metric: 'carbonSequestered',
      excellent: 50000,
      good: 37500,
      average: 25000,
      poor: 12500,
    })

    this.benchmarkThresholds.set('costPerCredit', {
      metric: 'costPerCredit',
      excellent: 50,
      good: 75,
      average: 100,
      poor: 150,
    })
  }

  /**
   * Add or update project metrics
   */
  addProjectMetrics(metrics: ProjectMetrics) {
    this.projectsData.set(metrics.projectId, metrics)

    // Initialize historical data if doesn't exist
    if (!this.historicalData.has(metrics.projectId)) {
      this.historicalData.set(metrics.projectId, [])
    }

    // Add to historical data
    const history = this.historicalData.get(metrics.projectId)!
    history.push(metrics.creditsGenerated)
    if (history.length > 12) {
      history.shift() // Keep last 12 months
    }
  }

  /**
   * Compare a baseline project against multiple projects
   */
  compareProjects(baselineProjectId: string, comparisonProjectIds: string[]): ComparisonResult {
    const baselineMetrics = this.projectsData.get(baselineProjectId)
    if (!baselineMetrics) {
      throw new Error(`Project ${baselineProjectId} not found`)
    }

    const comparisonMetrics = comparisonProjectIds
      .map((id) => this.projectsData.get(id))
      .filter((m) => m !== undefined) as ProjectMetrics[]

    const result: ComparisonResult = {
      baselineProjectId,
      comparisonProjects: comparisonMetrics,
      metrics: {
        creditsGenerated: this.calculateMetricComparison(
          baselineMetrics.creditsGenerated,
          comparisonMetrics.map((m) => m.creditsGenerated),
        ),
        forestCover: this.calculateMetricComparison(
          baselineMetrics.forestCover,
          comparisonMetrics.map((m) => m.forestCover),
        ),
        biomassEstimate: this.calculateMetricComparison(
          baselineMetrics.biomassEstimate,
          comparisonMetrics.map((m) => m.biomassEstimate),
        ),
        carbonSequestered: this.calculateMetricComparison(
          baselineMetrics.carbonSequestered,
          comparisonMetrics.map((m) => m.carbonSequestered),
        ),
        costPerCredit: this.calculateMetricComparison(
          baselineMetrics.costPerCredit,
          comparisonMetrics.map((m) => m.costPerCredit),
        ),
      },
      rankings: this.generateRankings([baselineMetrics, ...comparisonMetrics]),
      trends: this.analyzeTrends([baselineMetrics, ...comparisonMetrics]),
      recommendations: this.generateRecommendations(baselineMetrics, comparisonMetrics),
    }

    return result
  }

  /**
   * Calculate comparison metrics between baseline and others
   */
  private calculateMetricComparison(baseline: number, comparison: number[]): MetricComparison {
    const values = [baseline, ...comparison]
    const average = values.reduce((a, b) => a + b, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    const percentileDifference = comparison.map((c) => {
      if (baseline === 0) return 0
      return ((c - baseline) / baseline) * 100
    })

    return {
      baseline,
      comparison,
      average,
      min,
      max,
      percentileDifference,
    }
  }

  /**
   * Generate performance rankings
   */
  private generateRankings(projects: ProjectMetrics[]): RankingData[] {
    const rankings: RankingData[] = []

    // Credits ranking
    const creditsSorted = [...projects].sort((a, b) => b.creditsGenerated - a.creditsGenerated)
    creditsSorted.forEach((p, idx) => {
      rankings.push({
        projectId: p.projectId,
        projectName: p.projectName,
        rank: idx + 1,
        score: p.creditsGenerated,
        metric: 'creditsGenerated',
        value: p.creditsGenerated,
      })
    })

    // Forest cover ranking
    const forestSorted = [...projects].sort((a, b) => b.forestCover - a.forestCover)
    forestSorted.forEach((p, idx) => {
      rankings.push({
        projectId: p.projectId,
        projectName: p.projectName,
        rank: idx + 1,
        score: p.forestCover,
        metric: 'forestCover',
        value: p.forestCover,
      })
    })

    // Carbon sequestration ranking
    const carbonSorted = [...projects].sort((a, b) => b.carbonSequestered - a.carbonSequestered)
    carbonSorted.forEach((p, idx) => {
      rankings.push({
        projectId: p.projectId,
        projectName: p.projectName,
        rank: idx + 1,
        score: p.carbonSequestered,
        metric: 'carbonSequestered',
        value: p.carbonSequestered,
      })
    })

    return rankings
  }

  /**
   * Analyze trends across projects
   */
  private analyzeTrends(projects: ProjectMetrics[]): TrendAnalysis[] {
    const trends: TrendAnalysis[] = []

    projects.forEach((project) => {
      const history = this.historicalData.get(project.projectId) || []

      if (history.length >= 2) {
        const recent = history[history.length - 1]
        const previous = history[history.length - 2]
        const percentageChange = ((recent - previous) / previous) * 100

        const trendDirection = percentageChange > 2 ? 'up' : percentageChange < -2 ? 'down' : 'stable'

        trends.push({
          projectId: project.projectId,
          projectName: project.projectName,
          metric: 'creditsGenerated',
          trendDirection,
          percentageChange,
          dataPoints: history,
          period: `${history.length} months`,
        })
      }
    })

    return trends
  }

  /**
   * Generate recommendations based on comparison
   */
  private generateRecommendations(baseline: ProjectMetrics, comparison: ProjectMetrics[]): string[] {
    const recommendations: string[] = []

    // Compare average metrics
    const avgCredits = comparison.reduce((a, b) => a + b.creditsGenerated, 0) / comparison.length
    if (baseline.creditsGenerated < avgCredits * 0.8) {
      recommendations.push(`Consider implementing best practices from peer projects - average credits: ${avgCredits.toFixed(0)}`)
    }

    const avgForest = comparison.reduce((a, b) => a + b.forestCover, 0) / comparison.length
    if (baseline.forestCover < avgForest * 0.8) {
      recommendations.push(`Forest cover is below average. Consider restoration initiatives.`)
    }

    const avgCarbon = comparison.reduce((a, b) => a + b.carbonSequestered, 0) / comparison.length
    if (baseline.carbonSequestered < avgCarbon * 0.8) {
      recommendations.push(`Carbon sequestration potential not fully realized. Review methodologies.`)
    }

    // Cost efficiency
    const avgCost = comparison.reduce((a, b) => a + b.costPerCredit, 0) / comparison.length
    if (baseline.costPerCredit > avgCost * 1.2) {
      recommendations.push(`Cost per credit is above average. Review operational efficiency.`)
    }

    return recommendations
  }

  /**
   * Get benchmark performance rating
   */
  getBenchmarkRating(metric: string, value: number): 'excellent' | 'good' | 'average' | 'poor' {
    const threshold = this.benchmarkThresholds.get(metric)
    if (!threshold) return 'average'

    if (metric === 'costPerCredit') {
      // Lower is better for cost
      if (value <= threshold.excellent) return 'excellent'
      if (value <= threshold.good) return 'good'
      if (value <= threshold.average) return 'average'
      return 'poor'
    } else {
      // Higher is better for other metrics
      if (value >= threshold.excellent) return 'excellent'
      if (value >= threshold.good) return 'good'
      if (value >= threshold.average) return 'average'
      return 'poor'
    }
  }

  /**
   * Get all projects data
   */
  getAllProjects(): ProjectMetrics[] {
    return Array.from(this.projectsData.values())
  }

  /**
   * Get project metrics by ID
   */
  getProjectMetrics(projectId: string): ProjectMetrics | undefined {
    return this.projectsData.get(projectId)
  }

  /**
   * Calculate overall performance score
   */
  calculatePerformanceScore(projectId: string): number {
    const metrics = this.projectsData.get(projectId)
    if (!metrics) return 0

    // Weighted scoring system
    const creditsScore = Math.min((metrics.creditsGenerated / 10000) * 100, 100)
    const forestScore = Math.min((metrics.forestCover / 100) * 100, 100)
    const carbonScore = Math.min((metrics.carbonSequestered / 50000) * 100, 100)
    const costScore = Math.min(100 - (metrics.costPerCredit / 200) * 100, 100)

    // Weighted average (equal weights)
    const score = (creditsScore + forestScore + carbonScore + costScore) / 4

    return Math.round(score)
  }
}

// Export singleton instance getter
export function getComparisonService(): MultiProjectComparisonService {
  return MultiProjectComparisonService.getInstance()
}
