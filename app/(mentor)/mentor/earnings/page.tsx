"use client";


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
import { useState, useEffect } from "react";

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

      {/* Payout Configuration */}
      <PayoutConfiguration />

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
            <div className="text-sm text-gray-600">Automatic payout on your selected day</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayoutConfiguration() {
  const [payoutConfig, setPayoutConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    enabled: false,
    paymentMethod: "bKash" as "bKash" | "Nagad" | "Bank" | "Rocket",
    accountNumber: "",
    accountName: "",
    bankName: "",
    branchName: "",
    payoutDay: 1,
  });

  useEffect(() => {
    fetchPayoutConfig();
  }, []);

  const fetchPayoutConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mentor/payout");
      const data = await response.json();
      if (data.payoutConfig) {
        setPayoutConfig(data.payoutConfig);
        setFormData({
          enabled: data.payoutConfig.enabled || false,
          paymentMethod: data.payoutConfig.paymentMethod || "bKash",
          accountNumber: data.payoutConfig.accountNumber || "",
          accountName: data.payoutConfig.accountName || "",
          bankName: data.payoutConfig.bankName || "",
          branchName: data.payoutConfig.branchName || "",
          payoutDay: data.payoutConfig.payoutDay || 1,
        });
        setShowForm(data.payoutConfig.enabled);
      }
    } catch (error) {
      console.error("Error fetching payout config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/mentor/payout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutConfig: formData }),
      });

      if (response.ok) {
        const data = await response.json();
        setPayoutConfig(data.payoutConfig);
        setMessage("✅ Payout configuration saved successfully!");
        setShowForm(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to save payout configuration");
      }
    } catch (error) {
      console.error("Error saving payout config:", error);
      setMessage("❌ Error saving payout configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payout configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Payout Configuration</h3>
          <p className="text-gray-600 mt-1">Set up automatic monthly payouts</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            {payoutConfig?.enabled ? "Edit Configuration" : "Setup Payout"}
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 ${
          message.includes("✅") ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-700 border-2 border-red-200"
        }`}>
          {message}
        </div>
      )}

      {payoutConfig?.enabled && !showForm && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-green-600" />
            <h4 className="text-lg font-bold text-gray-900">Payout Configuration Active</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Method</div>
              <div className="font-semibold text-gray-900">{payoutConfig.paymentMethod}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Account Number</div>
              <div className="font-semibold text-gray-900">{payoutConfig.accountNumber}</div>
            </div>
            {payoutConfig.accountName && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Account Name</div>
                <div className="font-semibold text-gray-900">{payoutConfig.accountName}</div>
              </div>
            )}
            {payoutConfig.bankName && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Bank Name</div>
                <div className="font-semibold text-gray-900">{payoutConfig.bankName}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600 mb-1">Payout Day</div>
              <div className="font-semibold text-gray-900">
                {payoutConfig.payoutDay}{payoutConfig.payoutDay === 1 ? "st" : payoutConfig.payoutDay === 2 ? "nd" : payoutConfig.payoutDay === 3 ? "rd" : "th"} of each month
              </div>
            </div>
            {payoutConfig.nextPayoutDate && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Next Payout</div>
                <div className="font-semibold text-gray-900">
                  {new Date(payoutConfig.nextPayoutDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
              <span className="font-semibold text-gray-700">Enable Automatic Payouts</span>
            </label>
          </div>

          {formData.enabled && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method *</label>
                  <select
                    required={formData.enabled}
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number *</label>
                  <input
                    type="text"
                    required={formData.enabled}
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              {formData.paymentMethod === "Bank" && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name *</label>
                    <input
                      type="text"
                      required={formData.enabled && formData.paymentMethod === "Bank"}
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name *</label>
                    <input
                      type="text"
                      required={formData.enabled && formData.paymentMethod === "Bank"}
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Branch Name</label>
                    <input
                      type="text"
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payout Day of Month *</label>
                <select
                  required={formData.enabled}
                  value={formData.payoutDay}
                  onChange={(e) => setFormData({ ...formData, payoutDay: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}{day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"} of each month
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Your earnings will be automatically transferred to your account on this day each month.
                </p>
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-coral-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                fetchPayoutConfig();
              }}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


