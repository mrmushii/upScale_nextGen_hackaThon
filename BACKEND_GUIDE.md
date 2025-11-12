# Backend Development Guide - Upscale

This guide covers backend development for the Upscale platform using Next.js API Routes, MongoDB, and Mongoose.

## 🏗️ Architecture Overview

```
Frontend (Next.js) → API Routes → MongoDB (Mongoose)
                  ↓
           NextAuth (Authentication)
                  ↓
           Middleware (Authorization)
```

## 📦 Database Models

### 1. User Model
Located: `models/User.ts`

```typescript
{
  fullName: string;
  email: string; // unique, indexed
  password: string; // hashed
  skills: string[];
  preferredTrack: string;
  targetRoles: string[];
  subscription: {
    tier: "basic" | "pro" | "ultimate";
    status: "active" | "cancelled" | "expired";
  };
  usageLimits: {
    evaluationInterviews: number;
    careerRoadmaps: number;
    // ... other limits
  };
}
```

**Usage Example:**
```typescript
import { User } from "@/models";

// Create user
const user = await User.create({
  fullName: "John Doe",
  email: "john@example.com",
  password: hashedPassword,
  // ...
});

// Find user
const user = await User.findOne({ email: "john@example.com" });

// Update usage limits
await User.findByIdAndUpdate(userId, {
  $inc: { "usageLimits.evaluationInterviews": 1 }
});
```

### 2. Job Model
Located: `models/Job.ts`

```typescript
{
  title: string;
  company: string;
  requiredSkills: string[];
  location: string;
  remote: boolean;
  salary: { min, max, currency };
  status: "active" | "closed" | "draft";
}
```

### 3. Roadmap Model
Located: `models/Roadmap.ts`

```typescript
{
  userId: ObjectId;
  targetRole: string;
  stages: [{
    name: string;
    goals: string[];
    resources: string[];
    estimatedWeeks: number;
  }];
  progress: number; // 0-100
}
```

### 4. Mentor Model
Located: `models/Mentor.ts`

```typescript
{
  userId: ObjectId;
  skills: string[];
  hourlyRate: number;
  rating: number;
  verified: boolean;
  sessionsCompleted: number;
}
```

### 5. Application Model
Located: `models/Application.ts`

```typescript
{
  userId: ObjectId;
  jobId: ObjectId;
  status: "applied" | "interview" | "offer" | "rejected";
  notes: string;
  appliedAt: Date;
}
```

## 🛣️ API Routes Structure

### Authentication Routes

#### `POST /api/auth/register`
```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { fullName, email, password } = await request.json();
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    
    return NextResponse.json(
      { message: "User created", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
```

#### `POST /api/auth/login`
```typescript
// app/api/auth/login/route.ts
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  await connectDB();
  const { email, password } = await request.json();
  
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
  
  // Create session (using NextAuth or JWT)
  // Return token or session
  
  return NextResponse.json({ user: { id: user._id, email: user.email } });
}
```

### Job Routes

#### `GET /api/jobs`
```typescript
// app/api/jobs/route.ts
export async function GET(request: NextRequest) {
  await connectDB();
  
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  
  const query = track ? { track, status: "active" } : { status: "active" };
  
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  const total = await Job.countDocuments(query);
  
  return NextResponse.json({
    jobs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
```

#### `POST /api/jobs` (Admin only)
```typescript
export async function POST(request: NextRequest) {
  // Check authentication & authorization
  
  await connectDB();
  const jobData = await request.json();
  
  const job = await Job.create(jobData);
  
  return NextResponse.json({ job }, { status: 201 });
}
```

### Roadmap Routes

#### `POST /api/roadmap/generate`
```typescript
// app/api/roadmap/generate/route.ts
export async function POST(request: NextRequest) {
  await connectDB();
  
  const { userId, targetRole } = await request.json();
  
  // Check user's subscription and usage limits
  const user = await User.findById(userId);
  
  if (user.subscription.tier === "basic" && user.usageLimits.careerRoadmaps >= 1) {
    return NextResponse.json(
      { error: "Upgrade to Pro for more roadmaps" },
      { status: 403 }
    );
  }
  
  // Generate roadmap (rule-based or AI)
  const stages = generateRoadmapStages(user, targetRole);
  
  const roadmap = await Roadmap.create({
    userId,
    targetRole,
    stages,
  });
  
  // Increment usage
  await User.findByIdAndUpdate(userId, {
    $inc: { "usageLimits.careerRoadmaps": 1 }
  });
  
  return NextResponse.json({ roadmap });
}
```

