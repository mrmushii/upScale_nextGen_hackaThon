# Part 2 Hackathon - Missing Features Implementation Guide

This guide provides step-by-step instructions for implementing the missing Part 2 features.

---

## 1. CareerBot / Mentor Assistant Implementation

### Overview
A conversational AI assistant that helps users with career-related queries using the unified AI service.

### Implementation Steps

#### Step 1: Create API Endpoint

**File:** `app/api/chat/careerbot/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { runInterviewPrompt } from "@/lib/unifiedAI";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { message, conversationHistory = [] } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build context-aware prompt
    const userContext = `
User Profile:
- Skills: ${(user.skills || []).join(", ") || "None specified"}
- Preferred Track: ${user.preferredTrack || "Not specified"}
- Experience Level: ${user.experienceLevel || "Not specified"}
- Target Roles: ${(user.targetRoles || []).join(", ") || "None specified"}
`;

    const systemPrompt = `You are CareerBot, a helpful career mentor assistant focused on helping youth access decent work opportunities (SDG 8).

Your role:
- Provide career guidance and advice
- Help users understand which roles fit their skills
- Suggest learning paths and next steps
- Offer tips for improving job application success
- Be encouraging and supportive

IMPORTANT:
- Always indicate when you're making suggestions, not guarantees
- Focus on practical, actionable advice
- Consider the user's current skills and experience level
- Align advice with SDG 8 goals (decent work for youth)
- Keep responses concise and helpful

User Context:
${userContext}

Conversation History:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}

User Question: ${message}

Provide a helpful, encouraging response that addresses their question while considering their profile.`;

    // Use unified AI service
    const response = await runInterviewPrompt(systemPrompt);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("CareerBot error:", error);
    return NextResponse.json(
      {
        error: "Failed to get response from CareerBot",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
```

#### Step 2: Create React Component

**File:** `components/career/CareerBot.tsx`

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function CareerBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm CareerBot, your career mentor. How can I help you today? Ask me about career paths, skills to learn, or job search tips!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat/careerbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble right now. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-blue-50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">CareerBot</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Your AI career mentor assistant
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask CareerBot anything about your career..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Try: "Which roles fit my skills?" or "What should I learn next?"
        </p>
      </div>
    </div>
  );
}
```

#### Step 3: Add to Dashboard

**File:** `app/(dashboard)/dashboard/page.tsx` (or create new page)

Add CareerBot component to dashboard:

```typescript
import CareerBot from "@/components/career/CareerBot";

// In your dashboard component:
<CareerBot />
```

#### Step 4: Add Navigation Link

Add to dashboard navigation:
- Link: `/dashboard/careerbot` or embed in dashboard page

---

## 2. CV / Profile Assistant Implementation

### Overview
Auto-generate CV from user profile data with AI suggestions.

### Implementation Steps

#### Step 1: Create CV Generation Service

**File:** `lib/cvGenerator.ts`

```typescript
import { generateTextUnified, parseJSONFromText } from "./unifiedAI";

export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
  };
  professionalSummary: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export async function generateCVFromProfile(user: any): Promise<CVData> {
  // Extract user data
  const personalInfo = {
    name: user.name || "Your Name",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    linkedin: user.linkedin || "",
    portfolio: user.portfolio || "",
  };

  const skills = user.skills || [];
  const experience = user.experience || [];
  const education = user.education || [];
  const projects = user.projects || [];

  // Generate professional summary using AI
  const summaryPrompt = `Generate a professional summary (2-3 sentences) for a resume based on:

Skills: ${skills.join(", ")}
Experience Level: ${user.experienceLevel || "Entry level"}
Preferred Track: ${user.preferredTrack || "Not specified"}
Target Roles: ${(user.targetRoles || []).join(", ")}

Make it professional, concise, and highlight key strengths.`;

  let professionalSummary = "";
  try {
    const summary = await generateTextUnified({
      prompt: summaryPrompt,
      system: "You are a professional resume writer. Create compelling professional summaries.",
    });
    professionalSummary = summary.trim();
  } catch (error) {
    professionalSummary = `Experienced ${user.preferredTrack || "professional"} with expertise in ${skills.slice(0, 3).join(", ")}.`;
  }

  // Enhance experience descriptions with AI
  const enhancedExperience = await Promise.all(
    experience.map(async (exp: any) => {
      if (exp.description && Array.isArray(exp.description)) {
        return exp; // Already has descriptions
      }

      // Generate bullet points
      const bulletPrompt = `Generate 3-4 strong, action-oriented bullet points for a resume based on:

Job Title: ${exp.title || "Position"}
Company: ${exp.company || "Company"}
Duration: ${exp.duration || ""}
Skills: ${skills.join(", ")}

Format as JSON array: ["bullet point 1", "bullet point 2", ...]`;

      try {
        const bullets = await generateTextUnified({
          prompt: bulletPrompt,
          system: "You are a professional resume writer. Create impactful bullet points.",
        });
        const parsed = parseJSONFromText(bullets);
        return {
          ...exp,
          description: Array.isArray(parsed) ? parsed : [bullets],
        };
      } catch (error) {
        return {
          ...exp,
          description: ["• Accomplished key objectives", "• Collaborated with team members"],
        };
      }
    })
  );

  return {
    personalInfo,
    professionalSummary,
    skills,
    experience: enhancedExperience,
    education,
    projects,
  };
}

