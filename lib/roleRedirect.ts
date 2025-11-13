/**
 * Get the appropriate dashboard URL based on user role
 */
export function getDashboardUrl(role?: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "recruiter":
      return "/recruiter/dashboard";
    case "mentor":
      return "/mentor/dashboard";
    case "user":
    default:
      return "/dashboard";
  }
}

/**
 * Check if a path is a role-specific dashboard
 */
export function isDashboardPath(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/recruiter") ||
    pathname.startsWith("/mentor")
  );
}

