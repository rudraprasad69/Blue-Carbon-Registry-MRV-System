"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function LongTermCommitments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Long-Term Buyer Commitment Mechanisms</CardTitle>
        <CardDescription>
          Facilitating long-term offtake agreements between project developers and buyers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
            To ensure the long-term financial viability of blue carbon projects, our platform will enable developers and buyers to enter into multi-year offtake agreements. These commitments provide a stable revenue stream for projects and a guaranteed supply of high-quality carbon credits for buyers.
        </p>
      </CardContent>
    </Card>
  )
}
