import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Interview, { IInterview } from "@/models/Interview";
import InterviewFeedback from "@/models/InterviewFeedback";
import { isProTier } from "@/lib/aiInterview";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";

const formatDate = (value: Date | string) => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

export default async function InterviewFeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const { id } = await params;

  await connectDB();

  const user = await User.findById(session.user.id).select("subscription");
  if (!user) {
    redirect("/dashboard");
  }

  if (!isProTier(user.subscription?.tier)) {
    redirect("/dashboard/interviews");
  }

  const interview = (await Interview.findById(id).lean()) as (IInterview & {
    _id: string;
  }) | null;
  if (!interview) {
    redirect("/dashboard/interviews");
  }

  const feedback = await InterviewFeedback.findOne({
    interviewId: id,
    userId: user._id,
  }).lean();

  if (!feedback) {
    redirect(`/dashboard/interviews/${id}`);
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 text-sm text-primary-600">
        <ArrowLeft className="h-4 w-4" />
        <Link href={`/dashboard/interviews/${id}`} className="font-semibold">
          Back to interview
        </Link>
      </div>

      <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
            Interview Feedback
          </p>
          <h1 className="text-3xl font-bold text-slate-900 capitalize">
            {interview.role} Interview
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {feedback.totalScore}/100 overall
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium">
              <Calendar className="h-4 w-4" />
              {formatDate(feedback.createdAt)}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-coral-500 p-8 text-white shadow-xl">
            <h2 className="text-xl font-semibold">Overall Assessment</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              {feedback.finalAssessment}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Competency Breakdown
            </h3>
            <div className="space-y-4">
              {feedback.categoryScores?.map((category) => (
                <div
                  key={category.name}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-base font-semibold text-slate-900">
                      {category.name}
                    </p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {category.score}/100
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {category.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Strengths</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              {feedback.strengths?.map((strength) => (
                <li
                  key={strength}
                  className="rounded-2xl bg-slate-100 px-4 py-2 font-medium"
                >
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">
              Areas to Improve
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              {feedback.areasForImprovement?.map((area) => (
                <li
                  key={area}
                  className="rounded-2xl bg-amber-50 px-4 py-2 font-medium text-amber-700"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}


