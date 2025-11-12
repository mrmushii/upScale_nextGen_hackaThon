import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { TIER_LIMITS } from "@/types";

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
    const currentUsage = user.usageLimits?.cvAnalyses || 0;
    const limit = TIER_LIMITS[tier].cvAnalyses;

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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file content (basic text extraction)
    const text = await file.text();

    // Basic analysis (rule-based, can be enhanced with AI)
    const analysis = analyzeResume(text, tier);

    // Increment usage
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { "usageLimits.cvAnalyses": 1 },
    });

    return NextResponse.json({
      analysis,
      usage: {
        current: currentUsage + 1,
        limit,
      },
    });
  } catch (error) {
    console.error("CV analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze CV" },
      { status: 500 }
    );
  }
}

function analyzeResume(
  text: string,
  tier: "basic" | "pro" | "ultimate"
): any {
  const wordCount = text.split(/\s+/).length;
  const hasEmail = /\S+@\S+\.\S+/.test(text);
  const hasPhone = /\+?\d{10,}/.test(text);
  
  // Common tech keywords
  const keywords = [
    "React",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Python",
    "Java",
    "MongoDB",
    "SQL",
    "AWS",
    "Docker",
    "Git",
    "HTML",
    "CSS",
  ];

  const foundKeywords = keywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );

  const missingKeywords = keywords.filter(
    (keyword) => !text.toLowerCase().includes(keyword.toLowerCase())
  );

  // Calculate ATS score
  let atsScore = 50;
  if (hasEmail) atsScore += 10;
  if (hasPhone) atsScore += 10;
  if (foundKeywords.length >= 5) atsScore += 20;
  if (wordCount >= 200 && wordCount <= 800) atsScore += 10;

  const strengths = [];
  const improvements = [];

  if (hasEmail) strengths.push("Contact email provided");
  else improvements.push("Add your email address");

  if (hasPhone) strengths.push("Phone number included");
  else improvements.push("Include your phone number");

  if (foundKeywords.length >= 5)
    strengths.push("Good technical skills coverage");
  else improvements.push("Add more relevant technical skills");

  if (wordCount >= 200 && wordCount <= 800)
    strengths.push("Appropriate resume length");
  else if (wordCount < 200) improvements.push("Resume is too short, add more details");
  else improvements.push("Resume is too long, focus on key points");

  // Pro and Ultimate get detailed feedback
  const detailedFeedback = tier !== "basic" ? {
    formatting: {
      score: 75,
      suggestions: [
        "Use consistent bullet points",
        "Ensure proper heading hierarchy",
        "Add section dividers",
      ],
    },
    content: {
      score: 80,
      suggestions: [
        "Quantify achievements with numbers",
        "Use action verbs (led, developed, improved)",
        "Include measurable impact",
      ],
    },
    keywords: {
      found: foundKeywords,
      missing: missingKeywords.slice(0, 10),
      density: Math.round((foundKeywords.length / keywords.length) * 100),
    },
  } : null;

  return {
    atsScore,
    overallScore: atsScore + 5,
    strengths,
    improvements,
    keywords: {
      found: foundKeywords.length,
      recommended: keywords.length,
      missing: missingKeywords.slice(0, 5),
    },
    wordCount,
    detailedFeedback,
  };
}

