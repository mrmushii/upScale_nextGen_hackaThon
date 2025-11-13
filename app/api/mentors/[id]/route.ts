import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mentor from "@/models/Mentor";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const mentor = await Mentor.findById(params.id).lean();

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    return NextResponse.json({ mentor });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}

