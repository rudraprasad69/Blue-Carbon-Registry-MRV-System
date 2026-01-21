"use client"

import { useState, useEffect, useCallback } from "react"

interface UseAutoRefreshOptions {
  interval?: number
  enabled?: boolean
}

export function useAutoRefresh({ interval = 5 * 60 * 1000, enabled = true }: UseAutoRefreshOptions = {}) {
  const [lastRefresh, setLastRefresh] = useState(new Date().toISOString())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const manualRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastRefresh(new Date().toISOString())
      setIsRefreshing(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const timer = setInterval(() => {
      setLastRefresh(new Date().toISOString())
    }, interval)

    return () => clearInterval(timer)
  }, [interval, enabled])

  return {
    lastRefresh,
    isRefreshing,
    manualRefresh,
  }
}
