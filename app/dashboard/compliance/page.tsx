'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { CheckCircle, AlertCircle, Clock, Download, Filter } from 'lucide-react'

interface AuditEntry {
  timestamp: string
  user: string
  action: string
  resourceType: string
  status: 'success' | 'warning' | 'error'
}

interface RequirementStatus {
  name: string
  status: 'met' | 'not-met' | 'in-progress'
  deadline: string
  evidence: number
}

export default function CompliancePage() {
  const [activeFramework, setActiveFramework] = useState('VCS')
  const [compliancePercentage, setCompliancePercentage] = useState(72)

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      timestamp: '2024-01-22 14:32:15',
      user: 'admin@carboncredits.com',
      action: 'PROJECT_VERIFIED',
      resourceType: 'project',
      status: 'success'
    },
    {
      timestamp: '2024-01-22 13:45:22',
      user: 'auditor@carboncredits.com',
      action: 'COMPLIANCE_CHECK',
      resourceType: 'compliance',
      status: 'success'
    },
    {
      timestamp: '2024-01-22 12:18:45',
      user: 'trader@carboncredits.com',
      action: 'TRADE_EXECUTED',
      resourceType: 'transaction',
      status: 'success'
    },
    {
      timestamp: '2024-01-22 11:05:33',
      user: 'system',
      action: 'DATA_VALIDATION',
      resourceType: 'measurement',
      status: 'warning'
    },
    {
      timestamp: '2024-01-22 10:22:11',
      user: 'admin@carboncredits.com',
      action: 'REQUIREMENT_UPDATED',
      resourceType: 'requirement',
      status: 'success'
    }
  ])

  const [vcsRequirements, setVcsRequirements] = useState<RequirementStatus[]>([
    {
      name: 'Additionality Assessment',
      status: 'met',
      deadline: '2024-02-15',
      evidence: 5
    },
    {
      name: 'Quantification Methodology',
      status: 'met',
      deadline: '2024-02-20',
      evidence: 8
    },
    {
      name: 'Monitoring & Verification',
      status: 'in-progress',
      deadline: '2024-02-28',
      evidence: 3
    },
    {
      name: 'Permanence Assurance',
      status: 'met',
      deadline: '2024-03-05',
      evidence: 6
    }
  ])

  const [gsRequirements, setGsRequirements] = useState<RequirementStatus[]>([
    {
      name: 'Stakeholder Consultation',
      status: 'met',
      deadline: '2024-02-10',
      evidence: 4
    },
    {
      name: 'SDG Impact Assessment',
      status: 'not-met',
      deadline: '2024-03-15',
      evidence: 0
    },
    {
      name: 'Co-benefit Analysis',
      status: 'in-progress',
      deadline: '2024-03-20',
      evidence: 2
    }
  ])

  const [complianceTrend, setComplianceTrend] = useState([
    { date: '2024-01-08', vcs: 60, gs: 55, cdm: 58, car: 62 },
    { date: '2024-01-11', vcs: 62, gs: 57, cdm: 60, car: 64 },
    { date: '2024-01-15', vcs: 65, gs: 60, cdm: 63, car: 66 },
    { date: '2024-01-18', vcs: 68, gs: 63, cdm: 65, car: 68 },
    { date: '2024-01-22', vcs: 72, gs: 64, cdm: 68, car: 70 }
  ])

  const [auditByAction, setAuditByAction] = useState([
    { action: 'PROJECT_VERIFIED', count: 234 },
    { action: 'COMPLIANCE_CHECK', count: 189 },
    { action: 'TRADE_EXECUTED', count: 1250 },
    { action: 'DATA_VALIDATION', count: 567 },
    { action: 'REQUIREMENT_UPDATED', count: 89 }
  ])

  const [frameworkComparison, setFrameworkComparison] = useState([
    { framework: 'VCS', completed: 72, pending: 28 },
    { framework: 'Gold Standard', completed: 64, pending: 36 },
    { framework: 'CDM', completed: 68, pending: 32 },
    { framework: 'CAR', completed: 70, pending: 30 }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'not-met':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'not-met':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      default:
        return ''
    }
  }

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Compliance & Audit Management</h1>
        <p className="text-slate-300 text-lg">
          Monitor regulatory compliance, audit trails, and certification requirements
        </p>
      </div>

      {/* Overall Compliance Score */}
      <Card className="bg-slate-800 border-blue-500/30 mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-2xl">Overall Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Compliance Gauge */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${(compliancePercentage / 100) * 282.6} 282.6`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-400">{compliancePercentage}%</p>
                    <p className="text-xs text-slate-400">Compliant</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300 text-center">On Track</p>
            </div>

            {/* Framework Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white mb-4">Certification Frameworks</h3>
              {frameworkComparison.map(fw => (
                <div key={fw.framework}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300">{fw.framework}</span>
                    <span className="text-sm font-semibold text-emerald-400">{fw.completed}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                      style={{ width: `${fw.completed}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">18</p>
                    <p className="text-xs text-slate-400">Requirements Met</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">5</p>
                    <p className="text-xs text-slate-400">In Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">2</p>
                    <p className="text-xs text-slate-400">Not Met</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">2,847</p>
                    <p className="text-xs text-slate-400">Audit Events</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-4">
          <Tabs defaultValue="vcs" className="space-y-4">
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="vcs">VCS Framework</TabsTrigger>
              <TabsTrigger value="goldstandard">Gold Standard</TabsTrigger>
            </TabsList>

            {/* VCS Requirements */}
            <TabsContent value="vcs">
              <Card className="bg-slate-800 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">VCS Framework Requirements</CardTitle>
                  <CardDescription>Verified Carbon Standard compliance checklist</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vcsRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-4 border ${getStatusColor(req.status)} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {getStatusIcon(req.status)}
                        <div>
                          <p className="font-semibold text-white">{req.name}</p>
                          <p className="text-xs opacity-75">
                            Deadline: {req.deadline} • {req.evidence} evidence items
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase opacity-75">
                        {req.status === 'met'
                          ? 'Approved'
                          : req.status === 'in-progress'
                          ? 'In Progress'
                          : 'Not Met'}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gold Standard Requirements */}
            <TabsContent value="goldstandard">
              <Card className="bg-slate-800 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Gold Standard Requirements</CardTitle>
                  <CardDescription>Gold Standard certification checklist</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gsRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-4 border ${getStatusColor(req.status)} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {getStatusIcon(req.status)}
                        <div>
                          <p className="font-semibold text-white">{req.name}</p>
                          <p className="text-xs opacity-75">
                            Deadline: {req.deadline} • {req.evidence} evidence items
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase opacity-75">
                        {req.status === 'met'
                          ? 'Approved'
                          : req.status === 'in-progress'
                          ? 'In Progress'
                          : 'Not Met'}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit">
          <Card className="bg-slate-800 border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Audit Trail</CardTitle>
                  <CardDescription>Complete record of all system actions and changes</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLog.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {entry.status === 'success' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {entry.status === 'warning' && (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        {entry.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-mono text-sm text-slate-300">{entry.timestamp}</span>
                      </div>
                      <span className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded">
                        {entry.resourceType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{entry.action}</p>
                        <p className="text-xs text-slate-400">User: {entry.user}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Compliance Trend */}
          <Card className="bg-slate-800 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Compliance Trend</CardTitle>
              <CardDescription>Compliance percentage by framework over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={complianceTrend}>
                  <defs>
                    <linearGradient id="colorVcs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="vcs"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorVcs)"
                    name="VCS"
                  />
                  <Area
                    type="monotone"
                    dataKey="gs"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    name="Gold Standard"
                  />
                  <Area
                    type="monotone"
                    dataKey="cdm"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.2}
                    name="CDM"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Audit Events by Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Audit Events by Type</CardTitle>
                <CardDescription>Distribution of audit activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={auditByAction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="action" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Framework Compliance Distribution */}
            <Card className="bg-slate-800 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Compliance Distribution</CardTitle>
                <CardDescription>Completed vs pending by framework</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: 274 },
                        { name: 'Pending', value: 126 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Section */}
      <Card className="bg-slate-800 border-blue-500/30 mt-8">
        <CardHeader>
          <CardTitle className="text-white">Export Reports</CardTitle>
          <CardDescription>Download compliance documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Audit Report', 'Compliance Report', 'Requirements Summary', 'Certification Package'].map(
              (report, idx) => (
                <Button
                  key={idx}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4" />
                  {report}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
