"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DecentralizedTrading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Decentralized Trading Platform</CardTitle>
        <CardDescription>
          A peer-to-peer marketplace for carbon credits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
            Our decentralized trading platform allows buyers and sellers to trade carbon credits directly with each other, without the need for intermediaries. This increases transparency, reduces transaction costs, and empowers market participants.
        </p>
        <Button>Launch Trading Platform</Button>
      </CardContent>
    </Card>
  )
}
