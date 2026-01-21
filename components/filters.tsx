"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface FiltersProps {
  onChange: (filters: any) => void
  onSortChange: (sort: "price-low" | "price-high" | "newest") => void
}

export function Filters({ onChange, onSortChange }: FiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [ecosystem, setEcosystem] = useState<string[]>([])
  const [verificationOnly, setVerificationOnly] = useState(false)

  const ecosystems = [
    { id: "mangrove", label: "Mangrove Forests" },
    { id: "seagrass", label: "Seagrass Meadows" },
    { id: "saltmarsh", label: "Salt Marshes" },
    { id: "kelp", label: "Kelp Forests" },
  ]

  const handleEcosystemChange = (id: string) => {
    const updated = ecosystem.includes(id) ? ecosystem.filter((e) => e !== id) : [...ecosystem, id]
    setEcosystem(updated)
    onChange({ ecosystem: updated, priceRange, verificationOnly })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onChange({ ecosystem, priceRange: values, verificationOnly })
  }

  return (
    <div className="space-y-4 sticky top-24">
      {/* Sort */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="price-low" onValueChange={(v: any) => onSortChange(v)}>
            <SelectTrigger className="border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={handlePriceChange} min={0} max={100} step={5} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Ecosystem Type */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ecosystem Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ecosystems.map((eco) => (
            <label key={eco.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={ecosystem.includes(eco.id)} onCheckedChange={() => handleEcosystemChange(eco.id)} />
              <span className="text-sm text-foreground">{eco.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Verification */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={verificationOnly}
              onCheckedChange={(checked) => {
                setVerificationOnly(checked === true)
                onChange({ ecosystem, priceRange, verificationOnly: checked === true })
              }}
            />
            <span className="text-sm text-foreground">Verified Only</span>
          </label>
        </CardContent>
      </Card>
    </div>
  )
}
