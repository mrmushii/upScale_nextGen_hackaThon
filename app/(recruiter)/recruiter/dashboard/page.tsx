"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users, Eye, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalViews: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/recruiter/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const statsCards = [
    { icon: Briefcase, label: "Total Jobs", value: stats.totalJobs, color: "bg-blue-50 text-blue-600" },
    { icon: CheckCircle2, label: "Active Jobs", value: stats.activeJobs, color: "bg-green-50 text-green-600" },
    { icon: Eye, label: "Total Views", value: stats.totalViews, color: "bg-purple-50 text-purple-600" },
    { icon: Users, label: "Applications", value: stats.totalApplications, color: "bg-primary-50 text-primary-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your job postings and find talent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className={`p-3 rounded-xl ${stat.color} inline-flex mb-4`}>
              <stat.icon size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/recruiter/jobs/new" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition group">
          <div className="p-4 bg-blue-50 rounded-xl inline-flex mb-4 group-hover:scale-110 transition">
            <Briefcase size={32} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Post New Job</h3>
          <p className="text-gray-600">Create a new job listing and find candidates</p>
        </Link>

        <Link href="/recruiter/jobs" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition group">
          <div className="p-4 bg-green-50 rounded-xl inline-flex mb-4 group-hover:scale-110 transition">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Jobs</h3>
          <p className="text-gray-600">View and edit your active job listings</p>
        </Link>
      </div>
    </div>
  );
}

