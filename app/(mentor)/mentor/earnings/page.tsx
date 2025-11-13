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
import { DollarSign, TrendingUp, Calendar, CheckCircle } from "lucide-react";

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

export default function MentorEarningsPage() {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await fetch("/api/mentor/earnings");
      const data = await response.json();
      setEarnings(data);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  // Earnings chart data
  const earningsChartData = {
    labels: earnings?.monthlyData?.map((d: any) => d.month) || [],
    datasets: [
      {
        label: "Earnings (৳)",
        data: earnings?.monthlyData?.map((d: any) => d.earnings) || [],
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Sessions chart data
  const sessionsChartData = {
    labels: earnings?.monthlyData?.map((d: any) => d.month) || [],
    datasets: [
      {
        label: "Sessions",
        data: earnings?.monthlyData?.map((d: any) => d.sessions) || [],
        backgroundColor: "rgba(168, 85, 247, 0.8)",
      },
    ],
  };

  const stats = [
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: `৳${earnings?.totalEarnings?.toLocaleString()}`,
      change: "+18% from last month",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Calendar,
      label: "Total Sessions",
      value: earnings?.totalSessions,
      change: `${earnings?.monthlyData?.[earnings.monthlyData.length - 1]?.sessions} this month`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Avg Session Rate",
      value: `৳${earnings?.avgSessionRate}`,
      change: "Per session",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: CheckCircle,
      label: "This Month",
      value: `৳${earnings?.monthlyData?.[earnings.monthlyData.length - 1]?.earnings?.toLocaleString()}`,
      change: "Current month earnings",
      color: "bg-primary-50 text-primary-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your mentoring revenue and performance</p>
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
        {/* Earnings Trend */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Earnings Trend</h3>
          <Line 
            data={earningsChartData}
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
                  ticks: {
                    callback: function(value) {
                      return '৳' + value.toLocaleString();
                    }
                  }
                },
              },
            }}
          />
        </div>

        {/* Sessions per Month */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Sessions</h3>
          <Bar 
            data={sessionsChartData}
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

      {/* Recent Payouts */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Payouts</h3>
        <div className="space-y-4">
          {earnings?.recentPayouts?.map((payout: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-primary-300 transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <DollarSign size={24} className="text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    ৳{payout.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(payout.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {payout.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6">
            <div className="text-primary-600 font-bold text-2xl mb-2">85%</div>
            <div className="text-gray-900 font-semibold mb-1">Your Share</div>
            <div className="text-sm text-gray-600">You keep 85% of session earnings</div>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-coral-600 font-bold text-2xl mb-2">15%</div>
            <div className="text-gray-900 font-semibold mb-1">Platform Fee</div>
            <div className="text-sm text-gray-600">Platform maintenance and support</div>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-green-600 font-bold text-2xl mb-2">Monthly</div>
            <div className="text-gray-900 font-semibold mb-1">Payout</div>
            <div className="text-sm text-gray-600">Paid on the 1st of each month</div>
          </div>
        </div>
      </div>
    </div>
  );
}


