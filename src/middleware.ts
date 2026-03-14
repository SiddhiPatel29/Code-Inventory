import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      console.log("MIDDLEWARE CHECK:", req.nextUrl.pathname);
      return !!token || req.nextUrl.pathname.startsWith("/api/init-db") || req.nextUrl.pathname.startsWith("/register");
    },
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - login (auth pages)
     * - register (registration pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api/auth|api/init-db|api/seed|login|register|_next/static|_next/image|favicon.ico).*)",
  ],
};
