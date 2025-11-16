import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Interview, { IInterview } from "@/models/Interview";
import { isProTier } from "@/lib/aiInterview";

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

    const interview = (await Interview.findById(id).lean()) as (IInterview & {
      _id: string;
    }) | null;
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("AI interview detail error:", error);
    return NextResponse.json(
      { error: "Failed to load interview" },
      { status: 500 }
    );
  }
}


