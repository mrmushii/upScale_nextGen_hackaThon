"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Sparkles,
  Filter,
  Heart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRemote, setSelectedRemote] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchJobs(1);
  }, [selectedType, selectedRemote, selectedLocation, selectedTrack]);

  // Separate effect for search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || !loading) {
        fetchJobs(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      // Use findwork.dev API
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (searchTerm) params.append("search", searchTerm);
      if (selectedLocation !== "all") params.append("location", selectedLocation);
      if (selectedType !== "all") params.append("role", selectedType);
      if (selectedRemote === "remote") params.append("remote", "true");
      
      const response = await fetch(`/api/jobs/findwork?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        // Transform findwork.dev jobs to match our format
        setJobs(data.jobs || []);
        setPagination(data.pagination);
      } else {
        console.error("Error fetching jobs:", response.status);
        // Fallback to match API if findwork fails
        const fallbackResponse = await fetch("/api/jobs/match");
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setJobs(fallbackData.matches?.map((m: any) => m.job) || []);
        }
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.jobType === selectedType || job.employment_type === selectedType;
    const matchesRemote =
      selectedRemote === "all" ||
      (selectedRemote === "remote" && job.remote) ||
      (selectedRemote === "onsite" && !job.remote);
    return matchesSearch && matchesType && matchesRemote;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Job Matches</h1>
        <p className="text-gray-600 mt-2">
          {pagination ? `Found ${pagination.total || filteredJobs.length} jobs` : `Found ${filteredJobs.length} jobs`} matching your search
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs or companies..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition"
          >
            <Filter size={20} />
            <span className="font-semibold">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type / Role
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              >
                <option value="all">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location Type
              </label>
              <select
                value={selectedRemote}
                onChange={(e) => setSelectedRemote(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={selectedLocation === "all" ? "" : selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value || "all")}
                placeholder="e.g., New York, Remote"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Career Track
              </label>
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              >
                <option value="all">All Tracks</option>
                <option value="Frontend Development">Frontend</option>
                <option value="Backend Development">Backend</option>
                <option value="Full Stack Development">Full Stack</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {filteredJobs.map((job: any) => {
          return (
            <div
              key={job.id || job._id}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600">
                      {job.company?.charAt(0) || "?"}
                    </div>

                    <div className="flex-1">
                      {job.url ? (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition inline-block mb-2"
                        >
                          {job.title}
                        </a>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </div>
                      )}
                      <div className="text-lg text-gray-600 mb-3">{job.company || "Unknown Company"}</div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location || "Not specified"}
                          {job.remote && " (Remote)"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {job.jobType || job.employment_type || "Full-Time"}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign size={16} />
                            {job.salary.currency || "$"}{job.salary.min?.toLocaleString()} - {job.salary.currency || "$"}{job.salary.max?.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {job.postedDate || job.createdAt
                            ? new Date(job.postedDate || job.createdAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>

                      {job.description && (
                        <p className="text-gray-700 mt-3 line-clamp-2">
                          {job.description.substring(0, 200)}...
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.skills?.slice(0, 6).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requirements?.slice(0, 6).map((req: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end gap-3">
                  {job.source === "findwork.dev" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      External
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition">
                      <Heart size={20} />
                    </button>
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
                      >
                        Apply
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      <Link
                        href={`/dashboard/jobs/${job.id || job._id}`}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
                      >
                        View Details
                        <ExternalLink size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => fetchJobs(pagination.page - 1)}
            disabled={!pagination.previous}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {pagination.page} of {Math.ceil(pagination.total / 20)}
          </span>
          <button
            onClick={() => fetchJobs(pagination.page + 1)}
            disabled={!pagination.next}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Try adjusting your search or filters"
              : "Complete your profile to get personalized job matches"}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setSelectedRemote("all");
              setSelectedLocation("all");
              setSelectedTrack("all");
              fetchJobs();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            {searchTerm ? "Clear Filters" : "Refresh Jobs"}
          </button>
        </div>
      )}
    </div>
  );
}
