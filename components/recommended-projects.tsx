"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Star } from "lucide-react"

export function RecommendedProjects() {
  const recommendations = [
    {
      id: "rec-1",
      projectName: "Sundarbans Mangrove Restoration",
      ecosystem: "mangrove",
      location: "Bangladesh",
      price: 25,
      reason: "Perfect for your portfolio diversification",
      score: 9.2,
      image: "🌊",
    },
    {
      id: "rec-2",
      projectName: "Seagrass Meadow Conservation",
      ecosystem: "seagrass",
      location: "Australia",
      price: 18,
      reason: "High growth potential with stable ecosystem",
      score: 8.8,
      image: "🌿",
    },
    {
      id: "rec-3",
      projectName: "Atlantic Salt Marsh Protection",
      ecosystem: "saltmarsh",
      location: "USA",
      price: 22,
      reason: "Strong community impact metrics",
      score: 8.5,
      image: "🌾",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recommendations.map((rec) => (
        <Card
          key={rec.id}
          className="border-border bg-gradient-to-br from-primary/5 to-accent/5 hover:border-accent/50 transition-colors"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{rec.image}</span>
                <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{rec.score}</span>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-foreground mt-2">{rec.projectName}</h3>
            <p className="text-xs text-muted-foreground mt-1">{rec.location}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2 bg-accent/10 rounded-lg p-2">
              <Zap className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">{rec.reason}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">${rec.price}</span>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Explore
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
