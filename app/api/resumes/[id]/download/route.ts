import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { readFile } from "fs/promises";
import { join } from "path";

// GET - Download a resume file
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

    // Read file
    const relativePath = resume.filePath.startsWith("/uploads")
      ? resume.filePath.substring(1)
      : resume.filePath;
    const fullPath = join(process.cwd(), "public", relativePath);
    const fileBuffer = await readFile(fullPath);

    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": resume.mimeType,
        "Content-Disposition": `attachment; filename="${resume.originalFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error downloading resume:", error);
    return NextResponse.json(
      { error: "Failed to download resume", details: error.message },
      { status: 500 }
    );
  }
}

