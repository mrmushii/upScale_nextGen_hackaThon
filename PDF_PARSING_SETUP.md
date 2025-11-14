# PDF Parsing Setup & Troubleshooting Guide

## Overview

The Resume Analyzer feature uses `pdf-parse` for server-side PDF text extraction. This guide covers setup, configuration, and troubleshooting.

## Installation

```bash
npm install pdf-parse @types/pdf-parse
```

## Configuration

### Next.js Configuration

The `next.config.js` file has been configured to properly handle `pdf-parse`:

```javascript
const nextConfig = {
  serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'pdfjs-dist': 'commonjs pdfjs-dist',
      });
    }
    return config;
  },
}
```

**Why this is needed:**
- `pdf-parse` is a CommonJS module that depends on `pdfjs-dist`
- Next.js webpack bundling can cause issues with these packages
- Externalizing them ensures they're loaded as Node.js modules at runtime

## Usage

The PDF parser is used in `lib/pdfParser.ts`:

```typescript
const pdfParse = require("pdf-parse");

export async function extractTextFromPdf(buffer: Buffer): Promise<PdfParseResult> {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text || "",
      success: true,
    };
  } catch (error: any) {
    return {
      text: "",
      success: false,
      error: error.message || "Failed to parse PDF",
    };
  }
}
```

## Common Issues & Solutions

### Issue 1: "pdf-parse does not contain a default export"

**Error:**
```
Attempted import error: 'pdf-parse' does not contain a default export
```

**Solution:**
- Use `require("pdf-parse")` instead of `import pdfParse from "pdf-parse"`
- This is because `pdf-parse` is a CommonJS module

**Fixed in:** `lib/pdfParser.ts`

### Issue 2: Webpack bundling errors with pdfjs-dist

**Error:**
```
TypeError: Object.defineProperty called on non-object
at __webpack_require__.r
```

**Solution:**
- Configure Next.js to externalize `pdf-parse` and `pdfjs-dist`
- Add them to `serverComponentsExternalPackages` in `next.config.js`
- Use webpack externals configuration for server-side

**Fixed in:** `next.config.js`

### Issue 3: PDF text extraction returns empty string

**Possible causes:**
1. PDF is image-based (scanned) - no text layer
2. PDF is encrypted/password-protected
3. PDF is corrupted
4. Buffer is empty or invalid

**Solutions:**
- Check if PDF has selectable text (try copying text manually)
- For scanned PDFs, use OCR (Optical Character Recognition) - see alternatives below
- Validate PDF buffer before parsing
- Check file size and format

**Validation in code:**
```typescript
if (!resumeText || resumeText.trim().length < 50) {
  throw new Error("Resume text is too short or empty. Please ensure the PDF contains readable text.");
}
```

### Issue 4: Memory issues with large PDFs

**Solution:**
- Limit PDF file size (currently 20MB max)
- Consider streaming for very large files
- Monitor server memory usage

## Alternative PDF Parsing Solutions

If `pdf-parse` continues to cause issues, consider these alternatives:

### 1. Client-Side PDF.js

**Pros:**
- No server-side dependencies
- Works in browser
- Good for previews

**Cons:**
- Requires client-side JavaScript
- Larger bundle size
- May not work for all PDFs

**Implementation:**
```typescript
import * as pdfjsLib from 'pdfjs-dist';

// Load worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function extractText(buffer: ArrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ');
  }
  return text;
}
```

### 2. PDF.js (Server-Side)

**Installation:**
```bash
npm install pdfjs-dist
```

**Usage:**
```typescript
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdf = await getDocument({ data: buffer }).promise;
// Extract text similar to client-side approach
```

### 3. OCR for Scanned PDFs

For image-based PDFs, use OCR:

**Options:**
- **Tesseract.js** (client-side OCR)
- **Google Cloud Vision API** (cloud OCR)
- **AWS Textract** (cloud OCR)
- **Azure Computer Vision** (cloud OCR)

