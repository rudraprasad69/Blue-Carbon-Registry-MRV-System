"use client"

import { Info, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface DataQualityBadgeProps {
  quality: {
    overall: number
    confidence: number
    source: string
    dataAge: number
  }
  compact?: boolean
}

export function DataQualityBadge({ quality, compact = false }: DataQualityBadgeProps) {
  const getQualityColor = (score: number) => {
    if (score >= 90) return "bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    if (score >= 75) return "bg-blue-100/20 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    if (score >= 60) return "bg-yellow-100/20 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "bg-red-100/20 text-red-700 dark:bg-red-900/20 dark:text-red-400"
  }

  const getQualityLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 75) return "Good"
    if (score >= 60) return "Fair"
    return "Poor"
  }

  const getAgeWarning = (hours: number) => {
    if (hours < 1) return "Fresh data"
    if (hours < 24) return `${Math.floor(hours)}h old`
    return `${Math.floor(hours / 24)}d old`
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={cn("cursor-help gap-1", getQualityColor(quality.overall))}>
              <TrendingUp className="w-3 h-3" />
              <span>{getQualityLabel(quality.overall)}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-semibold">Data Quality Details</p>
              <p className="text-xs">Overall Score: {quality.overall}%</p>
              <p className="text-xs">Confidence: {quality.confidence}%</p>
              <p className="text-xs">Source: {quality.source}</p>
              <p className="text-xs">{getAgeWarning(quality.dataAge)}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={cn("p-3 rounded-lg border", getQualityColor(quality.overall))}>
      <div className="flex items-start gap-3">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-sm">
          <div className="font-semibold mb-1">
            Data Quality: {getQualityLabel(quality.overall)} ({quality.overall}%)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs opacity-90">
            <div>Confidence: {quality.confidence}%</div>
            <div>Source: {quality.source}</div>
            <div>{getAgeWarning(quality.dataAge)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
