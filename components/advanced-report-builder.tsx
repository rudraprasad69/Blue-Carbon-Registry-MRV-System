'use client'

import React, { useState } from 'react'
import type { SatelliteAnalysisResult } from '@/lib/earth-engine-service'
import { getExportService, type ExportOptions, type ReportMetadata } from '@/lib/export-service'

interface AdvancedReportBuilderProps {
  analysisData: SatelliteAnalysisResult
  projectId: string
  projectName: string
  verificationStatus?: 'APPROVED' | 'PENDING' | 'REJECTED'
  estimatedCredits?: number
  onExportComplete?: (fileName: string) => void
}

export function AdvancedReportBuilder({
  analysisData,
  projectId,
  projectName,
  verificationStatus = 'PENDING',
  estimatedCredits = 0,
  onExportComplete
}: AdvancedReportBuilderProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'json' | 'excel' | 'xml'>('pdf')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [includeSatelliteImages, setIncludeSatelliteImages] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reportMetadata: ReportMetadata = {
    title: `Carbon Verification Report - ${projectName}`,
    generatedAt: new Date().toISOString(),
    reportPeriod: '2025-10-01 to 2025-12-31',
    projectId,
    projectName,
    verificationStatus,
    estimatedCredits,
    carbonSequestered: analysisData.biomassEstimate.carbonContent * 100 // Mock calculation
  }

  async function generateReport() {
    try {
      setIsGenerating(true)
      setError(null)
      setDownloadUrl(null)

      const exportService = getExportService()
      const options: ExportOptions = {
        format: selectedFormat,
        includeCharts,
        includeRecommendations,
        includeSatelliteImages,
        projectId,
        projectName
      }

      let result

      switch (selectedFormat) {
        case 'csv':
          result = await exportService.exportToCSV(analysisData, options)
          break
        case 'json':
          result = await exportService.exportToJSON(analysisData, reportMetadata, options)
          break
        case 'excel':
          result = await exportService.exportToExcel(analysisData, reportMetadata, options)
          break
        case 'xml':
          result = await exportService.exportToXML(analysisData, reportMetadata, options)
          break
        case 'pdf':
        default:
          result = await exportService.exportToPDF(analysisData, reportMetadata, options)
      }

      if (result.success) {
        setDownloadUrl(result.downloadUrl || null)
        onExportComplete?.(result.fileName)
        
        // Trigger download
        if (result.downloadUrl) {
          const link = document.createElement('a')
          link.href = result.downloadUrl
          link.download = result.fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        setError(result.error || 'Export failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">📊 Advanced Report Builder</h3>
        <p className="text-slate-400 text-sm">Customize and export verification results with comprehensive analysis</p>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <label className="block text-slate-300 text-sm font-medium">Export Format</label>
        <div className="grid grid-cols-3 gap-3">
          {(['pdf', 'csv', 'json', 'excel', 'xml'] as const).map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                selectedFormat === format
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
              }`}
            >
              {format === 'pdf' && '📄 PDF'}
              {format === 'csv' && '📋 CSV'}
              {format === 'json' && '{ } JSON'}
              {format === 'excel' && '📊 Excel'}
              {format === 'xml' && '🗂️ XML'}
            </button>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-3 bg-slate-800 rounded p-4">
        <label className="block text-slate-300 text-sm font-medium">Include in Export</label>
        
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded">
            <input
              type="checkbox"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600"
            />
            <span className="text-slate-300 text-sm">📊 Charts & Visualizations</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded">
            <input
              type="checkbox"
              checked={includeRecommendations}
              onChange={(e) => setIncludeRecommendations(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600"
            />
            <span className="text-slate-300 text-sm">💡 Recommendations</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded">
            <input
              type="checkbox"
              checked={includeSatelliteImages}
              onChange={(e) => setIncludeSatelliteImages(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600"
            />
            <span className="text-slate-300 text-sm">🛰️ Satellite Images & Maps</span>
          </label>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded p-3 border border-slate-700">
          <p className="text-slate-500 text-xs mb-1">📍 Project</p>
          <p className="text-white font-semibold truncate text-sm">{projectName}</p>
        </div>
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded p-3 border border-slate-700">
          <p className="text-slate-500 text-xs mb-1">✓ Status</p>
          <p className={`font-semibold text-sm ${
            verificationStatus === 'APPROVED' ? 'text-green-400' :
            verificationStatus === 'REJECTED' ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {verificationStatus}
          </p>
        </div>
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded p-3 border border-slate-700">
          <p className="text-slate-500 text-xs mb-1">🎖️ Credits</p>
          <p className="text-white font-semibold text-sm">{estimatedCredits.toLocaleString()}</p>
        </div>
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded p-3 border border-slate-700">
          <p className="text-slate-500 text-xs mb-1">🌱 CO₂</p>
          <p className="text-white font-semibold text-sm">{reportMetadata.carbonSequestered.toFixed(0)} tons</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-4">
          <p className="text-red-300 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Success Display */}
      {downloadUrl && (
        <div className="bg-green-900/30 border border-green-500/30 rounded p-4">
          <p className="text-green-300 text-sm font-semibold flex items-center gap-2">
            <span>✅</span>
            Report generated successfully! Your download should start automatically.
          </p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateReport}
        disabled={isGenerating}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isGenerating
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
        }`}
      >
        {isGenerating ? (
          <>
            <span className="animate-spin">⏳</span>
            Generating {selectedFormat.toUpperCase()}...
          </>
        ) : (
          <>
            <span>📥</span>
            Generate & Download {selectedFormat.toUpperCase()}
          </>
        )}
      </button>

      {/* Format Info */}
      <div className="text-xs text-slate-400 bg-slate-800/50 rounded p-3 border border-slate-700">
        <p className="font-semibold mb-2 text-slate-300">📖 Format Details:</p>
        {selectedFormat === 'pdf' && (
          <ul className="space-y-1">
            <li>✓ Professional formatted report with charts and visualizations</li>
            <li>✓ Digital signature verification ready</li>
            <li>✓ Print-optimized layout</li>
          </ul>
        )}
        {selectedFormat === 'csv' && (
          <ul className="space-y-1">
            <li>✓ Spreadsheet-compatible CSV format</li>
            <li>✓ All metrics and measurements included</li>
            <li>✓ Compatible with Excel, Google Sheets, and other tools</li>
          </ul>
        )}
        {selectedFormat === 'json' && (
          <ul className="space-y-1">
            <li>✓ Structured JSON data format</li>
            <li>✓ API integration ready</li>
            <li>✓ Complete metadata preservation</li>
          </ul>
        )}
        {selectedFormat === 'excel' && (
          <ul className="space-y-1">
            <li>✓ Multi-sheet Excel workbook</li>
            <li>✓ Formatted tables and analysis sections</li>
            <li>✓ Built-in charts and formulas</li>
          </ul>
        )}
        {selectedFormat === 'xml' && (
          <ul className="space-y-1">
            <li>✓ Extensible Markup Language format</li>
            <li>✓ Machine-readable and human-readable</li>
            <li>✓ Good for data exchange between systems</li>
          </ul>
        )}
      </div>
    </div>
  )
}
