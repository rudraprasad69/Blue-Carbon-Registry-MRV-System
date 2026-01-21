'use client'

import { AdminDashboard } from '@/components/admin-dashboard'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-900 to-slate-900 p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">System Administration</h1>
        <p className="text-green-300">Manage users, projects, roles, and audit logs</p>
      </div>

      {/* Admin Dashboard Component */}
      <div className="max-w-7xl mx-auto">
        <AdminDashboard />
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            Admin access granted | Timestamp: {new Date().toISOString()} | System Health: Operational ✓
          </p>
        </div>
      </div>
    </div>
  )
}
