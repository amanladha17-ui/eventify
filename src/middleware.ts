import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin route protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/admin/login", req.url))
    }

    // Customer route protection (e.g., booking, wishlist)
    if ((path.startsWith("/my-bookings") || path.startsWith("/wishlist")) && !token) {
      return NextResponse.redirect(new URL("/auth/customer/login", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/my-bookings", "/wishlist"],
}
