import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simplified middleware - since we're using localStorage for static auth,
// we'll handle route protection on the client side only
export function middleware(request: NextRequest) {
  // Just allow all requests and let client-side handle auth
  return NextResponse.next()
}

// Minimal matcher to avoid unnecessary processing
export const config = {
  matcher: [
    /*
     * Match admin routes only
     */
    '/admin/:path*',
  ],
}