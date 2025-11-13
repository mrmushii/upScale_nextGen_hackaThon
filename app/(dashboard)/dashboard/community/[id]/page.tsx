"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ThumbsUp,
  MessageCircle,
  Check,
  ArrowLeft,
  Trash2,
  Edit,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Answer {
  _id: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
  userId: {
    _id: string;
    fullName: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  views: number;
  answers: Answer[];
  isAnswered: boolean;
  acceptedAnswerId?: string;
  userId: {
    _id: string;
    fullName: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/community/questions/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setQuestion(data.question);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session?.user) {
      alert("Please sign in to answer");
      return;
    }

    if (!answerContent.trim()) {
      alert("Please enter an answer");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/questions/${params.id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent }),
      });

      if (res.ok) {
        setAnswerContent("");
        fetchQuestion();
      } else {
        alert("Failed to post answer");
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      alert("Error posting answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteQuestion = async () => {
    if (!session?.user) {
      alert("Please sign in to upvote");
      return;
    }

    try {
      const res = await fetch(`/api/community/questions/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote" }),
      });

      if (res.ok) {
        fetchQuestion();
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleUpvoteAnswer = async (answerId: string) => {
    if (!session?.user) {
      alert("Please sign in to upvote");
      return;
    }

    try {
      const res = await fetch(`/api/community/questions/${params.id}/answers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerId, action: "upvote" }),
      });

      if (res.ok) {
        fetchQuestion();
      }
    } catch (error) {
      console.error("Error upvoting answer:", error);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!session?.user || !question) {
      return;
    }

    if (question.userId._id !== (session.user as any).id) {
      alert("Only the question owner can accept answers");
      return;
    }

    try {
      const res = await fetch(`/api/community/questions/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acceptAnswer", answerId }),
      });

      if (res.ok) {
        fetchQuestion();
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!confirm("Are you sure you want to delete this answer?")) {
      return;
    }

    try {
      const res = await fetch(
        `/api/community/questions/${params.id}/answers?answerId=${answerId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        fetchQuestion();
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Question not found</p>
        <Link href="/dashboard/community" className="text-primary-600 hover:text-primary-700">
          Back to Community
        </Link>
      </div>
    );
  }

  const isQuestionOwner = question.userId._id === (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/community"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>Back to Community</span>
      </Link>

      {/* Question */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleUpvoteQuestion}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ThumbsUp size={24} className="text-gray-600" />
            </button>
            <span className="text-2xl font-bold text-gray-900">{question.upvotes}</span>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>
            <div className="prose max-w-none mb-6 text-gray-700 whitespace-pre-wrap">
              {question.content}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                {question.userId.avatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={question.userId.avatar}
                      alt={question.userId.fullName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                    {question.userId.fullName.charAt(0)}
                  </div>
                )}
                <span>Asked by {question.userId.fullName}</span>
              </div>
              <span>•</span>
              <span>{formatTime(question.createdAt)}</span>
              <span>•</span>
              <span>{question.views} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {question.answers.length} Answer{question.answers.length !== 1 ? "s" : ""}
        </h2>

        {question.answers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No answers yet. Be the first to answer!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {question.answers
              .sort((a, b) => {
                // Accepted answers first, then by upvotes
                if (a.isAccepted && !b.isAccepted) return -1;
                if (!a.isAccepted && b.isAccepted) return 1;
                return b.upvotes - a.upvotes;
              })
              .map((answer) => (
                <div
                  key={answer._id}
                  className={`p-6 rounded-xl border-2 ${
                    answer.isAccepted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleUpvoteAnswer(answer._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <ThumbsUp size={20} className="text-gray-600" />
                      </button>
                      <span className="font-bold text-gray-900">{answer.upvotes}</span>
                    </div>

                    <div className="flex-1">
                      <div className="prose max-w-none mb-4 text-gray-700 whitespace-pre-wrap">
                        {answer.content}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          {answer.userId.avatar ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={answer.userId.avatar}
                                alt={answer.userId.fullName}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                              {answer.userId.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">
                              {answer.userId.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(answer.createdAt)}
                            </div>
                          </div>
                          {answer.isAccepted && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Check size={14} />
                              Accepted Answer
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isQuestionOwner && !question.isAnswered && (
                            <button
                              onClick={() => handleAcceptAnswer(answer._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                            >
                              Accept Answer
                            </button>
                          )}
                          {(answer.userId._id === (session?.user as any)?.id ||
                            userRole === "admin") && (
                            <button
                              onClick={() => handleDeleteAnswer(answer._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Answer Form */}
      {session?.user && (
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Answer</h2>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Write your answer here..."
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none mb-4"
          />
          <button
            onClick={handleSubmitAnswer}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
          >
            <Send size={20} />
            {submitting ? "Posting..." : "Post Answer"}
          </button>
        </div>
      )}

      {!session?.user && (
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <p className="text-gray-600 mb-4">Please sign in to answer this question</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}

