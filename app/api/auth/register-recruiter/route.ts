import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, email, password, companyName, companyWebsite, position } = body;

    // Validate required fields
    if (!fullName || !email || !password || !companyName || !position) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create recruiter user (unverified)
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "recruiter",
      verified: false, // Needs admin approval
      companyName,
      companyWebsite,
      position,
      educationLevel: "Not Applicable",
      experienceLevel: "Not Applicable",
      preferredTrack: "Recruitment",
      targetRoles: ["Recruiter"],
      skills: [],
      subscription: {
        tier: "pro", // Recruiters get pro by default
        status: "active",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Recruiter registration submitted for admin approval",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering recruiter:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}

