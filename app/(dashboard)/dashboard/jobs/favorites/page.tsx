"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  X,
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Youtube,
  School,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface FavoriteJob {
  _id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  jobData: any;
  skillGaps?: {
    missingSkills: string[];
    existingSkills: string[];
    matchPercentage: number;
    recommendations: string[];
  };
  createdAt: string;
}

interface CourseSuggestion {
  id: string;
  title: string;
  instructor?: string;
  thumbnail?: string;
  url: string;
  rating?: number;
  students?: number;
  price?: string;
  description?: string;
}

export default function FavoriteJobsPage() {
  const [favoriteJobs, setFavoriteJobs] = useState<FavoriteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, any>>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchFavoriteJobs();
  }, []);

  const fetchFavoriteJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavoriteJobs(data.favoriteJobs || []);
      } else {
        toast.error("Failed to load favorite jobs");
      }
    } catch (error) {
      console.error("Error fetching favorite jobs:", error);
      toast.error("Failed to load favorite jobs");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/favorites?jobId=${jobId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavoriteJobs((prev) => prev.filter((job) => job.jobId !== jobId));
        toast.success("Job removed from favorites");
      } else {
        toast.error("Failed to remove job from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove job from favorites");
    }
  };

  const fetchSuggestions = async (jobId: string) => {
    if (suggestions[jobId] || loadingSuggestions[jobId]) return;

    try {
      setLoadingSuggestions((prev) => ({ ...prev, [jobId]: true }));
      const response = await fetch(`/api/jobs/favorites/${jobId}/suggestions`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions((prev) => ({ ...prev, [jobId]: data }));
      } else {
        toast.error("Failed to load course suggestions");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load course suggestions");
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleExpand = (jobId: string) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
      fetchSuggestions(jobId);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 50) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your favorite jobs...</p>
        </div>
      </div>
    );
  }

  if (favoriteJobs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="text-primary-600" size={36} />
            Favorite Jobs
          </h1>
          <p className="text-gray-600 mt-2">
            Jobs you've saved for future reference
          </p>
        </div>

        <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Favorite Jobs Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start adding jobs to your favorites to track skill gaps and get personalized course suggestions.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            <Target size={20} />
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Heart className="text-primary-600" size={36} />
          Favorite Jobs ({favoriteJobs.length})
        </h1>
        <p className="text-gray-600 mt-2">
          Track your skill gaps and get personalized learning recommendations
        </p>
      </div>

      {/* Favorite Jobs List */}
      <div className="space-y-6">
        {favoriteJobs.map((job) => {
          const matchPercentage = job.skillGaps?.matchPercentage || 0;
          const missingSkills = job.skillGaps?.missingSkills || [];
          const existingSkills = job.skillGaps?.existingSkills || [];
          const isExpanded = expandedJob === job.jobId;
          const jobSuggestions = suggestions[job.jobId];

          return (
            <div
              key={job._id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Job Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {job.jobTitle}
                      </h2>
                      <button
                        onClick={() => removeFavorite(job.jobId)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="Remove from favorites"
                      >
                        <X size={20} className="text-red-500" />
                      </button>
                    </div>
                    <p className="text-lg text-gray-600 mb-4">{job.company}</p>

                    {/* Skill Match Indicator */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`px-4 py-2 rounded-xl ${getMatchBgColor(matchPercentage)}`}
                      >
                        <div className="flex items-center gap-2">
                          {matchPercentage >= 80 ? (
                            <TrendingUp
                              size={20}
                              className={getMatchColor(matchPercentage)}
                            />
                          ) : (
                            <TrendingDown
                              size={20}
                              className={getMatchColor(matchPercentage)}
                            />
                          )}
                          <span
                            className={`font-bold text-lg ${getMatchColor(matchPercentage)}`}
                          >
                            {matchPercentage}% Match
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {existingSkills.length} of{" "}
                        {existingSkills.length + missingSkills.length} skills
                        matched
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="p-6 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Existing Skills */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      Skills You Have ({existingSkills.length})
                    </h3>
                    {existingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {existingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No matching skills found</p>
                    )}
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={20} className="text-red-600" />
                      Skills to Learn ({missingSkills.length})
                    </h3>
                    {missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Great! You have all required skills
                      </p>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                {job.skillGaps?.recommendations &&
                  job.skillGaps.recommendations.length > 0 && (
                    <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-primary-600" />
                        Recommendations
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {job.skillGaps.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Toggle Suggestions Button */}
                <button
                  onClick={() => toggleExpand(job.jobId)}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                >
                  <BookOpen size={20} />
                  {isExpanded
                    ? "Hide Course Suggestions"
                    : "Show Course Suggestions"}
                </button>
              </div>

              {/* Course Suggestions */}
              {isExpanded && (
                <div className="p-6 border-t border-gray-200 bg-white">
                  {loadingSuggestions[job.jobId] ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                      <span className="ml-3 text-gray-600">
                        Loading course suggestions...
                      </span>
                    </div>
                  ) : jobSuggestions ? (
                    <div className="space-y-8">
                      {/* Missing Skills Summary */}
                      {jobSuggestions.missingSkills &&
                        jobSuggestions.missingSkills.length > 0 && (
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                              Courses to Learn:{" "}
                              {jobSuggestions.missingSkills
                                .slice(0, 5)
                                .join(", ")}
                            </h3>
                          </div>
                        )}

                      {/* Udemy Courses */}
                      {jobSuggestions.suggestions?.udemy &&
                        jobSuggestions.suggestions.udemy.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <GraduationCap
                                size={24}
                                className="text-primary-600"
                              />
                              Udemy Courses
                            </h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {jobSuggestions.suggestions.udemy.map(
                                (course: CourseSuggestion) => (
                                  <Link
                                    key={course.id}
                                    href={`/dashboard/resources/udemy/${course.id}`}
                                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-lg transition"
                                  >
                                    {course.thumbnail && (
                                      <div className="relative w-full h-32">
                                        <Image
                                          src={course.thumbnail}
                                          alt={course.title}
                                          fill
                                          className="object-cover"
                                          sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                      </div>
                                    )}
                                    <div className="p-4">
                                      <h5 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
                                        {course.title}
                                      </h5>
                                      {course.instructor && (
                                        <p className="text-xs text-gray-600 mb-2">
                                          {course.instructor}
                                        </p>
                                      )}
                                      <div className="flex items-center justify-between">
                                        {course.price && (
                                          <span className="text-sm font-bold text-primary-600">
                                            {course.price}
                                          </span>
                                        )}
                                        <ExternalLink
                                          size={14}
                                          className="text-gray-400"
                                        />
                                      </div>
                                    </div>
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* YouTube Courses */}
                      {jobSuggestions.suggestions?.youtube &&
                        jobSuggestions.suggestions.youtube.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Youtube size={24} className="text-red-600" />
                              YouTube Courses
                            </h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {jobSuggestions.suggestions.youtube.map(
                                (course: CourseSuggestion) => (
                                  <a
                                    key={course.id}
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-red-500 hover:shadow-lg transition block"
                                  >
                                    {course.thumbnail && (
                                      <div className="relative w-full h-32">
                                        <Image
                                          src={course.thumbnail}
                                          alt={course.title}
                                          fill
                                          className="object-cover"
                                          sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                      </div>
                                    )}
                                    <div className="p-4">
                                      <h5 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
                                        {course.title}
                                      </h5>
                                      {course.description && (
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                          {course.description}
                                        </p>
                                      )}
                                      <ExternalLink
                                        size={14}
                                        className="text-gray-400 float-right"
                                      />
                                    </div>
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Microsoft Learn Courses */}
                      {jobSuggestions.suggestions?.microsoft &&
                        jobSuggestions.suggestions.microsoft.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <School size={24} className="text-blue-600" />
                              Microsoft Learn Courses
                            </h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {jobSuggestions.suggestions.microsoft.map(
                                (course: CourseSuggestion) => (
                                  <a
                                    key={course.id}
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition block"
                                  >
                                    <h5 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
                                      {course.title}
                                    </h5>
                                    {course.description && (
                                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                        {course.description}
                                      </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-blue-600 font-medium">
                                        Free
                                      </span>
                                      <ExternalLink
                                        size={14}
                                        className="text-gray-400"
                                      />
                                    </div>
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {(!jobSuggestions.suggestions?.udemy?.length &&
                        !jobSuggestions.suggestions?.youtube?.length &&
                        !jobSuggestions.suggestions?.microsoft?.length) && (
                        <div className="text-center py-8 text-gray-500">
                          No course suggestions available at the moment.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Failed to load course suggestions. Please try again.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

