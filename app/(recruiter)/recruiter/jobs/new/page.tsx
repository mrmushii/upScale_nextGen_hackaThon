"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    remote: false,
    requiredSkills: "",
    recommendedExperience: "Entry Level (0-1 years)",
    jobType: "Full-Time",
    description: "",
    track: "Frontend Development",
    salaryMin: "",
    salaryMax: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()),
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        salary: formData.salaryMin ? {
          min: parseInt(formData.salaryMin),
          max: parseInt(formData.salaryMax),
          currency: "BDT",
        } : undefined,
        status: "active",
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        router.push("/recruiter/jobs");
      } else {
        alert("Failed to create job");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Link href="/recruiter/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a job listing</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Frontend Developer"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Tech Solutions Ltd"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dhaka, Bangladesh"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remote}
                onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-semibold text-gray-700">Remote Position</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills (comma-separated) *</label>
            <input
              type="text"
              required
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder="React, TypeScript, Tailwind CSS"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Career Track *</label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              >
                <option>Frontend Development</option>
                <option>Backend Development</option>
                <option>Full Stack Development</option>
                <option>Mobile Development</option>
                <option>Data Science</option>
                <option>DevOps</option>
                <option>UI/UX Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
              <select
                value={formData.recommendedExperience}
                onChange={(e) => setFormData({ ...formData, recommendedExperience: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              >
                <option>Fresh Graduate</option>
                <option>Entry Level (0-1 years)</option>
                <option>Junior (1-3 years)</option>
                <option>Mid-Level (3-5 years)</option>
                <option>Senior (5-10 years)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Salary (৳)</label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                placeholder="40000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Salary (৳)</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                placeholder="60000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={8}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Remote, Startup, Fast-paced"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl hover:from-primary-700 hover:to-coral-700 transition font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Post Job
                </>
              )}
            </button>
            <Link
              href="/recruiter/dashboard"
              className="px-8 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

