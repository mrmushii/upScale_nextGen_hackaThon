import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import CourseBookmark from "@/models/CourseBookmark";

// Get user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const bookmarks = await CourseBookmark.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ bookmarks });
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks", details: error.message },
      { status: 500 }
    );
  }
}

// Add or remove bookmark
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { courseId, courseType, courseTitle, courseThumbnail, videoId, url, action } = body;

    if (!courseId || !courseType || !courseTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action === "remove") {
      await CourseBookmark.findOneAndDelete({
        userId: session.user.id,
        courseId,
      });
      return NextResponse.json({ message: "Bookmark removed", bookmarked: false });
    }

    // Add bookmark
    const bookmark = await CourseBookmark.findOneAndUpdate(
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
        url,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return NextResponse.json({ bookmark, bookmarked: true });
  } catch (error: any) {
    console.error("Error updating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark", details: error.message },
      { status: 500 }
    );
  }
}

