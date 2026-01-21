"use client"

import { useState } from "react"
import { MapPin, TrendingUp, CheckCircle, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PurchaseModal } from "./purchase-modal"
import { DataQualityBadge } from "./data-quality-badge"
import { formatINRDecimal, convertToINR } from "@/lib/currency-utils"

interface CreditCardProps {
  credit: {
    id: string
    projectName: string
    ecosystem: string
    location: string
    price: number
    availableCredits: number
    sequestrationRate: number
    verificationStatus: "verified" | "pending" | "auditing"
    developerId: string
    image: string
    lastUpdated?: string
    dataQuality?: { overall: number; confidence: number; source: string; dataAge: number }
  }
}

export function CreditCard({ credit }: CreditCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const verificationColors = {
    verified: "bg-green-500/20 text-green-700 dark:text-green-400",
    pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    auditing: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  }

  return (
    <>
      <Card className="overflow-hidden border-border hover:shadow-lg hover:border-accent/50 transition-all duration-300 cursor-pointer hover:-translate-y-1">
        {/* Image */}
        <div className="h-48 bg-gradient-marine relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🌊</div>
          <div className="absolute top-4 right-4">
            <Badge className={`${verificationColors[credit.verificationStatus]}`}>
              {credit.verificationStatus === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
              {credit.verificationStatus}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Project Info */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-foreground mb-1">{credit.projectName}</h3>
            <p className="text-sm text-muted-foreground">{credit.ecosystem}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{credit.location}</span>
          </div>

          {/* Data Quality Indicator */}
          {credit.dataQuality && (
            <div className="mb-4">
              <DataQualityBadge quality={credit.dataQuality} compact={true} />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sequestration Rate</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="font-semibold text-sm text-foreground">{credit.sequestrationRate}</span>
                <span className="text-xs text-muted-foreground">tCO₂/ha/yr</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Available</p>
              <p className="font-semibold text-sm text-foreground">{credit.availableCredits.toLocaleString()}</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{formatINRDecimal(convertToINR(credit.price))}</span>
            <span className="text-sm text-muted-foreground">per credit</span>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Button
            onClick={() => setShowPurchaseModal(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Purchase Credits
          </Button>
        </CardFooter>
      </Card>

      <PurchaseModal credit={credit} open={showPurchaseModal} onOpenChange={setShowPurchaseModal} />
    </>
  )
}
