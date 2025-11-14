/**
 * PDF to Image Conversion Utility
 * 
 * Client-side PDF to image conversion using PDF.js
 * Similar to ai-resume-analyzer-main but adapted for Next.js
 */

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

/**
 * Load PDF.js library dynamically
 */
async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  
  try {
    // Dynamic import for client-side only
    loadPromise = import("pdfjs-dist").then((lib) => {
      // Set the worker source
      if (typeof window !== "undefined") {
        lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
      }
      pdfjsLib = lib;
      isLoading = false;
      return lib;
    });

    return loadPromise;
  } catch (error) {
    isLoading = false;
    loadPromise = null;
    throw new Error(`Failed to load PDF.js: ${error}`);
  }
}

/**
 * Convert PDF first page to image (PNG)
 * Client-side only function
 */
export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  // Ensure we're in browser environment
  if (typeof window === "undefined") {
    return {
      imageUrl: "",
      file: null,
      error: "PDF to image conversion is only available in the browser",
    };
  }

  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Failed to get canvas context",
      };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0 // Maximum quality
      );
    });
  } catch (err: any) {
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err.message || err}`,
    };
  }
}

