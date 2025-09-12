"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, ImageIcon, Images, LogOut, ChevronDown, ChevronRight, Plus, List } from "lucide-react"

const menuItems = [
  {
    title: "Facility",
    icon: Building2,
    href: "/admin/facility",
    subItems: [
      { title: "Add Facility", href: "/admin/facility/add", icon: Plus },
      { title: "View All", href: "/admin/facility", icon: List },
    ],
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/admin/events",
    subItems: [
      { title: "Add Event", href: "/admin/events/add", icon: Plus },
      { title: "View All", href: "/admin/events", icon: List },
    ],
  },
  {
    title: "Club Gallery",
    icon: ImageIcon,
    href: "/admin/club-gallery",
    subItems: [
      { title: "Add Image", href: "/admin/club-gallery/add", icon: Plus },
      { title: "View All", href: "/admin/club-gallery", icon: List },
    ],
  },
  {
    title: "Event Gallery",
    icon: Images,
    href: "/admin/event-gallery",
    subItems: [
      { title: "Add Gallery", href: "/admin/event-gallery/add", icon: Plus },
      { title: "View All", href: "/admin/event-gallery", icon: List },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold">Shree Ummed Club</h2>
        <p className="text-sm text-sidebar-foreground/70">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin">
          <Button
            variant={pathname === "/admin" ? "secondary" : "ghost"}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            Dashboard
          </Button>
        </Link>

        {menuItems.map((item) => {
          const isExpanded = expandedItems.includes(item.title)
          const isActive = pathname.startsWith(item.href)

          return (
            <div key={item.title} className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent",
                  isActive && "bg-sidebar-accent",
                )}
                onClick={() => toggleExpanded(item.title)}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent",
                          pathname === subItem.href && "bg-sidebar-accent text-sidebar-foreground",
                        )}
                      >
                        <subItem.icon className="h-3 w-3 mr-2" />
                        {subItem.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => (window.location.href = "/")}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
