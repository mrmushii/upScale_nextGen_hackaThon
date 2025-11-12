"use client";

import { useState } from "react";
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

// Mock jobs data
const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Ltd",
    location: "Dhaka, Bangladesh",
    remote: true,
    type: "Full-Time",
    salary: { min: 40000, max: 60000, currency: "BDT" },
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    match: 92,
    posted: "2 days ago",
    saved: false,
  },
  {
    id: 2,
    title: "React Developer",
    company: "Digital Innovations",
    location: "Remote",
    remote: true,
    type: "Full-Time",
    salary: { min: 50000, max: 70000, currency: "BDT" },
    requiredSkills: ["React", "JavaScript", "REST API", "Git"],
    match: 88,
    posted: "3 days ago",
    saved: true,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartupHub",
    location: "Chattogram, Bangladesh",
    remote: false,
    type: "Full-Time",
    salary: { min: 45000, max: 65000, currency: "BDT" },
    requiredSkills: ["React", "Node.js", "MongoDB", "Express"],
    match: 75,
    posted: "1 week ago",
    saved: false,
  },
  {
    id: 4,
    title: "UI/UX Developer",
    company: "Creative Studio BD",
    location: "Dhaka, Bangladesh",
    remote: false,
    type: "Contract",
    salary: { min: 35000, max: 50000, currency: "BDT" },
    requiredSkills: ["HTML", "CSS", "JavaScript", "Figma"],
    match: 65,
    posted: "2 weeks ago",
    saved: false,
  },
  {
    id: 5,
    title: "Junior Frontend Developer",
    company: "WebTech Solutions",
    location: "Sylhet, Bangladesh",
    remote: true,
    type: "Full-Time",
    salary: { min: 30000, max: 45000, currency: "BDT" },
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    match: 80,
    posted: "4 days ago",
    saved: false,
  },
  {
    id: 6,
    title: "Senior React Developer",
    company: "Enterprise Corp",
    location: "Dhaka, Bangladesh",
    remote: true,
    type: "Full-Time",
    salary: { min: 80000, max: 120000, currency: "BDT" },
    requiredSkills: ["React", "TypeScript", "Node.js", "AWS", "Docker"],
    match: 70,
    posted: "5 days ago",
    saved: false,
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRemote, setSelectedRemote] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.type === selectedType;
    const matchesRemote =
      selectedRemote === "all" ||
      (selectedRemote === "remote" && job.remote) ||
      (selectedRemote === "onsite" && !job.remote);
    return matchesSearch && matchesType && matchesRemote;
  });

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
          {/* Search */}
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

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition"
          >
            <Filter size={20} />
            <span className="font-semibold">Filters</span>
          </button>
        </div>

        {/* Expanded Filters */}
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
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  {/* Company Logo Placeholder */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600">
                    {job.company.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition inline-block mb-2"
                    >
                      {job.title}
                    </Link>
                    <div className="text-lg text-gray-600 mb-3">{job.company}</div>

                    {/* Job Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                        {job.remote && " (Remote)"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} />
                        ৳{job.salary.min.toLocaleString()} - ৳{job.salary.max.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {job.posted}
                      </span>
                    </div>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Score & Actions */}
              <div className="ml-4 flex flex-col items-end gap-3">
                <div
                  className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold ${
                    job.match >= 85
                      ? "bg-green-100 text-green-700"
                      : job.match >= 70
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  <Sparkles size={16} />
                  {job.match}% Match
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={`p-2 rounded-lg transition ${
                      job.saved
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                    }`}
                  >
                    <Heart size={20} fill={job.saved ? "currentColor" : "none"} />
                  </button>
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
                  >
                    View Details
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setSelectedRemote("all");
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

