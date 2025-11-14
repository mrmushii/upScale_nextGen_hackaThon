import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const userId = (session.user as any).id;
    const extension = file.name.split(".").pop();
    const filename = `avatar-${userId}-${timestamp}.${extension}`;

    // Save to public/uploads directory
    const path = join(process.cwd(), "public", "uploads", filename);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, buffer);

    const avatarUrl = `/uploads/${filename}`;

    // Update user in database
    await connectDB();
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    return NextResponse.json({ 
      success: true,
      avatarUrl
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}


