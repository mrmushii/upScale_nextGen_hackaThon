import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { TIER_LIMITS } from "@/types";

// Mock interview questions (In production, use AI to generate)
const interviewQuestions = {
  technical: {
    frontend: [
      { question: "What is the virtual DOM in React?", difficulty: "easy" },
      { question: "Explain the difference between state and props", difficulty: "easy" },
      { question: "How does useEffect work in React?", difficulty: "medium" },
      { question: "What is closure in JavaScript?", difficulty: "medium" },
      { question: "Explain React's reconciliation algorithm", difficulty: "hard" },
    ],
    backend: [
      { question: "What is REST API?", difficulty: "easy" },
      { question: "Explain middleware in Express.js", difficulty: "medium" },
      { question: "What is database indexing?", difficulty: "medium" },
      { question: "How would you design a scalable API?", difficulty: "hard" },
    ],
  },
  behavioral: [
    { question: "Tell me about a challenging project you worked on", difficulty: "medium" },
    { question: "How do you handle disagreements in a team?", difficulty: "medium" },
    { question: "Describe a time you failed and what you learned", difficulty: "medium" },
    { question: "Where do you see yourself in 5 years?", difficulty: "easy" },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check usage limits
    const tier = user.subscription?.tier || "basic";
    const currentUsage = user.usageLimits?.mockInterviews || 0;
    const limit = TIER_LIMITS[tier].mockInterviews;

    if (currentUsage >= limit) {
      return NextResponse.json(
        {
          error: "Usage limit reached. Please upgrade your plan.",
          current: currentUsage,
          limit,
        },
        { status: 403 }
      );
    }

    const { type, role, difficulty } = await request.json();

    let questions = [];
    
    if (type === "technical") {
      const roleQuestions = interviewQuestions.technical[role as keyof typeof interviewQuestions.technical] || interviewQuestions.technical.frontend;
      questions = roleQuestions.filter(q => 
        difficulty === "all" || q.difficulty === difficulty
      ).slice(0, 5);
    } else {
      questions = interviewQuestions.behavioral.slice(0, 5);
    }

    // Increment usage
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { "usageLimits.mockInterviews": 1 },
    });

    return NextResponse.json({
      sessionId: Date.now().toString(),
      questions,
      usage: {
        current: currentUsage + 1,
        limit,
      },
    });
  } catch (error) {
    console.error("Interview start error:", error);
    return NextResponse.json(
      { error: "Failed to start interview" },
      { status: 500 }
    );
  }
}

