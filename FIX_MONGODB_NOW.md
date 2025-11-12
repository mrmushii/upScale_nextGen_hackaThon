# 🔧 Fix MongoDB Atlas Connection - Quick Guide

## ⚡ Your Issue: "bad auth : authentication failed"

This means your `.env.local` file has incorrect MongoDB Atlas credentials.

---

## 🚀 **EASIEST FIX - Option 1: Use Local MongoDB (5 minutes)**

### Just run these commands:

```bash
# 1. Start local MongoDB with Docker
docker run -d -p 27017:27017 --name upscale-mongo mongo:latest

# 2. Update your .env.local file to:
MONGODB_URI=mongodb://localhost:27017/upscale

# 3. Restart your dev server
# Press Ctrl+C to stop, then:
npm run dev

# 4. Test connection
# Visit: http://localhost:3000/api/test
# Should show: "MongoDB connection successful! ✅"

# 5. Seed jobs
npm run seed:jobs

# 6. Register and test!
# Visit: http://localhost:3000/register
```

**DONE! Everything should work now!** ✅

---

## 📱 **Option 2: Fix MongoDB Atlas (10 minutes)**

### Step 1: Get Your Connection String from Atlas

1. Go to https://cloud.mongodb.com
2. Login to your account
3. Click **"Database"** in left sidebar
4. Click **"Connect"** button on your cluster
5. Choose **"Connect your application"**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Username: `upscale_admin` (remember this!)
4. Click **"Autogenerate Secure Password"** → **COPY IT IMMEDIATELY!**
5. Or set your own password: e.g., `Upscale2024!`
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### Step 3: Allow Your IP

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 4: Update .env.local

Open your `.env.local` file and update to:

```env
# Replace with YOUR actual values:
MONGODB_URI=mongodb+srv://upscale_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/upscale?retryWrites=true&w=majority

# Example (REPLACE WITH YOUR OWN):
# MONGODB_URI=mongodb+srv://upscale_admin:Upscale2024!@cluster0.abc123.mongodb.net/upscale?retryWrites=true&w=majority

# Keep these as is:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-characters
```

**IMPORTANT:**
- Replace `upscale_admin` with YOUR username
- Replace `YOUR_PASSWORD_HERE` with YOUR password
- Replace `cluster0.xxxxx.mongodb.net` with YOUR cluster URL
- Keep `/upscale` at the end (database name)

### Step 5: Test

```bash
# Restart server
npm run dev

# Test connection
# Visit: http://localhost:3000/api/test
```

Should show: ✅ "MongoDB connection successful!"

---

## ⚠️ **Special Characters in Password?**

If your password has special characters like `@`, `#`, `%`, encode them:

```
@ → %40
# → %23
% → %25
: → %3A
/ → %2F
```

Example:
- Password: `Pass@123#`
- In connection string: `Pass%40123%23`

---

## ✅ **RECOMMENDED: Option 1 (Local MongoDB)**

**Why?**
- ✅ Faster (no network latency)
- ✅ No authentication issues
- ✅ Works offline
- ✅ Free unlimited storage for development
- ✅ Easier to debug

**Just do this:**
```bash
docker run -d -p 27017:27017 --name upscale-mongo mongo:latest
```

Update `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/upscale
```

Restart server:
```bash
npm run dev
```

**DONE!** ✨

---

## 🧪 **VERIFY IT'S FIXED**

After fixing, test these:

```bash
# 1. Test connection
http://localhost:3000/api/test
→ Should show success message

# 2. Seed jobs
npm run seed:jobs
→ Should add 10 jobs to database

# 3. Register
http://localhost:3000/register
→ Should create user and login

# 4. Check MongoDB
mongosh
use upscale
db.users.find().pretty()
→ Should show your user

db.jobs.find().count()
→ Should show 10 jobs
```

**If all 4 work → YOU'RE GOOD TO GO!** 🎉

---

## 🎯 **WHAT TO DO AFTER FIXING**

Once MongoDB is connected:

1. **Seed Jobs**: `npm run seed:jobs`
2. **Register**: http://localhost:3000/register
3. **Test Features**:
   - Browse jobs (see real match scores)
   - Generate roadmap (AI personalization)
   - Add application (saves to database)
   - Update profile (real-time updates)
4. **Everything should work!** ✨

---

## 📞 **NEED HELP?**

### Quick Checklist:
- [ ] MongoDB is running (Docker or local or Atlas)
- [ ] `.env.local` has correct MONGODB_URI
- [ ] Server restarted after changing .env.local
- [ ] http://localhost:3000/api/test shows success
- [ ] Jobs seeded with `npm run seed:jobs`

### If still stuck:
1. Check the error message in terminal
2. Verify `.env.local` format (no spaces, no < >)
3. Try local MongoDB with Docker (easier!)
4. Check MongoDB Atlas IP whitelist

---

## 🎉 **FINAL NOTE**

**I recommend using local MongoDB for development!**

It's:
- Faster
- Simpler
- No authentication headaches
- Perfect for testing

**Just run:**
```bash
docker run -d -p 27017:27017 mongo:latest
```

Update `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/upscale
```

**And you're done!** 🚀

---

**Fix this and your entire platform will work perfectly!** ✨

