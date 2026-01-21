"use client"

import { TrendingUp, BarChart3, Users, Settings } from "lucide-react"
import { AccountTypeSelector } from "./account-type-selector"

interface SidebarProps {
  activeTab:
    | "marketplace"
    | "portfolio"
    | "developer"
    | "community"
    | "regulator"
    | "analytics"
    | "reporting"
    | "search"
  setActiveTab: (
    tab: "marketplace" | "portfolio" | "developer" | "community" | "regulator" | "analytics" | "reporting" | "search",
  ) => void
  userRole: "buyer" | "developer" | "community" | "regulator"
  setUserRole: (role: "buyer" | "developer" | "community" | "regulator") => void
}

export function Sidebar({ activeTab, setActiveTab, userRole, setUserRole }: SidebarProps) {
  const buyerMenuItems = [
    {
      id: "marketplace",
      label: "Dashboard",
      icon: TrendingUp,
      description: "Browse & manage credits",
    },
  ]

  const developerMenuItems = [
    {
      id: "developer",
      label: "Dashboard",
      icon: BarChart3,
      description: "Monitor your projects",
    },
  ]

  const communityMenuItems = [
    {
      id: "community",
      label: "Dashboard",
      icon: Users,
      description: "Community portal",
    },
  ]

  const regulatorMenuItems = [
    {
      id: "regulator",
      label: "Dashboard",
      icon: BarChart3,
      description: "Verify & audit",
    },
  ]

  const getMenuItems = () => {
    if (userRole === "buyer") return buyerMenuItems
    if (userRole === "developer") return developerMenuItems
    if (userRole === "community") return communityMenuItems
    if (userRole === "regulator") return regulatorMenuItems
    return []
  }

  const menuItems = getMenuItems()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card dark:bg-slate-950 flex flex-col">
      {/* Header with Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <img src="/logo.jpg" alt="BlueCarbon Logo" className="h-12 w-12 object-contain" />
          </div>
          {/* Branding Text */}
          <div>
            <h1 className="font-bold text-lg text-foreground">BlueCarbon</h1>
            <p className="text-xs text-muted-foreground">Registry</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-border">
        <AccountTypeSelector userRole={userRole} setUserRole={setUserRole} />
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                isActive ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Settings - at the bottom */}
      <div className="border-t border-border p-4">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-muted transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  )
}
