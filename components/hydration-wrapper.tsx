/**
 * Hydration-safe wrapper for client components
 * Prevents hydration mismatches by ensuring client-side rendering
 */

'use client'

import { ReactNode, useEffect, useState } from 'react'

interface HydrationWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationWrapper({ children, fallback = null }: HydrationWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return fallback
  }

  return <>{children}</>
}

/**
 * Higher-order component to wrap client components
 * Usage: const SafeComponent = withHydrationSafety(MyComponent)
 */
export function withHydrationSafety<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function SafeComponent(props: P) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      setIsClient(true)
    }, [])

    if (!isClient) {
      return fallback || null
    }

    return <Component {...props} />
  }
}
