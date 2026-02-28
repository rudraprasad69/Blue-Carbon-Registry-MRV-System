"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export function VerraGoldStandard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verra & Gold Standard Integration</CardTitle>
        <CardDescription>
          Aligning with leading voluntary carbon market standards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-around">
            <Image src="/placeholder-logo.svg" alt="Verra Logo" width={150} height={50} />
            <Image src="/placeholder-logo.svg" alt="Gold Standard Logo" width={150} height={50} />
        </div>
        <p className="text-sm text-muted-foreground">
            Our platform is designed to be compatible with methodologies from Verra's Verified Carbon Standard (VCS) Program and The Gold Standard for the Global Goals, ensuring that projects can achieve dual certification and access a wider market.
        </p>
      </CardContent>
    </Card>
  )
}
