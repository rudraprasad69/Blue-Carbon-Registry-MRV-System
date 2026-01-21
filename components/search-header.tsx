"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  resultCount: number
}

export function SearchHeader({ searchQuery, setSearchQuery, resultCount }: SearchHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-4">Discover Blue Carbon Credits</h1>
      <p className="text-muted-foreground mb-6">Find and compare verified carbon credit projects globally</p>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by project name, location, or ecosystem..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base"
        />
      </div>

      {searchQuery && <p className="text-sm text-muted-foreground mt-3">{resultCount} results found</p>}
    </div>
  )
}
