"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { clubGallery } from "@/util/server"
import toast from "react-hot-toast"

export default function AddClubGalleryPage() {
  const [image, setImage] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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
    
    if (!image || !title) {
      setError("Please provide both image and title")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('images', image) // Note: using 'images' to match backend
      formData.append('title', title)

      await clubGallery(formData)
      toast.success("Image added to gallery successfully!")
      router.push("/admin/club-gallery")
    } catch (error: any) {
      console.error("Error adding club gallery image:", error)
      const errorMessage = error.response?.data?.error || "Failed to add image to gallery"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Add Gallery Image</h1>
        <p className="text-muted-foreground">Add a new image to the club gallery</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Details</CardTitle>
          <CardDescription>Upload an image and provide a title</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {image ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt="Gallery preview"
                      className="w-48 h-48 object-cover rounded-lg"
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
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Click to upload image</p>
                      <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF up to 10MB</p>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Image Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Club Exterior View"
                required
              />
              <p className="text-xs text-muted-foreground">Provide a descriptive title for the image</p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add to Gallery"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/club-gallery")} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
