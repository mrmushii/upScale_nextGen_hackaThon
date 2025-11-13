"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  Map,
  FileText,
  Users,
  MessageSquare,
  ClipboardList,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  Calendar,
  PlusCircle,
  BarChart3,
  BookOpen,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

export default function DynamicDashboardNav() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const userRole = session?.user?.role || profile?.role || "user";

  // ensure user's dashboard link is /dashboard (not /user/dashboard)
  const dashboardHref = userRole === "user" ? "/dashboard" : `/${userRole}/dashboard`;

  // Different navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: "Dashboard", href: dashboardHref, roles: ["user", "admin", "recruiter", "mentor"] },
    ];

    if (userRole === "admin") {
      return [
        ...baseItems,
        { icon: Users, label: "Users", href: "/admin/users", roles: ["admin"] },
        { icon: Briefcase, label: "All Jobs", href: "/admin/jobs", roles: ["admin"] },
        { icon: Users, label: "Mentors", href: "/admin/mentors", roles: ["admin"] },
        { icon: Shield, label: "Recruiters", href: "/admin/recruiters", roles: ["admin"] },
        { icon: BarChart3, label: "Analytics", href: "/admin/analytics", roles: ["admin"] },
        { icon: Settings, label: "Settings", href: "/admin/settings", roles: ["admin"] },
      ];
    } else if (userRole === "recruiter") {
      return [
        ...baseItems,
        { icon: Briefcase, label: "My Jobs", href: "/recruiter/jobs", roles: ["recruiter"] },
        { icon: PlusCircle, label: "Post Job", href: "/recruiter/jobs/new", roles: ["recruiter"] },
        { icon: BarChart3, label: "Analytics", href: "/recruiter/analytics", roles: ["recruiter"] },
        { icon: Settings, label: "Settings", href: "/recruiter/settings", roles: ["recruiter"] },
      ];
    } else if (userRole === "mentor") {
      return [
        ...baseItems,
        { icon: Calendar, label: "My Schedule", href: "/mentor/schedule", roles: ["mentor"] },
        { icon: Users, label: "My Students", href: "/mentor/students", roles: ["mentor"] },
        { icon: BarChart3, label: "Earnings", href: "/mentor/earnings", roles: ["mentor"] },
        { icon: Settings, label: "Settings", href: "/mentor/settings", roles: ["mentor"] },
      ];
    } else {
      return [
        ...baseItems,
        { icon: User, label: "Profile", href: "/dashboard/profile", roles: ["user"] },
        { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs", roles: ["user"] },
        { icon: Map, label: "Roadmap", href: "/dashboard/roadmap", roles: ["user"] },
        { icon: BookOpen, label: "Resources", href: "/dashboard/resources", roles: ["user"] },
        { icon: FileText, label: "Portfolio", href: "/dashboard/portfolio", roles: ["user"] },
        { icon: Users, label: "Mentors", href: "/dashboard/mentors", roles: ["user"] },
        { icon: Calendar, label: "My Sessions", href: "/dashboard/mentors/my-sessions", roles: ["user"] },
        { icon: MessageSquare, label: "Community", href: "/dashboard/community", roles: ["user"] },
        { icon: ClipboardList, label: "Applications", href: "/dashboard/applications", roles: ["user"] },
        { icon: Settings, label: "Settings", href: "/dashboard/settings", roles: ["user"] },
      ];
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin": return "Admin";
      case "recruiter": return "Recruiter";
      case "mentor": return "Mentor";
      default: return profile?.subscription?.tier?.toUpperCase() || "Basic";
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "admin": return "from-red-500 to-orange-500";
      case "recruiter": return "from-blue-500 to-cyan-500";
      case "mentor": return "from-purple-500 to-pink-500";
      default: return "from-primary-500 to-coral-500";
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="Upscale Logo" 
              className="h-16 mb-2"
            />
          </Link>
          <div className="text-xs font-semibold text-gray-500 uppercase">
            {userRole === "admin" ? "Admin Panel" : userRole === "recruiter" ? "Recruiter Portal" : userRole === "mentor" ? "Mentor Dashboard" : "Career Platform"}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition group"
            >
              <item.icon size={20} className="group-hover:scale-110 transition" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={async () => {
              const { signOut } = await import("next-auth/react");
              signOut({ callbackUrl: "/" });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="Upscale Logo" 
              className="h-8"
            />
          </Link>

          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={async () => {
                    const { signOut } = await import("next-auth/react");
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Desktop Top Bar */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-4">
            <NotificationDropdown />

            {/* Profile */}
            <Link
              href={userRole === "user" ? "/dashboard/profile" : `/${userRole}/settings`}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition"
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor()} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {session?.user?.name?.charAt(0) || profile?.fullName?.charAt(0) || "U"}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-sm font-semibold text-gray-900">
                  {session?.user?.name || profile?.fullName || "User"}
                </div>
                <div className="text-xs text-gray-500">{getRoleLabel()}</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
