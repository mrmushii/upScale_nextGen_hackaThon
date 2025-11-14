import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { deleteResumeFile } from "@/lib/resumeFileService";

// GET - Get a specific resume
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    await connectDB();

    const resume = await Resume.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ resume });
  } catch (error: any) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a resume
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    await connectDB();

    const resume = await Resume.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    if (resume.filePath) {
      await deleteResumeFile(resume.filePath);
    }
    if (resume.imagePath) {
      await deleteResumeFile(resume.imagePath);
    }

    // Delete from database
    await Resume.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume", details: error.message },
      { status: 500 }
    );
  }
}

