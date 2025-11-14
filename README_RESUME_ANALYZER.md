# Resume Analyzer - Complete Guide

## Overview

The Resume Analyzer is a comprehensive ATS (Applicant Tracking System) analysis tool integrated into the Upscale Career Platform. It helps users optimize their resumes for job applications by providing detailed feedback across multiple categories.

---

## Features

### 1. Resume Upload & Storage
- **Supported Formats:** PDF, DOC, DOCX
- **File Size Limit:** 20MB
- **Storage:** Secure per-user storage with metadata tracking
- **Actions:** Upload, download, delete, re-analyze

### 2. AI-Powered Analysis
- **ATS Score:** Overall compatibility with Applicant Tracking Systems
- **Tone & Style:** Professional writing quality and consistency  
- **Content:** Relevance and completeness of information
- **Structure:** Organization and formatting
- **Skills:** Alignment with job requirements

### 3. Detailed Feedback
- Scored from 0-100 across all categories
- Specific tips for improvement (marked as "good" or "improve")
- Detailed explanations for each recommendation
- Actionable suggestions

### 4. Job Description Matching
- Analyze resume against specific job descriptions
- Identify matched and missing skills
- Get targeted recommendations for the role

### 5. Smart Skill Extraction (NEW)
- Extracts skills, tools/technologies, and role/domain suggestions from resumes, pasted CV text, or the existing profile.
- Uses Gemini v1 for structured outputs with automatic fallback to a transparent dictionary-based heuristic.
- Surfaces “why detected” evidence (LLM rationale or matched keywords) for each tag.
- Lets users edit/add/remove tags before applying them to the profile.
- Applies updates via a “Review & Save” step to avoid unwanted overwrites.

---

## Usage Guide

### Step 1: Upload a Resume

1. Navigate to **Dashboard → Resumes** (`/dashboard/resumes`)
2. Click **"Upload Resume"** button
3. Select a PDF, DOC, or DOCX file (max 20MB)
4. Optionally provide:
   - Company Name
   - Job Title
   - Job Description
   - Job Listing URL
5. Click **"Upload"**

Your resume will be saved and appear in the list.

### Step 2: Analyze Resume

1. Click on a resume from the list
2. On the detail page, find the **"Analyze Resume"** section
3. Provide:
   - **Job Title** (optional but recommended)
   - **Job Description** (required) - Paste the full job description
4. Click **"Analyze Resume"**
5. Wait 10-30 seconds for analysis to complete

### Step 3: Review Feedback

Once analysis completes, you'll see:

#### Overall Score
- Large score display (0-100)
- General assessment of resume quality

#### ATS Score
- Compatibility with Applicant Tracking Systems
- Tips for improving ATS performance

#### Category Scores
Each category shows:
- **Score** (0-100)
- **Progress bar** visualization
- **Tips** with short titles
- **Explanations** with detailed guidance
- **Icons** indicating "good" (✓) or "needs improvement" (⚠)

**Categories:**
1. **Tone & Style** - Writing quality, consistency, professionalism
2. **Content** - Relevance, completeness, achievements
3. **Structure** - Organization, formatting, sections
4. **Skills** - Technical skills, soft skills, keyword usage

### Step 4: Improve & Re-analyze

1. Update your resume based on the feedback
2. Upload the updated version
3. Analyze again to see improvements
4. Compare scores to track progress

### Step 5: Extract & Apply Skills

1. Open the **Smart Skill Extraction** panel (Profile page or Resume detail page).
2. Choose an input method:
   - Use stored resume (if viewing from `/dashboard/resumes/[id]`)
   - Use current profile data
   - Paste CV text directly
   - Upload a fresh PDF/DOCX
3. Click **Run Extraction**. Gemini v1 attempts structured extraction; a heuristic dictionary fallback is used automatically when the LLM is unavailable.
4. Review/edit detected skills, tools, and roles. Each chip shows delete buttons and evidence is listed in the panel.
5. Click **Apply to Profile** to push changes into the profile form (Profile page) or patch the profile immediately (Resume page).
6. Save your profile to persist the new tags.

> If no matches are found, you’ll see guidance to refine the CV text or retry when the AI service becomes available.

---

## API Documentation

### Authentication

All endpoints require authentication via NextAuth.js JWT token.

```bash
# Include session in request
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 1. List All Resumes

```http
GET /api/resumes
```

**Response:**
```json
{
  "resumes": [
    {
      "_id": "...",
      "userId": "...",
      "filename": "resume-user-timestamp.pdf",
      "originalFilename": "John_Doe_Resume.pdf",
      "filePath": "/uploads/resumes/...",
      "fileSize": 245678,
      "mimeType": "application/pdf",
      "companyName": "Google",
      "jobTitle": "Senior Developer",
      "parsedStatus": "completed",
      "analysisResult": { ... },
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:05:00.000Z"
    }
  ]
}
```

#### 2. Upload Resume

```http
POST /api/resumes
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required): Resume file
- `companyName` (optional): Company name
- `jobTitle` (optional): Job title
- `jobDescription` (optional): Job description
- `jobListingUrl` (optional): Job URL

