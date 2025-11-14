"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ScoreGauge from "@/components/resumes/ScoreGauge";
import ATSFeedback from "@/components/resumes/ATSFeedback";
import FeedbackAccordion from "@/components/resumes/FeedbackAccordion";

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeForm, setAnalyzeForm] = useState({
    jobTitle: "",
    jobDescription: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchResume();
    }
  }, [params.id]);

  const fetchResume = async () => {
    try {
      const res = await fetch(`/api/resumes/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setResume(data.resume);
        if (data.resume.jobTitle || data.resume.jobDescription) {
          setAnalyzeForm({
            jobTitle: data.resume.jobTitle || "",
            jobDescription: data.resume.jobDescription || "",
          });
        }
      } else {
        toast.error("Failed to load resume");
        router.push("/dashboard/resumes");
      }
    } catch (error) {
      toast.error("Failed to load resume");
      router.push("/dashboard/resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!analyzeForm.jobDescription) {
      toast.error("Job description is required for analysis");
      return;
    }

    setAnalyzing(true);

    try {
      const res = await fetch(`/api/resumes/${params.id}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analyzeForm),
      });

      if (res.ok) {
        const data = await res.json();
        setResume(data.resume);
        toast.success("Resume analyzed successfully");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to analyze resume");
      }
    } catch (error) {
      toast.error("Failed to analyze resume");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  const hasAnalysis = resume.analysisResult && resume.parsedStatus === "completed";

  return (
    <div className="max-w-7xl mx-auto">
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
          {resume.originalFilename}
        </h1>
        {(resume.companyName || resume.jobTitle) && (
          <p className="text-gray-600">
            {resume.companyName && <span className="font-medium">{resume.companyName}</span>}
            {resume.companyName && resume.jobTitle && " • "}
            {resume.jobTitle && <span>{resume.jobTitle}</span>}
          </p>
        )}
      </div>

      {hasAnalysis ? (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center gap-8">
              <ScoreGauge score={resume.analysisResult.overallScore} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Resume Score
                </h2>
                <p className="text-gray-600">
                  This score is calculated based on ATS compatibility, tone & style,
                  content quality, structure, and skills alignment.
                </p>
              </div>
            </div>
          </div>

          {/* ATS Feedback */}
          {resume.analysisResult.ATS && (
            <ATSFeedback
              score={resume.analysisResult.ATS.score}
              suggestions={resume.analysisResult.ATS.tips}
            />
          )}

          {/* Detailed Feedback */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Detailed Feedback
            </h2>
            <FeedbackAccordion
              categories={[
                {
                  title: "Tone & Style",
                  score: resume.analysisResult.toneAndStyle?.score || 0,
                  tips: resume.analysisResult.toneAndStyle?.tips || [],
                },
                {
                  title: "Content",
                  score: resume.analysisResult.content?.score || 0,
                  tips: resume.analysisResult.content?.tips || [],
                },
                {
                  title: "Structure",
                  score: resume.analysisResult.structure?.score || 0,
                  tips: resume.analysisResult.structure?.tips || [],
                },
                {
                  title: "Skills",
                  score: resume.analysisResult.skills?.score || 0,
                  tips: resume.analysisResult.skills?.tips || [],
                },
              ]}
            />
          </div>
        </div>
      ) : (
        /* Analyze Form */
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Analyze Resume
              </h2>
              <p className="text-gray-600">
                Provide a job description to get ATS score and feedback
              </p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label
                htmlFor="jobTitle"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                value={analyzeForm.jobTitle}
                onChange={(e) =>
                  setAnalyzeForm({ ...analyzeForm, jobTitle: e.target.value })
                }
                placeholder="e.g., Senior Frontend Developer"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="jobDescription"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="jobDescription"
                value={analyzeForm.jobDescription}
                onChange={(e) =>
                  setAnalyzeForm({
                    ...analyzeForm,
                    jobDescription: e.target.value,
                  })
                }
                placeholder="Paste the job description here..."
                rows={8}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                The job description helps generate targeted feedback and ATS score
              </p>
            </div>

            <button
              type="submit"
              disabled={analyzing || !analyzeForm.jobDescription}
              className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

