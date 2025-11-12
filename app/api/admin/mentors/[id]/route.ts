import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Mentor from "@/models/Mentor";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const mentor = await Mentor.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({ mentor });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update mentor" }, { status: 500 });
  }
}

