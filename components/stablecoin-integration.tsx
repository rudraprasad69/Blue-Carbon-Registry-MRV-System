"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export function StablecoinIntegration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stablecoin Integration</CardTitle>
        <CardDescription>
          Seamless payments and settlements using USDC and USDT.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-around">
            <Image src="/placeholder-logo.svg" alt="USDC Logo" width={100} height={50} />
            <Image src="/placeholder-logo.svg" alt="USDT Logo" width={100} height={50} />
        </div>
        <p className="text-sm text-muted-foreground">
            Our platform supports payments and settlements in major stablecoins like USDC and USDT, providing a stable and efficient medium of exchange for carbon credit transactions.
        </p>
      </CardContent>
    </Card>
  )
}
