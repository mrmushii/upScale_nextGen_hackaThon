# AI Model Compatibility Guide

## Issue: Model Version Compatibility with AI SDK 5

### Problem

The model `gemini-2.0-flash-001` is **not compatible** with AI SDK 5 (v2 specification). When using this model, you'll encounter the following error:

```
Unsupported model version v1 for provider "google.generative-ai" and model "gemini-2.0-flash-001". 
AI SDK 5 only supports models that implement specification version "v2".
```

### Solution

**Updated Model:** Changed from `gemini-2.0-flash-001` to `gemini-1.5-flash`

**Why `gemini-1.5-flash`?**
- ✅ Fully compatible with AI SDK 5 v2 specification
- ✅ Stable and well-supported
- ✅ Fast response times
- ✅ Good balance of capability and speed

### Files Updated

1. **`lib/unifiedAI.ts`**
   - Changed model from `gemini-2.0-flash-001` to `gemini-1.5-flash`
   - Updated comments to reflect compatibility

2. **`app/api/test/gemini/route.ts`**
   - Updated model reference in response

3. **`README.md`**
   - Updated documentation to reflect new model

### Note on `aiInterview.ts`

The file `lib/aiInterview.ts` still uses `gemini-2.0-flash-001`. This was left unchanged per user requirements. However, if you encounter the same compatibility error with mock interviews, you may need to update it to use `gemini-1.5-flash` as well.

**To update `aiInterview.ts` (if needed):**
```typescript
// Change from:
model: google("gemini-2.0-flash-001")

// To:
model: google("gemini-1.5-flash")
```

### Compatible Models for AI SDK 5

The following Gemini models are compatible with AI SDK 5:

- ✅ `gemini-1.5-flash` (recommended - fast, stable)
- ✅ `gemini-1.5-pro` (more capable, slower)
- ✅ `gemini-1.5-flash-latest` (latest flash version)
- ✅ `gemini-1.5-pro-latest` (latest pro version)

**Not Compatible:**
- ❌ `gemini-2.0-flash-001` (v1 specification, not supported)
- ❌ `gemini-2.0-flash-exp` (experimental, may have issues)

### Verification

To verify the fix is working:

1. **Test the unified AI service:**
   ```bash
   GET http://localhost:3000/api/test/gemini
   ```

2. **Test resume analysis:**
   ```bash
   POST http://localhost:3000/api/resumes/{resumeId}/analyze
   ```

3. **Test roadmap generation:**
   - Use the roadmap feature in the dashboard
   - Should work without model compatibility errors

### Troubleshooting

If you still encounter model compatibility errors:

1. **Check AI SDK version:**
   ```bash
   npm list ai @ai-sdk/google
   ```
   Should be:
   - `ai@^5.0.0` or higher
   - `@ai-sdk/google@^1.0.0` or higher

2. **Update packages if needed:**
   ```bash
   npm install ai@latest @ai-sdk/google@latest
   ```

3. **Verify model name:**
   - Ensure you're using `gemini-1.5-flash` (not `gemini-2.0-flash-001`)
   - Check `lib/unifiedAI.ts` for the model name

4. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

### Related Documentation

- [AI SDK 5 Documentation](https://sdk.vercel.ai/docs)
- [Google AI SDK Documentation](https://ai.google.dev/docs)
- [Gemini Model List](https://ai.google.dev/models/gemini)

---

**Last Updated:** 2024-12-19  
**Status:** ✅ Fixed - Using `gemini-1.5-flash` for AI SDK 5 compatibility

