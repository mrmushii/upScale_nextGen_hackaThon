// PDF parsing utility - Server-side only
// Uses pdf-parse for text extraction

import { join } from "path";
import { writeFile, mkdir, readFile } from "fs/promises";

// pdf-parse is a CommonJS module - use require for server-side
// TypeScript compatibility: use type assertion with @types/pdf-parse
const pdfParse: (buffer: Buffer) => Promise<{ text: string; [key: string]: any }> = require("pdf-parse");

export interface PdfParseResult {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<PdfParseResult> {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text || "",
      success: true,
    };
  } catch (error: any) {
    console.error("PDF parsing error:", error);
    return {
      text: "",
      success: false,
      error: error.message || "Failed to parse PDF",
    };
  }
}

/**
 * Convert PDF to image (for preview) - Client-side approach
 * Note: For server-side image conversion, you would need GraphicsMagick/ImageMagick
 * For now, we'll skip this and use client-side PDF.js if needed
 * This is a placeholder that can be enhanced later
 */
export async function convertPdfBufferToImage(
  buffer: Buffer,
  outputDir: string,
  filename: string
): Promise<{ imagePath: string; success: boolean; error?: string }> {
  try {
    // For now, return a placeholder
    // In production, you can:
    // 1. Use client-side pdfjs-dist to render PDF previews
    // 2. Install GraphicsMagick/ImageMagick and use pdf2pic
    // 3. Use a cloud service for PDF to image conversion
    
    // Placeholder - image conversion can be done client-side
    return {
      imagePath: "",
      success: false,
      error: "PDF to image conversion not implemented. Use client-side PDF.js for previews.",
    };
  } catch (error: any) {
    console.error("PDF buffer to image conversion error:", error);
    return {
      imagePath: "",
      success: false,
      error: error.message || "Failed to convert PDF buffer to image",
    };
  }
}
