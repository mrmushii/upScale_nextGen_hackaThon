import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Roadmap from "@/models/Roadmap";

export async function GET(request: NextRequest) {
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

    // Get user's active roadmap
    const roadmap = await Roadmap.findOne({
      userId: session.user.id,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!roadmap) {
      return NextResponse.json({
        suggestions: [],
        message: "No active roadmap found. Generate a roadmap to get course suggestions.",
      });
    }

    // Get current stage
    const currentStage = roadmap.stages.find((stage: any) => !stage.completed);
    const stageName = currentStage?.name || roadmap.stages[0]?.name || "";

    // Build suggestions based on roadmap stage
    const suggestions = {
      stageName,
      udemyCourses: [],
      youtubeCourses: [],
      message: `Based on your current roadmap stage: "${stageName}"`,
    };

    // Fetch Udemy courses related to current stage
    try {
      const udemyResponse = await fetch(
        `${request.nextUrl.origin}/api/resources/udemy`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );
      if (udemyResponse.ok) {
        const udemyData = await udemyResponse.json();
        suggestions.udemyCourses = (udemyData.courses || []).slice(0, 5); // Top 5
      }
    } catch (error) {
      console.error("Error fetching Udemy courses:", error);
    }

    // Fetch YouTube courses related to current stage
    try {
      const youtubeResponse = await fetch(
        `${request.nextUrl.origin}/api/resources/youtube`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );
      if (youtubeResponse.ok) {
        const youtubeData = await youtubeResponse.json();
        suggestions.youtubeCourses = (youtubeData.courses || []).slice(0, 5); // Top 5
      }
    } catch (error) {
      console.error("Error fetching YouTube courses:", error);
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("Error generating course suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions", details: error.message },
      { status: 500 }
    );
  }
}

