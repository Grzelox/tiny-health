import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes (landing page)
const isPublicRoute = createRouteMatcher([
  "/", // Landing page
  "/favicon.ico", // Browser favicon
  "/_next(.*)", // Next.js system files
  "/api/uploadthing", // UploadThing API routes should remain public
]);

export default clerkMiddleware(async (auth, req) => {
  // If it's not a public route, protect it
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
