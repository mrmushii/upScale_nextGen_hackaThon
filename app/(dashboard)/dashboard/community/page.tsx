"use client";

import { MessageSquare, ThumbsUp, MessageCircle, Plus, Search } from "lucide-react";

const questions = [
  { title: "How to prepare for technical interviews?", author: "John Doe", replies: 12, upvotes: 45, tags: ["Interview", "Technical"], answered: true, time: "2 hours ago" },
  { title: "Best resources to learn React in 2024?", author: "Sarah Ahmed", replies: 8, upvotes: 32, tags: ["React", "Learning"], answered: false, time: "5 hours ago" },
  { title: "How to negotiate salary in Bangladesh?", author: "Karim Hassan", replies: 15, upvotes: 67, tags: ["Career", "Salary"], answered: true, time: "1 day ago" },
];

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Community Q&A</h1>
          <p className="text-gray-600 mt-2">Ask questions, share knowledge, and help others</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold">
          <Plus size={20} />
          Ask Question
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer">
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <ThumbsUp size={20} className="text-gray-600" />
                </button>
                <span className="text-xl font-bold text-gray-900">{q.upvotes}</span>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition">
                  {q.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>Asked by {q.author}</span>
                  <span>•</span>
                  <span>{q.time}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    {q.replies} answers
                  </span>
                  {q.answered && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      ✓ Answered
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

