import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/api/products',  // Protect the entire products endpoint
    '/api/products/(.*)',  // Protect all sub-routes
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

    // For protected routes, apply Clerk middleware first
    if (isProtectedRoute(request)) {
        try {
            // Apply Clerk middleware
            const clerkResponse = await clerkMiddleware()(request)
            
            // Add CORS headers to the Clerk response
            const headers = new Headers(clerkResponse.headers)
            headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
            headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            
            // Return the response with both Clerk auth and CORS headers
            return new NextResponse(clerkResponse.body, {
                status: clerkResponse.status,
                statusText: clerkResponse.statusText,
                headers
            })
        } catch (error) {
            console.error('Clerk middleware error:', error);
            return new NextResponse(
                JSON.stringify({ error: 'Authentication required' }),
                { 
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                    }
                }
            )
        }
    }

    // Allow public routes to bypass authentication
    if (isPublicRoute(request)) {
        const response = NextResponse.next()
        response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
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
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
        '/api/:path*'
    ]
}