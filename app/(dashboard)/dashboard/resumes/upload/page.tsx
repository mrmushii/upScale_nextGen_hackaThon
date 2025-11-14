"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ResumeUploadWidget from "@/components/resumes/ResumeUploadWidget";
import toast from "react-hot-toast";

export default function UploadResumePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    jobListingUrl: "",
  });

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a resume file");
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      if (formData.companyName)
        formDataToSend.append("companyName", formData.companyName);
      if (formData.jobTitle) formDataToSend.append("jobTitle", formData.jobTitle);
      if (formData.jobDescription)
        formDataToSend.append("jobDescription", formData.jobDescription);
      if (formData.jobListingUrl)
        formDataToSend.append("jobListingUrl", formData.jobListingUrl);

      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Resume uploaded successfully");
        router.push(`/dashboard/resumes/${data.resume._id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to upload resume");
      }
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/resumes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resumes
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Resume
        </h1>
        <p className="text-gray-600">
          Upload your resume and optionally provide job details for ATS analysis
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Resume File <span className="text-red-500">*</span>
            </label>
            <ResumeUploadWidget onFileSelect={handleFileSelect} />
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Company Name (Optional)
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="e.g., Google, Microsoft"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Job Title (Optional)
            </label>
            <input
              type="text"
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              placeholder="e.g., Senior Frontend Developer"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Job Description */}
          <div>
            <label
              htmlFor="jobDescription"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Job Description (Optional)
            </label>
            <textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) =>
                setFormData({ ...formData, jobDescription: e.target.value })
              }
              placeholder="Paste the job description here for better analysis..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              Providing a job description helps generate more targeted feedback
            </p>
          </div>

          {/* Job Listing URL */}
          <div>
            <label
              htmlFor="jobListingUrl"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Job Listing URL (Optional)
            </label>
            <input
              type="url"
              id="jobListingUrl"
              value={formData.jobListingUrl}
              onChange={(e) =>
                setFormData({ ...formData, jobListingUrl: e.target.value })
              }
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </>
              )}
            </button>
            <Link
              href="/dashboard/resumes"
              className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

