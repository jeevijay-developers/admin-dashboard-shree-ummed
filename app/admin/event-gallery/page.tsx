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
import { Edit, Trash2, Plus, Images, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { fetchEventGalleries, deleteEventGallery } from "@/util/server"
import toast from "react-hot-toast"

interface EventGallery {
  _id: string
  banner: string
  title: string
  content: string
  images: string[]
  slug: string
  createdAt: string
  updatedAt: string
}

export default function EventGalleryPage() {
  const [galleryList, setGalleryList] = useState<EventGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalGalleries, setTotalGalleries] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    gallery: EventGallery | null
  }>({
    open: false,
    gallery: null
  })

  const loadEventGalleries = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchEventGalleries(page, 9)
      
      setGalleryList(data.eventGalleries || [])
      setCurrentPage(data.page || 1)
      setTotalPages(data.pages || 1)
      setTotalGalleries(data.total || 0)
    } catch (err: any) {
      console.error('Error fetching event galleries:', err)
      setError(err.response?.data?.error || 'Failed to load event galleries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEventGalleries(1)
  }, [])

  const openDeleteDialog = (gallery: EventGallery) => {
    setDeleteDialog({
      open: true,
      gallery
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      gallery: null
    })
  }

  const handleDelete = async () => {
    if (!deleteDialog.gallery) return
    
    const { _id: id, title } = deleteDialog.gallery
    setDeletingId(id)
    
    try {
      await deleteEventGallery(id)
      toast.success("Event gallery deleted successfully!")
      setGalleryList((prev) => prev.filter((gallery) => gallery._id !== id))
      setTotalGalleries((prev) => prev - 1)
      closeDeleteDialog()
    } catch (error: any) {
      console.error("Error deleting event gallery:", error)
      const errorMessage = error.response?.data?.error || "Failed to delete event gallery. Please try again."
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

  const getGalleryStatus = (createdAt: string) => {
    // For now, all galleries are considered published
    // You can add your own logic here based on requirements
    return "Published"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Event Gallery</h1>
          <p className="text-muted-foreground">Manage event photo galleries and collections</p>
        </div>
        <Link href="/admin/event-gallery/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event Gallery
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Event Galleries</CardTitle>
          <CardDescription>View and manage all event photo galleries</CardDescription>
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
              <span className="ml-2">Loading event galleries...</span>
            </div>
          ) : galleryList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No event galleries found. <br />
              <Link href="/admin/event-gallery/add" className="text-blue-600 hover:underline">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Event Gallery
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {galleryList.map((gallery) => (
                    <TableRow key={gallery._id}>
                      <TableCell>
                        <img
                          src={gallery.banner || "/placeholder.svg"}
                          alt={gallery.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{gallery.title}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm">{gallery.content}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Images className="h-4 w-4 text-muted-foreground" />
                          {gallery.images?.length || 0}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(gallery.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={getGalleryStatus(gallery.createdAt) === "Published" ? "default" : "secondary"}>
                          {getGalleryStatus(gallery.createdAt)}
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
                            onClick={() => openDeleteDialog(gallery)}
                            disabled={deletingId === gallery._id}
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingId === gallery._id ? (
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
                    Showing {((currentPage - 1) * 9) + 1} to {Math.min(currentPage * 9, totalGalleries)} of {totalGalleries} galleries
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => loadEventGalleries(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => loadEventGalleries(currentPage + 1)}
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

      {/* Gallery Cards View */}
      {!loading && galleryList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryList.map((gallery) => (
            <Card key={gallery._id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={gallery.banner || "/placeholder.svg"}
                  alt={gallery.title}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={getGalleryStatus(gallery.createdAt) === "Published" ? "default" : "secondary"}
                >
                  {getGalleryStatus(gallery.createdAt)}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{gallery.title}</CardTitle>
                <CardDescription className="line-clamp-2">{gallery.content}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{gallery.images?.length || 0} images</span>
                  <span>{formatDate(gallery.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Event Gallery
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event gallery? This action cannot be undone and will permanently remove the gallery, banner image, and all associated photos.
              <br /><br />
              <span className="font-semibold text-foreground">
                Gallery: "{deleteDialog.gallery?.title}"
              </span>
              <br />
              <span className="text-sm text-muted-foreground">
                {deleteDialog.gallery?.images?.length || 0} images will be deleted
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
                  Delete Gallery
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
