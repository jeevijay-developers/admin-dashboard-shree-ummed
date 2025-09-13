import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
