import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";
import User from "@/models/User";
import { auth } from "@/auth";
import { TIER_LIMITS } from "@/types";

// Mock roadmap templates (In production, this would use AI)
const roadmapTemplates: Record<string, any> = {
  "Frontend Development": {
    stages: [
      {
        name: "Prerequisites",
        goals: [
          "Master HTML & CSS fundamentals",
          "Learn JavaScript basics",
          "Understand Git & GitHub",
          "Build 3 static websites",
        ],
        resources: [],
        projects: [],
        estimatedWeeks: 6,
        completed: false,
      },
      {
        name: "Core Skills",
        goals: [
          "Master React fundamentals",
          "Learn TypeScript",
          "Understand state management",
          "Build responsive designs",
          "API integration basics",
        ],
        resources: [],
        projects: [],
        estimatedWeeks: 10,
        completed: false,
      },
      {
        name: "Advanced Topics",
        goals: [
          "Advanced React patterns",
          "Testing (Jest, RTL)",
          "Performance optimization",
          "Deployment & CI/CD",
          "Build production apps",
        ],
        resources: [],
        projects: [],
        estimatedWeeks: 8,
        completed: false,
      },
    ],
  },
  "Full Stack Development": {
    stages: [
      {
        name: "Prerequisites",
        goals: [
          "HTML, CSS, JavaScript fundamentals",
          "Git version control",
          "Command line basics",
          "Web architecture understanding",
        ],
        resources: [],
        projects: [],
        estimatedWeeks: 6,
        completed: false,
      },
      {
        name: "Core Skills",
        goals: [
          "React or Vue.js",
          "Node.js & Express",
          "Database (MongoDB/PostgreSQL)",
          "RESTful APIs",
          "Authentication & Authorization",
        ],
        resources: [],
        projects: [],
        estimatedWeeks: 12,
        completed: false,
      },
      {
        name: "Advanced Topics",
        goals: [
          "Microservices architecture",
          "Docker & Kubernetes",
          "Testing & CI/CD",
          "Cloud deployment (AWS/Azure)",
          "Security best practices",
        ],
        resources: [],
        projects: [],
        estimatedWeeks: 10,
        completed: false,
      },
    ],
  },
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
    const currentUsage = user.usageLimits?.careerRoadmaps || 0;
    const limit = TIER_LIMITS[tier].careerRoadmaps;

    if (currentUsage >= limit) {
      return NextResponse.json(
        { error: "Usage limit reached. Please upgrade your plan." },
        { status: 403 }
      );
    }

    const { targetRole } = await request.json();

    if (!targetRole) {
      return NextResponse.json(
        { error: "Target role is required" },
        { status: 400 }
      );
    }

    // Get template or generate from user's preferred track
    const template =
      roadmapTemplates[targetRole] ||
      roadmapTemplates[user.preferredTrack] ||
      roadmapTemplates["Frontend Development"];

    // Create roadmap
    const roadmap = await Roadmap.create({
      userId: user._id,
      targetRole,
      stages: template.stages,
      progress: 0,
      status: "active",
    });

    // Increment usage
    await User.findByIdAndUpdate(user._id, {
      $inc: { "usageLimits.careerRoadmaps": 1 },
    });

    return NextResponse.json({ roadmap }, { status: 201 });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}

