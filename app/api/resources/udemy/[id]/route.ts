import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUdemyCourseDetails } from "@/lib/udemyAPI";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.id;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    try {
      const course = await getUdemyCourseDetails(courseId);
      return NextResponse.json({ course });
    } catch (apiError: any) {
      console.error("RapidAPI Udemy error:", apiError);
      
      if (apiError.message === "Course not found") {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      // Check if it's a credentials error
      if (apiError.message?.includes("RapidAPI") || apiError.message?.includes("RAPIDAPI_KEY")) {
        return NextResponse.json(
          {
            error: "RapidAPI credentials not configured",
            message: "Please configure RAPIDAPI_KEY in your environment variables.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to fetch course details",
          message: apiError.message || "RapidAPI is currently unavailable. Please check your API key.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching Udemy course details:", error);
    return NextResponse.json(
      { error: "Failed to fetch course details", details: error.message },
      { status: 500 }
    );
  }
}

