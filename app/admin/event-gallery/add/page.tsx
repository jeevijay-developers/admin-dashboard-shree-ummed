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

export default function AddEventGalleryPage() {
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [eventImages, setEventImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerImage(file)
    }
  }

  const handleEventImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setEventImages([...eventImages, ...files])
  }

  const removeBannerImage = () => {
    setBannerImage(null)
  }

  const removeEventImage = (index: number) => {
    setEventImages(eventImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      alert("Event gallery created successfully!")
      router.push("/admin/event-gallery")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Add Event Gallery</h1>
        <p className="text-muted-foreground">Create a new event photo gallery</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Gallery Details</CardTitle>
          <CardDescription>Add banner image, title, content, and event photos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {bannerImage ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(bannerImage) || "/placeholder.svg"}
                      alt="Banner preview"
                      className="w-full max-w-md h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeBannerImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                      id="banner-upload"
                      required
                    />
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload banner image</p>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Gallery Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Sports Meet 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content Description</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the event and what the gallery contains..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Event Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEventImagesUpload}
                  className="hidden"
                  id="event-images-upload"
                />
                <label htmlFor="event-images-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload event images (multiple selection allowed)
                  </p>
                </label>
              </div>

              {eventImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">{eventImages.length} images selected</p>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {eventImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Event image ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                          onClick={() => removeEventImage(index)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Gallery"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/event-gallery")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
