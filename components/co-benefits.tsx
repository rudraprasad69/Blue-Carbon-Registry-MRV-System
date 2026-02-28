"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Droplets, Bird } from "lucide-react"

export function CoBenefits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Co-Benefits Tracking</CardTitle>
        <CardDescription>
          Tracking and quantifying the social and environmental co-benefits of blue carbon projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Bird className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h4 className="font-semibold">Biodiversity</h4>
                <p className="text-sm text-muted-foreground">Increased species richness and habitat restoration.</p>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Droplets className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
                <h4 className="font-semibold">Water Quality</h4>
                <p className="text-sm text-muted-foreground">Improved water clarity and reduced nutrient pollution.</p>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
                <h4 className="font-semibold">Community Livelihoods</h4>
                <p className="text-sm text-muted-foreground">Sustainable livelihoods and economic opportunities for local communities.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
