import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateCVFromProfile, generateCVSuggestions } from "@/lib/cvGenerator";

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

    const { includeSuggestions = false } = await request.json();

    // Generate CV data
    const cvData = await generateCVFromProfile(user);

    let suggestions = null;
    if (includeSuggestions) {
      suggestions = await generateCVSuggestions(cvData);
    }

    return NextResponse.json({
      cv: cvData,
      suggestions,
    });
  } catch (error: any) {
    console.error("CV generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CV", details: error.message },
      { status: 500 }
    );
  }
}

