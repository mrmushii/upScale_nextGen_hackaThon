// PDF parsing utility - Server-side only
// Uses pdf-parse for text extraction
import { join } from "path";
import { writeFile, mkdir, readFile } from "fs/promises";

// Required for Next.js App Router - pdf-parse does not work in Edge runtime
export const runtime = "nodejs";

// Import pdf-parse - must use require() for CommonJS modules in Next.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfModule = require("pdf-parse");

// Extract the actual callable function from the module
// Based on debug logs: module is an object, not a function, and has no .default
// In Next.js with webpack externalization, CommonJS modules can be objects
// but still be callable. We create a wrapper that handles this.
const pdf: (buffer: Buffer) => Promise<any> = (() => {
  // If module is directly a function, use it
  if (typeof pdfModule === "function") {
    return pdfModule;
  }
  
  // If there's a default export that's a function, use it
  if (pdfModule.default && typeof pdfModule.default === "function") {
    return pdfModule.default;
  }
  
  // If module is an object, it might still be callable (CommonJS interop)
  // Create a wrapper that tries to call it
  return async (buffer: Buffer) => {
    // Try calling the module directly - CommonJS modules can be callable objects
    try {
      // In some cases, the module.exports itself is callable even if typeof is 'object'
      if (typeof pdfModule === "function") {
        return await pdfModule(buffer);
      }
      // Try as a callable object (some webpack wrappers allow this)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (pdfModule as any)(buffer);
      return result;
    } catch (callError: any) {
      // If direct call fails, try to find the function in the object
      // Check common property names
      const functionKeys = ["default", "pdfParse", "PDFParse", "parse"];
      for (const key of functionKeys) {
        const func = (pdfModule as any)[key];
        if (func && typeof func === "function") {
          return await func(buffer);
        }
      }
      throw new Error(`Cannot call pdf-parse module. Error: ${callError.message}`);
    }
  };
})();

export interface PdfParseResult {
  text: string;
  success: boolean;
  error?: string;
  metadata?: {
    info?: any;
    metadata?: any;
    numPages?: number;
  };
}

/**
 * Extract text from PDF buffer
 * @param buffer - PDF file buffer
 * @returns Parsed text and metadata
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<PdfParseResult> {
  try {
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      return {
        text: "",
        success: false,
        error: "Empty PDF buffer provided",
      };
    }

    // Check minimum PDF size (PDF header is at least 4 bytes)
    if (buffer.length < 4) {
      return {
        text: "",
        success: false,
        error: "Invalid PDF: file too small",
      };
    }

    // Verify PDF header (should start with %PDF)
    const header = buffer.toString("ascii", 0, 4);
    if (header !== "%PDF") {
      return {
        text: "",
        success: false,
        error: "Invalid PDF format: file does not start with PDF header",
      };
    }

    // Parse PDF - 'pdf' is now available from the top-level require
    // Verify it's a function before calling
    if (typeof pdf !== "function") {
      // Try to extract the function from the module structure
      console.error("pdf-parse module structure:", {
        type: typeof pdfModule,
        isFunction: typeof pdfModule === "function",
        keys: Object.keys(pdfModule || {}),
        pdfType: typeof pdf,
      });
      throw new Error(`pdf-parse is not a function. Got type: ${typeof pdf}`);
    }
    
    const data: { text: string; [key: string]: any } = await pdf(buffer);

    // Extract text
    const text = data.text || "";

    // Validate extracted text
    if (!text || text.trim().length === 0) {
      return {
        text: "",
        success: false,
        error: "No text found in PDF. The PDF may be image-based or encrypted. Please use a PDF with selectable text.",
        metadata: {
          info: data.info,
          metadata: data.metadata,
          numPages: data.numpages || 0,
        },
      };
    }

    return {
      text: text.trim(),
      success: true,
      metadata: {
        info: data.info,
        metadata: data.metadata,
        numPages: data.numpages || 0,
      },
    };
  } catch (error: any) {
    console.error("PDF parsing error:", error);
    
    // Provide specific error messages
    let errorMessage = "Failed to parse PDF";
    
    if (error.message?.includes("password") || error.message?.includes("encrypted")) {
      errorMessage = "PDF is password-protected or encrypted. Please provide an unencrypted PDF.";
    } else if (error.message?.includes("corrupt") || error.message?.includes("invalid")) {
      errorMessage = "PDF file is corrupted or invalid. Please upload a valid PDF file.";
    } else if (error.message?.includes("memory") || error.message?.includes("too large")) {
      errorMessage = "PDF file is too large to process. Please use a smaller file (max 20MB).";
    } else {
      errorMessage = error.message || "Failed to parse PDF";
    }

    return {
      text: "",
      success: false,
      error: errorMessage,
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
