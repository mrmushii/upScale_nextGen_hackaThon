// PDF parsing utility – Server-side only
export const runtime = "nodejs";

// ---- Types ---- //
export interface PdfParseResult {
  text: string;
  success: boolean;
  error?: string;
  metadata?: {
    numPages?: number;
  };
}

// ---- PDF Text Extraction (Fixed with dynamic import) ---- //
export async function extractTextFromPdf(
  buffer: Buffer
): Promise<PdfParseResult> {
  try {
    // --- Validate PDF buffer --- //
    if (!buffer || buffer.length === 0) {
      return {
        text: "",
        success: false,
        error: "Empty PDF buffer provided",
      };
    }

    if (buffer.toString("ascii", 0, 4) !== "%PDF") {
      return {
        text: "",
        success: false,
        error: "Invalid PDF format: missing PDF header",
      };
    }

    // --- Dynamic import (IMPORTANT FIX) --- //
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Disable worker in Node
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";
    }

    // --- Load PDF Document --- //
    const loadingTask = pdfjsLib.getDocument({
      data: buffer,
      useSystemFonts: true,
      isEvalSupported: false,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let extractedText = "";

    // --- Extract text from each page --- //
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const text = textContent.items
        .map((item: any) => item?.str || item?.unicode || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (text) {
        extractedText += extractedText ? `\n\n${text}` : text;
      }
    }

    await pdf.cleanup();
    await loadingTask.destroy();

    if (!extractedText.trim()) {
      return {
        text: "",
        success: false,
        error: "No text found in PDF (may be scanned or encrypted).",
        metadata: { numPages: pdf.numPages },
      };
    }

    return {
      text: extractedText.trim(),
      success: true,
      metadata: {
        numPages: pdf.numPages,
      },
    };
  } catch (error: any) {
    console.error("PDF parsing error:", error);

    let message = "Failed to parse PDF.";

    if (error?.message?.includes("encrypted")) message = "The PDF is encrypted.";
    if (error?.message?.includes("corrupt")) message = "The PDF is corrupted or invalid.";
    if (error?.message?.includes("out of memory"))
      message = "PDF too large. Maximum size is ~20MB.";

    return {
      text: "",
      success: false,
      error: message,
    };
  }
}

// ---- Placeholder PDF → Image Conversion (Not implemented yet) ---- //
export async function convertPdfBufferToImage(
  buffer: Buffer,
  outputDir: string,
  filename: string
): Promise<{ imagePath: string; success: boolean; error?: string }> {
  try {
    return {
      imagePath: "",
      success: false,
      error: "PDF-to-image conversion not implemented yet.",
    };
  } catch (error: any) {
    return {
      imagePath: "",
      success: false,
      error: error.message || "Failed to convert PDF to image.",
    };
  }
}
