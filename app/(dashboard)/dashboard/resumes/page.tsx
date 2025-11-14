"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import ResumeCard from "@/components/resumes/ResumeCard";
import toast from "react-hot-toast";

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
      } else {
        toast.error("Failed to load resumes");
      }
    } catch (error) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter((r) => r._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
          <p className="text-gray-600">
            Upload and analyze your resumes to improve your ATS score
          </p>
        </div>
        <Link
          href="/dashboard/resumes/upload"
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Upload Resume
        </Link>
      </div>

      {/* Resumes List */}
      {resumes.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No resumes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Upload your first resume to get started with ATS analysis
          </p>
          <Link
            href="/dashboard/resumes/upload"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

