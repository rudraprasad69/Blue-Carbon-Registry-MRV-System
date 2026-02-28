'use client'

import { useState, useEffect } from 'react'
import { getEarthEngineService, type SatelliteAnalysisResult, type AreaOfInterest } from '@/lib/earth-engine-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAutoRefresh } from '@/hooks/use-auto-refresh'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface SatelliteAnalysisViewerProps {
  areaOfInterest: AreaOfInterest
  startDate: string
  endDate: string
}

export function SatelliteAnalysisViewer({ areaOfInterest, startDate, endDate }: SatelliteAnalysisViewerProps) {
  const [analysisResult, setAnalysisResult] = useState<SatelliteAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { lastRefresh, isRefreshing, manualRefresh } = useAutoRefresh({ interval: 60000 })

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true)
        const service = getEarthEngineService()
        const result = await service.analyzeSatelliteImagery(areaOfInterest, startDate, endDate)
        setAnalysisResult(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analysis')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalysis()
  }, [areaOfInterest, startDate, endDate, lastRefresh])

  if (loading && !isRefreshing) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin text-4xl mb-4">🛰️</div>
        <p className="text-slate-400">Analyzing satellite data...</p>
      </div>
    )
  }

  if (error || !analysisResult) {
    return <div className="text-red-400 text-center p-8">Error: {error || 'Analysis data not available.'}</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Satellite Image and Metrics */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Satellite Image</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResult.images.length > 0 ? (
              <img src={analysisResult.images[0].visualUrl} alt="Satellite" className="rounded-lg" />
            ) : (
              <div className="text-slate-400">No image available</div>
            )}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>NDVI:</span> <span>{analysisResult.vegetationIndices.ndvi.toFixed(3)}</span></div>
            <div className="flex justify-between"><span>Biomass (tons/ha):</span> <span>{analysisResult.biomassEstimate.totalBiomass.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Forest Cover:</span> <span>{analysisResult.landCoverClassification.forest.toFixed(1)}%</span></div>
            <div className="flex justify-between"><span>Cloud Cover:</span> <span className={analysisResult.dataQuality.cloudCover > 20 ? 'text-yellow-400' : ''}>{analysisResult.dataQuality.cloudCover.toFixed(1)}%</span></div>
          </CardContent>
        </Card>
      </div>

      {/* NDVI Time Series */}
      <div className="lg:col-span-2">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>NDVI Time Series</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm" onClick={manualRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                    <span>Last updated: {new Date(lastRefresh).toLocaleTimeString()}</span>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={analysisResult.ndviTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 1]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="NDVI" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
