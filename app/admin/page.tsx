"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building, Calendar, Images, Camera } from "lucide-react"
import { fetchFacilities, fetchEvents, fetchClubGalleries, fetchEventGalleries } from "@/util/server"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    facilities: 0,
    events: 0,
    clubImages: 0,
    eventGalleries: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [facilitiesData, eventsData, clubGalleriesData, eventGalleriesData] = await Promise.all([
        fetchFacilities(), // Get all facilities
        fetchEvents(), // Get all events
        fetchClubGalleries(), // Get all club galleries
        fetchEventGalleries() // Get all event galleries
      ])

      // Calculate total club images from all club galleries
      const totalClubImages = clubGalleriesData.clubGalleries?.reduce((total: number, gallery: any) => {
        return total + (gallery.images?.length || 0)
      }, 0) || 0

      setStats({
        facilities: facilitiesData.total || 0,
        events: eventsData.total || 0,
        clubImages: totalClubImages,
        eventGalleries: eventGalleriesData.total || 0
      })
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Shree Ummed Club Kota Admin Panel</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <p className="text-destructive text-sm">{error}</p>
          <button 
            onClick={loadDashboardStats}
            className="mt-2 text-sm underline text-destructive hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.facilities}</div>
                <p className="text-xs text-muted-foreground">Active facilities</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.events}</div>
                <p className="text-xs text-muted-foreground">All events</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Club Images</CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.clubImages}</div>
                <p className="text-xs text-muted-foreground">Total images</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Galleries</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.eventGalleries}</div>
                <p className="text-xs text-muted-foreground">Published galleries</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
