import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Interview from "@/models/Interview";
import InterviewFeedback from "@/models/InterviewFeedback";
import {
  generateInterviewQuestions,
  getRandomCoverTheme,
  isProTier,
  normalizeTechstack,
} from "@/lib/aiInterview";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("subscription");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tier = user.subscription?.tier;
    if (!isProTier(tier)) {
      return NextResponse.json(
        { error: "This feature is available for Pro and Ultimate users only." },
        { status: 403 }
      );
    }

    const myInterviewsDocs = await Interview.find({
      userId: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const latestInterviewsDocs = await Interview.find({
      userId: { $ne: user._id },
      finalized: true,
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const interviewIds = [
      ...myInterviewsDocs.map((doc) => doc._id),
      ...latestInterviewsDocs.map((doc) => doc._id),
    ];

    let feedbackDocs: any[] = [];
    if (interviewIds.length) {
      feedbackDocs = await InterviewFeedback.find({
        interviewId: { $in: interviewIds },
        userId: user._id,
      })
        .select("interviewId totalScore finalAssessment createdAt")
        .lean();
    }

    const feedbackMap = feedbackDocs.reduce<Record<string, any>>((acc, doc) => {
      acc[doc.interviewId.toString()] = {
        totalScore: doc.totalScore,
        finalAssessment: doc.finalAssessment,
        createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
      };
      return acc;
    }, {});

    const serialize = (records: any[]) =>
      records.map((record) => ({
        id: record._id.toString(),
        userId: record.userId.toString(),
        role: record.role,
        type: record.type,
        level: record.level,
        techstack: record.techstack,
        questions: record.questions,
        finalized: record.finalized,
        coverTheme: record.coverTheme,
        createdAt: record.createdAt?.toISOString?.() ?? record.createdAt,
        updatedAt: record.updatedAt?.toISOString?.() ?? record.updatedAt,
        feedback: feedbackMap[record._id.toString()] || null,
      }));

    return NextResponse.json({
      myInterviews: serialize(myInterviewsDocs),
      latestInterviews: serialize(latestInterviewsDocs),
    });
  } catch (error) {
    console.error("AI interview GET error:", error);
    return NextResponse.json(
      { error: "Failed to load interviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const role = String(body.role || "").trim();
    const level = String(body.level || "").trim();
    const type = String(body.type || "technical").trim();
    const amount = Math.min(Math.max(Number(body.amount) || 8, 3), 12);
    const techstack = normalizeTechstack(body.techstack || []);

    if (!role || !level) {
      return NextResponse.json(
        { error: "Role and level are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("subscription");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tier = user.subscription?.tier;
    if (!isProTier(tier)) {
      return NextResponse.json(
        { error: "This feature is available for Pro and Ultimate users only." },
        { status: 403 }
      );
    }

    const questions = await generateInterviewQuestions({
      role,
      level,
      techstack,
      type,
      amount,
    });

    if (!questions.length) {
      return NextResponse.json(
        { error: "Failed to generate interview questions." },
        { status: 500 }
      );
    }

    const interview = await Interview.create({
      userId: user._id,
      role,
      type,
      level,
      techstack,
      questions,
      finalized: true,
      coverTheme: getRandomCoverTheme(),
    });

    return NextResponse.json(
      {
        interview: {
          id: interview._id.toString(),
          userId: interview.userId.toString(),
          role: interview.role,
          type: interview.type,
          level: interview.level,
          techstack: interview.techstack,
          questions: interview.questions,
          finalized: interview.finalized,
          coverTheme: interview.coverTheme,
          createdAt: interview.createdAt?.toISOString?.() ?? interview.createdAt,
          updatedAt: interview.updatedAt?.toISOString?.() ?? interview.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("AI interview POST error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate interview";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}


