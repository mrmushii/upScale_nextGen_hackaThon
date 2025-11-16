import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Interview, { IInterview } from "@/models/Interview";
import InterviewFeedback, {
  IInterviewFeedback,
} from "@/models/InterviewFeedback";
import { isProTier } from "@/lib/aiInterview";
import InterviewAgent from "@/components/ai-interview/InterviewAgent";
import TechStackIcons from "@/components/ai-interview/TechStackIcons";
import { redirect } from "next/navigation";
import { Calendar, Layers, Target } from "lucide-react";

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

export default async function InterviewDetailPage({
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

  const user = await User.findById(session.user.id).select(
    "fullName subscription"
  );
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

  const feedback = (await InterviewFeedback.findOne({
    interviewId: id,
    userId: user._id,
  })
    .select("totalScore finalAssessment createdAt")
    .lean()) as
    | (IInterviewFeedback & {
        _id: string;
      })
    | null;

  const typeLabel = /mix/i.test(interview.type)
    ? "Mixed"
    : interview.type.charAt(0).toUpperCase() + interview.type.slice(1);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
                Interview Scenario
              </p>
              <h1 className="text-3xl font-bold text-slate-900 capitalize">
                {interview.role} Interview
              </h1>
              <p className="text-sm text-slate-600">
                Generated on {formatDate(interview.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600">
                <Target size={16} />
                {typeLabel} Focus
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                <Layers size={16} />
                {interview.level}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                <Calendar size={16} />
                {interview.questions?.length || 0} questions
              </span>
            </div>
          </div>

          {interview.techstack?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Tech focus
              </h3>
              <div className="mt-3">
                <TechStackIcons techStack={interview.techstack} />
              </div>
            </div>
          )}

          {feedback && (
            <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-coral-600 p-6 text-white shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Latest feedback
              </p>
              <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-3xl font-bold">{feedback.totalScore}/100</p>
                  <p className="text-sm text-white/80">
                    Taken on {formatDate(feedback.createdAt)}
                  </p>
                </div>
                <p className="max-w-xl text-sm text-white/90">
                  {feedback.finalAssessment}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <InterviewAgent
        userName={user.fullName}
        userId={user._id.toString()}
        type="interview"
        interviewId={id}
        questions={interview.questions}
      />
    </div>
  );
}


