/**
 * EXPORT SERVICE
 * 
 * Handles export of verification results to multiple formats:
 * - PDF reports with visualizations
 * - CSV data exports
 * - JSON structured data
 * - Excel workbooks
 */

import type { SatelliteAnalysisResult } from '@/lib/earth-engine-service'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'excel' | 'xml'
  includeCharts: boolean
  includeRecommendations: boolean
  includeSatelliteImages: boolean
  dateRange?: { startDate: string; endDate: string }
  projectId: string
  projectName: string
}

export interface ExportResult {
  success: boolean
  format: string
  fileName: string
  fileSize: number
  generatedAt: string
  downloadUrl?: string
  error?: string
}

export interface ReportMetadata {
  title: string
  generatedAt: string
  reportPeriod: string
  projectId: string
  projectName: string
  verificationStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
  estimatedCredits: number
  carbonSequestered: number
}

/**
 * Export Service
 * Generates and manages data exports in multiple formats
 */
export class ExportService {
  private exportCache: Map<string, ExportResult> = new Map()
  private maxCacheSize = 100

  /**
   * Export verification data to CSV format
   */
  async exportToCSV(
    analysisData: SatelliteAnalysisResult,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const csvContent = this.generateCSVContent(analysisData)
      const fileName = `verification_${options.projectId}_${Date.now()}.csv`
      const blob = new Blob([csvContent], { type: 'text/csv' })
      
      const result: ExportResult = {
        success: true,
        format: 'csv',
        fileName,
        fileSize: blob.size,
        generatedAt: new Date().toISOString(),
        downloadUrl: this.createDataUrl(blob)
      }

      this.cacheExport(fileName, result)
      return result
    } catch (error) {
      return {
        success: false,
        format: 'csv',
        fileName: '',
        fileSize: 0,
        generatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'CSV export failed'
      }
    }
  }

  /**
   * Export verification data to JSON format
   */
  async exportToJSON(
    analysisData: SatelliteAnalysisResult,
    metadata: ReportMetadata,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const jsonData = {
        metadata,
        analysis: analysisData,
        exportedAt: new Date().toISOString(),
        exportOptions: options
      }

      const jsonContent = JSON.stringify(jsonData, null, 2)
      const fileName = `verification_${options.projectId}_${Date.now()}.json`
      const blob = new Blob([jsonContent], { type: 'application/json' })

      const result: ExportResult = {
        success: true,
        format: 'json',
        fileName,
        fileSize: blob.size,
        generatedAt: new Date().toISOString(),
        downloadUrl: this.createDataUrl(blob)
      }

      this.cacheExport(fileName, result)
      return result
    } catch (error) {
      return {
        success: false,
        format: 'json',
        fileName: '',
        fileSize: 0,
        generatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'JSON export failed'
      }
    }
  }

  /**
   * Generate PDF report (client-side with jsPDF library)
   */
  async exportToPDF(
    analysisData: SatelliteAnalysisResult,
    metadata: ReportMetadata,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const doc = new jsPDF()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPos = 20

      // Header
      doc.setFontSize(20)
      doc.text(metadata.title, 105, yPos, { align: 'center' })
      yPos += 10

      // Sub-header
      doc.setFontSize(10)
      doc.text(`Project: ${metadata.projectName} (${metadata.projectId})`, 105, yPos, { align: 'center' })
      yPos += 5
      doc.text(`Generated: ${new Date(metadata.generatedAt).toLocaleString()}`, 105, yPos, { align: 'center' })
      yPos += 15

      // Summary Table
      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: this.generateSummarySheet(metadata, analysisData).slice(2).map(row => [row[0], row[1]]),
        theme: 'striped',
        headStyles: { fillColor: '#0284c7' }
      })
      
      yPos = (doc as any).lastAutoTable.finalY + 15

      // Other sections
      const sections = [
        { title: 'Vegetation Indices', data: this.generateVegetationSheet(analysisData) },
        { title: 'Biomass Estimation', data: this.generateBiomassSheet(analysisData) },
        { title: 'Land Cover Classification', data: this.generateLandcoverSheet(analysisData) },
        { title: 'Climate Data', data: this.generateClimateSheet(analysisData) },
      ]

      for (const section of sections) {
        if (yPos > pageHeight - 40) { // Check for page break
          doc.addPage()
          yPos = 20
        }
        doc.setFontSize(14)
        doc.text(section.title, 14, yPos)
        yPos += 10
        autoTable(doc, {
          startY: yPos,
          head: [section.data[2]],
          body: section.data.slice(3),
          theme: 'grid',
        })
        yPos = (doc as any).lastAutoTable.finalY + 15
      }

      const fileName = `verification_report_${options.projectId}_${Date.now()}.pdf`
      const pdfBlob = doc.output('blob')

      const result: ExportResult = {
        success: true,
        format: 'pdf',
        fileName,
        fileSize: pdfBlob.size,
        generatedAt: new Date().toISOString(),
        downloadUrl: this.createDataUrl(pdfBlob),
      }

      this.cacheExport(fileName, result)
      return result
    } catch (error) {
      return {
        success: false,
        format: 'pdf',
        fileName: '',
        fileSize: 0,
        generatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'PDF export failed'
      }
    }
  }

  /**
   * Generate Excel workbook
   */
  async exportToExcel(
    analysisData: SatelliteAnalysisResult,
    metadata: ReportMetadata,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const wb = XLSX.utils.book_new()

      const sheets = [
        { name: 'Summary', data: this.generateSummarySheet(metadata, analysisData) },
        { name: 'Vegetation', data: this.generateVegetationSheet(analysisData) },
        { name: 'Biomass', data: this.generateBiomassSheet(analysisData) },
        { name: 'Land Cover', data: this.generateLandcoverSheet(analysisData) },
        { name: 'Climate Data', data: this.generateClimateSheet(analysisData) },
      ]

      sheets.forEach(sheet => {
        const ws = XLSX.utils.aoa_to_sheet(sheet.data)
        XLSX.utils.book_append_sheet(wb, ws, sheet.name)
      })

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })

      const fileName = `verification_${options.projectId}_${Date.now()}.xlsx`

      const result: Export_Result = {
        success: true,
        format: 'excel',
        fileName,
        fileSize: blob.size,
        generatedAt: new Date().toISOString(),
        downloadUrl: this.createDataUrl(blob),
      }

      this.cacheExport(fileName, result)
      return result
    } catch (error) {
      return {
        success: false,
        format: 'excel',
        fileName: '',
        fileSize: 0,
        generatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Excel export failed'
      }
    }
  }

  /**
   * Export verification data to XML format
   */
  async exportToXML(
    analysisData: SatelliteAnalysisResult,
    metadata: ReportMetadata,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const xmlContent = this.generateXMLContent(analysisData, metadata)
      const fileName = `verification_${options.projectId}_${Date.now()}.xml`
      const blob = new Blob([xmlContent], { type: 'application/xml' })

      const result: ExportResult = {
        success: true,
        format: 'xml',
        fileName,
        fileSize: blob.size,
        generatedAt: new Date().toISOString(),
        downloadUrl: this.createDataUrl(blob)
      }

      this.cacheExport(fileName, result)
      return result
    } catch (error) {
      return {
        success: false,
        format: 'xml',
        fileName: '',
        fileSize: 0,
        generatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'XML export failed'
      }
    }
  }

  /**
   * Generate CSV content from analysis data
   */
  private generateCSVContent(analysisData: SatelliteAnalysisResult): string {
    const rows: string[] = []

    // Header
    rows.push('Metric,Value,Unit,Quality')

    // Area information
    rows.push(`Area ID,${analysisData.areaId},,-`)
    rows.push(`Analysis Date,${analysisData.analysisDate},,-`)

    // Vegetation Indices
    const veg = analysisData.vegetationIndices
    rows.push(`NDVI,${veg.ndvi.toFixed(3)},-,${analysisData.dataQuality.imageQuality}`)
    rows.push(`EVI,${veg.evi.toFixed(3)},-,${analysisData.dataQuality.imageQuality}`)
    rows.push(`LAI,${veg.lai.toFixed(3)},m²/m²,${analysisData.dataQuality.imageQuality}`)
    rows.push(`GCI,${veg.gci.toFixed(3)},-,${analysisData.dataQuality.imageQuality}`)
    rows.push(`NDBI,${veg.ndbi.toFixed(3)},-,${analysisData.dataQuality.imageQuality}`)
    rows.push(`NDMI,${veg.ndmi.toFixed(3)},-,${analysisData.dataQuality.imageQuality}`)

    // Biomass
    const biomass = analysisData.biomassEstimate
    rows.push(`Total Biomass,${biomass.totalBiomass.toFixed(2)},tons/hectare,good`)
    rows.push(`Carbon Content,${biomass.carbonContent.toFixed(2)},tons CO2e/hectare,good`)
    rows.push(`Sequestration Rate,${biomass.sequestrationRate.toFixed(2)},tons CO2e/hectare/year,good`)

    // Land Cover
    const lc = analysisData.landCoverClassification
    rows.push(`Forest Coverage,${lc.forest.toFixed(1)},%,${analysisData.dataQuality.imageQuality}`)
    rows.push(`Grassland Coverage,${lc.grassland.toFixed(1)},%,${analysisData.dataQuality.imageQuality}`)
    rows.push(`Water Coverage,${lc.water.toFixed(1)},%,${analysisData.dataQuality.imageQuality}`)
    rows.push(`Urban Coverage,${lc.urban.toFixed(1)},%,${analysisData.dataQuality.imageQuality}`)
    rows.push(`Agriculture Coverage,${lc.agriculture.toFixed(1)},%,${analysisData.dataQuality.imageQuality}`)

    // Climate Data
    const climate = analysisData.climateData
    rows.push(`Temperature,${climate.temperature.toFixed(1)},°C,good`)
    rows.push(`Precipitation,${climate.precipitation.toFixed(1)},mm,good`)
    rows.push(`Soil Moisture,${climate.soilMoisture.toFixed(1)},%,good`)

    // Data Quality
    rows.push(`Cloud Cover,${analysisData.dataQuality.cloudCover.toFixed(1)},%,critical`)
    rows.push(`Image Quality,${analysisData.dataQuality.imageQuality},-,-`)

    return rows.join('\n')
  }

  /**
   * Generate XML content from analysis data
   */
  private generateXMLContent(
    analysisData: SatelliteAnalysisResult,
    metadata: ReportMetadata
  ): string {
    const escape = (str: string | number) => str.toString().replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<VerificationReport>\n';
    
    // Metadata
    xml += '  <Metadata>\n';
    xml += `    <Title>${escape(metadata.title)}</Title>\n`;
    xml += `    <GeneratedAt>${escape(metadata.generatedAt)}</GeneratedAt>\n`;
    xml += `    <ReportPeriod>${escape(metadata.reportPeriod)}</ReportPeriod>\n`;
    xml += `    <ProjectId>${escape(metadata.projectId)}</ProjectId>\n`;
    xml += `    <ProjectName>${escape(metadata.projectName)}</ProjectName>\n`;
    xml += `    <VerificationStatus>${escape(metadata.verificationStatus)}</VerificationStatus>\n`;
    xml += `    <EstimatedCredits>${escape(metadata.estimatedCredits)}</EstimatedCredits>\n`;
    xml += `    <CarbonSequestered>${escape(metadata.carbonSequestered)}</CarbonSequestered>\n`;
    xml += '  </Metadata>\n';

    // Analysis Data
    xml += '  <Analysis>\n';
    xml += `    <AreaId>${escape(analysisData.areaId)}</AreaId>\n`;
    xml += `    <AnalysisDate>${escape(analysisData.analysisDate)}</AnalysisDate>\n`;

    xml += '    <VegetationIndices>\n';
    for (const [key, value] of Object.entries(analysisData.vegetationIndices)) {
      xml += `      <${key}>${escape(value.toFixed(3))}</${key}>\n`;
    }
    xml += '    </VegetationIndices>\n';

    xml += '    <BiomassEstimate>\n';
    for (const [key, value] of Object.entries(analysisData.biomassEstimate)) {
      xml += `      <${key}>${escape(value.toFixed(2))}</${key}>\n`;
    }
    xml += '    </BiomassEstimate>\n';

    xml += '    <LandCoverClassification>\n';
    for (const [key, value] of Object.entries(analysisData.landCoverClassification)) {
      xml += `      <${key}>${escape(value.toFixed(1))}</${key}>\n`;
    }
    xml += '    </LandCoverClassification>\n';

    xml += '    <ClimateData>\n';
    for (const [key, value] of Object.entries(analysisData.climateData)) {
      xml += `      <${key}>${escape(value.toFixed(1))}</${key}>\n`;
    }
    xml += '    </ClimateData>\n';
    
    xml += '    <DataQuality>\n';
    xml += `      <CloudCover>${escape(analysisData.dataQuality.cloudCover.toFixed(1))}</CloudCover>\n`;
    xml += `      <ImageQuality>${escape(analysisData.dataQuality.imageQuality)}</ImageQuality>\n`;
    xml += `      <NoDataPercentage>${escape(analysisData.dataQuality.noDataPercentage.toFixed(1))}</NoDataPercentage>\n`;
    xml += '    </DataQuality>\n';

    xml += '  </Analysis>\n';
    xml += '</VerificationReport>';

    return xml;
  }

  /**
   * Generate summary sheet data for Excel
   */
  private generateSummarySheet(
    metadata: ReportMetadata,
    analysisData: SatelliteAnalysisResult
  ): any[] {
    return [
      ['Verification Report Summary'],
      [],
      ['Project Name', metadata.projectName],
      ['Project ID', metadata.projectId],
      ['Report Generated', metadata.generatedAt],
      ['Report Period', metadata.reportPeriod],
      ['Verification Status', metadata.verificationStatus],
      [],
      ['Carbon Metrics'],
      ['Total CO2 Sequestered', `${metadata.carbonSequestered} tons`],
      ['Estimated Credits', metadata.estimatedCredits],
      ['Annual Sequestration Rate', `${analysisData.biomassEstimate.sequestrationRate.toFixed(2)} tons/year`],
      [],
      ['Data Quality'],
      ['Image Quality', analysisData.dataQuality.imageQuality],
      ['Cloud Cover', `${analysisData.dataQuality.cloudCover.toFixed(1)}%`],
      ['No Data Percentage', `${analysisData.dataQuality.noDataPercentage.toFixed(1)}%`]
    ]
  }

  /**
   * Generate vegetation data sheet for Excel
   */
  private generateVegetationSheet(analysisData: SatelliteAnalysisResult): any[] {
    const veg = analysisData.vegetationIndices
    return [
      ['Vegetation Indices'],
      [],
      ['Index', 'Value', 'Range', 'Interpretation'],
      ['NDVI', veg.ndvi.toFixed(3), '-1 to 1', 'Vegetation density'],
      ['EVI', veg.evi.toFixed(3), '-1 to 1', 'Enhanced vegetation index'],
      ['LAI', veg.lai.toFixed(3), '0 to 8+', 'Leaf area index'],
      ['GCI', veg.gci.toFixed(3), '0 to 2+', 'Green chlorophyll index'],
      ['NDBI', veg.ndbi.toFixed(3), '-1 to 1', 'Built-up areas'],
      ['NDMI', veg.ndmi.toFixed(3), '-1 to 1', 'Moisture content']
    ]
  }

  /**
   * Generate biomass data sheet for Excel
   */
  private generateBiomassSheet(analysisData: SatelliteAnalysisResult): any[] {
    const biomass = analysisData.biomassEstimate
    return [
      ['Biomass Estimation'],
      [],
      ['Metric', 'Value', 'Unit'],
      ['Total Biomass', biomass.totalBiomass.toFixed(2), 'tons/hectare'],
      ['Carbon Content', biomass.carbonContent.toFixed(2), 'tons CO2e/hectare'],
      ['Annual Sequestration', biomass.sequestrationRate.toFixed(2), 'tons CO2e/hectare/year'],
      [],
      ['30-Year Projection'],
      ['Projected CO2 Sequestration', (biomass.sequestrationRate * 30).toFixed(2), 'tons CO2e/hectare']
    ]
  }

  /**
   * Generate land cover data sheet for Excel
   */
  private generateLandcoverSheet(analysisData: SatelliteAnalysisResult): any[] {
    const lc = analysisData.landCoverClassification
    const total = lc.forest + lc.grassland + lc.water + lc.urban + lc.agriculture
    return [
      ['Land Cover Classification'],
      [],
      ['Class', 'Percentage', 'Classification Quality'],
      ['Forest', `${lc.forest.toFixed(1)}%`, 'Primary carbon sink'],
      ['Grassland', `${lc.grassland.toFixed(1)}%`, 'Secondary carbon sink'],
      ['Water', `${lc.water.toFixed(1)}%`, 'Aquatic ecosystem'],
      ['Urban', `${lc.urban.toFixed(1)}%`, 'Non-vegetated'],
      ['Agriculture', `${lc.agriculture.toFixed(1)}%`, 'Managed land'],
      ['Total Classified', `${total.toFixed(1)}%`, 'Coverage accuracy']
    ]
  }

  /**
   * Generate climate data sheet for Excel
   */
  private generateClimateSheet(analysisData: SatelliteAnalysisResult): any[] {
    const climate = analysisData.climateData
    return [
      ['Climate Data (ERA5)'],
      [],
      ['Metric', 'Value', 'Unit'],
      ['Temperature', climate.temperature.toFixed(1), '°C'],
      ['Precipitation', climate.precipitation.toFixed(1), 'mm'],
      ['Soil Moisture', climate.soilMoisture.toFixed(1), '%'],
      [],
      ['Annual Averages'],
      ['Temperature Range', '15-30°C', 'Tropical/Subtropical'],
      ['Annual Precipitation', '1500-3000 mm', 'High rainfall region']
    ]
  }

  /**
   * Create data URL for download
   */
  private createDataUrl(blob: Blob): string {
    return URL.createObjectURL(blob)
  }

  /**
   * Cache export result
   */
  private cacheExport(fileName: string, result: ExportResult): void {
    if (this.exportCache.size >= this.maxCacheSize) {
      const firstKey = Array.from(this.exportCache.keys())[0]
      this.exportCache.delete(firstKey)
    }
    this.exportCache.set(fileName, result)
  }

  /**
   * Get cached export
   */
  getCachedExport(fileName: string): ExportResult | undefined {
    return this.exportCache.get(fileName)
  }

  /**
   * List all cached exports
   */
  listCachedExports(): Array<{ fileName: string; result: ExportResult }> {
    return Array.from(this.exportCache.entries()).map(([fileName, result]) => ({
      fileName,
      result
    }))
  }

  /**
   * Clear export cache
   */
  clearCache(): void {
    this.exportCache.clear()
  }
}

// Singleton instance
let exportService: ExportService | null = null

export function getExportService(): ExportService {
  if (!exportService) {
    exportService = new ExportService()
  }
  return exportService
}
