"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Code2, Shield, Zap } from "lucide-react"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ValidationRecord {
  id: string
  creditBatch: string
  dataSource: string
  submissionDate: string
  validationStatus: "verified" | "validating" | "failed" | "pending"
  smartContractHash: string
  verificationAccuracy: number
  dataPoints: number
  estimatedCredits: number
}

const mockValidationData: ValidationRecord[] = [
  {
    id: "val-1",
    creditBatch: "SMR-2024-06-001",
    dataSource: "Satellite + Ground Sensors",
    submissionDate: "2024-06-15T10:30:00",
    validationStatus: "verified",
    smartContractHash: "0x7a2c8f9e1d4b6c3e5f2a8b9d7c6e4f1a",
    verificationAccuracy: 98.5,
    dataPoints: 24580,
    estimatedCredits: 2450,
  },
  {
    id: "val-2",
    creditBatch: "SGM-2024-06-015",
    dataSource: "Drone Imagery + Field Data",
    submissionDate: "2024-06-14T14:45:00",
    validationStatus: "validating",
    smartContractHash: "0x3e9f1c7d4b2a6e8f5c3d1a9b7e6f4c2a",
    verificationAccuracy: 0,
    dataPoints: 18920,
    estimatedCredits: 1892,
  },
  {
    id: "val-3",
    creditBatch: "ASM-2024-06-008",
    dataSource: "Satellite + Water Quality Sensors",
    submissionDate: "2024-06-13T09:15:00",
    validationStatus: "pending",
    smartContractHash: "0x5d6c7b4e1f3a2c8d9e6f4a1b3c5d7e8f",
    verificationAccuracy: 0,
    dataPoints: 15640,
    estimatedCredits: 1564,
  },
  {
    id: "val-4",
    creditBatch: "SMR-2024-05-032",
    dataSource: "Satellite + Ground Sensors",
    submissionDate: "2024-05-30T11:20:00",
    validationStatus: "failed",
    smartContractHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    verificationAccuracy: 45.2,
    dataPoints: 12350,
    estimatedCredits: 1235,
  },
]

const validationTrendData = [
  { date: "Jun 1", verified: 45, pending: 8, failed: 2, validating: 3 },
  { date: "Jun 5", verified: 52, pending: 5, failed: 2, validating: 4 },
  { date: "Jun 10", verified: 61, pending: 3, failed: 3, validating: 2 },
  { date: "Jun 15", verified: 72, pending: 2, failed: 3, validating: 1 },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "verified":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case "validating":
      return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
    case "pending":
      return <AlertCircle className="w-5 h-5 text-yellow-600" />
    case "failed":
      return <AlertCircle className="w-5 h-5 text-red-600" />
    default:
      return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "verified":
      return "bg-green-500/20 text-green-700 dark:text-green-400"
    case "validating":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
    case "pending":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
    case "failed":
      return "bg-red-500/20 text-red-700 dark:text-red-400"
    default:
      return "bg-gray-500/20 text-gray-700"
  }
}

export function VerificationValidationLayer() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const verifiedCount = mockValidationData.filter((v) => v.validationStatus === "verified").length
  const validatingCount = mockValidationData.filter((v) => v.validationStatus === "validating").length
  const pendingCount = mockValidationData.filter((v) => v.validationStatus === "pending").length
  const failedCount = mockValidationData.filter((v) => v.validationStatus === "failed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Verification & Validation Layer</h2>
        <p className="text-muted-foreground mt-1">Smart contract-based credit validation and blockchain recording</p>
      </div>

      {/* Validation Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border hover:border-green-500/50 transition-colors group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Credits on blockchain</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-blue-500/50 transition-colors group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              Validating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{validatingCount}</p>
            <p className="text-xs text-muted-foreground mt-2">In process</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-yellow-500/50 transition-colors group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600 group-hover:scale-110 transition-transform" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting validation</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-red-500/50 transition-colors group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{failedCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Trend Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Validation Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={validationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend />
              <Bar dataKey="verified" fill="#10b981" name="Verified" radius={[8, 8, 0, 0]} />
              <Bar dataKey="validating" fill="#3b82f6" name="Validating" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[8, 8, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Validation Records */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Validation Records</h3>
        {mockValidationData.map((record) => (
          <Card
            key={record.id}
            className="border-border hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-accent/20 transition-colors">
                    {getStatusIcon(record.validationStatus)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{record.creditBatch}</h3>
                    <p className="text-sm text-muted-foreground">{record.dataSource}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(record.validationStatus)}>
                  {record.validationStatus.charAt(0).toUpperCase() + record.validationStatus.slice(1)}
                </Badge>
              </div>

              {/* Collapsed View Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Data Points</p>
                  <p className="font-semibold text-base text-primary">{record.dataPoints.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Est. Credits</p>
                  <p className="font-semibold text-base text-accent">{record.estimatedCredits.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Submission Date</p>
                  <p className="font-semibold text-base text-foreground">
                    {new Date(record.submissionDate).toLocaleDateString()}
                  </p>
                </div>
                {record.validationStatus === "verified" && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                    <p className="font-semibold text-base text-green-600">{record.verificationAccuracy}%</p>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {expandedId === record.id && (
                <div className="mt-6 pt-6 border-t border-border space-y-4 animate-in fade-in">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="w-4 h-4 text-accent" />
                      <p className="text-sm font-semibold text-foreground">Smart Contract Hash</p>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground break-all">{record.smartContractHash}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Validation Accuracy</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${record.verificationAccuracy}%` }}
                        />
                      </div>
                      <p className="text-sm font-semibold text-foreground mt-1">{record.verificationAccuracy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Validation Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.validationStatus)}
                        <span className="text-sm font-semibold text-foreground capitalize">
                          {record.validationStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      This validation record has been recorded on the blockchain and is cryptographically secured.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
