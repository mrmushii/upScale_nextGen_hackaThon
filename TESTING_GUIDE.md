# Upscale Platform - Complete Testing Guide

## 🚀 Quick Start Testing (5 Minutes)

### Step 1: Start MongoDB
```bash
# Option 1: Local MongoDB (if installed)
mongod

# Option 2: Docker (easiest)
docker run -d -p 27017:27017 --name upscale-mongo mongo:latest

# Option 3: Skip for now and use MongoDB Atlas
# (Update MONGODB_URI in .env.local with Atlas connection string)
```

### Step 2: Start the Application
```bash
npm run dev
```

### Step 3: Test the Features

#### ✅ Test 1: Landing Page
1. Visit http://localhost:3000
2. Click "Get Started" → Should go to /register
3. Click "Sign In" → Should go to /login
4. All buttons should navigate correctly

#### ✅ Test 2: User Registration
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
   - Check "Agree to terms"
3. Click "Create Account"
4. Should auto-login and redirect to /dashboard

#### ✅ Test 3: Dashboard Access
1. After registration, you should see the dashboard
2. Try accessing other pages:
   - /dashboard/jobs
   - /dashboard/roadmap
   - /dashboard/interview
   - /dashboard/cv-analyzer
3. All pages should load without errors

#### ✅ Test 4: Logout
1. Click "Logout" in sidebar (or mobile menu)
2. Should redirect to homepage (/)
3. Try accessing /dashboard → Should redirect to /login

#### ✅ Test 5: Login Again
1. Go to http://localhost:3000/login
2. Use same credentials:
   - Email: john@example.com
   - Password: password123
3. Click "Sign In"
4. Should redirect to /dashboard

---

## 🧪 API Testing (Using cURL or Postman)

### Test MongoDB Connection
```bash
curl http://localhost:3000/api/test
```
Expected: `{"success":true,"message":"MongoDB connection successful! ✅"}`

### Test User Registration API
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```
Expected: `{"message":"User created successfully","user":{...}}`

### Test Jobs API
```bash
curl http://localhost:3000/api/jobs
```
Expected: List of jobs (empty if no seed data)

### Test Job Matching (Requires Authentication)
After logging in, use browser console:
```javascript
fetch('/api/jobs/match').then(r => r.json()).then(console.log)
```

---

## 🗄️ Database Testing

### Check MongoDB Connection
```bash
# Connect to MongoDB
mongosh

# List databases
show dbs

# Use upscale database
use upscale

# Check collections
show collections

# View users
db.users.find().pretty()

# View jobs
db.jobs.find().pretty()

# Count documents
db.users.countDocuments()
db.jobs.countDocuments()
```

### Seed Test Data
```bash
# Run job seeding script
npm run seed:jobs
```

Expected output:
```
Cleared existing jobs
✅ Seeded 10 jobs successfully

Jobs by Track:
  - Frontend Development: 5 jobs
  - Full Stack Development: 2 jobs
  - Backend Development: 1 jobs
  - Mobile Development: 1 jobs
  - DevOps: 1 jobs
```

---

## ✅ Feature Testing Checklist

### Authentication ✅
- [ ] User can register with valid data
- [ ] Duplicate email shows error
- [ ] Password validation works
- [ ] Auto-login after registration
- [ ] User can login with correct credentials
- [ ] Invalid credentials show error
- [ ] User can logout
- [ ] Session persists on page reload
- [ ] Protected routes redirect to login

### Dashboard ✅
- [ ] Dashboard shows user stats
- [ ] Profile completion banner displays
- [ ] Quick actions work
- [ ] Navigation works (sidebar + mobile)
- [ ] Search bar functional (placeholder)

### Jobs ✅
- [ ] Jobs listing page loads
- [ ] Search filters jobs
- [ ] Track filter works
- [ ] Remote filter works
- [ ] Job detail page loads
- [ ] Match percentage displays
- [ ] Skill analysis shows overlap/missing
- [ ] Save job button works (frontend only)

### Roadmap ✅
- [ ] Roadmap page displays stages
- [ ] Progress bars show correctly
- [ ] Generate roadmap button works
- [ ] Usage limits are enforced
- [ ] Tier upgrade prompt shows

### Profile ✅
- [ ] Settings page loads
- [ ] Tab navigation works
- [ ] Profile form displays user data
- [ ] Subscription tier displays correctly
- [ ] Usage stats show current limits

---

## 🐛 Common Issues & Solutions

### Issue 1: "MongoDB connection failed"
**Solutions:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows: MongoDB should auto-start as service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Docker: docker start upscale-mongo
```

### Issue 2: "NEXTAUTH_SECRET is not set"
**Solution:**
Check `.env.local` file exists with:
```
NEXTAUTH_SECRET=your-secret-key-min-32-characters
```

### Issue 3: "Cannot POST /api/auth/register"
**Solution:**
Make sure:
1. Server is running (`npm run dev`)
2. File exists at `app/api/auth/register/route.ts`
3. No TypeScript errors (`npm run lint`)

### Issue 4: "Unauthorized" on protected routes
**Solution:**
1. Make sure you're logged in
2. Check session: Open browser console → `fetch('/api/auth/session').then(r=>r.json()).then(console.log)`
3. Clear cookies and login again

### Issue 5: Jobs list is empty
**Solution:**
```bash
# Seed sample jobs
npm run seed:jobs
```

