"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, DollarSign, Star, Clock } from "lucide-react";

export default function MentorDashboard() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    totalEarnings: 0,
    rating: 0,
    totalStudents: 0,
  });
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/mentor/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setSessions(data.upcomingSessions || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const statsCards = [
    { icon: Calendar, label: "Total Sessions", value: stats.totalSessions, color: "bg-blue-50 text-blue-600" },
    { icon: Clock, label: "Upcoming", value: stats.upcomingSessions, color: "bg-yellow-50 text-yellow-600" },
    { icon: Users, label: "Students", value: stats.totalStudents, color: "bg-green-50 text-green-600" },
    { icon: Star, label: "Rating", value: stats.rating.toFixed(1), color: "bg-purple-50 text-purple-600" },
    { icon: DollarSign, label: "Earnings", value: `৳${stats.totalEarnings.toLocaleString()}`, color: "bg-primary-50 text-primary-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Mentor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your sessions and students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Sessions</h2>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session: any, index: number) => (
              <div key={index} className="p-4 bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{session.studentName}</div>
                    <div className="text-sm text-gray-600">{session.topic}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary-600">{session.time}</div>
                    <div className="text-xs text-gray-600">{session.duration} min</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No upcoming sessions. Students will book sessions through the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}

