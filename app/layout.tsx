import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Shree Ummed Club',
  description: 'Admin panel for managing facilities, events, and gallery of Shree Ummed Club Kota.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
