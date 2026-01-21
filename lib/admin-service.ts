/**
 * ADMIN SERVICE
 * 
 * Comprehensive administration and monitoring system
 * - User management and permissions
 * - Project oversight
 * - System metrics and analytics
 * - Audit logging and compliance
 */

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'verifier' | 'project_manager' | 'viewer'
  organization: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string
  projectAccess: string[]
}

export interface Project {
  id: string
  name: string
  location: { latitude: number; longitude: number }
  owner: string
  status: 'active' | 'completed' | 'archived'
  creditsGenerated: number
  verificationStatus: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  teamMembers: string[]
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resourceType: 'project' | 'user' | 'report' | 'verification' | 'system'
  resourceId: string
  resourceName: string
  changes: Record<string, any>
  status: 'success' | 'failure'
  ipAddress: string
  metadata: Record<string, any>
}

export interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  activeProjects: number
  totalVerifications: number
  approvedVerifications: number
  totalCreditsIssued: number
  uptime: number
  avgResponseTime: number
  errorRate: number
  lastUpdate: string
}

export interface Permission {
  resource: string
  action: 'read' | 'create' | 'update' | 'delete' | 'approve' | 'reject'
  granted: boolean
}

const rolePermissions: Record<string, Permission[]> = {
  admin: [
    { resource: 'users', action: 'read', granted: true },
    { resource: 'users', action: 'create', granted: true },
    { resource: 'users', action: 'update', granted: true },
    { resource: 'users', action: 'delete', granted: true },
    { resource: 'projects', action: 'read', granted: true },
    { resource: 'projects', action: 'create', granted: true },
    { resource: 'projects', action: 'update', granted: true },
    { resource: 'projects', action: 'delete', granted: true },
    { resource: 'verifications', action: 'approve', granted: true },
    { resource: 'verifications', action: 'reject', granted: true },
    { resource: 'reports', action: 'read', granted: true },
    { resource: 'system', action: 'read', granted: true }
  ],
  verifier: [
    { resource: 'projects', action: 'read', granted: true },
    { resource: 'verifications', action: 'read', granted: true },
    { resource: 'verifications', action: 'approve', granted: true },
    { resource: 'verifications', action: 'reject', granted: true },
    { resource: 'reports', action: 'read', granted: true }
  ],
  project_manager: [
    { resource: 'projects', action: 'read', granted: true },
    { resource: 'projects', action: 'update', granted: true },
    { resource: 'verifications', action: 'read', granted: true },
    { resource: 'reports', action: 'read', granted: true }
  ],
  viewer: [
    { resource: 'projects', action: 'read', granted: true },
    { resource: 'reports', action: 'read', granted: true }
  ]
}

/**
 * Admin Service
 * Manages users, projects, and system monitoring
 */
export class AdminService {
  private users: Map<string, User> = new Map()
  private projects: Map<string, Project> = new Map()
  private auditLogs: AuditLog[] = []
  private metrics: SystemMetrics

  constructor() {
    this.initializeSampleData()
    this.metrics = this.calculateMetrics()
  }

  /**
   * Initialize with sample data for demo
   */
  private initializeSampleData(): void {
    // Sample users
    const sampleUsers: User[] = [
      {
        id: 'user-001',
        email: 'admin@bluecarbonregistry.com',
        name: 'Admin User',
        role: 'admin',
        organization: 'Blue Carbon Registry',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: new Date().toISOString(),
        projectAccess: ['all']
      },
      {
        id: 'user-002',
        email: 'verifier@example.com',
        name: 'John Verifier',
        role: 'verifier',
        organization: 'Verification Team',
        status: 'active',
        createdAt: '2025-01-15T00:00:00Z',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        projectAccess: ['proj-001', 'proj-002']
      }
    ]

    sampleUsers.forEach(user => this.users.set(user.id, user))

    // Sample projects
    const sampleProjects: Project[] = [
      {
        id: 'proj-001',
        name: 'Sundarbans Mangrove Forest',
        location: { latitude: 21.95, longitude: 88.85 },
        owner: 'user-001',
        status: 'active',
        creditsGenerated: 5000,
        verificationStatus: 'APPROVED',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        teamMembers: ['user-001', 'user-002']
      },
      {
        id: 'proj-002',
        name: 'Amazon Rainforest Conservation',
        location: { latitude: -3.5, longitude: -62.2 },
        owner: 'user-001',
        status: 'active',
        creditsGenerated: 8000,
        verificationStatus: 'PENDING',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: new Date().toISOString(),
        teamMembers: ['user-001']
      }
    ]

    sampleProjects.forEach(project => this.projects.set(project.id, project))
  }

