"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function RealtimePayments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Payment Execution</CardTitle>
        <CardDescription>
          Instantaneous settlement of carbon credit trades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
            Leveraging blockchain technology, our platform ensures that payments are executed and settled in real-time, providing immediate liquidity to project owners and sellers.
        </p>
      </CardContent>
    </Card>
  )
}
