"use client";

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
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data
  const user = {
    name: "John Doe",
    tier: "pro",
    profileCompletion: 85,
  };

  const stats = [
    {
      icon: Briefcase,
      label: "Job Matches",
      value: "24",
      change: "+12%",
      color: "bg-primary-50 text-primary-600",
    },
    {
      icon: Map,
      label: "Roadmap Progress",
      value: "65%",
      change: "+5%",
      color: "bg-coral-50 text-coral-600",
    },
    {
      icon: CheckCircle2,
      label: "Mock Interviews",
      value: "8/20",
      change: "3 this week",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Users,
      label: "Mentor Sessions",
      value: "3",
      change: "2 scheduled",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Ltd",
      location: "Dhaka, Bangladesh",
      match: 92,
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "React Developer",
      company: "Digital Innovations",
      location: "Remote",
      match: 88,
      posted: "3 days ago",
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "StartupHub",
      location: "Chattogram, Bangladesh",
      match: 75,
      posted: "1 week ago",
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      type: "Mentor Session",
      mentor: "Sarah Ahmed",
      topic: "Resume Review",
      time: "Tomorrow, 3:00 PM",
    },
    {
      id: 2,
      type: "Mock Interview",
      topic: "Technical Interview Practice",
      time: "Friday, 10:00 AM",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your career journey today
        </p>
      </div>

      {/* Profile Completion Banner */}
      {user.profileCompletion < 100 && (
        <div className="bg-gradient-to-r from-primary-600 to-coral-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-white/90 mb-4">
                  {user.profileCompletion}% complete - Add more details to get better matches
                </p>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  Complete Profile
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="white"
                    strokeOpacity="0.2"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="white"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - user.profileCompletion / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center -mt-16 text-white font-bold">
                  {user.profileCompletion}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

            <div className="space-y-4">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="block p-4 border-2 border-gray-100 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 group-hover:text-primary-700">
                        {job.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📍 {job.location}</span>
                        <span>🕒 {job.posted}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          job.match >= 85
                            ? "bg-green-100 text-green-700"
                            : job.match >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        <Sparkles size={14} />
                        {job.match}% Match
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Overall Progress</span>
                <span className="font-bold text-primary-600">65%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all duration-500"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>

            {/* Current Stage */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                <CheckCircle2 size={20} className="text-primary-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Prerequisites</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <Award size={20} className="text-yellow-500" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary-100 rounded-xl border-2 border-primary-300">
                <div className="w-5 h-5 rounded-full border-2 border-primary-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Core Skills</div>
                  <div className="text-sm text-gray-600">In Progress - 65%</div>
                </div>
                <Clock size={20} className="text-primary-600" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-60">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Advanced Topics</div>
                  <div className="text-sm text-gray-600">Locked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming & Actions */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-primary-600" />
              Upcoming
            </h3>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 bg-gradient-to-br from-primary-50 to-coral-50 rounded-xl border-2 border-primary-100"
                >
                  <div className="text-xs font-semibold text-primary-600 uppercase mb-1">
                    {session.type}
                  </div>
                  {"mentor" in session && (
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      with {session.mentor}
                    </div>
                  )}
                  <div className="text-sm text-gray-700 mb-2">{session.topic}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {session.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/interview"
                className="block p-4 bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl hover:from-primary-100 hover:to-coral-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition">
                    <Sparkles size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Start Mock Interview</div>
                    <div className="text-sm text-gray-600">8/20 used this month</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/cv-analyzer"
                className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition">
                    <Award size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Analyze Resume</div>
                    <div className="text-sm text-gray-600">Get AI feedback</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/mentors"
                className="block p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl hover:from-green-100 hover:to-teal-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Book Mentor</div>
                    <div className="text-sm text-gray-600">1 session included</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Upgrade Prompt (for Basic users) */}
          <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-3xl p-6 text-white">
            <Sparkles size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
            <p className="text-white/90 text-sm mb-4">
              Unlock unlimited mock interviews, AI resume optimization, and priority job matching
            </p>
            <Link
              href="/dashboard/settings?tab=subscription"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              View Plans
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

