"use client"

import { useState, useEffect } from "react"
import { Filters } from "./filters"
import { CreditCard } from "./credit-card"
import { mockCredits } from "@/lib/mock-data"

interface CreditExplorerProps {
  walletConnected: boolean
}

export function CreditExplorer({ walletConnected }: CreditExplorerProps) {
  const [filteredCredits, setFilteredCredits] = useState(mockCredits)
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "newest">("price-low")
  const [credits, setCredits] = useState(mockCredits)
  const [filters, setFilters] = useState({
    ecosystem: [] as string[],
    priceRange: [0, 100],
    verificationOnly: false,
  })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Initialize lastUpdated only on client
  useEffect(() => {
    setIsClient(true)
    setLastUpdated(new Date())
  }, [])

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const updatedCredits = mockCredits.map((credit) => ({
        ...credit,
        lastUpdated: new Date().toISOString(),
        price: Math.max(15, credit.price + (Math.random() - 0.5) * 2),
      }))
      setCredits(updatedCredits)
      setLastUpdated(new Date())
      // Re-apply current filters when data refreshes
      applyFiltersAndSort(updatedCredits, filters, sortBy)
    }, 30000)

    return () => clearInterval(refreshInterval)
  }, [filters, sortBy])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    applyFiltersAndSort(credits, newFilters, sortBy)
  }

  const handleSortChange = (newSort: "price-low" | "price-high" | "newest") => {
    setSortBy(newSort)
    applyFiltersAndSort(credits, filters, newSort)
  }

  const applyFiltersAndSort = (
    creditsToFilter: typeof mockCredits,
    filtersToApply: typeof filters,
    sortMethod: typeof sortBy,
  ) => {
    let filtered = creditsToFilter

    if (filtersToApply.ecosystem && filtersToApply.ecosystem.length > 0) {
      filtered = filtered.filter((c) => filtersToApply.ecosystem.includes(c.ecosystem))
    }

    filtered = filtered.filter(
      (c) => c.price >= filtersToApply.priceRange[0] && c.price <= filtersToApply.priceRange[1],
    )

    if (filtersToApply.verificationOnly) {
      filtered = filtered.filter((c) => c.verificationStatus === "verified")
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortMethod === "price-low") return a.price - b.price
      if (sortMethod === "price-high") return b.price - a.price
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    })

    setFilteredCredits(sorted)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <Filters onChange={handleFilterChange} onSortChange={handleSortChange} />
      </div>

      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Available Credits</h2>
            <p className="text-muted-foreground mt-1">
              {filteredCredits.length} verified blue carbon credits available for purchase
            </p>
            {isClient && lastUpdated && (
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {lastUpdated.toLocaleTimeString()} (refreshes every 30 seconds)
              </p>
            )}
          </div>
        </div>

        {walletConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCredits.map((credit) => (
              <CreditCard key={credit.id} credit={credit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Connect your wallet to view and purchase credits</p>
          </div>
        )}
      </div>
    </div>
  )
}
