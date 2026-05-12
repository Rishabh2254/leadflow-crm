import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/login") || path.startsWith("/signup")) return true;
      if (path.startsWith("/api/auth")) return true;
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};

