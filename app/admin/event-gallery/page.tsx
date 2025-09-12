"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Images } from "lucide-react"
import Link from "next/link"

// Mock data for event galleries
const eventGalleries = [
  {
    id: 1,
    bannerImage: "/sports-meet-banner.jpg",
    title: "Annual Sports Meet 2024",
    content:
      "Complete coverage of our annual sports meet featuring various competitions, award ceremonies, and memorable moments from the event.",
    images: 25,
    createdDate: "2024-03-16",
    status: "Published",
  },
  {
    id: 2,
    bannerImage: "/cultural-night-banner.jpg",
    title: "Cultural Night February",
    content:
      "Highlights from our cultural night featuring music, dance, drama performances, and artistic showcases by club members.",
    images: 18,
    createdDate: "2024-03-01",
    status: "Published",
  },
  {
    id: 3,
    bannerImage: "/new-year-celebration-banner.jpg",
    title: "New Year Celebration 2024",
    content:
      "New Year celebration with fireworks, live music, dinner, and entertainment for all club members and their families.",
    images: 32,
    createdDate: "2024-01-02",
    status: "Draft",
  },
]

export default function EventGalleryPage() {
  const [galleryList, setGalleryList] = useState(eventGalleries)

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this event gallery?")) {
      setGalleryList((prev) => prev.filter((gallery) => gallery.id !== id))
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
        <CardContent>
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
                <TableRow key={gallery.id}>
                  <TableCell>
                    <img
                      src={gallery.bannerImage || "/placeholder.svg"}
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
                      {gallery.images}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(gallery.createdDate)}</TableCell>
                  <TableCell>
                    <Badge variant={gallery.status === "Published" ? "default" : "secondary"}>{gallery.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
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

      {/* Gallery Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryList.map((gallery) => (
          <Card key={gallery.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={gallery.bannerImage || "/placeholder.svg"}
                alt={gallery.title}
                className="w-full h-48 object-cover"
              />
              <Badge
                className="absolute top-2 right-2"
                variant={gallery.status === "Published" ? "default" : "secondary"}
              >
                {gallery.status}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{gallery.title}</CardTitle>
              <CardDescription className="line-clamp-2">{gallery.content}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{gallery.images} images</span>
                <span>{formatDate(gallery.createdDate)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
