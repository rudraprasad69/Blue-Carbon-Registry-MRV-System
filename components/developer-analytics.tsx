'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDeveloperService, type CreditIssuance, type ProjectTransaction } from "@/lib/developer-service"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ISSUANCE_HISTORY: CreditIssuance[] = getDeveloperService().getCreditIssuanceHistory()
const RECENT_TRANSACTIONS: ProjectTransaction[] = getDeveloperService().getRecentTransactions()
const PROJECTS = getDeveloperService().getProjects()

const projectStatusData = PROJECTS.reduce((acc, project) => {
  const status = project.status.charAt(0).toUpperCase() + project.status.slice(1)
  const existing = acc.find(item => item.name === status)
  if (existing) {
    existing.value += 1
  } else {
    acc.push({ name: status, value: 1 })
  }
  return acc
}, [] as { name: string; value: number }[])

const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#ef4444']

export function DeveloperAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Credits Issued Over Time */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Credits Issued Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={ISSUANCE_HISTORY} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString()}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="credits" stroke="#10b981" fillOpacity={1} fill="url(#colorCredits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Project Status Distribution */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Project Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" nameKey="name" >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <div className="lg:col-span-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.projectName}</TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell className="text-right">{tx.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {tx.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
