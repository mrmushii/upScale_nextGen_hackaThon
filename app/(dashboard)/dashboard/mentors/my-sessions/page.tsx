"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, CheckCircle, XCircle, Video, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Session {
  _id: string;
  topic: string;
  description?: string;
  scheduledDate: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  earnings?: number;
  mentorId: {
    _id: string;
    name: string;
    hourlyRate: number;
    avatar?: string;
  };
}

export default function MySessionsPage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mentors/sessions");
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to cancel this session?")) return;

    try {
      const response = await fetch(`/api/mentors/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        fetchSessions();
      }
    } catch (error) {
      console.error("Error cancelling session:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      "no-show": "bg-orange-100 text-orange-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true;
    return session.status === filter;
  });

  const upcomingSessions = filteredSessions.filter(
    (s) => s.status === "scheduled" && new Date(s.scheduledDate) > new Date()
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/mentors"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-4"
          >
            <ArrowLeft size={20} />
            Back to Mentors
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">View and manage your booked mentor sessions</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-lg inline-flex gap-2">
        {["all", "scheduled", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              filter === status
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session._id} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{session.topic}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(session.status)}`}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span className="text-sm">{session.mentorId.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {new Date(session.scheduledDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm">{session.duration} min</span>
                      </div>
                    </div>
                    {session.description && (
                      <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                    )}
                    {session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                      >
                        <Video size={16} />
                        Join Meeting
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => cancelSession(session._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm flex items-center gap-2 ml-4"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Sessions */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Sessions</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600 mb-6">You haven't booked any sessions yet.</p>
            <Link
              href="/dashboard/mentors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
            >
              Browse Mentors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div key={session._id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-primary-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{session.topic}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(session.status)}`}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={16} />
                        <span className="text-sm">{session.mentorId.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {new Date(session.scheduledDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span className="text-sm">{session.duration} minutes</span>
                      </div>
                    </div>
                    {session.description && (
                      <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                    )}
                    {session.meetingLink && session.status === "scheduled" && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                      >
                        <Video size={16} />
                        Join Meeting
                      </a>
                    )}
                  </div>
                  {session.status === "scheduled" && new Date(session.scheduledDate) > new Date() && (
                    <button
                      onClick={() => cancelSession(session._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm flex items-center gap-2 ml-4 whitespace-nowrap"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

