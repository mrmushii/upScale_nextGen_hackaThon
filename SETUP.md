# Resume Analyzer Setup Guide

This guide will help you set up and troubleshoot the Resume Analyzer feature in the Upscale Career Platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Dependencies Installation](#dependencies-installation)
4. [Configuration Steps](#configuration-steps)
5. [Testing the Setup](#testing-the-setup)
6. [Troubleshooting](#troubleshooting)
7. [Common Errors and Solutions](#common-errors-and-solutions)

---

## Prerequisites

Before setting up the Resume Analyzer, ensure you have:

- ✅ Node.js v18 or higher installed
- ✅ MongoDB database (local or Atlas) configured
- ✅ Google Gemini API key (free tier available)
- ✅ Next.js project set up and running

---

## Environment Variables

### Required Variables

Add these to your `.env.local` file in the project root:

```env
# Google Gemini API Key (REQUIRED for Resume Analyzer)
GEMINI_API_KEY="your-gemini-api-key-here"

# Alternative variable name (optional)
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key-here"

# MongoDB Connection
MONGODB_URI="mongodb://localhost:27017/upscale"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste it into your `.env.local` file as `GEMINI_API_KEY`

**Note:** The free tier provides generous quotas for testing. For production, consider upgrading.

---

## Dependencies Installation

The Resume Analyzer requires the following packages:

### Already Installed
- `@google/generative-ai` - Google Gemini AI SDK
- `pdf-parse` - PDF text extraction
- `@types/pdf-parse` - TypeScript types

### Install Missing Dependencies

If you haven't installed them yet, run:

```bash
npm install pdf-parse @types/pdf-parse
```

---

## Configuration Steps

### Step 1: Create `.env.local` File

If you don't have a `.env.local` file, create one in the project root:

```bash
cp env.template .env.local
```

### Step 2: Add Gemini API Key

Open `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY="AIzaSy..." # Your actual API key
```

### Step 3: Verify MongoDB Connection

Ensure your MongoDB is running and accessible:

```bash
# For local MongoDB
mongod

# Or verify your MongoDB Atlas connection string is correct
```

### Step 4: Restart Development Server

After adding environment variables, restart your Next.js server:

```bash
npm run dev
```

---

## Testing the Setup

### Test 1: Verify API Key

Visit: `http://localhost:3000/api/test/gemini`

Expected response:
```json
{
  "success": true,
  "message": "Gemini API is working correctly!",
  "apiKeyStatus": "configured"
}
```

### Test 2: Upload a Resume

1. Navigate to `/dashboard/resumes`
2. Click "Upload Resume"
3. Select a PDF file (with selectable text, not just images)
4. Fill in optional job details
5. Click "Upload Resume"

### Test 3: Analyze Resume

1. After uploading, click on the resume
2. Paste a job description
3. Click "Analyze Resume"
4. Wait for analysis (usually 10-30 seconds)

---

## Troubleshooting

### Error: "Gemini API key not configured"

**Symptoms:**
- 500 error when analyzing resume
- Error message: "Gemini API key not configured"

**Solution:**
1. Check that `.env.local` exists in project root
2. Verify `GEMINI_API_KEY` is set (not empty, not "your-api-key-here")
3. Restart the development server after adding the key
4. Check server logs for detailed error messages

**Verification:**
```bash
# Check if variable is loaded (in Node.js)
node -e "require('dotenv').config(); console.log(process.env.GEMINI_API_KEY)"
```

### Error: "Failed to extract text from PDF"

**Symptoms:**
- Error: "PDF text is too short or empty"
- Error: "Failed to extract text from PDF"

**Causes:**
- PDF contains only images (scanned document)
- PDF is corrupted
- PDF is password-protected

**Solutions:**
1. Use a PDF with selectable text (not scanned)
2. Convert scanned PDFs to text using OCR tools first
3. Ensure PDF is not password-protected
4. Try a different PDF file

**Test PDF:**
Create a simple PDF with text to verify the system works:
```bash
# Use any text editor to create a PDF with actual text content
```

### Error: "No JSON found in AI response"

**Symptoms:**
- Analysis fails with JSON parsing error
- Server logs show AI response but no JSON

**Causes:**
- AI model returned unexpected format
- API response was truncated
- Content safety filters blocked the response

**Solutions:**
1. Check server logs for the full AI response
2. Try with a different resume (less sensitive content)
3. Ensure job description is appropriate
4. The system will automatically try different Gemini models

### Error: "Rate limit exceeded"

**Symptoms:**
- Error: "Too many requests"
- Error: "Quota exceeded"

**Solutions:**
1. Wait a few minutes before retrying
2. Check your Gemini API quota at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Upgrade your API plan if needed
4. Implement request throttling for production

### Error: "Resume file not found"

**Symptoms:**
- Error: "File at /uploads/... could not be read"

**Causes:**
- File was deleted from filesystem
- File path is incorrect
- Permissions issue

**Solutions:**
1. Re-upload the resume
2. Check that `public/uploads/resumes/` directory exists
3. Verify file permissions (should be readable)
4. Check server logs for exact file path

---

## Common Errors and Solutions

### Error Code: 500 - Internal Server Error

**Check these in order:**

1. **API Key Missing:**
   ```bash
   # Verify in .env.local
   GEMINI_API_KEY="your-key-here"
   ```

2. **PDF Parsing Failed:**
   - Ensure PDF has selectable text
   - Check file is not corrupted
   - Verify `pdf-parse` is installed: `npm list pdf-parse`

3. **Database Connection:**
   - Verify MongoDB is running
   - Check `MONGODB_URI` in `.env.local`
   - Test connection: `mongosh "your-connection-string"`

4. **Model Availability:**
   - The system tries multiple Gemini models automatically
   - Check [Gemini API Status](https://status.cloud.google.com/)
   - Some models may be region-restricted

### Error Code: 400 - Bad Request

**Common causes:**
- Missing job description
- Invalid file format (not PDF/DOC/DOCX)
- File too large (>20MB)

**Solutions:**
- Provide a job description when analyzing
- Use supported file formats only
- Compress large PDFs if needed

### Error Code: 401 - Unauthorized

**Causes:**
- User not logged in
- Session expired

**Solutions:**
- Log in again
- Clear browser cookies
- Check NextAuth configuration

---

## Advanced Configuration

### Using Different Gemini Models

The system automatically tries these models in order:
1. `gemini-2.0-flash-exp` (experimental, fastest)
2. `gemini-1.5-flash` (stable, fast)
3. `gemini-1.5-pro` (most capable, slower)

To force a specific model, modify `lib/analyzerService.ts`:

```typescript
const modelsToTry = ["gemini-1.5-flash"]; // Use only this model
```

### Increasing Text Length Limit

By default, resumes are truncated to 50,000 characters. To change:

Edit `lib/analyzerService.ts`:
```typescript
resumeText.substring(0, 50000) // Change 50000 to your desired limit
```

**Note:** Longer text = higher API costs and slower responses.

### Custom Error Messages

To customize error messages, edit:
- `app/api/resumes/[id]/analyze/route.ts` - API error handling
- `lib/analyzerService.ts` - Analysis error handling

---

## Production Checklist

Before deploying to production:

- [ ] Set `GEMINI_API_KEY` in production environment variables
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Set up file storage (S3/Cloud Storage) instead of local filesystem
- [ ] Implement rate limiting for API endpoints
- [ ] Add monitoring and error tracking (Sentry, etc.)
- [ ] Set up backup for uploaded resumes
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set appropriate file size limits
- [ ] Implement request logging

---

## Support and Resources

### Documentation
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [pdf-parse Documentation](https://www.npmjs.com/package/pdf-parse)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### Getting Help

1. Check server logs for detailed error messages
2. Test API key: `http://localhost:3000/api/test/gemini`
3. Verify PDF has selectable text
4. Check MongoDB connection
5. Review this guide's troubleshooting section

### Logs Location

Server logs appear in:
- Terminal/Console where `npm run dev` is running
- Browser console (for client-side errors)
- Next.js build output

---

## Quick Fix Commands

```bash
# Reinstall dependencies
npm install

# Clear Next.js cache
rm -rf .next

# Verify environment variables
node -e "require('dotenv').config({path:'.env.local'}); console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'MISSING')"

# Test MongoDB connection
mongosh "your-mongodb-uri"

# Check if pdf-parse is installed
npm list pdf-parse
```

---

## Summary

The Resume Analyzer requires:
1. ✅ Gemini API key in `.env.local`
2. ✅ `pdf-parse` package installed
3. ✅ MongoDB connection configured
4. ✅ PDFs with selectable text (not just images)

Most errors are caused by:
- Missing or invalid API key (90% of cases)
- PDF without selectable text
- Database connection issues

Follow this guide step-by-step, and the Resume Analyzer should work correctly!

