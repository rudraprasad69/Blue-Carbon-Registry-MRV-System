"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, User, Loader2, File, Layout, Hexagon, Zap, ArrowRight, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationsPanel } from "./notifications-panel"

interface MarketplaceHeaderProps {
  walletConnected: boolean
  userAddress: string | null
  onWalletConnect: (connected: boolean) => void
  onAddressChange: (address: string | null) => void
}

export function MarketplaceHeader({ walletConnected, userAddress, onWalletConnect }: MarketplaceHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<{category: string, items: any[]}[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced API fetch
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setResults([])
      setIsDropdownOpen(false)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true)
      setIsDropdownOpen(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "projects": return <Hexagon className="w-4 h-4 text-emerald-600" />
      case "pages": return <Layout className="w-4 h-4 text-blue-600" />
      case "assets": return <Database className="w-4 h-4 text-purple-600" />
      case "actions": return <Zap className="w-4 h-4 text-amber-600" />
      default: return <File className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <header className="border-b border-slate-300/30 bg-background/70 backdrop-blur-3xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Predictive Search Area */}
        <div className="flex-1 max-w-lg relative" ref={searchRef}>
          <div className="relative group">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-secondary group-hover:scale-110 transition-all duration-300" />
            )}
            
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.length > 0) setIsDropdownOpen(true)
              }}
              placeholder="Search projects, carbon credits..."
              className="pl-11 h-11 w-full rounded-full bg-slate-100/50 hover:bg-slate-100/80 border border-slate-300/50 focus:bg-white focus:ring-2 focus:ring-secondary/40 focus:border-secondary/40 transition-all duration-300 shadow-sm"
            />
          </div>

          {/* Predictive Dropdown Wrapper */}
          {isDropdownOpen && (
            <div className="absolute top-14 left-0 w-full bg-white/95 backdrop-blur-2xl border border-slate-200/60 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] overflow-hidden animate-fade-in z-50">
              {results.length === 0 && !isSearching && (
                <div className="p-4 text-center text-sm text-slate-500">No results found for "{searchQuery}"</div>
              )}
              
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.map((group) => (
                  <div key={group.category} className="mb-2">
                    <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 mt-2 mb-1 flex items-center gap-2">
                      {group.category}
                    </div>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <button 
                            className="w-full text-left px-3 py-2 rounded-xl flex items-start gap-3 hover:bg-slate-100 transition-colors group"
                            onClick={() => {
                              setIsDropdownOpen(false)
                              setSearchQuery("")
                              if (item.url) router.push(item.url)
                            }}
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
                              {getCategoryIcon(group.category)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{item.title}</h4>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mt-2" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5 ml-8">
          <NotificationsPanel />

          <div className="h-6 w-px bg-slate-300/60 mx-1 flex-shrink-0" /> {/* Divider */}

          {walletConnected ? (
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20 shadow-sm transition-colors cursor-default">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-primary">
                {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </span>
            </div>
          ) : (
            <Button
              onClick={() => onWalletConnect(true)}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(197,155,39,0.3)] active:scale-95"
            >
              Connect Wallet
            </Button>
          )}

          <button className="p-2.5 hover:bg-slate-200/60 rounded-full border border-transparent hover:border-slate-300/50 transition-all duration-300 group">
            <User className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    </header>
  )
}
