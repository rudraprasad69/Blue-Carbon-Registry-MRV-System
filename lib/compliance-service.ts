/**
 * Regulatory Compliance & Audit Service
 * Handles audit trails, compliance reporting, and regulatory requirements
 */

interface AuditEntry {
  entryId: string
  timestamp: string
  user: string
  action: string
  resourceType: string
  resourceId: string
  changes: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

interface ComplianceReport {
  reportId: string
  generatedAt: string
  period: string
  organization: string
  framework: 'VCS' | 'Gold Standard' | 'CDM' | 'CAR'
  sections: ComplianceSection[]
  status: 'draft' | 'pending-review' | 'approved' | 'published'
  certificationBody?: string
}

interface ComplianceSection {
  name: string
  status: 'compliant' | 'non-compliant' | 'pending'
  findings: string[]
  recommendations: string[]
  evidence: string[]
}

interface RegulatoryRequirement {
  requirementId: string
  framework: string
  requirement: string
  status: 'met' | 'not-met' | 'in-progress'
  deadline: string
  responsible: string
  evidence: string[]
}

interface DataValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
  validatedAt: string
}

class ComplianceService {
  private static instance: ComplianceService
  private auditLog: Map<string, AuditEntry[]> = new Map()
  private complianceReports: Map<string, ComplianceReport> = new Map()
  private regulatoryRequirements: Map<string, RegulatoryRequirement> = new Map()

  private constructor() {
    this.initializeRequirements()
  }

  public static getInstance(): ComplianceService {
    if (!ComplianceService.instance) {
      ComplianceService.instance = new ComplianceService()
    }
    return ComplianceService.instance
  }

  /**
   * Initialize standard regulatory requirements
   */
  private initializeRequirements(): void {
    const requirements: RegulatoryRequirement[] = [
      {
        requirementId: 'req_001',
        framework: 'VCS',
        requirement: 'Additionality Assessment',
        status: 'met',
        deadline: '2026-12-31',
        responsible: 'Project Manager',
        evidence: [
          'Additionality_Assessment_v2.pdf',
          'Financial_Analysis.xlsx',
          'Baseline_Study.pdf'
        ]
      },
      {
        requirementId: 'req_002',
        framework: 'VCS',
        requirement: 'Quantification Methodology',
        status: 'met',
        deadline: '2026-12-31',
        responsible: 'Technical Lead',
        evidence: [
          'Methodology_Document.pdf',
          'Calculation_Spreadsheets.xlsx'
        ]
      },
      {
        requirementId: 'req_003',
        framework: 'VCS',
        requirement: 'Monitoring & Verification Plan',
        status: 'in-progress',
        deadline: '2026-02-28',
        responsible: 'MRV Coordinator',
        evidence: [
          'MRV_Plan_Draft.pdf'
        ]
      },
      {
        requirementId: 'req_004',
        framework: 'Gold Standard',
        requirement: 'Stakeholder Consultation',
        status: 'met',
        deadline: '2026-03-31',
        responsible: 'Community Manager',
        evidence: [
          'Consultation_Report.pdf',
          'Stakeholder_Comments.pdf'
        ]
      },
      {
        requirementId: 'req_005',
        framework: 'Gold Standard',
        requirement: 'SDG Impact Assessment',
        status: 'not-met',
        deadline: '2026-03-15',
        responsible: 'Impact Analyst',
        evidence: []
      }
    ]

    for (const req of requirements) {
      this.regulatoryRequirements.set(req.requirementId, req)
    }
  }

  /**
   * Log audit event
   */
  public logAuditEvent(
    user: string,
    action: string,
    resourceType: string,
    resourceId: string,
    changes: Record<string, any>,
    ipAddress?: string
  ): AuditEntry {
    const entryId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const entry: AuditEntry = {
      entryId,
      timestamp: new Date().toISOString(),
      user,
      action,
      resourceType,
      resourceId,
      changes,
      ipAddress,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }

    if (!this.auditLog.has(resourceId)) {
      this.auditLog.set(resourceId, [])
    }

    this.auditLog.get(resourceId)!.push(entry)
    return entry
  }

  /**
   * Get audit trail for resource
   */
  public getAuditTrail(resourceId: string, limit: number = 100): AuditEntry[] {
    return (this.auditLog.get(resourceId) || []).slice(-limit)
  }

