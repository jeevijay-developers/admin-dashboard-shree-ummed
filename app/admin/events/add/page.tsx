"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { addEvent } from "@/util/server"
import toast from "react-hot-toast"

export default function AddEventPage() {
  const [image, setImage] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Auto-generate slug from description (removed - backend handles this)
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value
    setShortDescription(description)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!image) {
        throw new Error("Please select an image")
      }

      // Create FormData object for file upload
      const formData = new FormData()
      
      // Append form fields based on event.model.js schema
      formData.append('image', image)
      formData.append('name', name)
      formData.append('eventDate', eventDate)
      formData.append('shortDescription', shortDescription)

      // Call the API
      const result = await addEvent(formData)
      
      // Success - redirect to events list
      toast.success("Event created successfully!")
      router.push("/admin/events")
    } catch (error: any) {
      console.error("Error adding event:", error)
      const errorMessage = error.response?.data?.error || error.message || "Failed to add event. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Add New Event</h1>
        <p className="text-muted-foreground">Create a new event for the club</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Enter the event information and upload an image</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Event Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {image ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt="Event preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      required
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload event image</p>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Annual Sports Meet 2024"
                className="text-base border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="text-base border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={shortDescription}
                onChange={handleDescriptionChange}
                placeholder="Brief description of the event..."
                rows={4}
                required
                className="text-base border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading || !image || !name || !eventDate || !shortDescription}>
                {isLoading ? "Adding..." : "Add Event"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
