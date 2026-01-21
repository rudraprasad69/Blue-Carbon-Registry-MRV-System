"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockBenefitDistribution } from "@/lib/mock-data"
import { Users, TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BenefitDistribution() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Benefit Distribution</h2>
        <p className="text-muted-foreground mt-1">Community benefit sharing and fund distribution history</p>
      </div>

      <div className="space-y-4">
        {mockBenefitDistribution.map((benefit) => (
          <Card key={benefit.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{benefit.benefitType}</CardTitle>
                  <CardDescription>{benefit.projectName}</CardDescription>
                </div>
                <Badge variant={benefit.status === "completed" ? "default" : "secondary"}>
                  {benefit.status === "completed" ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending
                    </div>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Budget */}
                <div className="bg-gradient-marine/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                  <p className="text-xl font-bold text-primary">${benefit.totalBudget.toLocaleString()}</p>
                </div>

                {/* Beneficiaries */}
                <div className="bg-accent/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Beneficiaries</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{benefit.beneficiariesReached.toLocaleString()}</p>
                </div>

                {/* Per Person Amount */}
                <div className="bg-green-100/10 dark:bg-green-900/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-muted-foreground">Per Beneficiary</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">${benefit.amountPerBeneficiary.toFixed(2)}</p>
                </div>

                {/* Distribution Date */}
                <div className="bg-blue-100/10 dark:bg-blue-900/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Date</p>
                  </div>
                  <p className="text-sm font-bold text-blue-600">
                    {new Date(benefit.distributionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Progress Info */}
              <div className="border-t border-border pt-3">
                <p className="text-sm text-muted-foreground">
                  {benefit.status === "completed"
                    ? `Successfully distributed ${benefit.totalBudget.toLocaleString()} across ${benefit.beneficiariesReached.toLocaleString()} beneficiaries`
                    : `Scheduled for distribution to ${benefit.beneficiariesReached.toLocaleString()} beneficiaries`}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
