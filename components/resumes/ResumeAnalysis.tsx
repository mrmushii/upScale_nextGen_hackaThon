"use client";

import { CheckCircle2, AlertTriangle, TrendingUp, Target, XCircle } from "lucide-react";
import ScoreCircle from "./ScoreCircle";

interface ResumeAnalysisProps {
  analysis: {
    overallScore: number;
    feedback: {
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
    };
    jobMatch: {
      score: number;
      matchedSkills: string[];
      missingSkills: string[];
    };
  };
}

export default function ResumeAnalysis({ analysis }: ResumeAnalysisProps) {
  const { overallScore, feedback, jobMatch } = analysis;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-primary-50 to-coral-50 rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <ScoreCircle score={overallScore} size="large" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Overall Score: {overallScore}/100
        </h2>
        <p className="text-gray-600">
          {overallScore >= 80
            ? "Excellent! Your resume is well-optimized."
            : overallScore >= 60
            ? "Good! There's room for improvement."
            : "Needs work. Follow the suggestions below to improve."}
        </p>
      </div>

      {/* Job Match Score */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Target className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Job Match Score</h3>
            <p className="text-sm text-gray-600">How well your resume matches the job requirements</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl font-bold text-primary-600">{jobMatch.score}</div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all"
                style={{ width: `${jobMatch.score}%` }}
              />
            </div>
          </div>
          <span className="text-gray-600 font-semibold">/100</span>
        </div>

        {/* Matched Skills */}
        {jobMatch.matchedSkills && jobMatch.matchedSkills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Matched Skills ({jobMatch.matchedSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {jobMatch.matchedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {jobMatch.missingSkills && jobMatch.missingSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Missing Skills ({jobMatch.missingSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {jobMatch.missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strengths */}
      {feedback.strengths && feedback.strengths.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-green-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {feedback.weaknesses && feedback.weaknesses.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {feedback.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl border-2 border-primary-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Actionable Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700 leading-relaxed">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

