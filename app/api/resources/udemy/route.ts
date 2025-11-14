import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { searchUdemyCourses, getUdemyCoursesByCategory } from "@/lib/udemyAPI";

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

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    // Build search query from user preferences if not provided
    let query = searchQuery;
    if (!query && !category) {
      const preferredTrack = user.preferredTrack || user.targetRoles?.[0] || "programming";
      const skills = user.skills || [];
      query = [preferredTrack, ...skills.slice(0, 3)].join(" ");
    }

    try {
      let result;
      if (category) {
        result = await getUdemyCoursesByCategory(category, page, pageSize);
      } else {
        result = await searchUdemyCourses(query, page, pageSize);
      }

      return NextResponse.json({
        courses: result.courses || [],
        count: result.count || 0,
        hasMore: result.hasMore || false,
        page,
        pageSize,
      });
    } catch (apiError: any) {
      console.error("RapidAPI Udemy error:", apiError);
      
      // Check if it's a credentials error
      if (apiError.message?.includes("RapidAPI") || apiError.message?.includes("RAPIDAPI_KEY")) {
        return NextResponse.json(
          {
            error: "RapidAPI credentials not configured",
            message: "Please configure RAPIDAPI_KEY in your environment variables.",
            courses: [],
          },
          { status: 401 }
        );
      }
      
      // Check if it's a rate limit error
      if (apiError.message?.includes("rate limit") || apiError.message?.includes("429")) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: "RapidAPI rate limit exceeded. Please try again later or upgrade your RapidAPI plan.",
            courses: [],
          },
          { status: 429 }
        );
      }
      
      // Return error with helpful message
      return NextResponse.json(
        {
          error: "Failed to fetch Udemy courses",
          message: apiError.message || "RapidAPI is currently unavailable. Please check your API key.",
          courses: [],
          details: process.env.NODE_ENV === "development" ? apiError.message : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching Udemy courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error.message },
      { status: 500 }
    );
  }
}
