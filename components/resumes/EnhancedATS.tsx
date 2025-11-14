"use client";

import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface EnhancedATSProps {
  score: number;
  suggestions: Suggestion[];
}

/**
 * Enhanced ATS Component
 * Ported from ai-resume-analyzer-main but styled to match upScale theme
 */
const EnhancedATS: React.FC<EnhancedATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass =
    score > 69
      ? "from-green-100 to-white"
      : score > 49
      ? "from-yellow-100 to-white"
      : "from-red-100 to-white";

  // Determine subtitle based on score
  const subtitle =
    score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

  // Determine icon color
  const iconColor =
    score > 69 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <div
      className={`bg-gradient-to-b ${gradientClass} rounded-2xl shadow-md w-full p-6 border-2 ${
        score > 69
          ? "border-green-200"
          : score > 49
          ? "border-yellow-200"
          : "border-red-200"
      }`}
    >
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 bg-white rounded-lg ${iconColor}`}>
          {score > 69 ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : (
            <AlertTriangle className="w-8 h-8" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ATS Score - {score}/100
          </h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This score represents how well your resume is likely to perform in
          Applicant Tracking Systems used by employers.
        </p>

        {/* Suggestions list */}
        {suggestions && suggestions.length > 0 && (
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
        )}
      </div>

      {/* Closing encouragement */}
      <p className="text-gray-700 italic text-sm">
        Keep refining your resume to improve your chances of getting past ATS
        filters and into the hands of recruiters.
      </p>
    </div>
  );
};

export default EnhancedATS;

