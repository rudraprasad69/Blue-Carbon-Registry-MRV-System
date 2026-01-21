"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface SearchFiltersProps {
  filters: {
    ecosystems: string[]
    verificationStatus: string[]
    priceRange: [number, number]
    minSequestration: number
    location: string[]
  }
  setFilters: (filters: any) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function SearchFilters({ filters, setFilters, sortBy, setSortBy }: SearchFiltersProps) {
  const ecosystems = ["mangrove", "seagrass", "saltmarsh", "kelp"]
  const statuses = ["verified", "pending", "auditing"]
  const locations = ["Bangladesh", "Australia", "USA", "Norway", "Vietnam", "Spain"]

  const toggleEcosystem = (ecosystem: string) => {
    setFilters({
      ...filters,
      ecosystems: filters.ecosystems.includes(ecosystem)
        ? filters.ecosystems.filter((e) => e !== ecosystem)
        : [...filters.ecosystems, ecosystem],
    })
  }

  const toggleStatus = (status: string) => {
    setFilters({
      ...filters,
      verificationStatus: filters.verificationStatus.includes(status)
        ? filters.verificationStatus.filter((s) => s !== status)
        : [...filters.verificationStatus, status],
    })
  }

  const toggleLocation = (location: string) => {
    setFilters({
      ...filters,
      location: filters.location.includes(location)
        ? filters.location.filter((l) => l !== location)
        : [...filters.location, location],
    })
  }

  const handleResetFilters = () => {
    setFilters({
      ecosystems: [],
      verificationStatus: [],
      priceRange: [0, 100],
      minSequestration: 0,
      location: [],
    })
  }

  return (
    <div className="space-y-4 sticky top-8">
      {/* Sorting */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { id: "relevance", label: "Relevance" },
            { id: "price-low", label: "Price: Low to High" },
            { id: "price-high", label: "Price: High to Low" },
            { id: "sequestration-high", label: "Sequestration Rate" },
            { id: "newest", label: "Newest" },
          ].map((option) => (
            <label key={option.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.id}
                checked={sortBy === option.id}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Ecosystem Filter */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ecosystem Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ecosystems.map((eco) => (
            <label key={eco} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.ecosystems.includes(eco)} onCheckedChange={() => toggleEcosystem(eco)} />
              <span className="text-sm text-foreground capitalize">{eco}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Verification Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {statuses.map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.verificationStatus.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              />
              <span className="text-sm text-foreground capitalize">{status}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            min={0}
            max={100}
            step={1}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={(value) => setFilters({ ...filters, priceRange: [value[0], value[1]] as [number, number] })}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">${filters.priceRange[0]}</span>
            <span className="text-muted-foreground">${filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {locations.map((location) => (
            <label key={location} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.location.includes(location)}
                onCheckedChange={() => toggleLocation(location)}
              />
              <span className="text-sm text-foreground">{location}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button onClick={handleResetFilters} variant="outline" className="w-full bg-transparent">
        Reset Filters
      </Button>
    </div>
  )
}
