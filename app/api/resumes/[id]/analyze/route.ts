import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { readFile } from "fs/promises";
import { join } from "path";
import { extractTextFromPdf } from "@/lib/pdfParser";
import { analyzeResume } from "@/lib/resumeAnalyzer";
import { analyzeResumeEnhanced } from "@/lib/enhancedResumeAnalyzer";

/**
 * Simplified Resume Analysis API
 * 
 * Flow:
 * 1. Get resume from database
 * 2. Extract text from PDF
 * 3. Send text to Gemini API for analysis
 * 4. Save and return results
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    await connectDB();

    // Get resume from database
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

    // Get job information from request body
    const body = await request.json();
    const jobTitle = body.jobTitle || resume.jobTitle || "";
    const jobDescription = body.jobDescription || resume.jobDescription || "";

    // Update status to processing
    resume.parsedStatus = "processing";
    await resume.save();

    try {
      // Step 1: Read PDF file
      const relativePath = resume.filePath.startsWith("/uploads")
        ? resume.filePath.substring(1)
        : resume.filePath;
      const fullPath = join(process.cwd(), "public", relativePath);

      let buffer: Buffer;
      try {
        buffer = await readFile(fullPath);
      } catch (fileError: any) {
        resume.parsedStatus = "failed";
        await resume.save();
        return NextResponse.json(
          {
            error: "Resume file not found",
            details: `File at ${resume.filePath} could not be read. Please re-upload the resume.`,
          },
          { status: 404 }
        );
      }

      // Step 2: Extract text from PDF
      console.log("Extracting text from PDF...");
      const parseResult = await extractTextFromPdf(buffer);

      if (!parseResult.success || !parseResult.text) {
        resume.parsedStatus = "failed";
        await resume.save();
        return NextResponse.json(
          {
            error: "PDF Processing Error",
            details: parseResult.error || "Failed to extract text from PDF. Please ensure the PDF contains readable text.",
          },
          { status: 400 }
        );
      }

      // Save extracted text
      resume.parsedText = parseResult.text.substring(0, 100000); // Limit to 100KB

      // Step 3: Analyze resume with Gemini API (Enhanced Analysis)
      console.log("Analyzing resume with Gemini AI (Enhanced)...");
      const analysis = await analyzeResumeEnhanced(
        parseResult.text,
        jobTitle,
        jobDescription
      );

      // Step 4: Save results
      // Cast to any to allow new simplified structure
      resume.analysisResult = analysis as any;
      resume.parsedStatus = "completed";
      resume.analyzedAt = new Date();
      if (jobTitle) resume.jobTitle = jobTitle;
      if (jobDescription) resume.jobDescription = jobDescription;
      await resume.save();

      return NextResponse.json({
        success: true,
        analysis,
        resume: resume.toObject(),
      });
    } catch (analysisError: any) {
      // Mark as failed
      resume.parsedStatus = "failed";
      await resume.save();

      console.error("Resume analysis error:", {
        resumeId: resume._id,
        error: analysisError.message,
      });

      return NextResponse.json(
        {
          error: "Analysis Failed",
          details: analysisError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume", details: error.message },
      { status: 500 }
    );
  }
}
