"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, CheckCircle, XCircle, Video, Edit2 } from "lucide-react";
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
  studentId: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
}

export default function MentorSchedulePage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchSchedule();
  }, [filter, selectedMonth]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      params.append("month", selectedMonth);

      const response = await fetch(`/api/mentor/schedule?${params}`);
      const data = await response.json();
      
      setSessions(data.sessions || []);
      setUpcomingSessions(data.upcomingSessions || []);
      setStats(data.stats || { total: 0, completed: 0, upcoming: 0 });
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string, notes?: string) => {
    try {
      const response = await fetch("/api/mentor/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          updates: { status, ...(notes && { notes }) }
        })
      });

      if (response.ok) {
        fetchSchedule();
      }
    } catch (error) {
      console.error("Error updating session:", error);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600 mt-2">Manage your mentoring sessions</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
          <div className="mt-2 text-xs text-blue-600 font-semibold">All Time</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
          <div className="mt-2 text-xs text-green-600 font-semibold">Finished</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{stats.upcoming}</div>
          <div className="text-sm text-gray-600">Upcoming</div>
          <div className="mt-2 text-xs text-yellow-600 font-semibold">Scheduled</div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming (Next 7 Days)</h2>
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
                        <span className="text-sm">{session.studentId.fullName}</span>
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
                  <div className="flex flex-col gap-2 ml-4">
                    {session.status === "scheduled" && (
                      <>
                        <button
                          onClick={() => updateSessionStatus(session._id, "completed")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Complete
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Cancel this session?")) {
                              updateSessionStatus(session._id, "cancelled");
                            }
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Status:</label>
            <div className="flex gap-2">
              {["all", "scheduled", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                    filter === status
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Sessions */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Sessions</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">No sessions match your current filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
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
                        <span className="text-sm">{session.studentId.fullName}</span>
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
                      {session.earnings && (
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                          <span className="text-sm">৳{session.earnings.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    {session.description && (
                      <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                    )}
                    {session.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <p className="text-sm text-gray-700"><strong>Notes:</strong> {session.notes}</p>
                      </div>
                    )}
                    {session.rating && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < session.rating! ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {session.status === "scheduled" && (
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => updateSessionStatus(session._id, "completed")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
                      >
                        <CheckCircle size={16} />
                        Complete
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Cancel this session?")) {
                            updateSessionStatus(session._id, "cancelled");
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
                      >
                        <XCircle size={16} />
                        Cancel
                      </button>
                    </div>
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

