import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes - these require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/agent(.*)',
  '/api/create-checkout-session',
  '/api/livekit-token',
])

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
