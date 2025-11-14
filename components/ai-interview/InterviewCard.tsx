import Link from "next/link";
import { AIInterview } from "@/types";
import { Calendar, Sparkles } from "lucide-react";
import TechStackIcons from "./TechStackIcons";

const THEME_MAP: Record<string, string> = {
  indigo: "from-indigo-500 via-purple-500 to-fuchsia-500",
  emerald: "from-emerald-500 via-teal-500 to-cyan-500",
  coral: "from-orange-500 via-rose-500 to-pink-500",
  amber: "from-amber-500 via-orange-500 to-yellow-500",
  violet: "from-violet-500 via-purple-500 to-indigo-500",
  cyan: "from-cyan-500 via-sky-500 to-blue-500",
  slate: "from-slate-500 via-gray-600 to-slate-800",
};

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
  const gradient =
    THEME_MAP[interview.coverTheme] || THEME_MAP["indigo"] || "from-indigo-500";
  const typeLabel = /mix/i.test(interview.type)
    ? "Mixed"
    : interview.type.charAt(0).toUpperCase() + interview.type.slice(1);
  const totalScore = interview.feedback?.totalScore;
  const feedbackDate = interview.feedback?.createdAt || interview.createdAt;
  const subtitle =
    interview.feedback?.finalAssessment ||
    "Take this interview to unlock personalized insights.";

  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-2xl">
        <div
          className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-r ${gradient} opacity-90`}
        />

        <div className="relative p-6 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
            {typeLabel}
          </span>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 capitalize">
              {interview.role} Interview
            </h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{subtitle}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="inline-flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(feedbackDate)}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>{totalScore != null ? `${totalScore}/100` : "Pending"}</span>
            </div>
          </div>

          {interview.techstack?.length > 0 && (
            <TechStackIcons techStack={interview.techstack} />
          )}
        </div>
      </div>
    </Link>
  );
}


