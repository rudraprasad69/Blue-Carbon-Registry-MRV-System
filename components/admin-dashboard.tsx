'use client'

import React, { useState, useEffect } from 'react'
import { getAdminService, type SystemMetrics, type User, type Project } from '@/lib/admin-service'

interface AdminDashboardProps {
  currentUserId?: string
  currentUserRole?: 'admin' | 'verifier' | 'project_manager' | 'viewer'
}

export function AdminDashboard({ currentUserId = 'user-001', currentUserRole = 'admin' }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'audit'>('overview')
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  function loadAdminData() {
    const adminService = getAdminService()
    
    // Check if user has admin access
    if (currentUserRole !== 'admin') {
      return // In production, redirect to unauthorized page
    }

    setMetrics(adminService.getMetrics())
    setUsers(adminService.getAllUsers())
    setProjects(adminService.getAllProjects())
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-lg border border-slate-700 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">🔧 Admin Dashboard</h1>
        <p className="text-slate-400">System management and monitoring center</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700">
        {(['overview', 'users', 'projects', 'audit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-blue-400 border-b-blue-600'
                : 'text-slate-400 border-b-transparent hover:text-slate-300'
            }`}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'users' && '👥 Users'}
            {tab === 'projects' && '📁 Projects'}
            {tab === 'audit' && '📋 Audit Logs'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <OverviewTab metrics={metrics} />
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <UsersTab users={users} onRefresh={loadAdminData} />
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <ProjectsTab projects={projects} onRefresh={loadAdminData} />
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <AuditTab />
      )}
    </div>
  )
}

/**
 * Overview Tab - System metrics and KPIs
 */
function OverviewTab({ metrics }: { metrics: SystemMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* User Metrics */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">👥 Total Users</p>
            <p className="text-3xl font-bold text-white">{metrics.totalUsers}</p>
          </div>
          <span className="text-2xl">👤</span>
        </div>
        <p className="text-slate-500 text-sm">{metrics.activeUsers} active</p>
        <div className="mt-2 bg-slate-800 rounded h-2">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${(metrics.activeUsers / metrics.totalUsers) * 100}%` }}
          />
        </div>
      </div>

      {/* Project Metrics */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">📁 Total Projects</p>
            <p className="text-3xl font-bold text-white">{metrics.totalProjects}</p>
          </div>
          <span className="text-2xl">🗂️</span>
        </div>
        <p className="text-slate-500 text-sm">{metrics.activeProjects} active</p>
        <div className="mt-2 bg-slate-800 rounded h-2">
          <div
            className="bg-green-600 h-2 rounded"
            style={{ width: `${(metrics.activeProjects / metrics.totalProjects) * 100}%` }}
          />
        </div>
      </div>

      {/* Verification Metrics */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">✓ Verifications</p>
            <p className="text-3xl font-bold text-white">{metrics.totalVerifications}</p>
          </div>
          <span className="text-2xl">✔️</span>
        </div>
        <p className="text-slate-500 text-sm">
          {((metrics.approvedVerifications / metrics.totalVerifications) * 100).toFixed(1)}% approved
        </p>
        <div className="mt-2 bg-slate-800 rounded h-2">
          <div
            className="bg-purple-600 h-2 rounded"
            style={{ width: `${(metrics.approvedVerifications / metrics.totalVerifications) * 100}%` }}
          />
        </div>
      </div>

      {/* Credits Issued */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">🎖️ Credits Issued</p>
            <p className="text-3xl font-bold text-white">{metrics.totalCreditsIssued.toLocaleString()}</p>
          </div>
          <span className="text-2xl">💳</span>
        </div>
        <p className="text-slate-500 text-sm">Active projects contributing</p>
      </div>

      {/* Uptime */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">⏱️ Uptime</p>
            <p className="text-3xl font-bold text-white">{metrics.uptime}%</p>
          </div>
          <span className="text-2xl">🟢</span>
        </div>
        <p className="text-slate-500 text-sm">Last 30 days</p>
      </div>

      {/* Response Time */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">⚡ Avg Response</p>
            <p className="text-3xl font-bold text-white">{metrics.avgResponseTime}ms</p>
          </div>
          <span className="text-2xl">⚙️</span>
        </div>
        <p className="text-slate-500 text-sm">System performance</p>
      </div>
    </div>
  )
}

/**
 * Users Tab - User management
 */
function UsersTab({ users, onRefresh }: { users: User[]; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">User Management</h3>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          + Add User
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Role</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Last Login</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 text-slate-300">{user.email}</td>
                <td className="px-6 py-4 text-slate-300">{user.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Projects Tab - Project management
 */
function ProjectsTab({ projects, onRefresh }: { projects: Project[]; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Project Management</h3>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{project.name}</h4>
                <p className="text-slate-400 text-sm">📍 Lat: {project.location.latitude}, Lon: {project.location.longitude}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.verificationStatus === 'APPROVED'
                    ? 'bg-green-900/30 text-green-300'
                    : project.verificationStatus === 'REJECTED'
                      ? 'bg-red-900/30 text-red-300'
                      : 'bg-yellow-900/30 text-yellow-300'
                }`}
              >
                {project.verificationStatus}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-slate-500 text-xs">Status</p>
                <p className="text-white font-semibold capitalize">{project.status}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Credits Generated</p>
                <p className="text-white font-semibold">{project.creditsGenerated.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Team Members</p>
                <p className="text-white font-semibold">{project.teamMembers.length}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium">
                View Details
              </button>
              <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Audit Tab - Audit logging
 */
function AuditTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Audit Logs</h3>

      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Timestamp</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">User</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Action</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Resource</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 text-slate-400 text-xs">2025-01-21 14:32:00</td>
                <td className="px-6 py-4 text-slate-300">Admin User</td>
                <td className="px-6 py-4 text-slate-300">UPDATE</td>
                <td className="px-6 py-4 text-slate-300">Project: Sundarbans</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs font-medium">
                    Success
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
