"use client"

import { type ReactNode, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

interface InteractiveChartWrapperProps {
  title: string
  description?: string
  children: ReactNode
  onHover?: (active: boolean) => void
  stats?: {
    label: string
    value: string | number
    trend?: "up" | "down"
  }[]
}

export function InteractiveChartWrapper({
  title,
  description,
  children,
  onHover,
  stats,
}: InteractiveChartWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHover?.(false)
  }

  return (
    <Card
      className="border-border hover-lift hover-glow group transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base group-hover:text-accent transition-colors">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {isHovered && <Info className="w-4 h-4 text-muted-foreground animate-scale-pop" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-90"}`}>{children}</div>

        {/* Micro stats display */}
        {stats && stats.length > 0 && (
          <div
            className={`grid gap-3 pt-3 border-t border-border grid-cols-${stats.length} transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-75 translate-y-1"
            }`}
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg font-semibold text-primary">
                  {stat.value}
                  {stat.trend && (
                    <span className={`ml-1 text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.trend === "up" ? "↑" : "↓"}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
