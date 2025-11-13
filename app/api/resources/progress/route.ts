import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import CourseProgress from "@/models/CourseProgress";

// Get user's course progress
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const progress = await CourseProgress.find({
      userId: session.user.id,
    }).sort({ lastAccessed: -1 });

    return NextResponse.json({ progress });
  } catch (error: any) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress", details: error.message },
      { status: 500 }
    );
  }
}

// Update course progress
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { courseId, courseType, courseTitle, courseThumbnail, videoId, progress, lastWatchedTimestamp, duration } = body;

    if (!courseId || !courseType || !courseTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate completion status
    const completed = progress >= 90; // Consider 90%+ as completed

    const courseProgress = await CourseProgress.findOneAndUpdate(
      {
        userId: session.user.id,
        courseId,
      },
      {
        userId: session.user.id,
        courseId,
        courseType,
        courseTitle,
        courseThumbnail,
        videoId,
        progress: Math.min(100, Math.max(0, progress || 0)),
        lastWatchedTimestamp: lastWatchedTimestamp || 0,
        duration,
        completed,
        lastAccessed: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    return NextResponse.json({ progress: courseProgress });
  } catch (error: any) {
    console.error("Error updating course progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress", details: error.message },
      { status: 500 }
    );
  }
}

