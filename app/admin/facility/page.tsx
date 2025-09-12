"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchFacilities } from "@/util/server"

interface Facility {
  _id: string
  name: string
  images: string[]
  data: {
    title: string
    description: string
    features: string[]
  }
  slug: string
  createdAt: string
  updatedAt: string
}

export default function FacilityPage() {
  const [facilityList, setFacilityList] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalFacilities, setTotalFacilities] = useState(0)

  const loadFacilities = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchFacilities(page, 9)
      
      setFacilityList(data.facilities || [])
      setCurrentPage(data.page || 1)
      setTotalPages(data.pages || 1)
      setTotalFacilities(data.total || 0)
    } catch (err: any) {
      console.error('Error fetching facilities:', err)
      setError(err.response?.data?.error || 'Failed to load facilities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFacilities(1)
  }, [])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadFacilities(page)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this facility?")) {
      // TODO: Implement actual delete API call
      setFacilityList((prev) => prev.filter((facility) => facility._id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Facilities</h1>
          <p className="text-muted-foreground">Manage club facilities and amenities</p>
        </div>
        <Link href="/admin/facility/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Facility
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Facilities</CardTitle>
          <CardDescription>
            View and manage all club facilities {totalFacilities > 0 && `(${totalFacilities} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => loadFacilities(currentPage)}
              >
                Retry
              </Button>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading facilities...</span>
            </div>
          ) : facilityList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No facilities found.</p>
              <Link href="/admin/facility/add">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Facility
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilityList.map((facility) => (
                    <TableRow key={facility._id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{facility.data?.description || 'No description'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {facility.data?.features?.slice(0, 2).map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          )) || <span className="text-muted-foreground text-xs">No features</span>}
                          {facility.data?.features && facility.data.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{facility.data.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{facility.images?.length || 0} photos</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(facility._id)}
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
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  )
}
