"use client";

import { useState, useEffect } from "react";
import { User, Lock, CreditCard, Bell, Shield, Crown, Save } from "lucide-react";
import { CAREER_TRACKS, EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "@/lib/constants";
import Link from "next/link";
import toast from "react-hot-toast";

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
  const [accountForm, setAccountForm] = useState({
    backupEmail: "",
    twoFactorEnabled: false,
    loginAlerts: true,
    currentPassword: "",
    newPassword: "",
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailUpdates: true,
    productUpdates: true,
    jobAlerts: true,
    mentorReminders: true,
  });
  const [privacyPrefs, setPrivacyPrefs] = useState({
    profileVisibility: "public",
    showSkills: true,
    showProjects: true,
    showActivity: false,
    allowMessages: true,
  });
  const [billingPrefs, setBillingPrefs] = useState({
    defaultPaymentMethod: "card",
    sendInvoices: true,
    taxId: "",
    autoRenew: false,
  });
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [savingBilling, setSavingBilling] = useState(false);

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
          phone: data.user.phone || "",
        });

        const preferences = data.user.preferences || {};
        setAccountForm((prev) => ({
          ...prev,
          backupEmail: preferences.account?.backupEmail || "",
          twoFactorEnabled: preferences.account?.twoFactorEnabled ?? false,
          loginAlerts: preferences.account?.loginAlerts ?? true,
          currentPassword: "",
          newPassword: "",
        }));
        setNotificationPrefs({
          emailUpdates: preferences.notifications?.emailUpdates ?? true,
          productUpdates: preferences.notifications?.productUpdates ?? true,
          jobAlerts: preferences.notifications?.jobAlerts ?? true,
          mentorReminders: preferences.notifications?.mentorReminders ?? true,
        });
        setPrivacyPrefs({
          profileVisibility: preferences.privacy?.profileVisibility || "public",
          showSkills: preferences.privacy?.showSkills ?? true,
          showProjects: preferences.privacy?.showProjects ?? true,
          showActivity: preferences.privacy?.showActivity ?? false,
          allowMessages: preferences.privacy?.allowMessages ?? true,
        });
        setBillingPrefs((prev) => ({
          ...prev,
          defaultPaymentMethod: preferences.billing?.defaultPaymentMethod || "card",
          sendInvoices: preferences.billing?.sendInvoices ?? true,
          taxId: preferences.billing?.taxId || "",
          autoRenew: data.user.subscription?.autoRenew ?? false,
        }));
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
        toast.success("Profile updated successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const saveAccountSettings = async () => {
    try {
      setSavingAccount(true);

      if (accountForm.newPassword && !accountForm.currentPassword) {
        toast.error("Please enter your current password to set a new password.");
        setSavingAccount(false);
        return;
      }

      if (accountForm.newPassword && accountForm.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        setSavingAccount(false);
        return;
      }

      if (accountForm.newPassword) {
        const passwordRes = await fetch("/api/settings/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: accountForm.currentPassword,
            newPassword: accountForm.newPassword,
          }),
        });

        const passwordData = await passwordRes.json();
        if (!passwordRes.ok) {
          toast.error(passwordData.error || "Failed to update password");
          setSavingAccount(false);
          return;
        }
      }

      const prefRes = await fetch("/api/settings/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "account",
          data: {
            backupEmail: accountForm.backupEmail,
            twoFactorEnabled: accountForm.twoFactorEnabled,
            loginAlerts: accountForm.loginAlerts,
          },
        }),
      });

      const prefData = await prefRes.json();
      if (!prefRes.ok) {
        toast.error(prefData.error || "Failed to update account settings");
        setSavingAccount(false);
        return;
      }

      toast.success("Account settings updated");
      setAccountForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
      await fetchProfile();
    } catch (error) {
      console.error("Error updating account settings:", error);
      toast.error("Failed to update account settings");
    } finally {
      setSavingAccount(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setSavingNotifications(true);
      const res = await fetch("/api/settings/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "notifications",
          data: notificationPrefs,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update notification settings");
        setSavingNotifications(false);
        return;
      }

      toast.success("Notification preferences saved");
      await fetchProfile();
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to update notifications");
    } finally {
      setSavingNotifications(false);
    }
  };

  const savePrivacySettings = async () => {
    try {
      setSavingPrivacy(true);
      const res = await fetch("/api/settings/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "privacy",
          data: privacyPrefs,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update privacy settings");
        setSavingPrivacy(false);
        return;
      }

      toast.success("Privacy settings updated");
      await fetchProfile();
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      toast.error("Failed to update privacy settings");
    } finally {
      setSavingPrivacy(false);
    }
  };

  const saveBillingSettings = async () => {
    try {
      setSavingBilling(true);

      const prefsResponse = await fetch("/api/settings/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "billing",
          data: {
            defaultPaymentMethod: billingPrefs.defaultPaymentMethod,
            sendInvoices: billingPrefs.sendInvoices,
            taxId: billingPrefs.taxId,
          },
        }),
      });

      const prefsData = await prefsResponse.json();
      if (!prefsResponse.ok) {
        toast.error(prefsData.error || "Failed to update billing preferences");
        setSavingBilling(false);
        return;
      }

      const currentAuto = profile?.subscription?.autoRenew ?? false;
      if (profile?.subscription && billingPrefs.autoRenew !== currentAuto) {
        const autoRes = await fetch("/api/subscription", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateAutoRenew", autoRenew: billingPrefs.autoRenew }),
        });

        const autoData = await autoRes.json();
        if (!autoRes.ok) {
          toast.error(autoData.error || "Failed to update auto-renew");
          setSavingBilling(false);
          return;
        }
      } else if (!profile?.subscription && billingPrefs.autoRenew) {
        toast("Upgrade to a paid plan to enable auto-renew.");
        setBillingPrefs((prev) => ({ ...prev, autoRenew: false }));
      }

      toast.success("Billing preferences saved");
      await fetchProfile();
    } catch (error) {
      console.error("Error updating billing settings:", error);
      toast.error("Failed to update billing settings");
    } finally {
      setSavingBilling(false);
    }
  };

  const currentPlan = profile?.subscription?.tier || "Basic";
  const canManageAutoRenew = Boolean(
    profile?.subscription &&
    profile.subscription.status === "active" &&
    profile.subscription.tier !== "basic"
  );

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
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                      placeholder="e.g., +8801XXXXXXXXX"
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

            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Security</h2>
                <p className="text-gray-600">
                  Manage your login credentials, recovery options, and security alerts.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recovery Email
                    </label>
                    <input
                      type="email"
                      value={accountForm.backupEmail}
                      onChange={(e) => setAccountForm({ ...accountForm, backupEmail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                      placeholder="Add a backup email address"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      We use this email if you ever lose access to your account.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Two-factor authentication</div>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your login sessions.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-primary-600"
                      checked={accountForm.twoFactorEnabled}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, twoFactorEnabled: e.target.checked })
                      }
                    />
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Login alerts</div>
                      <p className="text-sm text-gray-600">
                        Receive email alerts whenever a new device signs in.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-primary-600"
                      checked={accountForm.loginAlerts}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, loginAlerts: e.target.checked })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={accountForm.currentPassword}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, currentPassword: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={accountForm.newPassword}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, newPassword: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                <button
                  onClick={saveAccountSettings}
                  disabled={savingAccount}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-semibold disabled:opacity-50"
                >
                  {savingAccount ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Account Settings"
                  )}
                </button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                <p className="text-gray-600">Choose how you’d like us to keep you updated.</p>

                <div className="space-y-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={notificationPrefs.jobAlerts}
                      onChange={(e) =>
                        setNotificationPrefs({ ...notificationPrefs, jobAlerts: e.target.checked })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Job alerts</div>
                      <p className="text-sm text-gray-600">
                        Get curated job recommendations based on your profile each week.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={notificationPrefs.mentorReminders}
                      onChange={(e) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          mentorReminders: e.target.checked,
                        })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Mentor session reminders</div>
                      <p className="text-sm text-gray-600">
                        Receive reminders before your scheduled mentor sessions.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={notificationPrefs.emailUpdates}
                      onChange={(e) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          emailUpdates: e.target.checked,
                        })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Email updates</div>
                      <p className="text-sm text-gray-600">
                        Important platform announcements and feature releases.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={notificationPrefs.productUpdates}
                      onChange={(e) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          productUpdates: e.target.checked,
                        })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Product tips & resources</div>
                      <p className="text-sm text-gray-600">
                        Occasional tips to help you get the most from Upscale.
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={saveNotificationSettings}
                  disabled={savingNotifications}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                >
                  {savingNotifications ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Notification Preferences"
                  )}
                </button>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Privacy Controls</h2>
                <p className="text-gray-600">
                  Control who can see your profile, projects, and activity across Upscale.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      value: "public",
                      title: "Public",
                      description: "Visible to employers, mentors, and the Upscale community.",
                    },
                    {
                      value: "community",
                      title: "Community only",
                      description: "Visible to verified Upscale members and mentors.",
                    },
                    {
                      value: "private",
                      title: "Private",
                      description: "Only visible to you and invited collaborators.",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition ${
                        privacyPrefs.profileVisibility === option.value
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-primary-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={privacyPrefs.profileVisibility === option.value}
                        onChange={(e) =>
                          setPrivacyPrefs({ ...privacyPrefs, profileVisibility: e.target.value })
                        }
                        className="mt-1"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{option.title}</div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={privacyPrefs.showSkills}
                      onChange={(e) =>
                        setPrivacyPrefs({ ...privacyPrefs, showSkills: e.target.checked })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Display skills on profile</div>
                      <p className="text-sm text-gray-600">
                        Highlight your core skills to recruiters and mentors.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={privacyPrefs.showProjects}
                      onChange={(e) =>
                        setPrivacyPrefs({ ...privacyPrefs, showProjects: e.target.checked })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Show portfolio projects</div>
                      <p className="text-sm text-gray-600">
                        Allow others to view your featured case studies and builds.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={privacyPrefs.showActivity}
                      onChange={(e) =>
                        setPrivacyPrefs({ ...privacyPrefs, showActivity: e.target.checked })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Share learning activity</div>
                      <p className="text-sm text-gray-600">
                        Display streaks and roadmap progress on your public profile.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-primary-600"
                      checked={privacyPrefs.allowMessages}
                      onChange={(e) =>
                        setPrivacyPrefs({ ...privacyPrefs, allowMessages: e.target.checked })
                      }
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Allow direct messages</div>
                      <p className="text-sm text-gray-600">
                        Mentors and recruiters can send you direct messages.
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={savePrivacySettings}
                  disabled={savingPrivacy}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                >
                  {savingPrivacy ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Privacy Settings"
                  )}
                </button>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Billing Preferences</h2>
                <p className="text-gray-600">
                  Update billing defaults, invoicing preferences, and auto-renewal settings.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Default payment method
                    </label>
                    <select
                      value={billingPrefs.defaultPaymentMethod}
                      onChange={(e) =>
                        setBillingPrefs({ ...billingPrefs, defaultPaymentMethod: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    >
                      <option value="card">Debit / Credit Card</option>
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tax ID / VAT (optional)
                    </label>
                    <input
                      type="text"
                      value={billingPrefs.taxId}
                      onChange={(e) =>
                        setBillingPrefs({ ...billingPrefs, taxId: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                      placeholder="Enter business tax details"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary-600"
                    checked={billingPrefs.sendInvoices}
                    onChange={(e) =>
                      setBillingPrefs({ ...billingPrefs, sendInvoices: e.target.checked })
                    }
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Email monthly invoices</div>
                    <p className="text-sm text-gray-600">
                      Receive a PDF receipt straight to your inbox each billing cycle.
                    </p>
                  </div>
                </label>

                <div className={`p-4 border rounded-xl ${canManageAutoRenew ? "border-primary-200 bg-primary-50/40" : "border-gray-200 bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Auto-renew subscription</div>
                      <p className="text-sm text-gray-600">
                        {canManageAutoRenew
                          ? "Keep your " + currentPlan + " plan active without interruption."
                          : "Upgrade to a paid plan to manage auto-renewal."}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-primary-600"
                      checked={billingPrefs.autoRenew}
                      disabled={!canManageAutoRenew}
                      onChange={(e) =>
                        setBillingPrefs({ ...billingPrefs, autoRenew: e.target.checked })
                      }
                    />
                  </div>
                  {profile?.subscription && (
                    <p className="text-xs text-gray-500 mt-3">
                      Current plan: <span className="font-semibold text-gray-800">{currentPlan.toUpperCase()}</span> •
                      Renews on {profile.subscription.endDate ? new Date(profile.subscription.endDate).toLocaleDateString() : "—"}
                    </p>
                  )}
                </div>

                <button
                  onClick={saveBillingSettings}
                  disabled={savingBilling}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                >
                  {savingBilling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Billing Preferences"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
