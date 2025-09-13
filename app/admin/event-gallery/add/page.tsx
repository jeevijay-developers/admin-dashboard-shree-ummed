"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { eventGallery } from "@/util/server"
import { compressImage, compressImages } from "@/util/imageCompression"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 rounded-md animate-pulse" />
})

export default function AddEventGalleryPage() {
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [eventImages, setEventImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressionProgress, setCompressionProgress] = useState<{
    banner?: boolean
    event?: boolean
  }>({})
  const router = useRouter()

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote']
    ],
  }

  const quillFormats = [
    'header', 'size',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'blockquote'
  ]

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCompressionProgress(prev => ({ ...prev, banner: true }))
      try {
        const compressedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 600,
          quality: 0.8,
          format: 'jpeg'
        })
        setBannerImage(compressedFile)
      } catch (error) {
        console.error('Error compressing banner image:', error)
        setBannerImage(file) // Fallback to original file
      } finally {
        setCompressionProgress(prev => ({ ...prev, banner: false }))
      }
    }
  }

  const handleEventImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setCompressionProgress(prev => ({ ...prev, event: true }))
      try {
        const compressedFiles = await compressImages(files, {
          maxWidth: 1024,
          maxHeight: 768,
          quality: 0.85,
          format: 'jpeg'
        })
        setEventImages([...eventImages, ...compressedFiles])
      } catch (error) {
        console.error('Error compressing event images:', error)
        setEventImages([...eventImages, ...files]) // Fallback to original files
      } finally {
        setCompressionProgress(prev => ({ ...prev, event: false }))
      }
    }
  }

  const removeBannerImage = () => {
    setBannerImage(null)
  }

  const removeEventImage = (index: number) => {
    setEventImages(eventImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if content has actual text (not just HTML tags)
    const contentText = content.replace(/<[^>]*>/g, '').trim()
    
    if (!bannerImage || !title || !contentText || eventImages.length === 0) {
      setError("Please fill all fields and upload at least one event image")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('banner', bannerImage)
      formData.append('title', title)
      formData.append('content', content) // Send the full HTML content
      
      // Append multiple event images
      eventImages.forEach((image) => {
        formData.append('images', image)
      })

      console.log('Sending event gallery data:');
      console.log('Title:', title);
      console.log('Content length:', content.length);
      console.log('Banner image:', bannerImage?.name, bannerImage?.size);
      console.log('Event images count:', eventImages.length);

      await eventGallery(formData)
      router.push("/admin/event-gallery")
    } catch (error: any) {
      console.error("Error creating event gallery:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      
      // Try to extract meaningful error message
      let errorMessage = "Failed to create event gallery"
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center min-h-screen py-6">
      <div className="w-full space-y-6">
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
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {compressionProgress.banner ? (
                  <div className="space-y-2">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                    <p className="text-sm text-blue-600">Compressing banner image...</p>
                  </div>
                ) : bannerImage ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(bannerImage) || "/placeholder.svg"}
                      alt="Banner preview"
                      className="w-full h-32 object-cover rounded-lg"
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
                      <p className="text-xs text-gray-400 mt-1">Images will be automatically compressed for faster upload</p>
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
                className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content Description</Label>
              <div className="quill-wrapper border rounded-lg overflow-hidden bg-white">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Describe the event and what the gallery contains... Use the toolbar to format your content with headings, bullet points, bold text, and more!"
                  className="min-h-[250px]"
                />
              </div>
              
              <style jsx global>{`
                .quill-wrapper .ql-toolbar {
                  border: none;
                  border-bottom: 2px solid #e2e8f0;
                  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                  padding: 12px 16px;
                  border-radius: 8px 8px 0 0;
                }
                
                .quill-wrapper .ql-toolbar .ql-formats {
                  margin-right: 16px;
                }
                
                .quill-wrapper .ql-toolbar .ql-formats:last-child {
                  margin-right: 0;
                }
                
                .quill-wrapper .ql-toolbar button {
                  border: 1px solid transparent;
                  border-radius: 8px;
                  padding: 10px 12px;
                  margin: 0 3px;
                  transition: all 0.2s ease;
                  background: white;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  min-width: 40px;
                  min-height: 40px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                }
                
                .quill-wrapper .ql-toolbar button:hover {
                  background: #3b82f6;
                  border-color: #3b82f6;
                  transform: translateY(-1px);
                  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
                }
                
                .quill-wrapper .ql-toolbar button:hover .ql-stroke {
                  stroke: white;
                }
                
                .quill-wrapper .ql-toolbar button:hover .ql-fill {
                  fill: white;
                }
                
                .quill-wrapper .ql-toolbar button.ql-active {
                  background: #3b82f6;
                  border-color: #3b82f6;
                  color: white;
                }
                
                .quill-wrapper .ql-toolbar button.ql-active .ql-stroke {
                  stroke: white;
                }
                
                .quill-wrapper .ql-toolbar button.ql-active .ql-fill {
                  fill: white;
                }
                
                .quill-wrapper .ql-toolbar .ql-picker {
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  background: white;
                  padding: 8px 12px;
                  margin: 0 3px;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  transition: all 0.2s ease;
                  min-height: 40px;
                  display: inline-flex;
                  align-items: center;
                }
                
                .quill-wrapper .ql-toolbar .ql-picker:hover {
                  border-color: #3b82f6;
                  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
                }
                
                .quill-wrapper .ql-toolbar .ql-picker-label {
                  color: #374151;
                  font-weight: 500;
                }
                
                .quill-wrapper .ql-toolbar .ql-picker-label:hover {
                  color: #3b82f6;
                }
                
                .quill-wrapper .ql-toolbar .ql-picker-options {
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  background: white;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                  padding: 4px;
                }
                
                .quill-wrapper .ql-toolbar .ql-picker-item {
                  border-radius: 4px;
                  padding: 6px 12px;
                  margin: 2px 0;
                  transition: all 0.2s ease;
                }
                
                .quill-wrapper .ql-toolbar .ql-picker-item:hover {
                  background: #eff6ff;
                  color: #3b82f6;
                }
                
                .quill-wrapper .ql-container {
                  border: none;
                  font-family: inherit;
                  background: white;
                }
                
                .quill-wrapper .ql-editor {
                  font-family: inherit;
                  font-size: 14px;
                  line-height: 1.6;
                  padding: 16px 20px;
                  min-height: 180px;
                  color: #374151;
                }
                
                .quill-wrapper .ql-editor.ql-blank::before {
                  font-style: normal;
                  color: #9ca3af;
                  font-size: 14px;
                }
                
                .quill-wrapper .ql-editor h1 {
                  font-size: 2em;
                  font-weight: 700;
                  margin: 0.67em 0;
                  color: #1f2937;
                }
                
                .quill-wrapper .ql-editor h2 {
                  font-size: 1.5em;
                  font-weight: 600;
                  margin: 0.75em 0;
                  color: #1f2937;
                }
                
                .quill-wrapper .ql-editor h3 {
                  font-size: 1.3em;
                  font-weight: 600;
                  margin: 0.83em 0;
                  color: #374151;
                }
                
                .quill-wrapper .ql-editor ul, .quill-wrapper .ql-editor ol {
                  padding-left: 1.5em;
                  margin: 1em 0;
                }
                
                .quill-wrapper .ql-editor blockquote {
                  border-left: 4px solid #3b82f6;
                  padding-left: 16px;
                  margin: 16px 0;
                  font-style: italic;
                  background: #f8fafc;
                  padding: 12px 16px;
                  border-radius: 0 8px 8px 0;
                }
                
                .quill-wrapper .ql-editor code {
                  background: #f1f5f9;
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-family: 'Courier New', monospace;
                  font-size: 0.9em;
                  color: #dc2626;
                }
                
                .quill-wrapper .ql-editor .ql-code-block {
                  background: #1f2937;
                  color: #f3f4f6;
                  padding: 16px;
                  border-radius: 8px;
                  font-family: 'Courier New', monospace;
                  margin: 16px 0;
                }
                
                /* Color picker styling */
                .quill-wrapper .ql-color .ql-picker-options {
                  width: 0px;
                  padding: 8px;
                }
                
                .quill-wrapper .ql-color .ql-picker-item {
                  border: 2px solid transparent;
                  border-radius: 4px;
                  width: 20px;
                  height: 20px;
                  margin: 2px;
                }
                
                .quill-wrapper .ql-color .ql-picker-item:hover {
                  border-color: #374151;
                  transform: scale(1.1);
                }
              `}</style>
            </div>

            <div className="space-y-2">
              <Label>Event Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {compressionProgress.event ? (
                  <div className="space-y-2">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                    <p className="text-sm text-blue-600">Compressing event images...</p>
                  </div>
                ) : (
                  <>
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
                      <p className="text-xs text-gray-400 mt-1">Images will be automatically compressed for faster upload</p>
                    </label>
                  </>
                )}
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
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Gallery"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/event-gallery")} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
