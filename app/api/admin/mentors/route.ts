import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Mentor from "@/models/Mentor";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const mentors = await Mentor.find().sort({ createdAt: -1 }).populate("userId", "email").lean();

    return NextResponse.json({ mentors });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch mentors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    // Create user account for mentor
    const hashedPassword = await bcrypt.hash("mentor123", 10);
    const user = await User.create({
      fullName: body.name,
      email: body.email,
      password: hashedPassword,
      role: "mentor",
      educationLevel: "Bachelor's Degree",
      experienceLevel: "Senior (5-10 years)",
      preferredTrack: "Mentorship",
      targetRoles: [],
      skills: body.skills,
      country: "Bangladesh",
      city: "Dhaka",
    });

    // Create mentor profile
    const mentor = await Mentor.create({
      userId: user._id,
      name: body.name,
      bio: body.bio,
      skills: body.skills,
      roles: body.roles,
      hourlyRate: body.hourlyRate,
      yearsOfExperience: body.yearsOfExperience,
      rating: 0,
      verified: true,
      sessionsCompleted: 0,
      status: "active",
    });

    return NextResponse.json({ mentor }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to create mentor" }, { status: 500 });
  }
}