export async function generateCVSuggestions(cvData: CVData): Promise<{
  summarySuggestions: string[];
  linkedinTips: string[];
  portfolioTips: string[];
}> {
  const prompt = `Analyze this CV data and provide suggestions:

Professional Summary: ${cvData.professionalSummary}
Skills: ${cvData.skills.join(", ")}
Experience: ${cvData.experience.length} positions
Projects: ${cvData.projects.length} projects

Provide:
1. 2-3 alternative professional summaries
2. LinkedIn profile improvement tips (3-4 tips)
3. Portfolio/online presence tips (3-4 tips)

Return as JSON:
{
  "summarySuggestions": ["suggestion1", "suggestion2"],
  "linkedinTips": ["tip1", "tip2"],
  "portfolioTips": ["tip1", "tip2"]
}`;

  try {
    const response = await generateTextUnified({
      prompt,
      system: "You are a career advisor providing CV and profile improvement suggestions.",
    });
    return parseJSONFromText(response);
  } catch (error) {
    return {
      summarySuggestions: ["Consider highlighting your key achievements", "Emphasize your technical skills"],
      linkedinTips: ["Complete your profile", "Add a professional headshot", "List all relevant skills"],
      portfolioTips: ["Showcase your best projects", "Include live demos", "Write clear project descriptions"],
    };
  }
}
```

#### Step 2: Create API Endpoint

**File:** `app/api/cv/generate/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateCVFromProfile, generateCVSuggestions } from "@/lib/cvGenerator";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { includeSuggestions = false } = await request.json();

    // Generate CV data
    const cvData = await generateCVFromProfile(user);

    let suggestions = null;
    if (includeSuggestions) {
      suggestions = await generateCVSuggestions(cvData);
    }

    return NextResponse.json({
      cv: cvData,
      suggestions,
    });
  } catch (error: any) {
    console.error("CV generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CV", details: error.message },
      { status: 500 }
    );
  }
}
```

#### Step 3: Create CV Display Component

**File:** `components/cv/CVPreview.tsx`

```typescript
"use client";

import { CVData } from "@/lib/cvGenerator";
import { Download, Printer } from "lucide-react";

interface CVPreviewProps {
  cvData: CVData;
}

export default function CVPreview({ cvData }: CVPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate PDF (you can use jsPDF or similar)
    // For now, just trigger print
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:p-6">
      {/* Header with actions */}
      <div className="mb-6 flex justify-end gap-2 print:hidden">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* CV Content */}
      <div className="space-y-6">
        {/* Personal Info */}
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold">{cvData.personalInfo.name}</h1>
          <div className="mt-2 space-x-4 text-sm text-gray-600">
            {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
            {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
            {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
          </div>
          <div className="mt-2 space-x-4 text-sm">
            {cvData.personalInfo.linkedin && (
              <a href={cvData.personalInfo.linkedin} className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            )}
            {cvData.personalInfo.portfolio && (
              <a href={cvData.personalInfo.portfolio} className="text-blue-600 hover:underline">
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h2 className="text-xl font-semibold border-b mb-2">Professional Summary</h2>
          <p className="text-gray-700">{cvData.professionalSummary}</p>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold border-b mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Experience</h2>
            <div className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">{exp.duration}</span>
                  </div>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Education</h2>
            <div className="space-y-2">
              {cvData.education.map((edu, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Projects</h2>
            <div className="space-y-4">
              {cvData.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### Step 4: Create CV Page

**File:** `app/(dashboard)/dashboard/cv/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import CVPreview from "@/components/cv/CVPreview";
import { CVData } from "@/lib/cvGenerator";

export default function CVPage() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<any>(null);

  useEffect(() => {
    generateCV();
  }, []);

  const generateCV = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ includeSuggestions: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate CV");
      }

      const data = await response.json();
      setCvData(data.cv);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Generating your CV...</div>;
  }

  if (!cvData) {
    return <div className="p-8">Failed to generate CV. Please try again.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your CV</h1>
      <CVPreview cvData={cvData} />
      
      {suggestions && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Improvement Suggestions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Professional Summary Alternatives</h3>
              <ul className="list-disc list-inside space-y-1">
                {suggestions.summarySuggestions?.map((s: string, i: number) => (
                  <li key={i} className="text-sm">{s}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">LinkedIn Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                {suggestions.linkedinTips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm">{tip}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Portfolio Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                {suggestions.portfolioTips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Step 5: Add Navigation Link

Add to dashboard navigation:
- Link: `/dashboard/cv`

---

## 3. Testing Checklist

### CareerBot Testing
- [ ] Test basic conversation flow
- [ ] Test context awareness (uses user profile)
- [ ] Test error handling
- [ ] Test loading states
- [ ] Verify SDG 8 alignment in responses

### CV Assistant Testing
- [ ] Test CV generation from profile
- [ ] Test professional summary generation
- [ ] Test experience bullet point generation
- [ ] Test suggestions generation
- [ ] Test print/PDF export
- [ ] Verify all user data is included

---

## 4. Integration Notes

### Dependencies
- Uses existing `unifiedAI.ts` service
- No new dependencies required
- Uses existing UI components and styling

### Database
- No new models required
- Uses existing User model

### API Routes
- `/api/chat/careerbot` - CareerBot endpoint
- `/api/cv/generate` - CV generation endpoint

---

## 5. Future Enhancements

### CareerBot
- Conversation history persistence
- Voice input/output
- Multi-language support
- Integration with roadmap and job matching

### CV Assistant
- Multiple CV templates
- PDF generation with jsPDF
- Real-time editing
- ATS optimization suggestions
- Export to Word format

---

**Last Updated:** 2024-12-19  
**Implementation Guide By:** Development Team

