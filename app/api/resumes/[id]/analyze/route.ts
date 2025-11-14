import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { analyzeResumeFromFile } from "@/lib/analyzerService";

// POST - Analyze a resume against a job description
export async function POST(
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

    // Get resume
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

    // Get job description from request body
    const body = await request.json();
    const jobTitle = body.jobTitle || resume.jobTitle || "";
    const jobDescription = body.jobDescription || resume.jobDescription || "";

    if (!jobDescription && !resume.jobDescription) {
      return NextResponse.json(
        { error: "Job description is required for analysis" },
        { status: 400 }
      );
    }

    // Update resume status
    resume.parsedStatus = "processing";
    await resume.save();

    try {
      // Validate API key before processing
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!apiKey || apiKey === "your-api-key-here" || apiKey === "AIzaSyDummy-Key-For-Testing") {
        resume.parsedStatus = "failed";
        await resume.save();
        return NextResponse.json(
          {
            error: "Gemini API key not configured",
            details: "Please set GEMINI_API_KEY in your .env.local file. See SETUP.md for instructions.",
          },
          { status: 500 }
        );
      }

      // Validate file exists
      const { readFile } = await import("fs/promises");
      const { join } = await import("path");
      const relativePath = resume.filePath.startsWith("/uploads")
        ? resume.filePath.substring(1)
        : resume.filePath;
      const fullPath = join(process.cwd(), "public", relativePath);
      
      try {
        await readFile(fullPath);
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

      // Analyze resume
      const analysisResult = await analyzeResumeFromFile(
        resume.filePath,
        jobTitle,
        jobDescription
      );

      // Validate analysis result
      if (!analysisResult || !analysisResult.overallScore) {
        throw new Error("Invalid analysis result received from AI");
      }

      // Update resume with analysis
      resume.analysisResult = analysisResult;
      resume.parsedStatus = "completed";
      resume.analyzedAt = new Date();
      if (jobTitle) resume.jobTitle = jobTitle;
      if (jobDescription) resume.jobDescription = jobDescription;
      await resume.save();

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        resume: resume.toObject(),
      });
    } catch (analysisError: any) {
      // Mark as failed
      resume.parsedStatus = "failed";
      await resume.save();

      // Log detailed error for debugging
      console.error("Resume analysis error:", {
        resumeId: resume._id,
        error: analysisError.message,
        stack: analysisError.stack,
        filePath: resume.filePath,
      });

      // Provide user-friendly error messages
      let errorMessage = "Failed to analyze resume";
      let errorDetails = analysisError.message;

      if (analysisError.message?.includes("API key")) {
        errorMessage = "API Configuration Error";
        errorDetails = "Gemini API key is missing or invalid. Please check your .env.local file.";
      } else if (analysisError.message?.includes("PDF") || analysisError.message?.includes("text")) {
        errorMessage = "PDF Processing Error";
        errorDetails = analysisError.message;
      } else if (analysisError.message?.includes("JSON") || analysisError.message?.includes("parse")) {
        errorMessage = "AI Response Error";
        errorDetails = "The AI service returned an invalid response. Please try again.";
      } else if (analysisError.message?.includes("rate limit") || analysisError.message?.includes("quota")) {
        errorMessage = "Rate Limit Exceeded";
        errorDetails = "Too many requests. Please wait a moment and try again.";
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
          hint: "Check server logs for more details. Ensure GEMINI_API_KEY is set correctly.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume", details: error.message },
      { status: 500 }
    );
  }
}