  /**
   * Get all users
   */
  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): User | undefined {
    return this.users.get(userId)
  }

  /**
   * Create new user
   */
  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    this.users.set(user.id, user)
    this.logAudit({
      action: 'CREATE',
      resourceType: 'user',
      resourceId: user.id,
      resourceName: user.email,
      userId: 'system',
      userName: 'System',
      changes: user,
      metadata: {},
    })
    return user
  }

  /**
   * Update user
   */
  updateUser(userId: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(userId)
    if (!user) return undefined

    const updated = { ...user, ...updates, id: user.id, createdAt: user.createdAt }
    this.users.set(userId, updated)
    this.logAudit({
      action: 'UPDATE',
      resourceType: 'user',
      resourceId: userId,
      resourceName: user.email,
      userId: 'system',
      userName: 'System',
      changes: updates,
      metadata: {},
    })
    return updated
  }

  /**
   * Delete user
   */
  deleteUser(userId: string): boolean {
    const user = this.users.get(userId)
    if (!user) return false

    this.users.delete(userId)
    this.logAudit({
      action: 'DELETE',
      resourceType: 'user',
      resourceId: userId,
      resourceName: user.email,
      userId: 'system',
      userName: 'System',
      changes: { status: 'deleted' },
      metadata: {},
    })
    return true
  }

  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    return Array.from(this.projects.values())
  }

  /**
   * Get project by ID
   */
  getProjectById(projectId: string): Project | undefined {
    return this.projects.get(projectId)
  }

  /**
   * Create new project
   */
  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const project: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.projects.set(project.id, project)
    this.logAudit({
      action: 'CREATE',
      resourceType: 'project',
      resourceId: project.id,
      resourceName: project.name,
      userId: projectData.owner,
      userName: this.users.get(projectData.owner)?.name || 'Unknown',
      changes: project,
      metadata: {},
    })
    return project
  }

  /**
   * Update project
   */
  updateProject(projectId: string, updates: Partial<Project>): Project | undefined {
    const project = this.projects.get(projectId)
    if (!project) return undefined

    const updated = {
      ...project,
      ...updates,
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: new Date().toISOString()
    }
    this.projects.set(projectId, updated)
    this.logAudit({
      action: 'UPDATE',
      resourceType: 'project',
      resourceId: projectId,
      resourceName: project.name,
      userId: 'system',
      userName: 'System',
      changes: updates,
      metadata: {},
    })
    return updated
  }

  /**
   * Get audit logs
   */
  getAuditLogs(
    resourceType?: string,
    userId?: string,
    limit: number = 100
  ): AuditLog[] {
    let filtered = this.auditLogs

    if (resourceType) {
      filtered = filtered.filter(log => log.resourceType === resourceType)
    }
    if (userId) {
      filtered = filtered.filter(log => log.userId === userId)
    }

    return filtered.slice(-limit).reverse()
  }

  /**
   * Log audit event
   */
  private logAudit(data: Omit<AuditLog, 'id' | 'timestamp' | 'status' | 'ipAddress'>): void {
    const log: AuditLog = {
      ...data,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'success',
      ipAddress: '127.0.0.1' // Mock IP
    }
    this.auditLogs.push(log)
  }

  /**
   * Get system metrics
   */
  getMetrics(): SystemMetrics {
    return this.calculateMetrics()
  }

  /**
   * Calculate system metrics
   */
  private calculateMetrics(): SystemMetrics {
    const totalUsers = this.users.size
    const activeUsers = Array.from(this.users.values()).filter(u => u.status === 'active').length
    const totalProjects = this.projects.size
    const activeProjects = Array.from(this.projects.values()).filter(p => p.status === 'active').length
    const totalVerifications = this.auditLogs.filter(
      l => l.resourceType === 'verification'
    ).length
    const approvedVerifications = totalVerifications / 2 // Mock calculation
    const totalCreditsIssued = Array.from(this.projects.values()).reduce(
      (sum, p) => sum + p.creditsGenerated,
      0
    )

    return {
      totalUsers,
      activeUsers,
      totalProjects,
      activeProjects,
      totalVerifications,
      approvedVerifications,
      totalCreditsIssued,
      uptime: 99.95,
      avgResponseTime: 245, // milliseconds
      errorRate: 0.02,
      lastUpdate: new Date().toISOString()
    }
  }

  /**
   * Get permissions for role
   */
  getPermissions(role: string): Permission[] {
    return rolePermissions[role] || rolePermissions['viewer']
  }

  /**
   * Check permission
   */
  hasPermission(
    role: string,
    resource: string,
    action: 'read' | 'create' | 'update' | 'delete' | 'approve' | 'reject'
  ): boolean {
    const permissions = this.getPermissions(role)
    return permissions.some(p => p.resource === resource && p.action === action && p.granted)
  }
}

// Singleton instance
let adminService: AdminService | null = null

export function getAdminService(): AdminService {
  if (!adminService) {
    adminService = new AdminService()
  }
  return adminService
}
