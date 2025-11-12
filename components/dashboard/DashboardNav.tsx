"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
  { icon: Map, label: "Roadmap", href: "/dashboard/roadmap" },
  { icon: FileText, label: "Mock Interview", href: "/dashboard/interview" },
  { icon: FileText, label: "CV Analyzer", href: "/dashboard/cv-analyzer" },
  { icon: User, label: "Portfolio", href: "/dashboard/portfolio" },
  { icon: Users, label: "Mentors", href: "/dashboard/mentors" },
  { icon: MessageSquare, label: "Community", href: "/dashboard/community" },
  { icon: ClipboardList, label: "Applications", href: "/dashboard/applications" },
];

export default function DashboardNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
            Upscale
          </Link>
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
        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
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
          <Link href="/dashboard" className="text-xl font-bold text-primary-600">
            Upscale
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} className="text-gray-600" />
            </button>
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
              <div className="pt-4 border-t border-gray-200 space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </Link>
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
                placeholder="Search jobs, resources, mentors..."
                className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-coral-500 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-sm font-semibold text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">Pro Plan</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

