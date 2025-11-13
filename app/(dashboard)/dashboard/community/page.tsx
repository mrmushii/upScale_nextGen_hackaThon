"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, ThumbsUp, MessageCircle, Plus, Search, X, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  views: number;
  answers: any[];
  isAnswered: boolean;
  userId: {
    _id: string;
    fullName: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", tags: "" });

  useEffect(() => {
    fetchQuestions();
  }, [sortBy, searchQuery]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sort: sortBy,
        limit: "20",
      });
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const res = await fetch(`/api/community/questions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!session?.user) {
      alert("Please sign in to ask a question");
      return;
    }

    if (!newQuestion.title || !newQuestion.content) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      const tags = newQuestion.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const res = await fetch("/api/community/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newQuestion.title,
          content: newQuestion.content,
          tags,
        }),
      });

      if (res.ok) {
        setNewQuestion({ title: "", content: "", tags: "" });
        setShowAskModal(false);
        fetchQuestions();
      } else {
        alert("Failed to post question");
      }
    } catch (error) {
      console.error("Error posting question:", error);
      alert("Error posting question");
    }
  };

  const handleUpvote = async (questionId: string) => {
    if (!session?.user) {
      alert("Please sign in to upvote");
      return;
    }

    try {
      const res = await fetch(`/api/community/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote" }),
      });

      if (res.ok) {
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Community Q&A</h1>
          <p className="text-gray-600 mt-2">Ask questions, share knowledge, and help others</p>
        </div>
        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          <Plus size={20} />
          Ask Question
        </button>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <MessageSquare size={64} className="mx-auto mb-4 opacity-50 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No questions yet</h3>
          <p className="text-gray-600 mb-4">Be the first to ask a question!</p>
          <button
            onClick={() => setShowAskModal(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            Ask Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Link
              key={question._id}
              href={`/dashboard/community/${question._id}`}
              className="block bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
            >
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpvote(question._id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ThumbsUp size={20} className="text-gray-600" />
                  </button>
                  <span className="text-xl font-bold text-gray-900">{question.upvotes}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{question.content}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      {question.userId.avatar ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <Image
                            src={question.userId.avatar}
                            alt={question.userId.fullName}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">
                          {question.userId.fullName.charAt(0)}
                        </div>
                      )}
                      <span>Asked by {question.userId.fullName}</span>
                    </div>
                    <span>•</span>
                    <span>{formatTime(question.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      {question.answers?.length || 0} answers
                    </span>
                    <span>•</span>
                    <span>{question.views} views</span>
                    {question.isAnswered && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          ✓ Answered
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ask a Question</h2>
              <button
                onClick={() => setShowAskModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  placeholder="What's your question?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  placeholder="Provide more details about your question..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                  placeholder="e.g., React, JavaScript, Interview"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAskQuestion}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                >
                  Post Question
                </button>
                <button
                  onClick={() => setShowAskModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
