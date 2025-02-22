import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/blog", "/bookmarks"]);
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/api/webhooks"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isPublicRoute(req)) return;
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    afterSignInUrl: "/",
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
