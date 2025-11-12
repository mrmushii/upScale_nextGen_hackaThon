"use client";

import { useState, useEffect } from "react";
import { User, Lock, CreditCard, Bell, Shield, Crown, Save } from "lucide-react";
import { CAREER_TRACKS, EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "@/lib/constants";
import Link from "next/link";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Lock },
  { id: "subscription", label: "Subscription", icon: Crown },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setFormData({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          city: data.user.city || "",
          country: data.user.country || "",
          preferredTrack: data.user.preferredTrack || "",
          educationLevel: data.user.educationLevel || "",
          experienceLevel: data.user.experienceLevel || "",
          skills: data.user.skills || [],
          targetRoles: data.user.targetRoles || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-4 shadow-lg space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Track
                    </label>
                    <select
                      value={formData.preferredTrack}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredTrack: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">Select a track</option>
                      {CAREER_TRACKS.map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, experienceLevel: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">Select level</option>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Subscription Plan</h2>
                <div className="p-6 bg-gradient-to-br from-primary-50 to-coral-50 rounded-2xl border-2 border-primary-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Current Plan</div>
                      <div className="text-3xl font-bold text-gray-900 uppercase">
                        {profile?.subscription?.tier || "Basic"}
                      </div>
                    </div>
                    <Crown size={48} className="text-primary-600" />
                  </div>
                  <div className="text-gray-700 mb-4">
                    Status: {profile?.subscription?.status || "Active"}
                  </div>
                  {profile?.subscription?.tier === "basic" && (
                    <Link
                      href="/dashboard/payment"
                      className="block text-center w-full py-3 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl hover:from-primary-700 hover:to-coral-700 transition font-semibold"
                    >
                      Upgrade to Pro - ৳999/month
                    </Link>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Usage This Month</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600">Roadmaps</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {profile?.usageLimits?.careerRoadmaps || 0}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {profile?.subscription?.tier === "basic" ? "1 total" : 
                         profile?.subscription?.tier === "pro" ? "/ 5 per month" : "Unlimited"}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600">CV Analyses</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {profile?.usageLimits?.cvAnalyses || 0}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {profile?.subscription?.tier === "basic" ? "1 total" : 
                         profile?.subscription?.tier === "pro" ? "/ 10 per month" : "Unlimited"}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600">Mock Interviews</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {profile?.usageLimits?.mockInterviews || 0}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {profile?.subscription?.tier === "basic" ? "Not available" : 
                         profile?.subscription?.tier === "pro" ? "/ 20 per month" : "Unlimited"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "profile" && activeTab !== "subscription" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                  {tabs.find((t) => t.id === activeTab)?.label} settings will be available soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
