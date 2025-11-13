"use client";

import { useEffect, useState } from "react";
import { Briefcase, MapPin, DollarSign, Clock, Edit2, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  jobType: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  status: string;
  approved: boolean;
  createdAt: string;
}

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/recruiter/my-jobs");
      const data = await response.json();
      
      setJobs(data.jobs);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Delete this job? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === "approved") return job.approved;
    if (filter === "pending") return !job.approved;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 mt-2">Manage your job postings</p>
        </div>
        <Link
          href="/recruiter/jobs/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          <Plus size={20} />
          Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Jobs</div>
          <div className="mt-2 text-xs text-blue-600 font-semibold">All Time</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
          <div className="mt-2 text-xs text-green-600 font-semibold">Live</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
          <div className="mt-2 text-xs text-orange-600 font-semibold">In Review</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
          <div className="mt-2 text-xs text-primary-600 font-semibold">Open</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-lg inline-flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            filter === "all" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            filter === "approved" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Approved ({stats.approved})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            filter === "pending" ? "bg-orange-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Pending ({stats.pending})
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all" ? "You haven't posted any jobs yet" : `No ${filter} jobs`}
            </p>
            <Link
              href="/recruiter/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
            >
              <Plus size={20} />
              Post Your First Job
            </Link>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className={`bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition border-2 ${
                job.approved ? "border-green-200" : "border-orange-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    {job.approved ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={14} />
                        APPROVED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock size={14} />
                        PENDING APPROVAL
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{job.company}</p>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm">{job.location}</span>
                      {job.remote && (
                        <span className="text-xs text-green-600 font-semibold">(Remote)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase size={16} className="text-gray-400" />
                      <span className="text-sm">{job.jobType}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign size={16} className="text-gray-400" />
                        <span className="text-sm">
                          ৳{job.salary.min.toLocaleString()} - ৳{job.salary.max.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Link
                    href={`/recruiter/jobs/${job._id}`}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center gap-2 whitespace-nowrap"
                  >
                    <Edit2 size={18} />
                    View/Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold flex items-center gap-2 whitespace-nowrap"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {stats.pending > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6">
          <h3 className="font-bold text-orange-900 mb-2">⏳ Pending Jobs Notice</h3>
          <p className="text-orange-700 text-sm">
            You have {stats.pending} job{stats.pending > 1 ? 's' : ''} pending admin approval. They will be visible to users once approved (typically within 24-48 hours).
          </p>
        </div>
      )}
    </div>
  );
}

