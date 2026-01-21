"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SearchHeader } from "./search-header"
import { SearchFilters } from "./search-filters"
import { SearchResults } from "./search-results"
import { RecommendedProjects } from "./recommended-projects"
import { mockCredits } from "@/lib/mock-data"

export function SearchDiscovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    ecosystems: [] as string[],
    verificationStatus: [] as string[],
    priceRange: [0, 100] as [number, number],
    minSequestration: 0,
    location: [] as string[],
  })
  const [sortBy, setSortBy] = useState("relevance")

  const filteredResults = useMemo(() => {
    let results = mockCredits

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (credit) =>
          credit.projectName.toLowerCase().includes(query) ||
          credit.location.toLowerCase().includes(query) ||
          credit.ecosystem.toLowerCase().includes(query),
      )
    }

    // Ecosystem filter
    if (filters.ecosystems.length > 0) {
      results = results.filter((credit) => filters.ecosystems.includes(credit.ecosystem))
    }

    // Verification status filter
    if (filters.verificationStatus.length > 0) {
      results = results.filter((credit) => filters.verificationStatus.includes(credit.verificationStatus))
    }

    // Price range filter
    results = results.filter((credit) => credit.price >= filters.priceRange[0] && credit.price <= filters.priceRange[1])

    // Sequestration rate filter
    results = results.filter((credit) => credit.sequestrationRate >= filters.minSequestration)

    // Location filter
    if (filters.location.length > 0) {
      results = results.filter((credit) => filters.location.includes(credit.location))
    }

    // Sorting
    const sorted = [...results].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "sequestration-high") return b.sequestrationRate - a.sequestrationRate
      if (sortBy === "newest") return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      // Default: relevance (search query match)
      return 0
    })

    return sorted
  }, [searchQuery, filters, sortBy])

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} resultCount={filteredResults.length} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} setFilters={setFilters} sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {filteredResults.length > 0 ? (
            <SearchResults results={filteredResults} />
          ) : (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-2">No projects found matching your criteria.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recommended Projects */}
      {!searchQuery && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Recommended For You</h2>
          <RecommendedProjects />
        </div>
      )}
    </div>
  )
}