---

## 🎯 Test Scenarios

### Scenario 1: New User Journey
1. ✅ Visit homepage
2. ✅ Click "Get Started"
3. ✅ Fill registration form
4. ✅ Submit and auto-login
5. ✅ See dashboard with stats
6. ✅ Browse jobs
7. ✅ View job details
8. ✅ See match score
9. ✅ Logout
10. ✅ Login again

### Scenario 2: Job Matching
1. ✅ Login as user
2. ✅ Go to /dashboard/jobs
3. ✅ See match percentages on each job
4. ✅ Click job to see details
5. ✅ View skill overlap (green badges)
6. ✅ View missing skills (orange badges)
7. ✅ Match score explanation

### Scenario 3: Roadmap Generation
1. ✅ Login as user
2. ✅ Go to /dashboard/roadmap
3. ✅ Click "Generate New Roadmap"
4. ✅ Select target role
5. ✅ Generate roadmap (API call)
6. ✅ See 3 stages with goals
7. ✅ Track progress visually
8. ✅ Try generating again (usage limit check)

### Scenario 4: Usage Limits (Basic Tier)
1. ✅ Register new user (defaults to Basic tier)
2. ✅ Generate 1 roadmap → Success
3. ✅ Try generating 2nd roadmap → Error: "Upgrade your plan"
4. ✅ See usage stats in settings
5. ✅ See upgrade prompts

---

## 📊 Expected Behavior

### After Registration
```
✅ User created in database
✅ Password hashed with bcrypt
✅ Default tier: "basic"
✅ Usage limits initialized
✅ Auto-logged in
✅ Redirected to /dashboard
```

### After Login
```
✅ Session created with JWT
✅ User data loaded
✅ Dashboard accessible
✅ Protected routes work
✅ Logout button works
```

### Job Matching
```
✅ Fetches active jobs
✅ Calculates match score
✅ Shows overlap skills (green)
✅ Shows missing skills (orange)
✅ Sorts by match percentage
✅ Boost for matching track
```

### Roadmap Generation
```
✅ Checks usage limits
✅ Creates 3-stage roadmap
✅ Stores in database
✅ Increments usage counter
✅ Returns personalized stages
```

---

## 🔍 Debugging Tools

### Check Current Session
```javascript
// In browser console (when logged in)
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log)
```

### Check User Profile
```javascript
// In browser console (when logged in)
fetch('/api/user/profile')
  .then(r => r.json())
  .then(console.log)
```

### Check Job Matches
```javascript
// In browser console (when logged in)
fetch('/api/jobs/match')
  .then(r => r.json())
  .then(console.log)
```

### MongoDB Queries
```bash
# Connect to MongoDB
mongosh

use upscale

# Find all users
db.users.find().pretty()

# Find user by email
db.users.findOne({ email: "john@example.com" })

# Count jobs
db.jobs.countDocuments()

# Find jobs by track
db.jobs.find({ track: "Frontend Development" }).pretty()
```

---

## ✅ What Should Work Now

### Working Features ✅
1. **User Registration** → Full validation, error handling, auto-login
2. **User Login** → Session creation, redirect to dashboard
3. **User Logout** → Session cleanup, redirect to home
4. **Protected Routes** → Middleware blocks unauthorized access
5. **Job Listings** → Fetch from database (if seeded)
6. **Job Matching** → Calculate skill overlap, show match scores
7. **Roadmap Generation** → Create personalized roadmap, check limits
8. **Profile Management** → Fetch and update user data
9. **Session Management** → Persist across page reloads
10. **Error Handling** → User-friendly error messages

### Placeholder Features (UI Ready) 🔄
1. **Mock Interview** → Needs AI integration
2. **CV Analyzer** → Needs AI/parsing integration
3. **Portfolio Builder** → Needs save/publish APIs
4. **Mentor Booking** → Needs payment integration
5. **Community Q&A** → Needs CRUD APIs
6. **Applications Tracker** → Needs CRUD APIs

---

## 🎉 Success Criteria

Your setup is working if:
- ✅ You can register a new user
- ✅ You can login with those credentials
- ✅ Dashboard loads after login
- ✅ /dashboard redirects to /login when logged out
- ✅ Logout button works
- ✅ MongoDB shows users collection
- ✅ No console errors

---

## 📝 Next Steps After Testing

1. **Seed More Data**
   - Run `npm run seed:jobs`
   - Create seed scripts for mentors, resources

2. **Add More APIs**
   - Applications CRUD
   - Community Q&A
   - Mentor booking

3. **AI Integration**
   - OpenAI for CV analysis
   - OpenAI for mock interviews
   - Enhanced roadmap generation

4. **Payment Integration**
   - Stripe for subscriptions
   - bKash/Nagad for local payments
   - Usage limit enforcement

5. **Enhanced Features**
   - Real-time notifications
   - Email notifications
   - File uploads (CV, portfolio images)
   - Advanced search

---

## 🆘 Need Help?

**MongoDB not working?** → See `MONGODB_SETUP.md`
**Authentication issues?** → See `BACKEND_IMPLEMENTATION.md`
**API questions?** → See `BACKEND_GUIDE.md`
**Quick setup?** → See `QUICKSTART.md`

---

**Your platform is LIVE and working! Start testing! 🎉**

