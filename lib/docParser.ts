import mammoth from "mammoth";

export async function extractTextFromDocx(buffer: Buffer): Promise<{ text: string; success: boolean; error?: string }> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.replace(/\s+/g, " ").trim();

    if (!text) {
      return {
        text: "",
        success: false,
        error: "No text content found in DOCX file",
      };
    }

    return {
      text,
      success: true,
    };
  } catch (error: any) {
    console.error("DOCX parsing error:", error);
    return {
      text: "",
      success: false,
      error: error.message || "Failed to parse DOCX file",
    };
  }
}

