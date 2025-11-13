"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Lock, CheckCircle2, Trophy, Target } from "lucide-react";
import Link from "next/link";
import CodeEditor from "@/components/learning/CodeEditor";

export default function InteractiveLearningPage({ params }: { params: { roadmapId: string } }) {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, [params.roadmapId]);

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`/api/roadmap/${params.roadmapId}`);
      if (response.ok) {
        const data = await response.json();
        setRoadmap(data.roadmap);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseComplete = async () => {
    try {
      const response = await fetch(
        `/api/roadmap/${params.roadmapId}/exercises/${currentExerciseIndex}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stageIndex: currentStageIndex,
            exerciseIndex: currentExerciseIndex,
          }),
        }
      );

      if (response.ok) {
        // Refresh roadmap to get updated progress
        fetchRoadmap();
        
        // Move to next exercise
        const currentStage = roadmap.stages[currentStageIndex];
        if (currentExerciseIndex < (currentStage.exercises?.length || 0) - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
        }
      }
    } catch (error) {
      console.error("Error completing exercise:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Roadmap Not Found</h2>
        <Link href="/dashboard/roadmap" className="text-primary-600 font-semibold">
          ← Back to Roadmaps
        </Link>
      </div>
    );
  }

  const currentStage = roadmap.stages[currentStageIndex];
  const currentExercise = currentStage.exercises?.[currentExerciseIndex];
  const isStageUnlocked = currentStageIndex === 0 || roadmap.stages[currentStageIndex - 1]?.completed;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/roadmap"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-4"
        >
          <ArrowLeft size={20} />
          Back to Roadmap
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">{roadmap.targetRole} - Interactive Learning</h1>
        <p className="text-gray-600 mt-2">
          Practice and master each skill through hands-on coding exercises
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">Overall Progress</span>
          <span className="text-2xl font-bold text-primary-600">{roadmap.progress}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all duration-500"
            style={{ width: `${roadmap.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar - Stage Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-8">
            <h3 className="font-bold text-gray-900 mb-4">Learning Stages</h3>
            <div className="space-y-3">
              {roadmap.stages.map((stage: any, index: number) => {
                const isUnlocked = index === 0 || roadmap.stages[index - 1]?.completed;
                const isCurrent = index === currentStageIndex;

                return (
                  <button
                    key={index}
                    onClick={() => isUnlocked && setCurrentStageIndex(index)}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-4 rounded-xl transition ${
                      isCurrent
                        ? "bg-primary-100 border-2 border-primary-500"
                        : isUnlocked
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-gray-50 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {stage.completed ? (
                        <CheckCircle2 size={20} className="text-green-600" />
                      ) : isUnlocked ? (
                        <Target size={20} className="text-primary-600" />
                      ) : (
                        <Lock size={20} className="text-gray-400" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">
                          Stage {index + 1}
                        </div>
                        <div className="text-xs text-gray-600">{stage.name}</div>
                        {stage.exercises && (
                          <div className="text-xs text-primary-600 mt-1">
                            {stage.completedExercises || 0}/{stage.exercises.length} exercises
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Exercises */}
        <div className="lg:col-span-3">
          {isStageUnlocked ? (
            <div className="space-y-6">
              {/* Stage Header */}
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {currentStage.name}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentStage.goals.map((goal: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <Target size={16} className="text-primary-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise Tabs */}
              {currentStage.exercises && currentStage.exercises.length > 0 && (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {currentStage.exercises.map((ex: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentExerciseIndex(index)}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                          index === currentExerciseIndex
                            ? "bg-primary-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Exercise {index + 1}
                        {ex.completed && " ✓"}
                      </button>
                    ))}
                  </div>

                  {/* Code Editor */}
                  {currentExercise && (
                    <CodeEditor
                      exercise={currentExercise}
                      onComplete={handleExerciseComplete}
                      isCompleted={currentExercise.completed || false}
                    />
                  )}
                </>
              )}

              {/* Resources */}
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Resources</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {currentStage.resources?.map((resource: string, index: number) => (
                    <div key={index} className="p-4 bg-primary-50 rounded-xl">
                      <span className="text-gray-900 font-semibold">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage Completion */}
              {currentStage.completed && (
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 text-white text-center">
                  <Trophy size={64} className="mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">Stage Completed! 🎉</h3>
                  <p className="text-white/90 mb-6">
                    Great job! You've mastered {currentStage.name}. Ready for the next challenge?
                  </p>
                  {currentStageIndex < roadmap.stages.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentStageIndex(currentStageIndex + 1);
                        setCurrentExerciseIndex(0);
                      }}
                      className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
                    >
                      Next Stage →
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
              <Lock size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Stage Locked</h3>
              <p className="text-gray-600">
                Complete the previous stage to unlock this content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





