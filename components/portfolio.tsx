"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TransactionHistory } from "./transaction-history"
import { formatINR, formatINRDecimal, convertToINR } from "@/lib/currency-utils"

interface PortfolioProps {
  userAddress: string | null
}

const portfolioData = {
  holdings: [
    {
      id: "1",
      projectName: "Sundarbans Mangrove Restoration",
      ecosystem: "Mangrove",
      quantity: 500,
      pricePerUnit: 25,
      value: 12500,
      date: "2024-01-15",
    },
    {
      id: "2",
      projectName: "Seagrass Meadow Conservation",
      ecosystem: "Seagrass",
      quantity: 300,
      pricePerUnit: 18,
      value: 5400,
      date: "2024-02-10",
    },
  ],
  impactMetrics: [
    { month: "Jan", co2Sequestered: 450, value: 11250 },
    { month: "Feb", co2Sequestered: 520, value: 12480 },
    { month: "Mar", co2Sequestered: 680, value: 15320 },
    { month: "Apr", co2Sequestered: 720, value: 16560 },
    { month: "May", co2Sequestered: 890, value: 20470 },
    { month: "Jun", co2Sequestered: 950, value: 21850 },
  ],
}

export function Portfolio({ userAddress }: PortfolioProps) {
  const totalValue = portfolioData.holdings.reduce((sum, h) => sum + h.value, 0)
  const totalCredits = portfolioData.holdings.reduce((sum, h) => sum + h.quantity, 0)
  const estimatedCO2 = (totalCredits * 3.7).toFixed(0)

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatINR(convertToINR(totalValue))}</p>
            <p className="text-xs text-muted-foreground mt-2">+12% this month</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{totalCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Across 2 projects</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">CO₂ Sequestered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{estimatedCO2}</p>
            <p className="text-xs text-muted-foreground mt-2">tons equivalent</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Impact Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">🌱</p>
            <p className="text-xs text-muted-foreground mt-2">Ocean Guardian</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolioData.holdings.map((holding) => (
              <div
                key={holding.id}
                className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{holding.projectName}</h3>
                    <p className="text-sm text-muted-foreground">{holding.ecosystem}</p>
                  </div>
                  <span className="font-bold text-primary">{formatINR(convertToINR(holding.value))}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Quantity</p>
                    <p className="font-medium text-foreground">{holding.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Price/Unit</p>
                    <p className="font-medium text-foreground">
                      {formatINRDecimal(convertToINR(holding.pricePerUnit))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Purchased</p>
                    <p className="font-medium text-foreground">{new Date(holding.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <TransactionHistory />

      {/* Impact Over Time */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Portfolio Impact Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData.impactMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
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
              <Line
                type="monotone"
                dataKey="co2Sequestered"
                stroke="var(--color-chart-1)"
                name="CO₂ Sequestered (tons)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-chart-2)"
                name="Portfolio Value (₹)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
