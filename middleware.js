import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes - note that /api/all-products is NOT protected
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/api/products(.*)',
    '/api/user-products(.*)',
    '/add-product(.*)'
])

// Define public routes that should bypass authentication
const isPublicRoute = createRouteMatcher([
    '/',
    '/explore',
    '/api/all-products(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)'
])

// Define auth-related routes for special handling
const isAuthRoute = createRouteMatcher([
    '/sign-out(.*)'
])

// Middleware function to handle both Clerk auth and CORS
export default async function middleware(request) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        })
    }

    // Handle sign-out redirection
    if (isAuthRoute(request)) {
        const homeUrl = new URL('/', request.url)
        return NextResponse.redirect(homeUrl)
    }

    // Allow public routes to bypass authentication
    if (isPublicRoute(request)) {
        const response = NextResponse.next()
        response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
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

    // For all other routes, allow access with CORS headers
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}