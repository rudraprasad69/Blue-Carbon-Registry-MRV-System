"use client"

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

const OFFLINE_STORAGE_KEY = 'offline-field-data'

export function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  const handleOnline = () => {
    setIsOffline(false)
    syncOfflineData()
  }

  const handleOffline = () => {
    setIsOffline(true)
  }

  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check
    if (navigator.onLine) {
      handleOnline()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getOfflineData = (): any[] => {
    const data = localStorage.getItem(OFFLINE_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  const saveOfflineData = (data: any) => {
    const existingData = getOfflineData()
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify([...existingData, data]))
  }

  const syncOfflineData = useCallback(async () => {
    if (isSyncing || !navigator.onLine) return

    const offlineData = getOfflineData()
    if (offlineData.length === 0) return

    setIsSyncing(true)
    toast({
      title: 'Syncing Offline Data',
      description: `Attempting to sync ${offlineData.length} records.`,
    })

    try {
      // In a real app, you would loop through and send each item to your API
      // For this simulation, we'll just wait and then clear the storage
      for (const record of offlineData) {
        // Simulate API call for each record
        console.log('Syncing record:', record)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      localStorage.removeItem(OFFLINE_STORAGE_KEY)
      toast({
        title: 'Sync Complete',
        description: 'All offline data has been successfully synced.',
      })
    } catch (error) {
      console.error('Offline sync failed:', error)
      toast({
        title: 'Sync Error',
        description: 'Could not sync all offline data. Will try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing, toast])

  return { isOffline, isSyncing, saveOfflineData }
}
