"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const result = await login({ email, password })
    
    if (!result.success) {
      setError(result.error || "Login failed. Please try again.")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <Card className="w-full shadow-lg border-0 sm:border sm:shadow-md">
        <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 sm:pt-6">
          <CardTitle className="text-xl sm:text-2xl text-center font-bold">Sign In</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base text-muted-foreground">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@shreummedclub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12 text-base border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 sm:h-12 text-base border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 sm:h-12 text-base font-medium mt-6" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
