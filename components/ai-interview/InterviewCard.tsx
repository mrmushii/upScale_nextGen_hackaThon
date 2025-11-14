import Link from "next/link";
import { AIInterview } from "@/types";
import { Calendar, Sparkles, Briefcase } from "lucide-react";
import TechStackIcons from "./TechStackIcons";

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

interface Props {
  interview: AIInterview;
  href: string;
}

export default function InterviewCard({ interview, href }: Props) {
  const typeLabel = /mix/i.test(interview.type)
    ? "Mixed"
    : interview.type.charAt(0).toUpperCase() + interview.type.slice(1);
  const totalScore = interview.feedback?.totalScore;
  const feedbackDate = interview.feedback?.createdAt || interview.createdAt;
  const subtitle =
    interview.feedback?.finalAssessment ||
    "Take this interview to unlock personalized insights.";

  // Get score color based on value
  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Get score badge color
  const getScoreBadgeColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "bg-gray-100 text-gray-700";
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:border-primary-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-600 to-coral-600 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wide text-white">
                {typeLabel}
              </span>
            </div>
            {totalScore != null && (
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBadgeColor(totalScore)}`}>
                {totalScore}/100
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white capitalize">
                {interview.role} Interview
              </h3>
              <p className="text-sm text-white/90 mt-1">
                {interview.level || "Mid-level"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {subtitle}
          </p>

          {/* Tech Stack */}
          {interview.techstack && interview.techstack.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <TechStackIcons techStack={interview.techstack} />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(feedbackDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${getScoreColor(totalScore)}`} />
              <span className={`text-sm font-semibold ${getScoreColor(totalScore)}`}>
                {totalScore != null ? `${totalScore}/100` : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
