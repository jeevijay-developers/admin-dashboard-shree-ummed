"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchClubGalleries } from "@/util/server"

interface ClubGallery {
  _id: string
  images: string[]
  title: string
  createdAt: string
  updatedAt: string
}

export default function ClubGalleryPage() {
  const [imageList, setImageList] = useState<ClubGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalGalleries, setTotalGalleries] = useState(0)

  const loadClubGalleries = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchClubGalleries(page, 9)
      
      setImageList(data.clubGalleries || [])
      setCurrentPage(data.page || 1)
      setTotalPages(data.pages || 1)
      setTotalGalleries(data.total || 0)
    } catch (err: any) {
      console.error('Error fetching club galleries:', err)
      setError(err.response?.data?.error || 'Failed to load club galleries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClubGalleries(1)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      // TODO: Implement actual delete API call
      setImageList((prev) => prev.filter((image) => image._id !== id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Club Gallery</h1>
          <p className="text-muted-foreground">Manage club photos and images</p>
        </div>
        <Link href="/admin/club-gallery/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Image
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Gallery Images</CardTitle>
          <CardDescription>View and manage all club gallery images</CardDescription>
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
              <span className="ml-2">Loading gallery images...</span>
            </div>
          ) : imageList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No gallery images found. <br />
              <Link href="/admin/club-gallery/add" className="text-blue-600 hover:underline">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Image
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Images Count</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imageList.map((image) => (
                    <TableRow key={image._id}>
                      <TableCell>
                        <img
                          src={image.images?.[0] || "/placeholder.svg"}
                          alt={image.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{image.title}</TableCell>
                      <TableCell>{image.images?.length || 0} images</TableCell>
                      <TableCell>{formatDate(image.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(image._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
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
                    Showing {((currentPage - 1) * 9) + 1} to {Math.min(currentPage * 9, totalGalleries)} of {totalGalleries} gallery entries
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => loadClubGalleries(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => loadClubGalleries(currentPage + 1)}
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

      {/* Gallery Grid View */}
      {!loading && imageList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery Preview</CardTitle>
            <CardDescription>Visual preview of all gallery images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageList.map((gallery) => 
                gallery.images?.map((imageSrc, index) => (
                  <div key={`${gallery._id}-${index}`} className="relative group">
                    <img
                      src={imageSrc || "/placeholder.svg"}
                      alt={gallery.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white text-sm font-medium text-center px-2">{gallery.title}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
