import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword } = body;

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with basic tier by default
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      educationLevel: "Bachelor's Degree",
      experienceLevel: "Entry Level (0-1 years)",
      preferredTrack: "Frontend Development",
      targetRoles: [],
      skills: [],
      country: "Bangladesh",
      city: "Dhaka",
      subscription: {
        tier: "basic",
        status: "active",
        startDate: new Date(),
        autoRenew: false,
      },
      usageLimits: {
        evaluationInterviews: 0,
        careerRoadmaps: 0,
        mockInterviews: 0,
        cvAnalyses: 0,
        mentorSessions: 0,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

