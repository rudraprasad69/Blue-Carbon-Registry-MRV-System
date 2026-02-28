"use client"

import { Search, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationsPanel } from "./notifications-panel"

interface MarketplaceHeaderProps {
  walletConnected: boolean
  userAddress: string | null
  onWalletConnect: (connected: boolean) => void
  onAddressChange: (address: string | null) => void
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function MarketplaceHeader({
  walletConnected,
  userAddress,
  onWalletConnect,
  onToggleSidebar,
  isSidebarOpen,
}: MarketplaceHeaderProps) {
  return (
    <header className="border-b border-border bg-card dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left Actions - Hamburger and Search */}
        <div className="flex items-center gap-2">
          {/* Hamburger Menu */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>

          {/* Search */}
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects, credits..."
                className="pl-10 w-64 lg:w-96 rounded-full bg-muted border-0 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <NotificationsPanel />

          {walletConnected ? (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-mono text-accent">
                {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </span>
            </div>
          ) : (
            <Button
              onClick={() => onWalletConnect(true)}
              className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Connect Wallet
            </Button>
          )}

          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <User className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
