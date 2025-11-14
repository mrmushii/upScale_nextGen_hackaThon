import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { validateResumeFile } from "@/lib/resumeService";
import { saveResumeFile } from "@/lib/resumeFileService";

// GET - List all resumes for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const resumes = await Resume.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ resumes });
  } catch (error: any) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Upload a new resume
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const companyName = formData.get("companyName") as string | null;
    const jobTitle = formData.get("jobTitle") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;
    const jobListingUrl = formData.get("jobListingUrl") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Save file
    const { filePath, filename } = await saveResumeFile(file, session.user.id);

    // Note: PDF to image conversion is optional and can be done client-side
    // For now, we'll skip server-side image generation
    // Image previews can be generated client-side using PDF.js if needed

    // Create resume record
    const resume = await Resume.create({
      userId: session.user.id,
      filename,
      originalFilename: file.name,
      filePath,
      fileSize: file.size,
      mimeType: file.type,
      companyName: companyName || undefined,
      jobTitle: jobTitle || undefined,
      jobDescription: jobDescription || undefined,
      jobListingUrl: jobListingUrl || undefined,
      parsedStatus: "pending",
    });

    return NextResponse.json({
      success: true,
      resume: resume.toObject(),
    });
  } catch (error: any) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Failed to upload resume", details: error.message },
      { status: 500 }
    );
  }
}

