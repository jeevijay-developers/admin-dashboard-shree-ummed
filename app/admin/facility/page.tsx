"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

// Mock data for facilities
const facilities = [
  {
    id: 1,
    title: "Swimming Pool",
    description: "Olympic size swimming pool with modern facilities",
    features: ["Olympic Size", "Heated Water", "Changing Rooms", "Lifeguard"],
    images: 5,
    status: "Active",
  },
  {
    id: 2,
    title: "Tennis Court",
    description: "Professional tennis court with synthetic surface",
    features: ["Synthetic Surface", "Floodlights", "Equipment Rental"],
    images: 3,
    status: "Active",
  },
  {
    id: 3,
    title: "Gymnasium",
    description: "Fully equipped gymnasium with modern equipment",
    features: ["Modern Equipment", "Air Conditioned", "Personal Training"],
    images: 4,
    status: "Maintenance",
  },
]

export default function FacilityPage() {
  const [facilityList, setFacilityList] = useState(facilities)

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this facility?")) {
      setFacilityList((prev) => prev.filter((facility) => facility.id !== id))
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
          <CardDescription>View and manage all club facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilityList.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{facility.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {facility.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {facility.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{facility.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{facility.images} photos</TableCell>
                  <TableCell>
                    <Badge variant={facility.status === "Active" ? "default" : "secondary"}>{facility.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(facility.id)}
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
