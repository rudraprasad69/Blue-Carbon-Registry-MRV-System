"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CommunityWallet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Wallet Integration</CardTitle>
        <CardDescription>
            Empowering local communities with direct access to funds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Our platform includes a dedicated wallet solution for local communities, allowing them to directly receive and manage funds from the sale of carbon credits. This promotes transparency and ensures that the benefits of blue carbon projects flow directly to the communities that are stewarding these critical ecosystems.
        </p>
        <Button>Access Community Wallet</Button>
      </CardContent>
    </Card>
  )
}
