"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function FiatOnRamp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fiat On-Ramp/Off-Ramp</CardTitle>
        <CardDescription>
          Easily convert between fiat currencies and stablecoins.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Our integrated fiat on-ramp and off-ramp service allows users to easily purchase stablecoins with their local currency and to convert their stablecoin holdings back to fiat.
        </p>
        <div className="flex gap-4">
            <Button>Buy Stablecoins</Button>
            <Button variant="outline">Sell Stablecoins</Button>
        </div>
      </CardContent>
    </Card>
  )
}
