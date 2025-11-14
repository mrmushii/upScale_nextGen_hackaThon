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
  Sparkles,
  Bot,
  FileText as FileTextIcon,
  ChevronDown,
  ChevronRight,
  Folder,
  Heart,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { usePathname } from "next/navigation";

export default function DynamicDashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  // Load expanded sections from localStorage
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-nav-expanded");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback to defaults if parse fails
        }
      }
    }
    return {
      career: true, // Default expanded
      documents: false,
      ai: false,
      support: false,
    };
  });

  // Save expanded sections to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboard-nav-expanded", JSON.stringify(expandedSections));
    }
  }, [expandedSections]);

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
  const subscriptionTierRaw =
    profile?.subscription?.tier || (session?.user as any)?.tier || "basic";
  const subscriptionTier = subscriptionTierRaw.toString().toLowerCase();

  // Auto-expand section if current page is in that section
  useEffect(() => {
    if (userRole === "user" && pathname) {
      const sections = {
        career: ["/dashboard/profile", "/dashboard/jobs", "/dashboard/jobs/favorites", "/dashboard/roadmap", "/dashboard/resources"],
        documents: ["/dashboard/cv", "/dashboard/portfolio"],
        ai: ["/dashboard/careerbot", "/dashboard/interviews"],
        support: ["/dashboard/mentors", "/dashboard/community"],
      };

      Object.entries(sections).forEach(([sectionId, paths]) => {
        if (paths.some((path) => pathname.startsWith(path))) {
          setExpandedSections((prev) => ({ ...prev, [sectionId]: true }));
        }
      });
    }
  }, [pathname, userRole]);

  // Helper to check if link is active
  const isActiveLink = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // ensure user's dashboard link is /dashboard (not /user/dashboard)
  const dashboardHref = userRole === "user" ? "/dashboard" : `/${userRole}/dashboard`;

  // Different navigation items based on role
  const getNavItems = (): Array<{ icon: any; label: string; href: string; roles: string[] }> | null => {
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
      // Users use grouped navigation, return null for flat nav
      return null;
    }
  };

  const navItems = getNavItems();
  
  // Get grouped navigation for users
  const getUserNavSections = () => {
    if (userRole !== "user") return null;
    
    return [
      {
        id: "career",
        label: "Career Tools",
        icon: Briefcase,
        defaultExpanded: expandedSections.career,
        items: [
          { icon: User, label: "Profile", href: "/dashboard/profile" },
          { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
          { icon: Heart, label: "Favorite Jobs", href: "/dashboard/jobs/favorites" },
          { icon: Map, label: "Roadmap", href: "/dashboard/roadmap" },
          { icon: BookOpen, label: "Resources", href: "/dashboard/resources" },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        icon: Folder,
        defaultExpanded: expandedSections.documents,
        items: [
          { icon: FileTextIcon, label: "My CV", href: "/dashboard/cv" },
          { icon: FileText, label: "Portfolio", href: "/dashboard/portfolio" },
        ],
      },
      {
        id: "ai",
        label: "AI Assistant",
        icon: Sparkles,
        defaultExpanded: expandedSections.ai,
        items: [
          { icon: Bot, label: "CareerBot", href: "/dashboard/careerbot" },
          ...(subscriptionTier === "pro" || subscriptionTier === "ultimate"
            ? [
                {
                  icon: Sparkles,
                  label: "AI Interviews",
                  href: "/dashboard/interviews",
                },
              ]
            : []),
        ],
      },
      {
        id: "support",
        label: "Support",
        icon: Users,
        defaultExpanded: expandedSections.support,
        items: [
          { icon: Users, label: "Mentors", href: "/dashboard/mentors" },
          { icon: Calendar, label: "My Sessions", href: "/dashboard/mentors/my-sessions" },
          { icon: MessageSquare, label: "Community", href: "/dashboard/community" },
        ],
      },
    ];
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const userNavSections = getUserNavSections();

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
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {userRole === "user" && userNavSections ? (
            <>
              {/* Dashboard - Always visible */}
              <Link
                href={dashboardHref}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition group mb-2 ${
                  isActiveLink(dashboardHref)
                    ? "bg-primary-100 text-primary-700 font-semibold"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                <LayoutDashboard size={20} className="group-hover:scale-110 transition" />
                <span className="font-medium">Dashboard</span>
              </Link>

              {/* Grouped Sections */}
              {userNavSections.map((section) => (
                <div key={section.id} className="mb-2">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <section.icon size={14} />
                      <span>{section.label}</span>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>

                  {/* Section Items */}
                  {expandedSections[section.id] && (
                    <div className="mt-1 space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-2.5 ml-4 rounded-lg transition group text-sm ${
                            isActiveLink(item.href)
                              ? "bg-primary-100 text-primary-700 font-semibold"
                              : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                          }`}
                        >
                          <item.icon size={18} className="group-hover:scale-110 transition" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Standalone Items */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                <Link
                  href="/dashboard/applications"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition group ${
                    isActiveLink("/dashboard/applications")
                      ? "bg-primary-100 text-primary-700 font-semibold"
                      : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  <ClipboardList size={20} className="group-hover:scale-110 transition" />
                  <span className="font-medium">Applications</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition group ${
                    isActiveLink("/dashboard/settings")
                      ? "bg-primary-100 text-primary-700 font-semibold"
                      : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  <Settings size={20} className="group-hover:scale-110 transition" />
                  <span className="font-medium">Settings</span>
                </Link>
              </div>
            </>
          ) : (
            // Non-user roles (admin, recruiter, mentor) - flat navigation
            navItems && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition group"
              >
                <item.icon size={20} className="group-hover:scale-110 transition" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))
          )}
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
            <nav className="p-4 space-y-2">
              {userRole === "user" && userNavSections ? (
                <>
                  {/* Dashboard */}
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition"
                  >
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  {/* Grouped Sections */}
                  {userNavSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <section.icon size={14} />
                          <span>{section.label}</span>
                        </div>
                        {expandedSections[section.id] ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                      {expandedSections[section.id] && (
                        <div className="mt-1 space-y-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 ml-4 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition text-sm"
                            >
                              <item.icon size={18} />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Standalone Items */}
                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    <Link
                      href="/dashboard/applications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition"
                    >
                      <ClipboardList size={20} />
                      <span className="font-medium">Applications</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition"
                    >
                      <Settings size={20} />
                      <span className="font-medium">Settings</span>
                    </Link>
                  </div>
                </>
              ) : (
                navItems && navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition"
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))
              )}
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
