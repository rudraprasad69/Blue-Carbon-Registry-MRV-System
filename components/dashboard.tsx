"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { MarketplaceHeader } from "./marketplace-header"
import { Portfolio } from "./portfolio"
import { DeveloperDashboard } from "./developer-dashboard"
import { CommunityDashboard } from "./community-dashboard"
import { WalletConnection } from "./wallet-connection"
import { RegulatorDashboard } from "./regulator-dashboard"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { ReportingDashboard } from "./reporting-dashboard"
import { SearchDiscovery } from "./search-discovery"
import { DataInfrastructureDashboard } from "./data-infrastructure-dashboard"
import { StandardsDashboard } from "./standards-dashboard"
import { AiDashboard } from "./ai-dashboard"
import { AdvancedFeaturesDashboard } from "./advanced-features-dashboard"
import { PaymentsDashboard } from "./payments-dashboard"
import { MarketplaceDashboard } from "./marketplace-dashboard"
import { RefreshIndicator } from "./refresh-indicator"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { useMobile } from "@/hooks/use-mobile"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "portfolio" | "developer" | "community" | "regulator" | "analytics" | "reporting" | "search" | "data" | "standards" | "ai" | "advanced" | "payments"
  >("marketplace")
  const [walletConnected, setWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<"buyer" | "developer" | "community" | "regulator">("buyer")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isMobile = useMobile()

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
  
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true)
    } else {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-slate-50 to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : (isSidebarOpen ? 'md:ml-64' : 'ml-0')}`}>
        {/* Header */}
        <MarketplaceHeader
          walletConnected={walletConnected}
          userAddress={userAddress}
          onWalletConnect={setWalletConnected}
          onAddressChange={setUserAddress}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Refresh Indicator */}
        <div className="px-4 md:px-8 pt-4 pb-2 bg-background/95 border-b border-border">
          <RefreshIndicator lastRefresh={lastRefresh} isRefreshing={isRefreshing} onRefresh={manualRefresh} />
        </div>

        {/* Content Area */}
        <main className="p-4 md:p-8">
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

          {userRole === "buyer" && activeTab === "marketplace" && <MarketplaceDashboard />}
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
          {activeTab === "data" && <DataInfrastructureDashboard />}
          {activeTab === "standards" && <StandardsDashboard />}
          {activeTab === "ai" && <AiDashboard />}
          {activeTab === "advanced" && <AdvancedFeaturesDashboard />}
          {activeTab === "payments" && <PaymentsDashboard />}
        </main>
      </div>
    </div>
  )
}
