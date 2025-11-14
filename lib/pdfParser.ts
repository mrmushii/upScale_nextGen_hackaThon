// PDF parsing utility - Server-side only
// Uses pdf-parse for text extraction

// Required for Next.js App Router - pdf-parse does not work in Edge runtime
export const runtime = "nodejs";

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

    // Dynamically import pdf-parse at runtime to avoid webpack issues
    // This ensures it's loaded as a CommonJS module, not bundled
    let pdfParse: (buffer: Buffer) => Promise<any>;
    
    try {
      // Try dynamic import first (works in Node.js 14+)
      const pdfModule = await import("pdf-parse");
      pdfParse = pdfModule.default || pdfModule;
      
      // If it's still not a function, try to extract it
      if (typeof pdfParse !== "function") {
        // Try require as fallback
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfRequire = require("pdf-parse");
        if (typeof pdfRequire === "function") {
          pdfParse = pdfRequire;
        } else if (pdfRequire.default && typeof pdfRequire.default === "function") {
          pdfParse = pdfRequire.default;
        } else {
          throw new Error("pdf-parse module is not a function");
        }
      }
    } catch (importError: any) {
      // Fallback to require if import fails
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfRequire = require("pdf-parse");
      if (typeof pdfRequire === "function") {
        pdfParse = pdfRequire;
      } else if (pdfRequire.default && typeof pdfRequire.default === "function") {
        pdfParse = pdfRequire.default;
      } else {
        throw new Error(`Failed to load pdf-parse: ${importError.message}`);
      }
    }

    // Ensure we have a function
    if (typeof pdfParse !== "function") {
      throw new Error("pdf-parse is not a callable function");
    }

    // Parse PDF - call the function with the buffer
    const data: { text: string; [key: string]: any } = await pdfParse(buffer);

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
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      type: typeof error,
    });
    
    // Provide specific error messages
    let errorMessage = "Failed to parse PDF";
    
    if (error.message?.includes("password") || error.message?.includes("encrypted")) {
      errorMessage = "PDF is password-protected or encrypted. Please provide an unencrypted PDF.";
    } else if (error.message?.includes("corrupt") || error.message?.includes("invalid")) {
      errorMessage = "PDF file is corrupted or invalid. Please upload a valid PDF file.";
    } else if (error.message?.includes("memory") || error.message?.includes("too large")) {
      errorMessage = "PDF file is too large to process. Please use a smaller file (max 20MB).";
    } else if (error.message?.includes("Class constructors cannot be invoked without 'new'")) {
      errorMessage = "PDF parsing module error. Please restart the development server and try again.";
    } else if (error.message?.includes("not a callable function")) {
      errorMessage = "PDF parsing module configuration error. Please contact support.";
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
