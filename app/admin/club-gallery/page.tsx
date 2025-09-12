"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

// Mock data for club gallery
const galleryImages = [
  {
    id: 1,
    image: "/club-exterior-view.jpg",
    title: "Club Exterior View",
    uploadDate: "2024-01-15",
  },
  {
    id: 2,
    image: "/main-lobby-interior.jpg",
    title: "Main Lobby Interior",
    uploadDate: "2024-01-20",
  },
  {
    id: 3,
    image: "/dining-area-setup.jpg",
    title: "Dining Area Setup",
    uploadDate: "2024-02-05",
  },
  {
    id: 4,
    image: "/garden-landscape-view.jpg",
    title: "Garden Landscape View",
    uploadDate: "2024-02-10",
  },
]

export default function ClubGalleryPage() {
  const [imageList, setImageList] = useState(galleryImages)

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setImageList((prev) => prev.filter((image) => image.id !== id))
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imageList.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <img
                      src={image.image || "/placeholder.svg"}
                      alt={image.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{image.title}</TableCell>
                  <TableCell>{formatDate(image.uploadDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
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
        </CardContent>
      </Card>

      {/* Gallery Grid View */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Preview</CardTitle>
          <CardDescription>Visual preview of all gallery images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageList.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.image || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white text-sm font-medium text-center px-2">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
