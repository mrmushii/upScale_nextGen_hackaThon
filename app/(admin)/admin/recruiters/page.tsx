"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Building2, Mail, Briefcase, Globe, Clock } from "lucide-react";

interface Recruiter {
  _id: string;
  fullName: string;
  email: string;
  companyName: string;
  companyWebsite: string;
  position: string;
  verified: boolean;
  createdAt: string;
}

export default function AdminRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");
  const [counts, setCounts] = useState({ pending: 0, verified: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiters();
  }, [filter]);

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const params = filter === "all" ? "" : `?status=${filter}`;
      const response = await fetch(`/api/admin/recruiters${params}`);
      const data = await response.json();
      
      setRecruiters(data.recruiters);
      setCounts(data.counts);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recruiterId: string) => {
    if (!confirm("Approve this recruiter?")) return;

    try {
      const response = await fetch("/api/admin/recruiters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterId,
          action: "approve"
        })
      });

      if (response.ok) {
        fetchRecruiters();
      }
    } catch (error) {
      console.error("Error approving recruiter:", error);
    }
  };

  const handleReject = async (recruiterId: string) => {
    if (!confirm("Reject and remove this recruiter? This action cannot be undone.")) return;

    try {
      const response = await fetch("/api/admin/recruiters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterId,
          action: "reject"
        })
      });

      if (response.ok) {
        fetchRecruiters();
      }
    } catch (error) {
      console.error("Error rejecting recruiter:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Management</h1>
        <p className="text-gray-600 mt-2">Verify and manage recruiter accounts</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{counts.pending}</div>
          <div className="text-sm text-gray-600">Pending Approval</div>
          <div className="mt-2 text-xs text-orange-600 font-semibold">Needs Review</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{counts.verified}</div>
          <div className="text-sm text-gray-600">Verified Recruiters</div>
          <div className="mt-2 text-xs text-green-600 font-semibold">Active</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{counts.total}</div>
          <div className="text-sm text-gray-600">Total Recruiters</div>
          <div className="mt-2 text-xs text-blue-600 font-semibold">All Time</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-lg inline-flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All ({counts.total})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            filter === "pending"
              ? "bg-orange-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Pending ({counts.pending})
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            filter === "verified"
              ? "bg-green-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Verified ({counts.verified})
        </button>
      </div>

      {/* Recruiters List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading recruiters...</p>
          </div>
        ) : recruiters.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No recruiters found</p>
          </div>
        ) : (
          recruiters.map((recruiter) => (
            <div
              key={recruiter._id}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase size={28} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{recruiter.fullName}</h3>
                      <p className="text-sm text-gray-600">{recruiter.position}</p>
                    </div>
                    {recruiter.verified ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        PENDING
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm">{recruiter.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Building2 size={16} className="text-gray-400" />
                      <span className="text-sm">{recruiter.companyName}</span>
                    </div>
                    {recruiter.companyWebsite && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Globe size={16} className="text-gray-400" />
                        <a
                          href={recruiter.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          {recruiter.companyWebsite}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm">
                        Applied {new Date(recruiter.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!recruiter.verified && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(recruiter._id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold flex items-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(recruiter._id)}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold flex items-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

