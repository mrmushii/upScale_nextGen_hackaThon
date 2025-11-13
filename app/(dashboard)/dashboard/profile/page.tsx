"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, MapPin, Briefcase, GraduationCap, Award, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchProfile();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found</p>
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your profile information</p>
        </div>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          <Settings size={20} />
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-coral-600 p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {profile.avatar ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={profile.avatar}
                    alt={profile.fullName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold">
                  {profile.fullName?.charAt(0) || session?.user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{profile.fullName || session?.user?.name || "User"}</h2>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{profile.email || session?.user?.email}</span>
                </div>
                {(profile.city || profile.country) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{[profile.city, profile.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8">
          {/* Career Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={24} className="text-primary-600" />
              Career Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {profile.preferredTrack && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Preferred Track</div>
                  <div className="text-lg font-semibold text-gray-900">{profile.preferredTrack}</div>
                </div>
              )}
              {profile.experienceLevel && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Experience Level</div>
                  <div className="text-lg font-semibold text-gray-900">{profile.experienceLevel}</div>
                </div>
              )}
              {profile.educationLevel && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Education Level</div>
                  <div className="text-lg font-semibold text-gray-900">{profile.educationLevel}</div>
                </div>
              )}
              {profile.targetRoles && profile.targetRoles.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">Target Roles</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.targetRoles.map((role: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={24} className="text-primary-600" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary-50 to-coral-50 text-primary-700 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subscription Info */}
          {profile.subscription && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={24} className="text-primary-600" />
                Subscription
              </h3>
              <div className="p-6 bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Current Plan</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.subscription.tier?.toUpperCase() || "BASIC"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Status: <span className="font-semibold text-green-600">{profile.subscription.status}</span>
                    </div>
                  </div>
                  {profile.subscription.tier === "basic" && (
                    <Link
                      href="/dashboard/settings?tab=subscription"
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                    >
                      Upgrade Plan
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Usage Stats */}
          {profile.usageLimits && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Usage Statistics</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Mock Interviews</div>
                  <div className="text-2xl font-bold text-gray-900">{profile.usageLimits.mockInterviews || 0}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Career Roadmaps</div>
                  <div className="text-2xl font-bold text-gray-900">{profile.usageLimits.careerRoadmaps || 0}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">CV Analyses</div>
                  <div className="text-2xl font-bold text-gray-900">{profile.usageLimits.cvAnalyses || 0}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

