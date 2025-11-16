import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Interview from "@/models/Interview";
import InterviewFeedback from "@/models/InterviewFeedback";
import {
  generateInterviewFeedback,
  isProTier,
} from "@/lib/aiInterview";

function serializeFeedback(record: any) {
  if (!record) return null;

  return {
    id: record._id.toString(),
    interviewId: record.interviewId.toString(),
    userId: record.userId.toString(),
    totalScore: record.totalScore,
    categoryScores: record.categoryScores,
    strengths: record.strengths,
    areasForImprovement: record.areasForImprovement,
    finalAssessment: record.finalAssessment,
    createdAt: record.createdAt?.toISOString?.() ?? record.createdAt,
    updatedAt: record.updatedAt?.toISOString?.() ?? record.updatedAt,
  };
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

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

    const feedback = await InterviewFeedback.findOne({
      interviewId: id,
      userId: user._id,
    }).lean();

    if (!feedback) {
      return NextResponse.json({ feedback: null }, { status: 200 });
    }

    return NextResponse.json({ feedback: serializeFeedback(feedback) });
  } catch (error) {
    console.error("AI interview feedback GET error:", error);
    return NextResponse.json(
      { error: "Failed to load feedback" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const transcript = Array.isArray(body.transcript) ? body.transcript : [];

    if (!transcript.length) {
      return NextResponse.json(
        { error: "Interview transcript is required." },
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

    const interview = await Interview.findById(id).lean();
    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const sanitizedTranscript = transcript
      .map((item: { role?: unknown; content?: unknown }) => ({
        role: String(item.role || "").slice(0, 32),
        content: String(item.content || "").slice(0, 2000),
      }))
      .filter(
        (item: { role: string; content: string }) => item.role && item.content
      );

    if (!sanitizedTranscript.length) {
      return NextResponse.json(
        { error: "Valid transcript entries are required." },
        { status: 400 }
      );
    }

    const feedbackObject = await generateInterviewFeedback({
      transcript: sanitizedTranscript,
    });

    const feedbackDoc = await InterviewFeedback.findOneAndUpdate(
      { interviewId: id, userId: user._id },
      {
        interviewId: id,
        userId: user._id,
        totalScore: feedbackObject.totalScore,
        categoryScores: feedbackObject.categoryScores,
        strengths: feedbackObject.strengths,
        areasForImprovement: feedbackObject.areasForImprovement,
        finalAssessment: feedbackObject.finalAssessment,
        transcript: sanitizedTranscript,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json(
      { feedback: serializeFeedback(feedbackDoc?.toObject()) },
      { status: 201 }
    );
  } catch (error) {
    console.error("AI interview feedback POST error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}


