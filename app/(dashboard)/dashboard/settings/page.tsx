"use client";

import { useState } from "react";
import { User, Lock, CreditCard, Bell, Shield, Crown } from "lucide-react";

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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input type="email" defaultValue="john@example.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input type="text" defaultValue="Dhaka, Bangladesh" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Track</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none">
                      <option>Frontend Development</option>
                      <option>Backend Development</option>
                      <option>Full Stack Development</option>
                    </select>
                  </div>
                </div>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold">
                  Save Changes
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
                      <div className="text-3xl font-bold text-gray-900">Pro</div>
                    </div>
                    <Crown size={48} className="text-primary-600" />
                  </div>
                  <div className="text-gray-700 mb-4">৳999/month • Renews on Feb 15, 2024</div>
                  <button className="w-full py-3 bg-white border-2 border-primary-300 text-primary-700 rounded-xl hover:bg-primary-50 transition font-semibold">
                    Upgrade to Ultimate
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Usage This Month</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600">Interviews</div>
                      <div className="text-2xl font-bold text-gray-900">8/20</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600">Roadmaps</div>
                      <div className="text-2xl font-bold text-gray-900">3/5</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600">CV Analyses</div>
                      <div className="text-2xl font-bold text-gray-900">6/10</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab !== "profile" && activeTab !== "subscription") && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">{tabs.find(t => t.id === activeTab)?.label} settings will be available soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

