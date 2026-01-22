import { NextRequest, NextResponse } from 'next/server'
import { getComplianceService } from '@/lib/compliance-service'

/**
 * POST /api/compliance/audit-log
 * Log an audit event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user, action, resourceType, resourceId, changes, ipAddress } = body

    const compliance = getComplianceService()
    const entry = compliance.logAuditEvent(
      user,
      action,
      resourceType,
      resourceId,
      changes,
      ipAddress
    )

    return NextResponse.json({
      success: true,
      auditEntry: {
        entryId: entry.entryId,
        timestamp: entry.timestamp,
        user: entry.user,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId
      }
    })
  } catch (error) {
    console.error('Audit logging error:', error)
    return NextResponse.json(
      { error: 'Failed to log audit event' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compliance/audit-trail
 * Get audit trail for a resource
 */
export async function getAuditTrail(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('resourceId')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID required' },
        { status: 400 }
      )
    }

    const compliance = getComplianceService()
    const trail = compliance.getAuditTrail(resourceId, limit)

    return NextResponse.json({
      resourceId,
      auditTrail: trail.map(entry => ({
        entryId: entry.entryId,
        timestamp: entry.timestamp,
        user: entry.user,
        action: entry.action,
        resourceType: entry.resourceType,
        changes: entry.changes
      })),
      count: trail.length
    })
  } catch (error) {
    console.error('Audit trail fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit trail' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/compliance/report
 * Generate compliance report
 */
export async function generateReport(request: NextRequest) {
  try {
    const body = await request.json()
    const { organization, framework, period } = body

    if (!organization || !framework) {
      return NextResponse.json(
        { error: 'Organization and framework required' },
        { status: 400 }
      )
    }

    const compliance = getComplianceService()
    const report = await compliance.generateComplianceReport(organization, framework, period)

    return NextResponse.json({
      success: true,
      report: {
        reportId: report.reportId,
        organization: report.organization,
        framework: report.framework,
        period: report.period,
        generatedAt: report.generatedAt,
        status: report.status,
        sections: report.sections.map(s => ({
          name: s.name,
          status: s.status,
          findings: s.findings,
          recommendations: s.recommendations
        })),
        compliantSections: report.sections.filter(s => s.status === 'compliant').length,
        totalSections: report.sections.length
      }
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/compliance/validate
 * Validate data against compliance requirements
 */
export async function validateData(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, validationType } = body

    if (!validationType) {
      return NextResponse.json(
        { error: 'Validation type required' },
        { status: 400 }
      )
    }

    const compliance = getComplianceService()
    const result = compliance.validateData(data, validationType)

    return NextResponse.json({
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
      suggestions: result.suggestions,
      validatedAt: result.validatedAt
    })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate data' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compliance/requirements
 * Get regulatory requirements and checklist
 */
export async function getRequirements(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const framework = searchParams.get('framework') || 'VCS'

    const compliance = getComplianceService()
    const checklist = compliance.getComplianceChecklist(framework)

    return NextResponse.json({
      framework,
      checklist: checklist.items.map(item => ({
        name: item.name,
        status: item.status,
        deadline: item.deadline
      })),
      overallProgress: checklist.overallProgress.toFixed(1) + '%',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Requirements fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requirements' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/compliance/requirement
 * Update requirement status
 */
export async function updateRequirement(request: NextRequest) {
  try {
    const body = await request.json()
    const { requirementId, status, evidence } = body

    const compliance = getComplianceService()
    const updated = compliance.updateRequirementStatus(requirementId, status, evidence)

    if (!updated) {
      return NextResponse.json(
        { error: 'Requirement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      requirement: {
        requirementId: updated.requirementId,
        requirement: updated.requirement,
        status: updated.status,
        evidence: updated.evidence,
        deadline: updated.deadline
      }
    })
  } catch (error) {
    console.error('Requirement update error:', error)
    return NextResponse.json(
      { error: 'Failed to update requirement' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compliance/audit-report
 * Generate detailed audit report
 */
export async function getAuditReport(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('resourceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!resourceId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'ResourceId, startDate, and endDate required' },
        { status: 400 }
      )
    }

    const compliance = getComplianceService()
    const report = compliance.generateAuditReport(resourceId, startDate, endDate)

    return NextResponse.json({
      auditReport: {
        resourceId: report.resourceId,
        period: report.period,
        totalEvents: report.totalEvents,
        eventsByAction: report.eventsByAction,
        eventsByUser: report.eventsByUser,
        recentEvents: report.report.slice(0, 10).map(e => ({
          timestamp: e.timestamp,
          user: e.user,
          action: e.action,
          resourceType: e.resourceType
        }))
      }
    })
  } catch (error) {
    console.error('Audit report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audit report' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compliance/metrics
 * Get compliance metrics
 */
export async function getMetrics(request: NextRequest) {
  try {
    const compliance = getComplianceService()
    const metrics = compliance.getComplianceMetrics()

    return NextResponse.json({
      metrics: {
        totalRequirements: metrics.totalRequirements,
        metRequirements: metrics.metRequirements,
        pendingRequirements: metrics.pendingRequirements,
        compliancePercentage: metrics.overallCompliancePercentage.toFixed(1) + '%',
        status: metrics.overallCompliancePercentage >= 80 ? 'On Track' : 'At Risk'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compliance/export
 * Export compliance data
 */
export async function exportData(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = (searchParams.get('format') || 'json') as 'json' | 'csv'
    const dataType = (searchParams.get('type') || 'requirements') as 'audit' | 'requirements' | 'reports'

    const compliance = getComplianceService()
    const exported = compliance.exportComplianceData(format, dataType)

    const headers: Record<string, string> = {
      'Content-Type': format === 'json' ? 'application/json' : 'text/csv',
      'Content-Disposition': `attachment; filename="compliance_${dataType}.${format}"`
    }

    return new NextResponse(exported, { headers })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
