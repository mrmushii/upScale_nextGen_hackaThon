"use client";

import { CheckCircle2, AlertTriangle, FileText, Sparkles, Target, Code } from "lucide-react";
import ScoreCircle from "./ScoreCircle";
import EnhancedATS from "./EnhancedATS";

interface EnhancedResumeAnalysisProps {
  analysis: {
    overallScore: number;
    ATS: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
      }>;
    };
    toneAndStyle: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    content: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    structure: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    skills: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
  };
}

/**
 * Enhanced Resume Analysis Component
 * Displays detailed ATS analysis with all categories
 */
export default function EnhancedResumeAnalysis({
  analysis,
}: EnhancedResumeAnalysisProps) {
  const { overallScore, ATS, toneAndStyle, content, structure, skills } =
    analysis;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-primary-50 to-coral-50 rounded-2xl p-8 text-center border-2 border-primary-200">
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

      {/* ATS Score */}
      <EnhancedATS score={ATS.score} suggestions={ATS.tips} />

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tone & Style */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Tone & Style</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-primary-600">
                  {toneAndStyle.score}
                </span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${toneAndStyle.score}%` }}
            />
          </div>
          {toneAndStyle.tips && toneAndStyle.tips.length > 0 && (
            <div className="space-y-2">
              {toneAndStyle.tips.map((tip, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-sm ${
                    tip.type === "good"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {tip.type === "good" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{tip.tip}</p>
                      {tip.explanation && (
                        <p className="text-xs mt-1 opacity-90">{tip.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Content</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-primary-600">
                  {content.score}
                </span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${content.score}%` }}
            />
          </div>
          {content.tips && content.tips.length > 0 && (
            <div className="space-y-2">
              {content.tips.map((tip, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-sm ${
                    tip.type === "good"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {tip.type === "good" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{tip.tip}</p>
                      {tip.explanation && (
                        <p className="text-xs mt-1 opacity-90">{tip.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Structure */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Structure</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-primary-600">
                  {structure.score}
                </span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${structure.score}%` }}
            />
          </div>
          {structure.tips && structure.tips.length > 0 && (
            <div className="space-y-2">
              {structure.tips.map((tip, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-sm ${
                    tip.type === "good"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {tip.type === "good" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{tip.tip}</p>
                      {tip.explanation && (
                        <p className="text-xs mt-1 opacity-90">{tip.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Code className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Skills</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-primary-600">
                  {skills.score}
                </span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${skills.score}%` }}
            />
          </div>
          {skills.tips && skills.tips.length > 0 && (
            <div className="space-y-2">
              {skills.tips.map((tip, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-sm ${
                    tip.type === "good"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {tip.type === "good" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{tip.tip}</p>
                      {tip.explanation && (
                        <p className="text-xs mt-1 opacity-90">{tip.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

