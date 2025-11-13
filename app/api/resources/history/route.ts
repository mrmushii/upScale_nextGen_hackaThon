import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import CourseProgress from "@/models/CourseProgress";

// Get user's watch history
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all courses with progress (watched history)
    const history = await CourseProgress.find({
      userId: session.user.id,
    })
      .sort({ lastAccessed: -1 })
      .limit(50); // Last 50 watched courses

    return NextResponse.json({ history });
  } catch (error: any) {
    console.error("Error fetching watch history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history", details: error.message },
      { status: 500 }
    );
  }
}

