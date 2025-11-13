"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Briefcase,
  Map,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  User,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileCompletionData, setProfileCompletionData] = useState<any>(null);

  // Redirect users with different roles to their specific dashboards
  useEffect(() => {
    // Only redirect if session is loaded (not loading)
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as any)?.role || "user";
      
      if (userRole !== "user") {
        const roleUrls: Record<string, string> = {
          admin: "/admin/dashboard",
          recruiter: "/recruiter/dashboard",
          mentor: "/mentor/dashboard",
        };
        
        if (roleUrls[userRole]) {
          window.location.replace(roleUrls[userRole]);
        }
      }
    }
  }, [session, status]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user profile
        const profileRes = await fetch("/api/user/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.user);
        }

        // Check profile completion
        const completionRes = await fetch("/api/user/profile/completion");
        if (completionRes.ok) {
          const completionData = await completionRes.json();
          setProfileCompletionData(completionData.completion);
          // Don't redirect - let users see the dashboard with the completion card
        }

        // Fetch job matches
        const jobsRes = await fetch("/api/jobs/match");
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobMatches(jobsData.matches?.slice(0, 3) || []);
        }

        // Fetch roadmaps
        const roadmapRes = await fetch("/api/roadmap");
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json();
          setRoadmaps(roadmapData.roadmaps || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Use proper completion data from API, fallback to old calculation
  const completionPercentage = profileCompletionData?.percentage || profile?.profileCompletionPercentage || calculateProfileCompletion(profile);
  const isProfileComplete = profileCompletionData?.isComplete || profile?.profileCompleted || false;
  const missingFields = profileCompletionData?.missingFields || [];
  const currentRoadmap = roadmaps[0];

  const stats = [
    {
      icon: Briefcase,
      label: "Job Matches",
      value: jobMatches.length.toString(),
      change: "New matches",
      color: "bg-primary-50 text-primary-600",
    },
    {
      icon: Map,
      label: "Roadmap Progress",
      value: currentRoadmap ? `${currentRoadmap.progress}%` : "0%",
      change: "Active",
      color: "bg-coral-50 text-coral-600",
    },
    {
      icon: CheckCircle2,
      label: "Mock Interviews",
      value: `${profile?.usageLimits?.mockInterviews || 0}`,
      change: "Completed",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Users,
      label: "Mentor Sessions",
      value: `${profile?.usageLimits?.mentorSessions || 0}`,
      change: "Booked",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome back, {profile?.fullName || session?.user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your career journey today
        </p>
      </div>

      {/* Profile Completion Card - Always visible for better UX */}
      <div className={`rounded-3xl p-6 shadow-lg relative overflow-hidden ${
        isProfileComplete 
          ? "bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200" 
          : "bg-gradient-to-r from-primary-600 to-coral-600 text-white"
      }`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {isProfileComplete ? (
                  <CheckCircle2 size={28} className="text-green-600" />
                ) : (
                  <AlertCircle size={28} className="text-white" />
                )}
                <h3 className={`text-2xl font-bold ${isProfileComplete ? "text-gray-900" : "text-white"}`}>
                  {isProfileComplete ? "Profile Complete! 🎉" : "Complete Your Profile"}
                </h3>
              </div>
              {isProfileComplete ? (
                <p className="text-gray-700 mb-4">
                  Your profile is 100% complete! You can now generate roadmaps and apply to jobs.
                </p>
              ) : (
                <>
                  <p className="text-white/90 mb-2 text-lg">
                    {completionPercentage}% complete - Complete your profile to unlock all features
                  </p>
                  {missingFields.length > 0 && (
                    <p className="text-white/80 text-sm mb-4">
                      Missing: {missingFields.slice(0, 3).join(", ")}
                      {missingFields.length > 3 && ` +${missingFields.length - 3} more`}
                    </p>
                  )}
                </>
              )}
              <Link
                href="/dashboard/profile/complete"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                  isProfileComplete
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-white text-primary-600 hover:bg-gray-100"
                }`}
              >
                {isProfileComplete ? "Update Profile" : "Complete Profile"}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="flex items-center gap-6">
              {/* Circular Progress */}
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={isProfileComplete ? "#10b981" : "rgba(255,255,255,0.2)"}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={isProfileComplete ? "#10b981" : "white"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - completionPercentage / 100)
                    }`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${
                  isProfileComplete ? "text-green-600" : "text-white"
                }`}>
                  {completionPercentage}%
                </div>
              </div>
              {/* Progress Bar */}
              <div className="hidden md:block w-32">
                <div className={`h-3 rounded-full overflow-hidden ${
                  isProfileComplete ? "bg-green-100" : "bg-white/20"
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isProfileComplete
                        ? "bg-green-600"
                        : "bg-white"
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className={`text-xs mt-2 text-center ${
                  isProfileComplete ? "text-gray-600" : "text-white/80"
                }`}>
                  {isProfileComplete ? "All set!" : `${completionPercentage}% done`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-sm font-semibold text-green-600">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Job Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Jobs */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target size={24} className="text-primary-600" />
                Top Job Matches
              </h3>
              <Link
                href="/dashboard/jobs"
                className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            {jobMatches.length > 0 ? (
              <div className="space-y-4">
                {jobMatches.map((match: any) => (
                  <Link
                    key={match.job._id}
                    href={`/dashboard/jobs/${match.job._id}`}
                    className="block p-4 border-2 border-gray-100 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1 group-hover:text-primary-700">
                          {match.job.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">{match.job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📍 {match.job.location}</span>
                          <span>🕒 {new Date(match.job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                            match.score >= 85
                              ? "bg-green-100 text-green-700"
                              : match.score >= 70
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          <Sparkles size={14} />
                          {match.score}% Match
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                <p>No job matches yet. Complete your profile to get personalized recommendations.</p>
                <Link
                  href="/dashboard/settings"
                  className="inline-block mt-4 text-primary-600 font-semibold hover:text-primary-700"
                >
                  Complete Profile →
                </Link>
              </div>
            )}
          </div>

          {/* Roadmap Progress */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Map size={24} className="text-coral-600" />
                Your Roadmap
              </h3>
              <Link
                href="/dashboard/roadmap"
                className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
              >
                View Details
                <ArrowRight size={16} />
              </Link>
            </div>

            {currentRoadmap ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">
                      {currentRoadmap.targetRole}
                    </span>
                    <span className="font-bold text-primary-600">
                      {currentRoadmap.progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentRoadmap.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentRoadmap.stages.slice(0, 3).map((stage: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        stage.completed
                          ? "bg-green-50"
                          : index === 1
                          ? "bg-primary-100 border-2 border-primary-300"
                          : "bg-gray-50 opacity-60"
                      }`}
                    >
                      {stage.completed ? (
                        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                      ) : index === 1 ? (
                        <div className="w-5 h-5 rounded-full border-2 border-primary-600 flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{stage.name}</div>
                        <div className="text-sm text-gray-600">
                          {stage.completed ? "Completed" : `${currentRoadmap.progress}% done`}
                        </div>
                      </div>
                      {stage.completed && <Award size={20} className="text-yellow-500" />}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Map size={48} className="mx-auto mb-4 opacity-50" />
                <p className="mb-4">No roadmap yet. Generate your personalized career path!</p>
                <Link
                  href="/dashboard/roadmap"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                >
                  Generate Roadmap
                  <Map size={20} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/jobs"
                className="block p-4 bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl hover:from-primary-100 hover:to-coral-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition">
                    <Briefcase size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Browse Jobs</div>
                    <div className="text-sm text-gray-600">{jobMatches.length} matches found</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/roadmap"
                className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition">
                    <Map size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">View Roadmap</div>
                    <div className="text-sm text-gray-600">
                      {roadmaps.length > 0 ? "Track your progress" : "Generate your path"}
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/settings"
                className="block p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl hover:from-green-100 hover:to-teal-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Update Profile</div>
                    <div className="text-sm text-gray-600">{completionPercentage}% complete</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-3xl p-6 text-white">
            <Sparkles size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-2">
              Current Plan: {profile?.subscription?.tier?.toUpperCase() || "BASIC"}
            </h3>
            <div className="text-white/90 text-sm mb-4">
              <div>Roadmaps: {profile?.usageLimits?.careerRoadmaps || 0} used</div>
              <div>CV Analyses: {profile?.usageLimits?.cvAnalyses || 0} used</div>
            </div>
            {profile?.subscription?.tier === "basic" && (
              <Link
                href="/dashboard/settings?tab=subscription"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Upgrade to Pro
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  
  let completion = 20; // Base
  if (profile.skills?.length > 0) completion += 20;
  if (profile.targetRoles?.length > 0) completion += 20;
  if (profile.preferredTrack) completion += 20;
  if (profile.educationLevel) completion += 10;
  if (profile.experienceLevel) completion += 10;
  
  return Math.min(100, completion);
}
