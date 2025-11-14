"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import InterviewCard from "@/components/ai-interview/InterviewCard";
import { AIInterview } from "@/types";
import {
  EXPERIENCE_LEVELS,
  INTERVIEW_TYPES,
} from "@/constants/aiInterview";
import Link from "next/link";
import { ChevronRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";

interface InterviewResponse {
  myInterviews: AIInterview[];
  latestInterviews: AIInterview[];
}

export default function InterviewsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [interviews, setInterviews] = useState<AIInterview[]>([]);
  const [latestInterviews, setLatestInterviews] = useState<AIInterview[]>([]);

  const [form, setForm] = useState({
    role: "",
    level: "Mid-level",
    type: "technical",
    techstack: "",
    amount: 8,
  });

  useEffect(() => {
    async function loadInterviews() {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const response = await fetch("/api/ai-interviews");

        if (response.status === 403) {
          setAccessDenied(true);
          setEligible(false);
          return;
        }

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = (await response.json()) as InterviewResponse;
        setInterviews(data.myInterviews);
        setLatestInterviews(data.latestInterviews);
        setAccessDenied(false);
        setEligible(true);
      } catch (error) {
        console.error("Failed to load interviews", error);
        toast.error("We couldn't load interviews right now.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      loadInterviews();
    }
  }, [session, status]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.role.trim()) {
      toast.error("Please provide a role to tailor the interview.");
      return;
    }

    try {
      setCreating(true);
      const response = await fetch("/api/ai-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role,
          level: form.level,
          type: form.type,
          techstack: form.techstack,
          amount: form.amount,
        }),
      });

      if (response.status === 403) {
        setAccessDenied(true);
        setEligible(false);
        toast.error("Upgrade to Pro or Ultimate to access AI interviews.");
        return;
      }

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setInterviews((prev) => [data.interview, ...prev]);
      toast.success("Interview generated successfully!");
      setForm((prev) => ({
        ...prev,
        role: "",
        techstack: "",
      }));
    } catch (error) {
      console.error("Failed to generate interview", error);
      toast.error("We couldn't generate this interview. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">
            Preparing your interview workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!eligible && !loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg border-2 border-gray-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-coral-600 text-white shadow-lg mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Unlock AI Mock Interviews
          </h1>
          <p className="text-base text-gray-600 mb-6">
            Practice with voice-powered interviews and get actionable feedback.
            Upgrade to the Pro or Ultimate plan to enable this feature on your
            account.
          </p>
          <Link
            href="/dashboard/settings?tab=subscription"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-coral-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            View Plans
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            AI Mock Interviews
          </p>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Practice smarter with voice-powered interviews
        </h1>
        <p className="max-w-2xl text-base text-gray-600">
          Generate tailored interview question sets based on your target role,
          run a live voice interview with our AI interviewer, and receive
          structured feedback on the spot.
        </p>
      </div>

      {/* Create Interview Form */}
      <section className="rounded-3xl bg-white p-8 shadow-lg border-2 border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Create a new interview
          </h2>
          <p className="text-sm text-gray-600">
            Provide a few details and let our AI generate a focused interview
            scenario.
          </p>
        </div>

        <form
          onSubmit={handleGenerate}
          className="grid gap-6 md:grid-cols-2 md:gap-8"
        >
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
              Target role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="level"
              className="block text-sm font-semibold text-gray-700"
            >
              Experience level
            </label>
            <select
              id="level"
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="type"
              className="block text-sm font-semibold text-gray-700"
            >
              Interview focus
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
            >
              {INTERVIEW_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="techstack"
              className="block text-sm font-semibold text-gray-700"
            >
              Tech stack (comma separated)
            </label>
            <input
              id="techstack"
              name="techstack"
              type="text"
              value={form.techstack}
              onChange={handleChange}
              placeholder="React, TypeScript, Next.js"
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-gray-700"
            >
              Number of questions: {form.amount}
            </label>
            <input
              id="amount"
              name="amount"
              type="range"
              min={3}
              max={12}
              value={form.amount}
              onChange={handleChange}
              className="w-full accent-primary-600"
            />
            <div className="text-sm text-gray-500">
              {form.amount} questions will be generated.
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-coral-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate interview
            </button>
          </div>
        </form>
      </section>

      {/* Your Interviews */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Your interviews
          </h2>
          {interviews.length > 0 && (
            <p className="text-sm text-gray-500">
              {interviews.length} saved interview
              {interviews.length === 1 ? "" : "s"}
            </p>
          )}
        </div>

        {interviews.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600">
              Generate your first mock interview to see it listed here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                href={`/dashboard/interviews/${interview.id}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Community Interviews */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Practice with community scenarios
          </h2>
          <p className="text-sm text-gray-500">
            Trending interviews from fellow Upscale users
          </p>
        </div>

        {latestInterviews.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              New interviews will appear here as the community creates them.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {latestInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                href={`/dashboard/interviews/${interview.id}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
