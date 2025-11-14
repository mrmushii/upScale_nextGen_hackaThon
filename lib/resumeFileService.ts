// Server-only file operations for resumes
// This file should only be imported in API routes (server-side)

import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function saveResumeFile(
  file: File,
  userId: string
): Promise<{ filePath: string; filename: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const filename = `resume-${userId}-${timestamp}.${extension}`;

  // Save to public/uploads/resumes directory
  const uploadDir = join(process.cwd(), "public", "uploads", "resumes");
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return {
    filePath: `/uploads/resumes/${filename}`,
    filename,
  };
}

export async function deleteResumeFile(filePath: string): Promise<void> {
  try {
    // Remove /uploads prefix if present
    const relativePath = filePath.startsWith("/uploads")
      ? filePath.substring(1)
      : filePath;

    const fullPath = join(process.cwd(), "public", relativePath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error("Error deleting resume file:", error);
    // Don't throw - file deletion failure shouldn't break the flow
  }
}

