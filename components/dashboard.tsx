"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { MarketplaceHeader } from "./marketplace-header"
import { CreditExplorer } from "./credit-explorer"
import { Portfolio } from "./portfolio"
import { DeveloperDashboard } from "./developer-dashboard"
import { CommunityDashboard } from "./community-dashboard"
import { WalletConnection } from "./wallet-connection"
import { RegulatorDashboard } from "./regulator-dashboard"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { ReportingDashboard } from "./reporting-dashboard"
import { SearchDiscovery } from "./search-discovery"
import { RefreshIndicator } from "./refresh-indicator"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "portfolio" | "developer" | "community" | "regulator" | "analytics" | "reporting" | "search"
  >("marketplace")
  const [walletConnected, setWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<"buyer" | "developer" | "community" | "regulator">("buyer")

  useEffect(() => {
    if (userRole === "buyer") {
      setActiveTab("marketplace")
    } else if (userRole === "developer") {
      setActiveTab("developer")
    } else if (userRole === "community") {
      setActiveTab("community")
    } else if (userRole === "regulator") {
      setActiveTab("regulator")
    }
  }, [userRole])

  const handleBackToAccountType = () => {
    // The sidebar AccountTypeSelector allows clicking a different role
    setUserRole("buyer")
  }

  const { lastRefresh, isRefreshing, manualRefresh } = useAutoRefresh({
    interval: 5 * 60 * 1000, // Refresh every 5 minutes
    enabled: true,
  })

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Regal & Deep Animated Background Meshes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-slate-800/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-amber-600/5 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-slate-700/5 blur-[150px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} setUserRole={setUserRole} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <MarketplaceHeader
          walletConnected={walletConnected}
          userAddress={userAddress}
          onWalletConnect={setWalletConnected}
          onAddressChange={setUserAddress}
        />

        {/* Refresh Indicator */}
        <div className="px-8 pt-4 pb-2 bg-background/95 border-b border-border">
          <RefreshIndicator lastRefresh={lastRefresh} isRefreshing={isRefreshing} onRefresh={manualRefresh} />
        </div>

        {/* Content Area */}
        <main className="p-8 animate-fade-in">
          {!walletConnected && userRole === "buyer" && (
            <div className="mb-8">
              <WalletConnection
                onConnect={(address) => {
                  setWalletConnected(true)
                  setUserAddress(address)
                }}
                onBack={() => {
                  setActiveTab("marketplace")
                }}
              />
            </div>
          )}

          {userRole === "buyer" && activeTab === "marketplace" && <CreditExplorer walletConnected={walletConnected} />}
          {userRole === "buyer" && activeTab === "portfolio" && <Portfolio userAddress={userAddress} />}
          {userRole === "developer" && activeTab === "developer" && (
            <DeveloperDashboard onBack={handleBackToAccountType} />
          )}
          {userRole === "community" && activeTab === "community" && (
            <CommunityDashboard onBack={handleBackToAccountType} />
          )}
          {userRole === "regulator" && activeTab === "regulator" && (
            <RegulatorDashboard onBack={handleBackToAccountType} />
          )}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "reporting" && <ReportingDashboard />}
          {activeTab === "search" && <SearchDiscovery />}
        </main>
      </div>
    </div>
  )
}