  /**
   * Generate compliance report
   */
  public async generateComplianceReport(
    organization: string,
    framework: 'VCS' | 'Gold Standard' | 'CDM' | 'CAR',
    period: string
  ): Promise<ComplianceReport> {
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const sections: ComplianceSection[] = this.buildComplianceSections(framework)

    const report: ComplianceReport = {
      reportId,
      generatedAt: new Date().toISOString(),
      period,
      organization,
      framework,
      sections,
      status: 'draft'
    }

    this.complianceReports.set(reportId, report)
    return report
  }

  /**
   * Build compliance sections based on framework
   */
  private buildComplianceSections(framework: string): ComplianceSection[] {
    if (framework === 'VCS') {
      return [
        {
          name: 'Additionality',
          status: 'compliant',
          findings: [
            'Project passes additionality test',
            'Without carbon revenue, project would not be viable',
            'Financial analysis demonstrates additionality'
          ],
          recommendations: [],
          evidence: ['Financial_Analysis.pdf', 'Baseline_Study.pdf']
        },
        {
          name: 'Quantification',
          status: 'compliant',
          findings: [
            'Methodology aligns with VCS standards',
            'Conservative emission factors applied',
            'Uncertainty analysis within acceptable limits'
          ],
          recommendations: ['Update emission factors annually'],
          evidence: ['Methodology_Document.pdf']
        },
        {
          name: 'Monitoring & Verification',
          status: 'compliant',
          findings: [
            'MRV plan implements satellite monitoring',
            'QA/QC procedures documented',
            'Third-party verification scheduled'
          ],
          recommendations: [],
          evidence: ['MRV_Plan.pdf', 'QA_QC_Procedures.pdf']
        },
        {
          name: 'Permanence',
          status: 'compliant',
          findings: [
            'Project duration: 25 years',
            'Insurance coverage in place',
            'Land rights confirmed'
          ],
          recommendations: [],
          evidence: ['Insurance_Certificate.pdf', 'Land_Deed.pdf']
        }
      ]
    } else if (framework === 'Gold Standard') {
      return [
        {
          name: 'Project Design',
          status: 'compliant',
          findings: [
            'Project design document complete',
            'Stakeholder engagement plan developed',
            'SDG alignment assessed'
          ],
          recommendations: [],
          evidence: ['PDD.pdf', 'Engagement_Plan.pdf']
        },
        {
          name: 'Impact Assessment',
          status: 'non-compliant',
          findings: [
            'SDG impact assessment incomplete',
            'Community benefit analysis pending',
            'Environmental co-benefits not fully quantified'
          ],
          recommendations: [
            'Complete SDG impact assessment by Feb 28',
            'Quantify environmental co-benefits',
            'Engage community stakeholders'
          ],
          evidence: []
        },
        {
          name: 'Governance',
          status: 'compliant',
          findings: [
            'Governance structure meets Gold Standard requirements',
            'Stakeholder committee established',
            'Grievance mechanism in place'
          ],
          recommendations: [],
          evidence: ['Governance_Structure.pdf', 'Grievance_Policy.pdf']
        }
      ]
    }

    return []
  }

  /**
   * Validate data against compliance requirements
   */
  public validateData(
    data: Record<string, any>,
    validationType: 'project' | 'measurement' | 'transaction'
  ): DataValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    if (validationType === 'project') {
      if (!data.projectId) errors.push('Project ID is required')
      if (!data.location) errors.push('Project location is required')
      if (!data.creditType) errors.push('Credit type is required')
      if (!data.vintage) warnings.push('Vintage year should be specified')
      if (!data.verificationBody) suggestions.push('Consider third-party verification')
    }

    if (validationType === 'measurement') {
      if (!data.measurementDate) errors.push('Measurement date is required')
      if (!data.value) errors.push('Measurement value is required')
      if (data.value < 0) errors.push('Measurement value cannot be negative')
      if (!data.method) errors.push('Measurement method must be specified')
      if (data.uncertainty && data.uncertainty > 20) {
        warnings.push('Measurement uncertainty exceeds 20%')
      }
    }

