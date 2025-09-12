"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data for events
const events = [
  {
    id: 1,
    image: "/annual-sports-meet.jpg",
    eventDate: "2024-03-15",
    shortDescription: "Annual Sports Meet with various competitions and prizes",
    slug: "annual-sports-meet-2024",
    status: "Upcoming",
  },
  {
    id: 2,
    image: "/cultural-night-celebration.png",
    eventDate: "2024-02-28",
    shortDescription: "Cultural night featuring music, dance, and drama performances",
    slug: "cultural-night-february",
    status: "Completed",
  },
  {
    id: 3,
    image: "/swimming-championship.jpg",
    eventDate: "2024-04-10",
    shortDescription: "Inter-club swimming championship for all age groups",
    slug: "swimming-championship-2024",
    status: "Upcoming",
  },
]

export default function EventsPage() {
  const [eventList, setEventList] = useState(events)

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEventList((prev) => prev.filter((event) => event.id !== id))
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
        <CardContent>
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
                <TableRow key={event.id}>
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
                    <Badge variant={event.status === "Upcoming" ? "default" : "secondary"}>{event.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
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
    </div>
  )
}
