"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, ImageIcon, Images, LogOut, ChevronDown, ChevronRight, Plus, List, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

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
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Mobile overlay and backdrop
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-80 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out md:hidden",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent 
            pathname={pathname}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
            closeMobileSidebar={closeMobileSidebar}
            isMobile={true}
          />
        </div>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <div className="hidden md:flex w-64 lg:w-72 bg-sidebar text-sidebar-foreground flex-col min-h-screen">
      <SidebarContent 
        pathname={pathname}
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
        isMobile={false}
      />
    </div>
  )
}

interface SidebarContentProps {
  pathname: string
  expandedItems: string[]
  toggleExpanded: (title: string) => void
  closeMobileSidebar?: () => void
  isMobile?: boolean
}

function SidebarContent({ pathname, expandedItems, toggleExpanded, closeMobileSidebar, isMobile = false }: SidebarContentProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold">Shree Ummed Club</h2>
            <p className="text-xs md:text-sm text-sidebar-foreground/70">Admin Panel</p>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileSidebar}
              className="p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        <Link href="/admin" onClick={isMobile ? closeMobileSidebar : undefined}>
          <Button
            variant={pathname === "/admin" ? "secondary" : "ghost"}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm md:text-base"
          >
            Dashboard
          </Button>
        </Link>

        {menuItems.map((item) => {
          const isExpanded = expandedItems.includes(item.title)
          const isActive = pathname.startsWith(item.href)

          return (
            <div key={item.title} className="my-1 md:my-2">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent text-sm md:text-base",
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
                <div className="ml-2 md:ml-4 space-y-1 mt-1">
                  {item.subItems.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href} onClick={isMobile ? closeMobileSidebar : undefined}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent text-xs md:text-sm my-[2px]",
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

      <div className="p-3 md:p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm md:text-base"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
