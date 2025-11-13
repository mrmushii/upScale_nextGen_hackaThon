"use client";

import { useState, useEffect } from "react";
import {
  Map,
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Target,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/roadmap");
      if (response.ok) {
        const data = await response.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    try {
      setGenerating(true);
      setError("");
      
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: "Full Stack Developer" }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          const errorMsg = data.message || data.error || "Usage limit reached";
          const details = data.current !== undefined 
            ? ` (Used ${data.current}/${data.limit} on ${data.tier} plan)`
            : "";
          setError(errorMsg + details + ". You can view your existing roadmap below.");
        } else {
          setError(data.error || "Failed to generate roadmap");
        }
        return;
      }

      // Refresh roadmaps
      await fetchRoadmaps();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  const currentRoadmap = roadmaps[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Map className="text-primary-600" size={36} />
          Your Career Roadmap
        </h1>
        <p className="text-gray-600 mt-2">
          {currentRoadmap
            ? `Track your progress toward becoming a ${currentRoadmap.targetRole}`
            : "Generate your personalized career path"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {currentRoadmap ? (
        <>
          {/* Overall Progress Card */}
          <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-3xl p-8 text-white shadow-lg">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-white/80 text-sm font-semibold mb-2">
                  Overall Progress
                </div>
                <div className="text-5xl font-bold mb-2">
                  {currentRoadmap.progress}%
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${currentRoadmap.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="text-white/80 text-sm font-semibold mb-2">
                  Current Stage
                </div>
                <div className="text-2xl font-bold">
                  {currentRoadmap.stages.find((s: any) => !s.completed)?.name || "Completed"}
                </div>
                <div className="text-white/80 mt-2">
                  {currentRoadmap.stages.filter((s: any) => s.completed).length} of{" "}
                  {currentRoadmap.stages.length} complete
                </div>
              </div>

              <div>
                <div className="text-white/80 text-sm font-semibold mb-2">
                  Target Role
                </div>
                <div className="text-2xl font-bold">{currentRoadmap.targetRole}</div>
                <div className="text-white/80 mt-2">
                  {currentRoadmap.status === "active" ? "In Progress" : "Paused"}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href={`/dashboard/learn/${currentRoadmap._id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition font-bold shadow-lg text-lg"
              >
                🎯 Start Interactive Learning
              </Link>
              <Link
                href="/dashboard/resources?tab=suggested"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl hover:from-primary-700 hover:to-coral-700 transition font-bold shadow-lg text-lg"
              >
                📚 View Suggested Courses
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              Practice with hands-on coding exercises • Complete challenges • Unlock stages progressively • Access recommended courses
            </p>
          </div>

          {/* Roadmap Stages */}
          <div className="space-y-6">
            {currentRoadmap.stages.map((stage: any, index: number) => {
              const isCompleted = stage.completed;
              const isInProgress =
                !isCompleted &&
                (index === 0 ||
                  currentRoadmap.stages[index - 1]?.completed);
              const isLocked = !isCompleted && !isInProgress;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-8 shadow-lg ${
                    isLocked ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-100 text-green-600"
                            : isInProgress
                            ? "bg-primary-100 text-primary-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={32} />
                        ) : isLocked ? (
                          <Lock size={32} />
                        ) : (
                          <Circle size={32} />
                        )}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Stage {index + 1}: {stage.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {stage.estimatedWeeks} weeks
                          </span>
                          <span className="flex items-center gap-1">
                            <Target size={14} />
                            {stage.goals.length} goals
                          </span>
                        </div>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                        <Award size={20} />
                        Completed
                      </div>
                    )}
                  </div>

                  {!isLocked && (
                    <>
                      {!isCompleted && (
                        <div className="mb-6">
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all"
                              style={{ width: `${isInProgress ? currentRoadmap.progress : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Target size={20} className="text-primary-600" />
                          Learning Goals
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {stage.goals.map((goal: string, goalIndex: number) => (
                            <div
                              key={goalIndex}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                            >
                              <CheckCircle2
                                size={20}
                                className={
                                  isCompleted ? "text-green-600" : "text-gray-300"
                                }
                              />
                              <span className="text-gray-700 flex-1">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {isLocked && (
                    <div className="text-center py-8">
                      <Lock size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        Complete the previous stage to unlock this content
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <Map size={64} className="mx-auto text-primary-600 mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No Roadmap Yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Generate your personalized learning path based on your skills and career goals.
            Our AI will create a step-by-step roadmap to help you reach your target role.
          </p>
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl hover:from-primary-700 hover:to-coral-700 transition font-semibold shadow-lg disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate My Roadmap
              </>
            )}
          </button>
        </div>
      )}

      {currentRoadmap && (
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need a Different Roadmap?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Generate a new learning path for a different role or career track
          </p>
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                Generate New Roadmap
                <Map size={20} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
