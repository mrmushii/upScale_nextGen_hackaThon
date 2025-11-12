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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs/match");
      if (response.ok) {
        const data = await response.json();
        setJobs(data.matches || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((match) => {
    const job = match.job;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.jobType === selectedType;
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
          Found {filteredJobs.length} jobs matching your skills and preferences
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
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
                Sort By
              </label>
              <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition">
                <option value="match">Best Match</option>
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {filteredJobs.map((match) => {
          const job = match.job;
          return (
            <div
              key={job._id}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600">
                      {job.company.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/dashboard/jobs/${job._id}`}
                        className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition inline-block mb-2"
                      >
                        {job.title}
                      </Link>
                      <div className="text-lg text-gray-600 mb-3">{job.company}</div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                          {job.remote && " (Remote)"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {job.jobType}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign size={16} />
                            ৳{job.salary.min.toLocaleString()} - ৳{job.salary.max.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.requiredSkills?.slice(0, 6).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              match.overlapSkills.includes(skill)
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end gap-3">
                  <div
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold ${
                      match.score >= 85
                        ? "bg-green-100 text-green-700"
                        : match.score >= 70
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    <Sparkles size={16} />
                    {match.score}% Match
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition">
                      <Heart size={20} />
                    </button>
                    <Link
                      href={`/dashboard/jobs/${job._id}`}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
                    >
                      View Details
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            {searchTerm ? "Clear Filters" : "Complete Profile"}
          </button>
        </div>
      )}
    </div>
  );
}
