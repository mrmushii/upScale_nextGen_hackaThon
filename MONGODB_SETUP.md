# MongoDB Setup Guide for Upscale

This guide will help you set up MongoDB for the Upscale platform, both locally and in production.

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [MongoDB Atlas (Cloud) Setup](#mongodb-atlas-cloud-setup)
3. [Connecting to MongoDB](#connecting-to-mongodb)
4. [Mongoose Models Overview](#mongoose-models-overview)
5. [Database Operations](#database-operations)
6. [Troubleshooting](#troubleshooting)

---

## 🖥️ Local Development Setup

### Option 1: Install MongoDB Locally (Recommended for Development)

#### Windows

1. **Download MongoDB**
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server
   - Run the installer (MSI file)

2. **Install MongoDB**
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (GUI tool) - recommended

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB**
   - MongoDB should start automatically as a service
   - Or run manually:
   ```bash
   mongod
   ```

#### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify
mongosh
```

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

### Option 2: Use Docker (Easy & Isolated)

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d \
  --name upscale-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=upscale \
  mongo:latest

# Connect to MongoDB
docker exec -it upscale-mongodb mongosh
```

### Set Up Local Database

```bash
# Connect to MongoDB
mongosh

# Create database (it will be created automatically when you insert data)
use upscale

# Create a user for the database
db.createUser({
  user: "upscale_user",
  pwd: "your_password_here",
  roles: [
    { role: "readWrite", db: "upscale" }
  ]
})
```

---

## ☁️ MongoDB Atlas (Cloud) Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier available - M0)

### Step 2: Configure Cluster

1. **Choose Cloud Provider & Region**
   - Provider: AWS / Google Cloud / Azure
   - Region: Choose closest to your location (e.g., Singapore for Bangladesh)

2. **Cluster Tier**
   - Select: M0 (Free tier) for development
   - Upgrade to M10+ for production

3. **Cluster Name**
   - Name: `upscale-cluster` (or any name you prefer)

### Step 3: Configure Security

1. **Database Access**
   - Go to "Database Access"
   - Add New Database User
   - Username: `upscale_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: Read and write to any database

2. **Network Access**
   - Go to "Network Access"
   - Add IP Address
   - For development: Allow access from anywhere (0.0.0.0/0)
   - For production: Add specific IPs (Vercel, your server, etc.)

### Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://upscale_admin:<password>@cluster0.xxxxx.mongodb.net/upscale?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

---

## 🔗 Connecting to MongoDB

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/upscale

# OR MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://upscale_admin:your_password@cluster0.xxxxx.mongodb.net/upscale?retryWrites=true&w=majority
```

### Using the Connection in Your App

The connection is already set up in `lib/mongodb.ts`. Simply import and use:

```typescript
import connectDB from "@/lib/mongodb";

// In your API route or server component
export async function GET() {
  try {
    await connectDB();
    // Your database operations here
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Database connection failed" }, { status: 500 });
  }
}
```

---

## 📊 Mongoose Models Overview

### Available Models

All models are in the `models/` directory:

#### 1. **User Model** (`models/User.ts`)
```typescript
{
  fullName: string;
  email: string; // unique, indexed
  password: string;
  skills: string[];
  subscription: { tier, status, dates };
  usageLimits: { evaluationInterviews, roadmaps, etc. };
}
```

#### 2. **Job Model** (`models/Job.ts`)
```typescript
{
  title: string;
  company: string;
  requiredSkills: string[];
  salary: { min, max, currency };
  status: "active" | "closed";
}
```

#### 3. **Roadmap Model** (`models/Roadmap.ts`)
```typescript
{
  userId: ObjectId;
  targetRole: string;
  stages: [{ name, goals, resources, projects }];
  progress: number;
}
```

#### 4. **Mentor Model** (`models/Mentor.ts`)
```typescript
{
  userId: ObjectId;
  skills: string[];
  hourlyRate: number;
  rating: number;
  verified: boolean;
}
```

#### 5. **Application Model** (`models/Application.ts`)
```typescript
{
  userId: ObjectId;
  jobId: ObjectId;
  status: "applied" | "interview" | "offer";
  notes: string;
}
```

---

## 💻 Database Operations

### Example API Route

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const users = await User.find({})
      .select("-password") // Exclude password
      .limit(10);
    
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const user = await User.create(body);
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
```

### Common Operations

```typescript
// Create
const user = await User.create({ fullName: "John Doe", email: "john@example.com" });

// Find
const users = await User.find({ preferredTrack: "Frontend Development" });
const user = await User.findOne({ email: "john@example.com" });
const userById = await User.findById(userId);

// Update
await User.findByIdAndUpdate(userId, { skills: ["React", "TypeScript"] });

// Delete
await User.findByIdAndDelete(userId);

// Aggregation
const stats = await User.aggregate([
  { $group: { _id: "$preferredTrack", count: { $sum: 1 } } }
]);
```

---

## 🛠️ Troubleshooting

### Connection Issues

**Problem**: `MongooseServerSelectionError`

**Solutions**:
1. Check if MongoDB is running: `mongosh`
2. Verify MONGODB_URI in `.env.local`
3. For Atlas: Check IP whitelist in Network Access
4. For Atlas: Verify username/password

### Port Already in Use

```bash
# Find process using port 27017
netstat -ano | findstr :27017  # Windows
lsof -i :27017                 # Mac/Linux

# Kill the process (use PID from above)
taskkill /F /PID <PID>         # Windows
kill -9 <PID>                  # Mac/Linux
```

### Database Not Creating

MongoDB creates databases lazily (when first document is inserted). Insert a document to create it:

```typescript
await User.create({ /* user data */ });
```

### Slow Queries

Add indexes to frequently queried fields:

```typescript
UserSchema.index({ email: 1 });
UserSchema.index({ skills: 1 });
JobSchema.index({ requiredSkills: 1 });
```

---

## 🎯 Quick Start Checklist

- [ ] Install MongoDB locally OR set up MongoDB Atlas
- [ ] Create `.env.local` with MONGODB_URI
- [ ] Run `npm install` to install mongoose
- [ ] Start your Next.js app: `npm run dev`
- [ ] Test connection with a simple API route
- [ ] Use MongoDB Compass to view your data

---

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Tutorial](https://docs.atlas.mongodb.com/getting-started/)
- [Next.js with MongoDB](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose)

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to version control
2. Use strong passwords for database users
3. Limit IP access in production
4. Enable authentication on local MongoDB
5. Use environment-specific connection strings
6. Rotate credentials regularly
7. Use MongoDB Atlas encryption at rest (production)

---

**Your MongoDB setup is complete! 🎉**

Start building your API routes and database operations!