**Example (curl):**
```bash
curl -X POST http://localhost:3000/api/resumes \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf" \
  -F "companyName=Google" \
  -F "jobTitle=Senior Developer" \
  -F "jobDescription=We are looking for..."
```

**Response:**
```json
{
  "success": true,
  "resume": { ... }
}
```

#### 3. Get Resume Details

```http
GET /api/resumes/:id
```

**Response:**
```json
{
  "resume": { ... }
}
```

#### 4. Analyze Resume

```http
POST /api/resumes/:id/analyze
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobTitle": "Senior Full Stack Developer",
  "jobDescription": "We are seeking an experienced developer..."
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "overallScore": 85,
    "ATS": {
      "score": 90,
      "tips": [
        {
          "type": "good",
          "tip": "Keywords well-distributed"
        },
        {
          "type": "improve",
          "tip": "Add more action verbs"
        }
      ]
    },
    "toneAndStyle": {
      "score": 82,
      "tips": [
        {
          "type": "good",
          "tip": "Professional tone maintained",
          "explanation": "Your resume maintains a professional tone throughout..."
        }
      ]
    },
    "content": { ... },
    "structure": { ... },
    "skills": { ... }
  },
  "resume": { ... }
}
```

#### 5. Smart Skill Extraction

```http
POST /api/skills/extract
Content-Type: application/json | multipart/form-data
```

**JSON Payload Options:**
```json
{
  "resumeId": "Optional resume ID to reuse parsed text",
  "cvText": "Optional raw CV text",
  "useProfile": true
}
```

**Multipart Option (Upload):**
```bash
curl -X POST http://localhost:3000/api/skills/extract \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "result": {
    "skills": ["React", "Leadership"],
    "tools": ["AWS", "PostgreSQL"],
    "roles": [
      { "name": "Frontend Developer", "confidence": 0.86 }
    ],
    "evidence": [
      {
        "item": "React",
        "source": "LLM",
        "rationale": "Built dashboards using React/Next.js"
      }
    ]
  },
  "usedFallback": false,
  "message": null
}
```

> If Gemini cannot return valid JSON, the API automatically switches to the dictionary-based heuristic extractor and sets `usedFallback: true` with an explanatory message.

#### 6. Download Resume

```http
GET /api/resumes/:id/download
```

**Response:** Binary file download

#### 7. Delete Resume

```http
DELETE /api/resumes/:id
```

**Response:**
```json
{
  "success": true
}
```

---

## Setup & Configuration

### Environment Variables

Required in `.env.local`:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Gemini AI (Required for analysis)
GEMINI_API_KEY=your_gemini_api_key

# NextAuth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### Dependencies

```bash
# Install required packages
npm install @google/generative-ai pdf-parse pdfjs-dist
```

### File Storage Setup

The system uses local file storage by default:
- Files saved to: `public/uploads/resumes/`
- Ensure directory exists and is writable
- Files are accessible via URL (consider security in production)

**For Production:**
- Migrate to S3/Cloud Storage
- Implement signed URLs
- Add virus scanning

### Database

The Resume model is automatically created. No migration needed.

**Indexes:**
- `userId` + `createdAt` (compound)

---

## Security Notes

### Current Security Measures

1. **Authentication:** All endpoints require valid session
2. **Authorization:** Users can only access their own resumes
3. **File Validation:**
   - MIME type checking
   - File size limits (20MB)
   - Type whitelist (PDF/DOC/DOCX)
4. **Input Sanitization:**
   - Text truncation before AI processing
   - SQL injection prevention (Mongoose)
   - XSS prevention (React escaping)

### Production Recommendations

1. **File Storage:**
   - ⚠️ Move to S3/Cloud Storage
   - ⚠️ Implement signed URLs
   - ⚠️ Add virus/malware scanning

2. **Rate Limiting:**
   - ⚠️ Add per-user analysis limits
   - ⚠️ Monitor API costs
   - ⚠️ Implement cooldown periods

3. **File Cleanup:**
   - ⚠️ Automatic cleanup of old files
   - ⚠️ User-configurable retention periods

---

## Testing

### Manual Testing Checklist

**Upload Flow:**
- [ ] Upload PDF resume (valid)
- [ ] Upload DOC resume (valid)
- [ ] Upload DOCX resume (valid)
- [ ] Reject invalid file types
- [ ] Reject files over 20MB
- [ ] Show upload progress
- [ ] Display success message

**List & Actions:**
- [ ] View all uploaded resumes
- [ ] See correct metadata (filename, size, date)
- [ ] Download resume (returns correct file)
- [ ] Delete resume (removes file and record)

**Analysis Flow:**
- [ ] Submit analysis with job description
- [ ] Wait for analysis (10-30 seconds)
- [ ] View detailed feedback
- [ ] See scores for all categories
- [ ] Read tips and explanations
- [ ] Re-analyze same resume

**Error Handling:**
- [ ] Invalid PDF shows clear error
- [ ] Missing API key shows clear error
- [ ] Corrupted file handled gracefully
- [ ] Network errors handled

**Responsive Design:**
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

