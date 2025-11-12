import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const roadmaps = await Roadmap.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ roadmaps });
  } catch (error) {
    console.error("Roadmap fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}

