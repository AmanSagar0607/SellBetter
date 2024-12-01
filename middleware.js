import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Update protected routes to include the products API and add-product page
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/api/products(.*)',
    '/add-product(.*)'
])

// Middleware function to handle both Clerk auth and CORS
export default async function middleware(request) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        })
        return response
    }

    // Apply Clerk middleware for protected routes
    if (isProtectedRoute(request)) {
        const clerkResponse = await clerkMiddleware()(request)
        
        // Add CORS headers to the Clerk response
        const headers = new Headers(clerkResponse.headers)
        headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        
        return new NextResponse(clerkResponse.body, {
            status: clerkResponse.status,
            statusText: clerkResponse.statusText,
            headers
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}