**Smart Skill Extraction:**
- [ ] Resume context → Gemini success (skills/tools/roles present)
- [ ] Profile context → Gemini success
- [ ] Force fallback (simulate network error) → Heuristic response with evidence
- [ ] DOCX upload → Parsed text and extraction succeeds
- [ ] Editable tags behave (add/remove) and “Apply to Profile” updates skills/tools/roles
- [ ] Evidence list scrolls and indicates LLM vs Heuristic

### Automated Testing

**Unit Tests** (To be added):
```typescript
// lib/enhancedResumeAnalyzer.test.ts
describe('analyzeResumeEnhanced', () => {
  it('should analyze resume successfully', async () => {
    const result = await analyzeResumeEnhanced(
      'Resume text here...',
      'Software Engineer',
      'Job description...'
    );
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.ATS).toBeDefined();
  });
});
```

**Integration Tests** (To be added):
```typescript
// app/api/resumes/route.test.ts
describe('POST /api/resumes', () => {
  it('should upload resume successfully', async () => {
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
  });
});
```

---

## Troubleshooting

### Issue: "PDF parsing error"

**Cause:** PDF is scanned/image-based or corrupted

**Solution:**
- Use text-based PDFs
- Ensure PDF is not password-protected
- Try a different PDF file

### Issue: "Missing Gemini API key"

**Cause:** `GEMINI_API_KEY` not set in `.env.local`

**Solution:**
1. Create `.env.local` if it doesn't exist
2. Add `GEMINI_API_KEY=your_key_here`
3. Restart development server
4. Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Issue: "Analysis takes too long"

**Cause:** Large resume or slow API response

**Solution:**
- Use smaller PDFs (< 5MB recommended)
- Check network connection
- Monitor API response times

### Issue: "File upload fails"

**Cause:** Directory permissions or disk space

**Solution:**
1. Ensure `public/uploads/resumes` exists
2. Check directory permissions
3. Verify available disk space
4. Check server logs for details

---

## Architecture

### File Structure

```
lib/
  ├── enhancedResumeAnalyzer.ts    # AI analysis service
  ├── resumeAnalyzer.ts            # Simple analysis (fallback)
  ├── pdfParser.ts                 # PDF text extraction
  ├── pdfToImage.ts               # PDF to image conversion
  ├── resumeFileService.ts        # File storage operations
  └── resumeService.ts            # Business logic

components/resumes/
  ├── EnhancedResumeAnalysis.tsx   # Detailed analysis display
  ├── EnhancedATS.tsx              # ATS score component
  ├── ResumeAnalysis.tsx           # Simple analysis display
  ├── ResumeCard.tsx               # List item component
  ├── ScoreCircle.tsx              # Score visualization
  └── ...

app/api/resumes/
  ├── route.ts                     # List & upload endpoints
  ├── [id]/route.ts                # Get & delete endpoints
  ├── [id]/analyze/route.ts       # Analysis endpoint
  └── [id]/download/route.ts      # Download endpoint

app/(dashboard)/dashboard/resumes/
  ├── page.tsx                     # Resume list page
  ├── upload/page.tsx              # Upload page
  └── [id]/page.tsx                # Resume detail & analysis page

models/
  └── Resume.ts                    # Mongoose schema
```

### Data Flow

```
1. User uploads PDF
   ↓
2. File saved to storage
   ↓
3. Database record created
   ↓
4. User triggers analysis
   ↓
5. PDF text extracted
   ↓
6. Text sent to Gemini AI
   ↓
7. Analysis results parsed
   ↓
8. Results saved to database
   ↓
9. UI displays feedback
```

### AI Service Integration

The Resume Analyzer uses the unified AI service pattern:

```typescript
// Direct Google Generative AI SDK usage
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-001",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

// Generate analysis
const result = await model.generateContent(prompt);
const text = result.response.text();
const analysis = parseJSON(text);
```

---

## Future Enhancements

### Planned Features

1. **Batch Analysis**
   - Analyze multiple resumes at once
   - Compare resumes side-by-side

2. **Analysis History**
   - Track analysis over time
   - Show improvement trends
   - Export history reports

3. **Resume Templates**
   - Pre-built ATS-optimized templates
   - Industry-specific formats
   - Easy customization

4. **Advanced Matching**
   - Match resume to multiple jobs
   - Rank best-fit opportunities
   - Skills gap analysis

5. **Collaboration**
   - Share resumes with mentors
   - Get peer reviews
   - Track feedback

### Technical Improvements

1. **Performance**
   - Background job queue for analysis
   - WebSocket for real-time progress
   - Caching improvements

2. **Storage**
   - S3/Cloud Storage integration
   - CDN for file delivery
   - File versioning

3. **Security**
   - Virus scanning
   - File encryption
   - Rate limiting

4. **Testing**
   - Unit test coverage
   - Integration tests
   - E2E testing

---

## Support

For issues or questions:
1. Check this documentation
2. Review `SETUP.md` for configuration
3. Check `INTEGRATION_ISSUE_LOG.md` for known issues
4. Review server logs for errors
5. Verify API key status in Google AI Studio

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-XX  
**Status:** ✅ Production Ready (with production recommendations)