    if (validationType === 'transaction') {
      if (!data.transactionId) errors.push('Transaction ID is required')
      if (!data.amount) errors.push('Transaction amount is required')
      if (!data.buyer) errors.push('Buyer address is required')
      if (!data.seller) errors.push('Seller address is required')
      if (data.amount <= 0) errors.push('Amount must be positive')
      if (!data.blockchainHash && data.status === 'settled') {
        errors.push('Settled transaction must have blockchain hash')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      validatedAt: new Date().toISOString()
    }
  }

  /**
   * Update requirement status
   */
  public updateRequirementStatus(
    requirementId: string,
    status: 'met' | 'not-met' | 'in-progress',
    evidence?: string[]
  ): RegulatoryRequirement | null {
    const req = this.regulatoryRequirements.get(requirementId)
    if (!req) return null

    req.status = status
    if (evidence) {
      req.evidence = [...req.evidence, ...evidence]
    }

    // Log this as audit event
    this.logAuditEvent(
      'compliance-system',
      'UPDATE_REQUIREMENT',
      'RegulatoryRequirement',
      requirementId,
      { oldStatus: req.status, newStatus: status }
    )

    return req
  }

  /**
   * Get compliance checklist
   */
  public getComplianceChecklist(framework: string): {
    items: Array<{ name: string; status: string; deadline: string }>
    overallProgress: number
  } {
    const items = Array.from(this.regulatoryRequirements.values())
      .filter(r => r.framework === framework)
      .map(r => ({
        name: r.requirement,
        status: r.status,
        deadline: r.deadline
      }))

    const completed = items.filter(i => i.status === 'met').length
    const overallProgress = (completed / items.length) * 100

    return { items, overallProgress }
  }

  /**
   * Generate audit report
   */
  public generateAuditReport(
    resourceId: string,
    startDate: string,
    endDate: string
  ): {
    resourceId: string
    period: string
    totalEvents: number
    eventsByAction: Record<string, number>
    eventsByUser: Record<string, number>
    report: AuditEntry[]
  } {
    const allEvents = this.getAuditTrail(resourceId, 1000)

    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    const report = allEvents.filter(e => {
      const eventTime = new Date(e.timestamp).getTime()
      return eventTime >= start && eventTime <= end
    })

    const eventsByAction: Record<string, number> = {}
    const eventsByUser: Record<string, number> = {}

    for (const event of report) {
      eventsByAction[event.action] = (eventsByAction[event.action] || 0) + 1
      eventsByUser[event.user] = (eventsByUser[event.user] || 0) + 1
    }

    return {
      resourceId,
      period: `${startDate} to ${endDate}`,
      totalEvents: report.length,
      eventsByAction,
      eventsByUser,
      report: report.slice(-50) // Last 50 events
    }
  }

  /**
   * Export compliance data
   */
  public exportComplianceData(
    format: 'json' | 'csv',
    dataType: 'audit' | 'requirements' | 'reports'
  ): string {
    let data: any[] = []

    if (dataType === 'requirements') {
      data = Array.from(this.regulatoryRequirements.values())
    } else if (dataType === 'reports') {
      data = Array.from(this.complianceReports.values())
    }

    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    } else if (format === 'csv') {
      if (data.length === 0) return ''

      const headers = Object.keys(data[0])
      const csv = [
        headers.join(','),
        ...data.map(item =>
          headers
            .map(header => {
              const value = item[header]
              if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value
            })
            .join(',')
        )
      ].join('\n')

      return csv
    }

    return ''
  }

  /**
   * Get compliance metrics
   */
  public getComplianceMetrics(): {
    totalRequirements: number
    metRequirements: number
    pendingRequirements: number
    overallCompliancePercentage: number
  } {
    const all = Array.from(this.regulatoryRequirements.values())
    const met = all.filter(r => r.status === 'met').length
    const pending = all.filter(r => r.status === 'in-progress').length

    return {
      totalRequirements: all.length,
      metRequirements: met,
      pendingRequirements: pending,
      overallCompliancePercentage: (met / all.length) * 100
    }
  }
}

export function getComplianceService(): ComplianceService {
  return ComplianceService.getInstance()
}

export type {
  AuditEntry,
  ComplianceReport,
  ComplianceSection,
  RegulatoryRequirement,
  DataValidationResult
}
