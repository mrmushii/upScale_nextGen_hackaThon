"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import ScoreBadge from "./ScoreBadge";

interface ATSFeedbackProps {
  score: number;
  suggestions: Array<{
    type: "good" | "improve";
    tip: string;
  }>;
}

export default function ATSFeedback({ score, suggestions }: ATSFeedbackProps) {
  const gradientClass =
    score > 69
      ? "from-green-100"
      : score > 49
      ? "from-yellow-100"
      : "from-red-100";

  return (
    <div
      className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-white rounded-lg">
          {score > 69 ? (
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          ) : score > 49 ? (
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-red-600" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ATS Score - {score}/100
          </h2>
          <ScoreBadge score={score} />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {score > 69
            ? "Great Job!"
            : score > 49
            ? "Good Start"
            : "Needs Improvement"}
        </h3>
        <p className="text-gray-600 mb-4">
          This score represents how well your resume is likely to perform in
          Applicant Tracking Systems used by employers.
        </p>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              {suggestion.type === "good" ? (
                <CheckCircle2 className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 mt-1 text-amber-600 flex-shrink-0" />
              )}
              <p
                className={
                  suggestion.type === "good"
                    ? "text-green-700"
                    : "text-amber-700"
                }
              >
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-700 italic">
        Keep refining your resume to improve your chances of getting past ATS
        filters and into the hands of recruiters.
      </p>
    </div>
  );
}