**Example with Tesseract.js:**
```bash
npm install tesseract.js
```

```typescript
import { createWorker } from 'tesseract.js';

async function ocrPdf(pdfBuffer: Buffer) {
  // Convert PDF to image first, then OCR
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(imageBuffer);
  await worker.terminate();
  return text;
}
```

### 4. Cloud Services

**Google Cloud Document AI:**
- High accuracy
- Handles forms, tables, structured data
- Paid service

**AWS Textract:**
- Good for forms and tables
- OCR capabilities
- Paid service

## Testing PDF Parsing

### Test Endpoint

You can test PDF parsing via the analyze endpoint:

```bash
POST /api/resumes/{resumeId}/analyze
```

### Manual Testing

```typescript
// test-pdf-parser.ts
import { readFile } from 'fs/promises';
import { extractTextFromPdf } from './lib/pdfParser';

async function test() {
  const buffer = await readFile('./test-resume.pdf');
  const result = await extractTextFromPdf(buffer);
  console.log('Success:', result.success);
  console.log('Text length:', result.text.length);
  console.log('First 500 chars:', result.text.substring(0, 500));
}

test();
```

## Performance Considerations

1. **File Size Limits:**
   - Current limit: 20MB
   - Consider reducing for production

2. **Parsing Time:**
   - Small PDFs (< 1MB): ~100-500ms
   - Medium PDFs (1-5MB): ~500ms-2s
   - Large PDFs (5-20MB): ~2-10s

3. **Memory Usage:**
   - `pdf-parse` loads entire PDF into memory
   - Monitor server memory for concurrent requests

4. **Caching:**
   - Consider caching parsed text in database
   - Re-parse only when file changes

## Best Practices

1. **Validate PDFs before parsing:**
   ```typescript
   if (!buffer || buffer.length === 0) {
     throw new Error("Empty PDF buffer");
   }
   ```

2. **Handle errors gracefully:**
   ```typescript
   try {
     const result = await extractTextFromPdf(buffer);
     if (!result.success) {
       // Log error, return user-friendly message
     }
   } catch (error) {
     // Fallback handling
   }
   ```

3. **Set timeouts:**
   ```typescript
   const timeout = 30000; // 30 seconds
   const result = await Promise.race([
     extractTextFromPdf(buffer),
     new Promise((_, reject) => 
       setTimeout(() => reject(new Error("Timeout")), timeout)
     )
   ]);
   ```

4. **Log parsing metrics:**
   - Track success/failure rates
   - Monitor parsing times
   - Alert on high failure rates

## Environment Variables

No specific environment variables are required for `pdf-parse`. However, ensure:

- Node.js version >= 14 (for async/await support)
- Sufficient server memory for PDF processing
- File system write permissions (if caching parsed text)

## Troubleshooting Checklist

- [ ] `pdf-parse` is installed: `npm list pdf-parse`
- [ ] `@types/pdf-parse` is installed: `npm list @types/pdf-parse`
- [ ] Next.js config includes `serverComponentsExternalPackages`
- [ ] Using `require()` instead of `import` for `pdf-parse`
- [ ] PDF file is not corrupted (test with PDF viewer)
- [ ] PDF has text layer (not just images)
- [ ] File size is within limits (20MB)
- [ ] Server has sufficient memory
- [ ] No conflicting webpack configurations

## Support & Resources

- [pdf-parse npm package](https://www.npmjs.com/package/pdf-parse)
- [pdf-parse GitHub](https://github.com/mozilla/pdf.js)
- [Next.js Server Components External Packages](https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)

## Related Files

- `lib/pdfParser.ts` - PDF parsing implementation
- `lib/analyzerService.ts` - Uses PDF parser for resume analysis
- `app/api/resumes/[id]/analyze/route.ts` - API endpoint using PDF parser
- `next.config.js` - Next.js configuration for PDF parsing

---

**Last Updated:** 2024
**Maintained by:** Development Team

