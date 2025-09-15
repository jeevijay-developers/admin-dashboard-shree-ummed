"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Trash2, Plus, Calendar, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { fetchEvents, deleteEvent } from "@/util/server"
import toast from "react-hot-toast"

interface Event {
  _id: string
  image: string
  eventDate: string
  shortDescription: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function EventsPage() {
  const [eventList, setEventList] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    event: Event | null
  }>({
    open: false,
    event: null
  })

  const loadEvents = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchEvents(page, 9)
      
      setEventList(data.events || [])
      setCurrentPage(data.page || 1)
      setTotalPages(data.pages || 1)
      setTotalEvents(data.total || 0)
    } catch (err: any) {
      console.error('Error fetching events:', err)
      setError(err.response?.data?.error || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents(1)
  }, [])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadEvents(page)
    }
  }

  const openDeleteDialog = (event: Event) => {
    setDeleteDialog({
      open: true,
      event
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      event: null
    })
  }

  const handleDelete = async () => {
    if (!deleteDialog.event) return
    
    const { _id: id, shortDescription } = deleteDialog.event
    setDeletingId(id)
    
    try {
      await deleteEvent(id)
      toast.success("Event deleted successfully!")
      setEventList((prev) => prev.filter((event) => event._id !== id))
      setTotalEvents((prev) => prev - 1)
      closeDeleteDialog()
    } catch (error: any) {
      console.error("Error deleting event:", error)
      const errorMessage = error.response?.data?.error || "Failed to delete event. Please try again."
      toast.error(errorMessage)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEventStatus = (eventDate: string) => {
    const today = new Date()
    const eventDateObj = new Date(eventDate)
    today.setHours(0, 0, 0, 0)
    eventDateObj.setHours(0, 0, 0, 0)
    
    if (eventDateObj > today) {
      return "Upcoming"
    } else if (eventDateObj < today) {
      return "Completed"
    } else {
      return "Today"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Events</h1>
          <p className="text-muted-foreground">Manage club events and activities</p>
        </div>
        <Link href="/admin/events/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>View and manage all club events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading events...</span>
            </div>
          ) : eventList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found.  <br /> <Link href="/admin/events/add" className="text-blue-600 hover:underline">   <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Facility
                </Button></Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventList.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt="Event"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(event.eventDate)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{event.shortDescription}</p>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{event.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEventStatus(event.eventDate) === "Upcoming" ? "default" : "secondary"}>
                          {getEventStatus(event.eventDate)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(event)}
                            disabled={deletingId === event._id}
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingId === event._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 9) + 1} to {Math.min(currentPage * 9, totalEvents)} of {totalEvents} events
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => loadEvents(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => loadEvents(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Event
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone and will permanently remove the event and its associated image.
              <br /><br />
              <span className="font-semibold text-foreground">
                Event: {deleteDialog.event?.shortDescription}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog} disabled={deletingId !== null}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletingId !== null}
            >
              {deletingId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
