"use client";

import { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Users, Briefcase, TrendingUp, DollarSign } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // User growth chart data
  const userGrowthData = {
    labels: analytics?.userGrowth?.map((d: any) => 
      `${d._id.year}-${String(d._id.month).padStart(2, "0")}`
    ) || [],
    datasets: [
      {
        label: "New Users",
        data: analytics?.userGrowth?.map((d: any) => d.count) || [],
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Role distribution chart data
  const roleData = {
    labels: analytics?.roleDistribution?.map((d: any) => d._id?.toUpperCase() || "UNKNOWN") || [],
    datasets: [
      {
        data: analytics?.roleDistribution?.map((d: any) => d.count) || [],
        backgroundColor: [
          "rgba(244, 63, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
      },
    ],
  };

  // Tier distribution chart data
  const tierData = {
    labels: analytics?.tierDistribution?.map((d: any) => d._id?.toUpperCase() || "BASIC") || [],
    datasets: [
      {
        label: "Users",
        data: analytics?.tierDistribution?.map((d: any) => d.count) || [],
        backgroundColor: [
          "rgba(156, 163, 175, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(234, 179, 8, 0.8)",
        ],
      },
    ],
  };

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: analytics?.counts?.totalUsers || 0,
      change: "+12% from last month",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Briefcase,
      label: "Total Jobs",
      value: analytics?.counts?.totalJobs || 0,
      change: `${analytics?.counts?.activeJobs || 0} active`,
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Users,
      label: "Total Mentors",
      value: analytics?.counts?.totalMentors || 0,
      change: "Verified professionals",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Growth Rate",
      value: "15.3%",
      change: "This month",
      color: "bg-primary-50 text-primary-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-600 mt-2">Monitor platform performance and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-xs text-green-600 font-semibold">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">User Growth (Last 6 Months)</h3>
          <Line 
            data={userGrowthData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Role Distribution</h3>
          <div className="max-w-xs mx-auto">
            <Doughnut 
              data={roleData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Subscription Tiers</h3>
          <Bar 
            data={tierData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Users</h3>
          <div className="space-y-4">
            {analytics?.recentUsers?.map((user: any) => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-900">{user.fullName}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === "admin" ? "bg-red-100 text-red-700" :
                  user.role === "mentor" ? "bg-purple-100 text-purple-700" :
                  user.role === "recruiter" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


