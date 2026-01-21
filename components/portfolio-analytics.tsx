"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockPortfolioAnalytics } from "@/lib/mock-data"
import { formatINR, convertToINR, formatINRDecimal } from "@/lib/currency-utils"

export function PortfolioAnalytics() {
  return (
    <div className="space-y-4">
      {mockPortfolioAnalytics.map((portfolio) => (
        <Card key={portfolio.id} className="border-border hover:border-accent/50 transition-colors">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              {/* Project Info */}
              <div>
                <h3 className="font-bold text-foreground mb-1">{portfolio.projectName}</h3>
                <p className="text-xs text-muted-foreground mb-2">{portfolio.location}</p>
                <Badge
                  className={
                    portfolio.riskProfile === "low"
                      ? "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }
                >
                  {portfolio.riskProfile.toUpperCase()} RISK
                </Badge>
              </div>

              {/* Holdings Value */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Holdings Value</p>
                <p className="text-2xl font-bold text-primary">{formatINR(convertToINR(portfolio.holdingsValue))}</p>
              </div>

              {/* Price Per Credit */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Price Per Credit</p>
                <p className="text-2xl font-bold text-accent">
                  {formatINRDecimal(convertToINR(portfolio.pricePerCredit))}
                </p>
              </div>

              {/* Yearly Impact */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Yearly CO₂ Impact</p>
                <p className="text-xl font-bold text-green-600">{portfolio.yearlyImpact}t</p>
              </div>

              {/* Diversification */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Diversification Score</p>
                <p className="text-xl font-bold text-foreground mb-1">{portfolio.diversificationScore}/10</p>
                <Progress value={portfolio.diversificationScore * 10} className="h-2" />
              </div>

              {/* Recommendation */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Recommendation</p>
                <p className="text-sm text-foreground font-medium">{portfolio.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
