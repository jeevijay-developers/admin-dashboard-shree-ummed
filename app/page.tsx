"use client"

import { LoginForm } from "@/components/login-form"
import { useState, useEffect } from "react"
import { checkDatabaseConnection } from "@/util/server"
import Loading from "../loading"

export default function LoginPage() {
  const [isDbConnected, setIsDbConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await checkDatabaseConnection()
        setIsDbConnected(true)
      } catch (error) {
        console.error("Database connection failed:", error)
        // Retry connection after 3 seconds
        setTimeout(checkConnection, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (isLoading || !isDbConnected) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Shree Ummed Club Kota</h1>
          <p className="text-muted-foreground">Admin Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
