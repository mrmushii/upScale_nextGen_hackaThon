import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const currentPath = nextUrl.pathname;
      
      // Check if user is on any dashboard path
      const isOnDashboard = currentPath.startsWith("/dashboard") ||
                           currentPath.startsWith("/admin") ||
                           currentPath.startsWith("/recruiter") ||
                           currentPath.startsWith("/mentor");
      
      // Require authentication for all dashboard paths
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

