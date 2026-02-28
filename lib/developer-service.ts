export interface DeveloperProject {
  id: string
  name: string
  status: 'active' | 'pending' | 'completed' | 'rejected'
  creditsIssued: number
  lastUpdate: string
  verificationStatus: 'verified' | 'unverified' | 'in_progress'
}

export interface DeveloperMetrics {
  totalProjects: number
  activeProjects: number
  totalCreditsIssued: number
  pendingVerification: number
  nextAuditDays: number
}

export interface CreditIssuance {
  date: string
  credits: number
}

export interface ProjectTransaction {
  id: string
  projectId: string
  projectName: string
  date: string
  type: 'issuance' | 'transfer' | 'retirement'
  amount: number
  status: 'completed' | 'pending'
}

class DeveloperService {
  private projects: DeveloperProject[] = [
    { id: 'proj-001', name: 'Mangrove Restoration Initiative', status: 'active', creditsIssued: 2500, lastUpdate: '2026-01-15', verificationStatus: 'verified' },
    { id: 'proj-002', name: 'Seagrass Meadow Preservation', status: 'active', creditsIssued: 1800, lastUpdate: '2026-01-20', verificationStatus: 'verified' },
    { id: 'proj-003', name: 'Kelp Forest Expansion', status: 'pending', creditsIssued: 0, lastUpdate: '2026-02-01', verificationStatus: 'in_progress' },
    { id: 'proj-004', name: 'Salt Marsh Carbon Sequestration', status: 'completed', creditsIssued: 5000, lastUpdate: '2025-12-10', verificationStatus: 'verified' },
  ]

  private transactions: ProjectTransaction[] = [
    { id: 'txn-001', projectId: 'proj-001', projectName: 'Mangrove Restoration Initiative', date: '2026-01-15', type: 'issuance', amount: 1000, status: 'completed' },
    { id: 'txn-002', projectId: 'proj-002', projectName: 'Seagrass Meadow Preservation', date: '2026-01-20', type: 'issuance', amount: 800, status: 'completed' },
    { id: 'txn-003', projectId: 'proj-001', projectName: 'Mangrove Restoration Initiative', date: '2026-01-22', type: 'transfer', amount: 500, status: 'completed' },
    { id: 'txn-004', projectId: 'proj-004', projectName: 'Salt Marsh Carbon Sequestration', date: '2025-12-10', type: 'issuance', amount: 5000, status: 'completed' },
  ]

  getMetrics(): DeveloperMetrics {
    return {
      totalProjects: this.projects.length,
      activeProjects: this.projects.filter(p => p.status === 'active').length,
      totalCreditsIssued: this.projects.reduce((sum, p) => sum + p.creditsIssued, 0),
      pendingVerification: this.projects.filter(p => p.verificationStatus === 'in_progress').length,
      nextAuditDays: 18, // Mock data
    }
  }

  getProjects(): DeveloperProject[] {
    return this.projects
  }

  getCreditIssuanceHistory(): CreditIssuance[] {
    return [
      { date: '2025-10-01', credits: 500 },
      { date: '2025-11-01', credits: 800 },
      { date: '2025-12-01', credits: 1200 },
      { date: '2026-01-01', credits: 1800 },
    ]
  }

  getRecentTransactions(): ProjectTransaction[] {
    return this.transactions.slice(0, 5)
  }
}

const developerService = new DeveloperService()

export function getDeveloperService(): DeveloperService {
  return developerService
}
