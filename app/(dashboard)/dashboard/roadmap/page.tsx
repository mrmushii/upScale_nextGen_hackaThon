"use client";

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
} from "lucide-react";
import Link from "next/link";

const roadmapData = {
  targetRole: "Full Stack Developer",
  overall Progress: 65,
  estimatedCompletion: "8 weeks",
  stages: [
    {
      name: "Prerequisites",
      status: "completed",
      progress: 100,
      estimatedWeeks: 6,
      goals: [
        "Master HTML & CSS fundamentals",
        "Learn JavaScript basics",
        "Understand Git & GitHub",
        "Build 3 static websites",
      ],
      resources: [
        { title: "freeCodeCamp HTML/CSS", type: "Course", completed: true },
        { title: "JavaScript Basics on MDN", type: "Tutorial", completed: true },
        { title: "Git & GitHub Crash Course", type: "Video", completed: true },
      ],
      projects: [
        { title: "Personal Portfolio Website", completed: true },
        { title: "Landing Page for Local Business", completed: true },
        { title: "Restaurant Menu Site", completed: true },
      ],
    },
    {
      name: "Core Skills",
      status: "in-progress",
      progress: 65,
      estimatedWeeks: 10,
      goals: [
        "Master React fundamentals",
        "Learn Node.js & Express",
        "Understand REST APIs",
        "Database basics (MongoDB)",
        "Authentication & Authorization",
      ],
      resources: [
        { title: "React Official Tutorial", type: "Course", completed: true },
        { title: "Node.js Complete Guide", type: "Course", completed: true },
        { title: "REST API Best Practices", type: "Article", completed: false },
        { title: "MongoDB University", type: "Course", completed: false },
      ],
      projects: [
        { title: "Todo App with React", completed: true },
        { title: "Blog API with Node.js", completed: false },
        { title: "Full Stack CRUD App", completed: false },
      ],
    },
    {
      name: "Advanced Topics",
      status: "locked",
      progress: 0,
      estimatedWeeks: 8,
      goals: [
        "Advanced React patterns",
        "Testing (Jest, React Testing Library)",
        "Deployment & CI/CD",
        "Performance optimization",
        "Security best practices",
      ],
      resources: [],
      projects: [],
    },
  ],
};

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Map className="text-primary-600" size={36} />
          Your Career Roadmap
        </h1>
        <p className="text-gray-600 mt-2">
          Track your progress toward becoming a {roadmapData.targetRole}
        </p>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-white/80 text-sm font-semibold mb-2">
              Overall Progress
            </div>
            <div className="text-5xl font-bold mb-2">
              {roadmapData.overallProgress}%
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${roadmapData.overallProgress}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="text-white/80 text-sm font-semibold mb-2">
              Current Stage
            </div>
            <div className="text-2xl font-bold">Core Skills</div>
            <div className="text-white/80 mt-2">
              {roadmapData.stages[1].progress}% complete
            </div>
          </div>

          <div>
            <div className="text-white/80 text-sm font-semibold mb-2">
              Est. Completion
            </div>
            <div className="text-2xl font-bold">{roadmapData.estimatedCompletion}</div>
            <div className="text-white/80 mt-2">At current pace</div>
          </div>
        </div>
      </div>

      {/* Roadmap Stages */}
      <div className="space-y-6">
        {roadmapData.stages.map((stage, index) => {
          const isCompleted = stage.status === "completed";
          const isInProgress = stage.status === "in-progress";
          const isLocked = stage.status === "locked";

          return (
            <div
              key={index}
              className={`bg-white rounded-3xl p-8 shadow-lg ${
                isLocked ? "opacity-60" : ""
              }`}
            >
              {/* Stage Header */}
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
                {isInProgress && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {stage.progress}%
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                )}
              </div>

              {!isLocked && (
                <>
                  {/* Progress Bar */}
                  {!isCompleted && (
                    <div className="mb-6">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all"
                          style={{ width: `${stage.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Goals */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target size={20} className="text-primary-600" />
                      Learning Goals
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {stage.goals.map((goal, goalIndex) => (
                        <div
                          key={goalIndex}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <CheckCircle2
                            size={20}
                            className={
                              isCompleted
                                ? "text-green-600"
                                : "text-gray-300"
                            }
                          />
                          <span className="text-gray-700 flex-1">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  {stage.resources.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen size={20} className="text-coral-600" />
                        Learning Resources
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {stage.resources.map((resource, resIndex) => (
                          <div
                            key={resIndex}
                            className={`p-4 rounded-xl border-2 ${
                              resource.completed
                                ? "bg-green-50 border-green-200"
                                : "bg-white border-gray-200 hover:border-primary-300"
                            } transition cursor-pointer group`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 group-hover:text-primary-600">
                                  {resource.title}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {resource.type}
                                </div>
                              </div>
                              {resource.completed ? (
                                <CheckCircle2 size={20} className="text-green-600" />
                              ) : (
                                <Play size={20} className="text-gray-400 group-hover:text-primary-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {stage.projects.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp size={20} className="text-purple-600" />
                        Practice Projects
                      </h4>
                      <div className="grid md:grid-cols-3 gap-3">
                        {stage.projects.map((project, projIndex) => (
                          <div
                            key={projIndex}
                            className={`p-4 rounded-xl border-2 ${
                              project.completed
                                ? "bg-purple-50 border-purple-200"
                                : "bg-white border-gray-200 hover:border-purple-300"
                            } transition`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {project.completed ? (
                                <CheckCircle2 size={16} className="text-purple-600" />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <span className="font-semibold text-sm text-gray-900">
                                {project.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

      {/* CTA */}
      <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Need a Custom Roadmap?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get a personalized learning path tailored to your specific goals and current skill level
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          Generate New Roadmap
          <Map size={20} />
        </Link>
      </div>
    </div>
  );
}

