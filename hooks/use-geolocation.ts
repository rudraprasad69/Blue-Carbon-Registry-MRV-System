"use client"

import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        error: "Geolocation is not supported by your browser.",
      }))
      return
    }

    setState((prevState) => ({ ...prevState, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (error) => {
        setState((prevState) => ({
          ...prevState,
          error: error.message,
          loading: false,
        }))
      }
    )
  }

  return { ...state, getGeolocation }
}
