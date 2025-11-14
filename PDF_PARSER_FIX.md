# PDF Parser Fix - "Class constructors cannot be invoked without 'new'"

## Problem
The error "Class constructors cannot be invoked without 'new'" occurs when webpack tries to bundle `pdf-parse` incorrectly, even though it's externalized.

## Solution
1. **Updated `lib/pdfParser.ts`**:
   - Use dynamic `import()` at runtime instead of static require
   - Fallback to `require()` if import fails
   - Better error handling and module detection

2. **Updated `next.config.js`**:
   - Improved webpack externalization using a function-based approach
   - Ensures pdf-parse is properly externalized

## Testing
1. Restart the Next.js development server
2. Upload a PDF resume
3. Try to analyze it
4. Should work without the "Class constructors" error

## If Still Failing
1. Clear `.next` folder: `rm -rf .next` (or delete it manually)
2. Restart dev server
3. Try again

