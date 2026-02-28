"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreditRetirement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Retirement Interface</CardTitle>
        <CardDescription>
            Permanently retire carbon credits to claim their environmental benefit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="credit-id">Credit Serial Number</Label>
            <Input id="credit-id" placeholder="Enter credit serial number" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Retire</Label>
            <Input id="quantity" type="number" placeholder="Enter quantity" />
        </div>
        <Button>Retire Credits</Button>
      </CardContent>
    </Card>
  )
}
