import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";
import User from "@/models/User";
import { auth } from "@/auth";
import { TIER_LIMITS } from "@/types";
import { generatePersonalizedRoadmap, calculateRoadmapProgress } from "@/lib/roadmapGenerator";
import { generateRoadmapWithGemini } from "@/lib/geminiAI";
import { generateInteractiveRoadmap } from "@/lib/geminiAIEnhanced";
import { checkProfileCompletion } from "@/lib/profileCompletion";

// Legacy templates for reference (now using AI generator)
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

    // Check profile completion
    const completion = checkProfileCompletion(user);
    if (!completion.isComplete) {
      return NextResponse.json(
        {
          error: "Profile incomplete",
          message: "Please complete your profile before generating a roadmap.",
          completion: completion,
        },
        { status: 403 }
      );
    }

    // Check usage limits
    const tier = user.subscription?.tier || "basic";
    const currentUsage = user.usageLimits?.careerRoadmaps || 0;
    const limit = TIER_LIMITS[tier].careerRoadmaps;

    console.log("Usage check:", {
      tier,
      currentUsage,
      limit,
      canGenerate: currentUsage < limit,
    });

    if (currentUsage >= limit && limit !== Infinity) {
      // Check if user has existing roadmaps they can delete
      const existingRoadmaps = await Roadmap.countDocuments({ userId: user._id });
      
      return NextResponse.json(
        {
          error: "Usage limit reached. Please upgrade your plan or delete an existing roadmap.",
          current: currentUsage,
          limit,
          tier,
          existingRoadmaps,
          message: `You've used ${currentUsage} of ${limit} roadmaps allowed on the ${tier} plan.`,
        },
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

    // Try Gemini AI with interactive exercises first
    let stages;
    let geminiUsed = false;
    try {
      console.log("Attempting to generate roadmap with Gemini AI...");
      console.log("User profile:", {
        skills: user.skills,
        preferredTrack: user.preferredTrack,
        experienceLevel: user.experienceLevel,
        targetRole,
      });

      stages = await generateInteractiveRoadmap({
        skills: user.skills || [],
        preferredTrack: user.preferredTrack,
        experienceLevel: user.experienceLevel,
        targetRole,
      });
      
      // If Gemini fails or returns null/empty, use fallback
      if (!stages || stages.length === 0) {
        console.warn("Gemini returned null or empty stages");
        throw new Error("Gemini returned null or empty");
      }
      
      geminiUsed = true;
      console.log("✅ Successfully generated roadmap using Gemini AI");
      console.log("Stages generated:", stages.length);
    } catch (geminiError: any) {
      console.log("⚠️ Gemini AI unavailable, using template-based generation with exercises");
      console.log("Gemini error:", geminiError.message);
      console.log("Error status:", geminiError.status);
      
      // Check if it's a temporary error (503, 429)
      if (geminiError.status === 503 || geminiError.status === 429) {
        console.log("⚠️ Temporary Gemini API issue (overloaded/rate limited). Using fallback.");
      }
      
      // Fallback includes interactive exercises
      stages = generatePersonalizedRoadmap(
        {
          skills: user.skills || [],
          preferredTrack: user.preferredTrack,
          experienceLevel: user.experienceLevel,
          targetRoles: user.targetRoles || [],
        },
        targetRole
      );
      console.log("✅ Using fallback template-based roadmap with exercises");
    }

    const progress = calculateRoadmapProgress(stages);

    // Create roadmap
    const roadmap = await Roadmap.create({
      userId: user._id,
      targetRole,
      stages,
      progress,
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

