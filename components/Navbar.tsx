"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user) {
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
    }
    fetchProfile();
  }, [session]);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const getProfileUrl = () => {
    if (!session?.user) return "/login";
    const role = (session.user as any)?.role || profile?.role || "user";
    if (role === "user") return "/dashboard/profile";
    if (role === "admin") return "/admin/dashboard";
    if (role === "recruiter") return "/recruiter/dashboard";
    if (role === "mentor") return "/mentor/dashboard";
    return "/dashboard/profile";
  };

  const getDashboardUrl = () => {
    if (!session?.user) return "/login";
    const role = (session.user as any)?.role || profile?.role || "user";
    if (role === "user") return "/dashboard";
    if (role === "admin") return "/admin/dashboard";
    if (role === "recruiter") return "/recruiter/dashboard";
    if (role === "mentor") return "/mentor/dashboard";
    return "/dashboard";
  };

  const getRoleColor = () => {
    const role = (session?.user as any)?.role || profile?.role || "user";
    switch (role) {
      case "admin": return "from-red-500 to-orange-500";
      case "recruiter": return "from-blue-500 to-cyan-500";
      case "mentor": return "from-purple-500 to-pink-500";
      default: return "from-primary-500 to-coral-500";
    }
  };

  const handleSignOut = async () => {
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src="/logo.png" 
                alt="Upscale Logo" 
                className="h-10"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition">
              Testimonials
            </a>
            <a href="#faq" className="text-gray-700 hover:text-primary-600 transition">
              FAQ
            </a>
          </div>

          {/* CTA Buttons / User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session?.user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition"
                >
                  {profile?.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-600">
                      <Image
                        src={profile.avatar}
                        alt={profile.fullName || session.user.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor()} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {session.user.name?.charAt(0) || profile?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                  <ChevronDown size={18} className="text-gray-600" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="font-semibold text-gray-900">
                        {session.user.name || profile?.fullName || "User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(session.user as any)?.role || profile?.role || "user"}
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        href={getProfileUrl()}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={getDashboardUrl()}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href={`/${(session.user as any)?.role || profile?.role || "user"}/settings`}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition font-semibold">
                  Sign In
                </Link>
                <Link href="/register" className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition transform hover:scale-105">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              FAQ
            </a>
            <div className="pt-4 space-y-2">
              {session?.user ? (
                <>
                  <Link
                    href={getProfileUrl()}
                    className="block w-full text-center py-2 text-gray-700 hover:text-primary-600 transition font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    href={getDashboardUrl()}
                    className="block w-full text-center py-2 text-gray-700 hover:text-primary-600 transition font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="block w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center py-2 text-gray-700 hover:text-primary-600 transition font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full bg-primary-600 text-white py-2 rounded-full hover:bg-primary-700 transition text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

