"use client"

import type React from "react"

import { TrendingUp, Hammer, Users, Shield, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountTypeOption {
  id: "buyer" | "developer" | "community" | "regulator"
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
}

interface AccountTypeSelectorProps {
  userRole: "buyer" | "developer" | "community" | "regulator"
  setUserRole: (role: "buyer" | "developer" | "community" | "regulator") => void
}

export function AccountTypeSelector({ userRole, setUserRole }: AccountTypeSelectorProps) {
  const accountTypes: AccountTypeOption[] = [
    {
      id: "buyer",
      label: "Buyer",
      icon: TrendingUp,
      description: "Explore and purchase carbon credits",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "developer",
      label: "Developer",
      icon: Hammer,
      description: "Monitor projects and generate credits",
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "community",
      label: "Community",
      icon: Users,
      description: "Track benefits and local impact",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "regulator",
      label: "Regulator",
      icon: Shield,
      description: "Verify and audit the ecosystem",
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Account Type</p>
      </div>

      <div className="flex flex-col gap-3">
        {accountTypes.map((type) => {
          const Icon = type.icon
          const isActive = userRole === type.id

          return (
            <button
              key={type.id}
              onClick={() => setUserRole(type.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ease-out",
                "px-4 py-3 text-left",
                "hover:shadow-md",
                isActive
                  ? "border-primary bg-linear-to-r from-primary/15 to-primary/5 shadow-lg"
                  : "border-border bg-card/50 hover:border-primary/40 hover:bg-card/70",
              )}
            >
              {/* Background gradient effect */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  `bg-linear-to-r ${type.color}`,
                )}
                style={{ opacity: isActive ? 0.03 : 0 }}
              />

              <div className="relative z-10 flex items-center gap-3">
                {/* Icon container */}
                <div
                  className={cn(
                    `shrink-0 p-2.5 rounded-lg transition-all`,
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text content container */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "text-sm font-semibold transition-colors leading-tight",
                      isActive ? "text-primary" : "text-foreground",
                    )}
                  >
                    {type.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground/75 transition-colors truncate">
                    {type.description}
                  </p>
                </div>

                {isActive && (
                  <div className="shrink-0 p-1 bg-primary/20 rounded-full">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
