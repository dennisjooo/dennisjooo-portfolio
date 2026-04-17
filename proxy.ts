import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/admin/login(.*)"]);
const isProtected = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req) && !isPublicRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/admin/login", req.url).toString(),
    });
  }
});

export const config = {
  matcher: ["/admin(.*)", "/api(.*)"],
};
