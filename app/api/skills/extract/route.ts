import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { validateResumeFile } from "@/lib/resumeService";
import { extractTextFromPdf } from "@/lib/pdfParser";
import { extractTextFromDocx } from "@/lib/docParser";
import { extractSkillsFromText } from "@/lib/skillExtraction";

function buildProfileContext(user: any): string {
  if (!user) return "";
  const segments: string[] = [];

  if (user.fullName) segments.push(`Name: ${user.fullName}`);
  if (user.bio) segments.push(`Summary: ${user.bio}`);
  if (user.skills?.length) segments.push(`Skills: ${user.skills.join(", ")}`);
  if (user.careerInterests?.length) segments.push(`Interests: ${user.careerInterests.join(", ")}`);
  if (user.experience?.length) {
    const expText = user.experience
      .slice(0, 5)
      .map(
        (exp: any) =>
          `${exp.title || ""} ${exp.company ? `at ${exp.company}` : ""} - ${
            Array.isArray(exp.description) ? exp.description.join("; ") : exp.description || ""
          }`
      )
      .join(" | ");
    segments.push(`Experience: ${expText}`);
  }
  if (user.projects?.length) {
    const projects = user.projects
      .slice(0, 3)
      .map((project: any) => `${project.title}: ${project.description}`)
      .join(" | ");
    segments.push(`Projects: ${projects}`);
  }

  return segments.join("\n");
}

async function parseFile(file: File) {
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const parsed = await extractTextFromPdf(buffer);
    if (!parsed.success || !parsed.text) {
      throw new Error(parsed.error || "Unable to extract text from PDF");
    }
    return parsed.text;
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const parsed = await extractTextFromDocx(buffer);
    if (!parsed.success || !parsed.text) {
      throw new Error(parsed.error || "Unable to extract text from DOCX");
    }
    return parsed.text;
  }

  throw new Error("DOC format is currently not supported. Please upload a DOCX or PDF file.");
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const contentType = request.headers.get("content-type") || "";
    let text = "";
    let profileContext = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      text = await parseFile(file);
    } else {
      const body = await request.json();
      const { resumeId, cvText, useProfile } = body;

      if (useProfile) {
        const user = await User.findById(session.user.id).lean();
        profileContext = buildProfileContext(user);
        if (!cvText && !resumeId && user?.cvText) {
          text = user.cvText;
        }
      }

      if (!text && resumeId) {
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: session.user.id,
        }).lean();

        if (!resume) {
          return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        if (resume.parsedText && resume.parsedText.trim().length > 0) {
          text = resume.parsedText;
        } else {
          return NextResponse.json(
            {
              error:
                "Resume text is unavailable for extraction. Please re-upload the resume or provide raw text.",
            },
            { status: 400 }
          );
        }
      }

      if (!text && cvText) {
        text = cvText;
      }
    }

    if (!text || text.trim().length < 40) {
      return NextResponse.json(
        { error: "Please provide more detailed CV text before running extraction." },
        { status: 400 }
      );
    }

    const extraction = await extractSkillsFromText({
      text,
      profileContext,
    });

    return NextResponse.json(extraction);
  } catch (error: any) {
    console.error("Skill extraction error:", error);
    return NextResponse.json(
      {
        error: "Failed to extract skills. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

