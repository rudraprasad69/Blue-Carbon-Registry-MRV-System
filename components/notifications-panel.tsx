"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { mockNotifications } from "@/lib/mock-data"
import { formatDateTimeConsistent } from "@/lib/date-utils"

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isClient, setIsClient] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  // Ensure client-side rendering to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleClear = () => {
    setNotifications([])
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "transaction_confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "price_alert":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "new_project":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      default:
        return "bg-muted"
    }
  }

  // Format date consistently across server and client
  const formatDate = (date: Date | string) => {
    return formatDateTimeConsistent(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            Notifications {unreadCount > 0 && <span className="text-xs text-accent">({unreadCount})</span>}
          </h3>
          {notifications.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${!notif.read ? "bg-accent/5" : ""}`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.read ? "bg-accent" : "bg-transparent"}`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {isClient ? formatDate(notif.timestamp) : "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
