"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Leaf, TrendingUp } from "lucide-react"

interface Credit {
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
  dateAdded: string
}

export function SearchResults({ results }: { results: Credit[] }) {
  const getStatusColor = (status: string) => {
    if (status === "verified") return "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    if (status === "pending") return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {results.map((credit) => (
        <Card
          key={credit.id}
          className="border-border hover:border-accent/50 transition-all hover:shadow-md cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{credit.image}</span>
                  <Badge className={getStatusColor(credit.verificationStatus)}>{credit.verificationStatus}</Badge>
                </div>
                <h3 className="font-bold text-foreground truncate">{credit.projectName}</h3>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location & Ecosystem */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{credit.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4" />
                <span className="capitalize">{credit.ecosystem} Ecosystem</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-muted/30 rounded-lg p-3">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-bold text-lg text-primary">${credit.price}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="font-bold text-lg text-foreground">{credit.availableCredits.toLocaleString()}</p>
              </div>
              <div className="flex items-end gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Seq. Rate</p>
                  <p className="font-bold text-foreground">{credit.sequestrationRate}t</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
