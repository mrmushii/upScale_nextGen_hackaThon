# AI Interview Fix - Model Version Error

## Problem
The AI interview feature was using `@ai-sdk/google` which doesn't support `gemini-2.0-flash-001` (requires v2 models). This caused the error:
```
UnsupportedModelVersionError: Unsupported model version v1 for provider "google.generative-ai" and model "gemini-2.0-flash-001"
```

## Solution
Updated `lib/aiInterview.ts` to use the **direct Google Generative AI SDK** (`@google/generative-ai`) instead of `@ai-sdk/google`, matching the approach used in:
- `lib/unifiedAI.ts`
- `lib/resumeAnalyzer.ts`

## Changes Made

### `lib/aiInterview.ts`
- ✅ Removed `@ai-sdk/google` dependency
- ✅ Removed `ai` SDK imports (`generateText`, `generateObject`)
- ✅ Added direct `GoogleGenerativeAI` SDK usage
- ✅ Updated `generateInterviewQuestions()` to use direct SDK
- ✅ Updated `generateInterviewFeedback()` to use direct SDK with JSON parsing
- ✅ Improved error handling and JSON parsing

## Implementation Details

### Before (Using AI SDK):
```typescript
import { generateText, generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({ apiKey });
const { text } = await generateText({
  model: google("gemini-2.0-flash-001"),
  prompt: "...",
});
```

### After (Direct SDK):
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  generationConfig: { ... }
});

const result = await model.generateContent(prompt);
const text = result.response.text();
```

## Benefits
1. ✅ **Compatible with gemini-2.0-flash-001** - Direct SDK supports v1 models
2. ✅ **Consistent with other AI features** - All features now use the same SDK
3. ✅ **Better error handling** - More control over error messages
4. ✅ **Improved JSON parsing** - Handles markdown code blocks and malformed JSON

## Testing
1. ✅ Generate interview questions - Should work without errors
2. ✅ Generate interview feedback - Should parse JSON correctly
3. ✅ Error handling - Should provide clear error messages

## Status
✅ **Fixed** - All AI features now use the direct Google Generative AI SDK (v1)

