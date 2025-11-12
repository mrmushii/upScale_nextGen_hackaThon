"use client";

import { useState } from "react";
import { Video, FileText, Play, Sparkles, TrendingUp, Award } from "lucide-react";

export default function MockInterviewPage() {
  const [selectedType, setSelectedType] = useState<"technical" | "behavioral" | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const interviewTypes = [
    {
      type: "technical" as const,
      icon: FileText,
      title: "Technical Interview",
      description: "Practice coding problems, system design, and technical questions",
      color: "from-primary-600 to-coral-600",
    },
    {
      type: "behavioral" as const,
      icon: Video,
      title: "Behavioral Interview",
      description: "Practice STAR method, leadership questions, and soft skills",
      color: "from-purple-600 to-pink-600",
    },
  ];

  const recentSessions = [
    { date: "2 days ago", type: "Technical", score: 85, role: "Frontend Developer" },
    { date: "1 week ago", type: "Behavioral", score: 78, role: "Full Stack Developer" },
    { date: "2 weeks ago", type: "Technical", score: 92, role: "React Developer" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">AI Mock Interview</h1>
        <p className="text-gray-600 mt-2">Practice interviews and get instant AI feedback</p>
      </div>

      {/* Usage Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">This Month</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">8/20</div>
          <div className="text-sm text-green-600 font-semibold">12 remaining</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Average Score</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">85%</div>
          <div className="text-sm text-gray-600">+5% from last month</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">24</div>
          <div className="text-sm text-gray-600">Since you joined</div>
        </div>
      </div>

      {/* Interview Type Selection */}
      {!selectedType && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Interview Type</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {interviewTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => setSelectedType(type.type)}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${type.color} mb-4 group-hover:scale-110 transition`}>
                  <type.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="flex items-center gap-2 text-primary-600 font-semibold">
                  Start Interview <Play size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Form */}
      {selectedType && (
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <button onClick={() => setSelectedType(null)} className="text-gray-600 hover:text-gray-900 mb-6">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Configure Your {selectedType === "technical" ? "Technical" : "Behavioral"} Interview
          </h2>
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              >
                <option value="">Select a role</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Full Stack Developer</option>
                <option value="mobile">Mobile Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-3 rounded-xl font-semibold transition ${
                      difficulty === level
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!selectedRole}
              className="w-full bg-gradient-to-r from-primary-600 to-coral-600 text-white py-4 rounded-xl font-bold hover:from-primary-700 hover:to-coral-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play size={20} />
              Start Interview
            </button>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="text-primary-600" />
          Recent Sessions
        </h2>
        <div className="space-y-4">
          {recentSessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  session.score >= 85 ? "bg-green-100 text-green-600" :
                  session.score >= 70 ? "bg-yellow-100 text-yellow-600" :
                  "bg-orange-100 text-orange-600"
                }`}>
                  <Award size={24} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{session.type} - {session.role}</div>
                  <div className="text-sm text-gray-600">{session.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{session.score}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Placeholder Notice */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200 text-center">
        <Sparkles size={48} className="mx-auto text-yellow-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Feature Coming Soon</h3>
        <p className="text-gray-700">
          Full AI-powered interview simulation with real-time feedback will be available soon!
        </p>
      </div>
    </div>
  );
}

