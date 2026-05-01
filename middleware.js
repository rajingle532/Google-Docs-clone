import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

// Only protect /doc/* routes.
// Excluding /api/auth prevents the middleware from intercepting NextAuth
// requests and causing the "Response body disturbed" error.
export const config = {
  matcher: ["/doc/:path*"],
};
