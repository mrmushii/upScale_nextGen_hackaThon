"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Briefcase, MapPin, Clock, DollarSign, Search } from "lucide-react";

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
  approved: boolean;
  status: string;
  createdAt: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [filter, search]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      
      const response = await fetch(`/api/admin/all-jobs?${params}`);
      const data = await response.json();
      
      let filteredJobs = data.jobs;
      if (filter === "pending") {
        filteredJobs = filteredJobs.filter((j: Job) => !j.approved);
      } else if (filter === "approved") {
        filteredJobs = filteredJobs.filter((j: Job) => j.approved);
      }
      
      setJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      const response = await fetch("/api/admin/all-jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          updates: { approved: true }
        })
      });

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleReject = async (jobId: string) => {
    if (!confirm("Delete this job posting? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/admin/all-jobs?jobId=${jobId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  const pendingJobs = jobs.filter(j => !j.approved).length;
  const approvedJobs = jobs.filter(j => j.approved).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
        <p className="text-gray-600 mt-2">Moderate and approve job postings</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{pendingJobs}</div>
          <div className="text-sm text-gray-600">Pending Approval</div>
          <div className="mt-2 text-xs text-orange-600 font-semibold">Needs Review</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{approvedJobs}</div>
          <div className="text-sm text-gray-600">Approved Jobs</div>
          <div className="mt-2 text-xs text-green-600 font-semibold">Live</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
          <div className="text-sm text-gray-600">Total Jobs</div>
          <div className="mt-2 text-xs text-blue-600 font-semibold">All Time</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Jobs</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="inline-flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                filter === "all" ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                filter === "pending" ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                filter === "approved" ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Approved
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No jobs found</p>
          </div>
        ) : (
          jobs.map((job) => (
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
                        PENDING
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{job.company}</p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        +{job.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {!job.approved && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(job._id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold flex items-center gap-2 whitespace-nowrap"
                    >
                      <CheckCircle size={20} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(job._id)}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold flex items-center gap-2 whitespace-nowrap"
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

