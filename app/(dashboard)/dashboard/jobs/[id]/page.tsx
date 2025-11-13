"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Sparkles,
  Heart,
  Share2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch job details
      const jobResponse = await fetch(`/api/jobs/${params.id}`);
      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        setJob(jobData.job);
      }

      // Fetch all matches to find this job's match data
      const matchResponse = await fetch("/api/jobs/match");
      if (matchResponse.ok) {
        const matchData = await matchResponse.json();
        const thisJobMatch = matchData.matches?.find(
          (m: any) => m.job._id === params.id
        );
        if (thisJobMatch) {
          setMatchData(thisJobMatch);
        }
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          companyName: job.company,
          position: job.title,
          status: "applied",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully!");
      } else if (response.status === 403 && data.error === "Profile incomplete") {
        toast.error("Please complete your profile before applying to jobs.", {
          duration: 5000,
        });
        setTimeout(() => {
          router.push("/dashboard/profile/complete");
        }, 2000);
      } else {
        toast.error(data.message || data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error applying:", error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <Link href="/dashboard/jobs" className="text-primary-600 font-semibold">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const overlapSkills = matchData?.overlapSkills || [];
  const missingSkills = matchData?.missingSkills || [];
  const matchScore = matchData?.score || 0;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Jobs
      </Link>

      {/* Job Header */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-600 flex-shrink-0">
                {job.company.charAt(0)}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <div className="text-xl text-gray-600 mb-4">{job.company}</div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <MapPin size={18} />
                    {job.location}
                    {job.remote && " (Remote)"}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase size={18} />
                    {job.jobType}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-2">
                      <DollarSign size={18} />
                      ৳{job.salary.min.toLocaleString()} - ৳
                      {job.salary.max.toLocaleString()}/mo
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {matchScore > 0 && (
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold ${
                  matchScore >= 85
                    ? "bg-green-100 text-green-700"
                    : matchScore >= 70
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                <Sparkles size={20} />
                {matchScore}% Match
              </div>
            )}

            <button
              onClick={handleApply}
              disabled={applying}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
            >
              {applying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : (
                <>
                  Apply Now
                  <ExternalLink size={18} />
                </>
              )}
            </button>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition font-semibold">
                <Heart size={18} />
                Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition font-semibold">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Match Analysis */}
          {matchData && (
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Why You're a {matchScore}% Match
              </h2>

              {overlapSkills.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <h3 className="font-bold text-gray-900">
                      You have {overlapSkills.length} matching skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {overlapSkills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold flex items-center gap-1"
                      >
                        <CheckCircle2 size={14} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={20} className="text-orange-600" />
                    <h3 className="font-bold text-gray-900">
                      Skills to develop ({missingSkills.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {missingSkills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold flex items-center gap-1"
                      >
                        <XCircle size={14} />
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/dashboard/roadmap"
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                  >
                    Add to learning roadmap
                    <ExternalLink size={16} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Job Description */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Job Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.tags && job.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-3xl p-6 text-white sticky top-6">
            <h3 className="text-xl font-bold mb-4">Ready to apply?</h3>
            <p className="text-white/90 mb-6 text-sm">
              Your profile is {matchScore}% compatible with this role. Apply now to increase
              your chances!
            </p>
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full bg-white text-primary-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition mb-3 disabled:opacity-50"
            >
              {applying ? "Applying..." : "Apply with Upscale"}
            </button>
            <p className="text-xs text-white/80 text-center">
              Your profile and resume will be sent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
