"use client";

import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Briefcase, Eye, Users, TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RecruiterAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/recruiter/job-analytics");
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

  // Job postings chart data
  const jobsChartData = {
    labels: analytics?.monthlyData?.map((d: any) => d.month) || [],
    datasets: [
      {
        label: "Jobs Posted",
        data: analytics?.monthlyData?.map((d: any) => d.jobs) || [],
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Applications chart data
  const applicationsChartData = {
    labels: analytics?.monthlyData?.map((d: any) => d.month) || [],
    datasets: [
      {
        label: "Applications Received",
        data: analytics?.monthlyData?.map((d: any) => d.applications) || [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  };

  const stats = [
    {
      icon: Briefcase,
      label: "Total Jobs",
      value: analytics?.totalJobs,
      change: `${analytics?.activeJobs} active`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: analytics?.totalViews?.toLocaleString(),
      change: "All time",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Users,
      label: "Applications",
      value: analytics?.totalApplications,
      change: "Total received",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Avg per Job",
      value: Math.round(analytics?.totalApplications / analytics?.totalJobs) || 0,
      change: "Applications",
      color: "bg-primary-50 text-primary-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Analytics</h1>
        <p className="text-gray-600 mt-2">Track your job postings performance</p>
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Job Posting Trend */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Job Posting Trend</h3>
          <Line 
            data={jobsChartData}
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

        {/* Applications Received */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Applications Received</h3>
          <Bar 
            data={applicationsChartData}
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
      </div>

      {/* Top Performing Jobs */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Jobs</h3>
        <div className="space-y-4">
          {analytics?.topJobs?.map((job: any, index: number) => (
            <div key={job.id} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-primary-300 transition">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                <div>
                  <div className="font-semibold text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {job.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {job.applications} applications
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Conversion Rate</div>
                <div className="text-xl font-bold text-primary-600">
                  {Math.round((job.applications / job.views) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tips to Improve Performance</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6">
            <div className="text-2xl mb-2">✍️</div>
            <div className="text-gray-900 font-semibold mb-1">Clear Job Titles</div>
            <div className="text-sm text-gray-600">Use specific, descriptive titles</div>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-gray-900 font-semibold mb-1">Show Salary</div>
            <div className="text-sm text-gray-600">Include salary range for more applications</div>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-gray-900 font-semibold mb-1">Target Skills</div>
            <div className="text-sm text-gray-600">List specific required skills</div>
          </div>
        </div>
      </div>
    </div>
  );
}