### Job Matching Route

#### `GET /api/jobs/match`
```typescript
// app/api/jobs/match/route.ts
export async function GET(request: NextRequest) {
  await connectDB();
  
  const userId = request.headers.get("x-user-id"); // From auth middleware
  const user = await User.findById(userId);
  
  // Find jobs matching user skills
  const jobs = await Job.find({
    status: "active",
    requiredSkills: { $in: user.skills },
  }).limit(10);
  
  // Calculate match scores
  const matches = jobs.map(job => {
    const overlap = job.requiredSkills.filter(skill =>
      user.skills.includes(skill)
    );
    const missing = job.requiredSkills.filter(skill =>
      !user.skills.includes(skill)
    );
    const score = (overlap.length / job.requiredSkills.length) * 100;
    
    return {
      job,
      score: Math.round(score),
      overlap,
      missing,
    };
  });
  
  // Sort by score
  matches.sort((a, b) => b.score - a.score);
  
  return NextResponse.json({ matches });
}
```

## 🔐 Middleware & Authentication

### Auth Middleware
```typescript
// middleware.ts (root level)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  
  // Protected routes
  const protectedPaths = ["/api/roadmap", "/api/profile", "/api/applications"];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtected && !token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
```

## 📊 Usage Limit Checks

### Utility Function
```typescript
// lib/checkUsageLimit.ts
export async function checkUsageLimit(
  userId: string,
  feature: "evaluationInterviews" | "careerRoadmaps" | "mockInterviews"
): Promise<{ allowed: boolean; message?: string }> {
  const user = await User.findById(userId);
  
  const limits = {
    basic: { evaluationInterviews: 1, careerRoadmaps: 1, mockInterviews: 0 },
    pro: { evaluationInterviews: 10, careerRoadmaps: 5, mockInterviews: 20 },
    ultimate: { evaluationInterviews: Infinity, careerRoadmaps: Infinity, mockInterviews: Infinity },
  };
  
  const userLimit = limits[user.subscription.tier][feature];
  const currentUsage = user.usageLimits[feature];
  
  if (currentUsage >= userLimit) {
    return {
      allowed: false,
      message: `Upgrade your plan to access more ${feature}`,
    };
  }
  
  return { allowed: true };
}
```

## 🧪 Testing API Routes

### Test MongoDB Connection
```bash
# Start your dev server
npm run dev

# Test connection
curl http://localhost:3000/api/test
```

### Using Thunder Client / Postman

**Create User**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Jobs**
```
GET http://localhost:3000/api/jobs?track=Frontend%20Development&page=1
```

## 📈 Performance Optimization

### 1. Indexing
Already added in models:
```typescript
UserSchema.index({ email: 1 });
UserSchema.index({ skills: 1 });
JobSchema.index({ requiredSkills: 1 });
```

### 2. Pagination
Always paginate large datasets:
```typescript
const page = parseInt(req.query.page) || 1;
const limit = 20;
const skip = (page - 1) * limit;

const jobs = await Job.find().skip(skip).limit(limit);
```

### 3. Select Only Needed Fields
```typescript
const users = await User.find().select("fullName email skills -_id");
```

### 4. Lean Queries (for read-only)
```typescript
const jobs = await Job.find().lean(); // Returns plain JS objects
```

## 🔄 Next Steps

1. ✅ MongoDB setup complete
2. ✅ Models defined
3. ⏳ Implement authentication (NextAuth.js)
4. ⏳ Create all API routes
5. ⏳ Add input validation (Zod)
6. ⏳ Implement rate limiting
7. ⏳ Add error handling middleware
8. ⏳ Write API tests

## 📚 Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)

---

**Ready to build! 🚀**

