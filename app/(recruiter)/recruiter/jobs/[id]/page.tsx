"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Briefcase, MapPin, DollarSign, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    remote: false,
    requiredSkills: "",
    recommendedExperience: "",
    jobType: "",
    description: "",
    track: "",
    salaryMin: "",
    salaryMax: "",
    tags: "",
    status: "active",
  });

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const data = await response.json();
      
      if (data.job) {
        setJob(data.job);
        setFormData({
          title: data.job.title,
          company: data.job.company,
          location: data.job.location,
          remote: data.job.remote,
          requiredSkills: data.job.requiredSkills.join(", "),
          recommendedExperience: data.job.recommendedExperience,
          jobType: data.job.jobType,
          description: data.job.description,
          track: data.job.track,
          salaryMin: data.job.salary?.min?.toString() || "",
          salaryMax: data.job.salary?.max?.toString() || "",
          tags: data.job.tags?.join(", ") || "",
          status: data.job.status,
        });
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

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
      };

      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        setMessage("✅ Job updated successfully!");
        fetchJob();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setMessage("❌ Error updating job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <Link href="/recruiter/jobs" className="text-primary-600 hover:underline mt-4 inline-block">
          ← Back to My Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold">
        <ArrowLeft size={20} />
        Back to My Jobs
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-2">Update your job posting details</p>
        </div>
        {job.approved ? (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
            <CheckCircle size={16} />
            APPROVED
          </span>
        ) : (
          <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold flex items-center gap-2">
            <Clock size={16} />
            PENDING APPROVAL
          </span>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${
          message.includes("✅") ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-700 border-2 border-red-200"
        }`}>
          {message}
        </div>
      )}

      {!job.approved && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6">
          <h3 className="font-bold text-orange-900 mb-2">⏳ Awaiting Admin Approval</h3>
          <p className="text-orange-700 text-sm">
            This job is currently under review by our admin team. It will be visible to users once approved (typically within 24-48 hours).
          </p>
        </div>
      )}

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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Track *</label>
              <select
                required
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              >
                <option>Frontend Development</option>
                <option>Backend Development</option>
                <option>Full Stack Development</option>
                <option>Mobile Development</option>
                <option>DevOps</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remote}
                onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
              <span className="font-semibold text-gray-700">Remote Position</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills (comma-separated) *</label>
            <input
              type="text"
              required
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
              <select
                required
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
                <option>Freelance</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
              <select
                required
                value={formData.recommendedExperience}
                onChange={(e) => setFormData({ ...formData, recommendedExperience: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              >
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Salary (৳)</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-coral-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
            <Link
              href="/recruiter/jobs"
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Job Info */}
      <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Job Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Created</div>
            <div className="font-semibold text-gray-900">
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Last Updated</div>
            <div className="font-semibold text-gray-900">
              {new Date(job.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

