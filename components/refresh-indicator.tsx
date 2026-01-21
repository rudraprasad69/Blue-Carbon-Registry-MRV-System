"use client"

import { RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RefreshIndicatorProps {
  lastRefresh: string
  isRefreshing: boolean
  onRefresh: () => void
}

export function RefreshIndicator({ lastRefresh, isRefreshing, onRefresh }: RefreshIndicatorProps) {
  const getTimeSinceRefresh = () => {
    const now = new Date()
    const last = new Date(lastRefresh)
    const diffMinutes = Math.floor((now.getTime() - last.getTime()) / 60000)

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes === 1) return "1 minute ago"
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    return `${Math.floor(diffMinutes / 60)} hours ago`
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Last updated: {getTimeSinceRefresh()}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="h-8 gap-2 bg-transparent"
      >
        <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  )
}
