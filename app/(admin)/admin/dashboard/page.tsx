"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, DollarSign, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalMentors: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingMentors: 0,
  });
  const [loading, setLoading] = useState(true);

  // Ensure only admins can access this page
  useEffect(() => {
    // Only redirect if session is loaded (not loading)
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as any)?.role || "user";
      
      if (userRole !== "admin") {
        const roleUrls: Record<string, string> = {
          user: "/dashboard",
          recruiter: "/recruiter/dashboard",
          mentor: "/mentor/dashboard",
        };
        
        window.location.replace(roleUrls[userRole] || "/dashboard");
      }
    }
  }, [session, status]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      change: `${stats.activeUsers} active`,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/users",
    },
    {
      icon: Briefcase,
      label: "Total Jobs",
      value: stats.totalJobs,
      change: "Active listings",
      color: "bg-green-50 text-green-600",
      href: "/admin/jobs",
    },
    {
      icon: Users,
      label: "Mentors",
      value: stats.totalMentors,
      change: `${stats.pendingMentors} pending approval`,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/mentors",
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      change: "This month",
      color: "bg-primary-50 text-primary-600",
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="text-red-600" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage and monitor your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-xs text-gray-500">{stat.change}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/mentors"
          className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition group"
        >
          <div className="p-4 bg-purple-50 rounded-xl inline-flex mb-4 group-hover:scale-110 transition">
            <Users size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Mentors</h3>
          <p className="text-gray-600">Approve, verify, and manage mentor applications</p>
        </Link>

        <Link
          href="/admin/jobs"
          className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition group"
        >
          <div className="p-4 bg-green-50 rounded-xl inline-flex mb-4 group-hover:scale-110 transition">
            <Briefcase size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Jobs</h3>
          <p className="text-gray-600">Review and moderate job postings</p>
        </Link>

        <Link
          href="/admin/analytics"
          className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition group"
        >
          <div className="p-4 bg-primary-50 rounded-xl inline-flex mb-4 group-hover:scale-110 transition">
            <TrendingUp size={32} className="text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">View Analytics</h3>
          <p className="text-gray-600">Platform metrics and insights</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 size={20} className="text-green-600" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">New user registered</div>
              <div className="text-sm text-gray-600">2 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 size={20} className="text-blue-600" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">New job posted by recruiter</div>
              <div className="text-sm text-gray-600">1 hour ago</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 size={20} className="text-purple-600" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Mentor application pending</div>
              <div className="text-sm text-gray-600">3 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

