# Fix MongoDB Atlas Authentication Error

## 🔴 Error: "bad auth : authentication failed"

This error means your MongoDB Atlas credentials are incorrect or not set up properly.

---

## ✅ SOLUTION - Step by Step

### Step 1: Create/Verify Database User in Atlas

1. **Go to MongoDB Atlas** → https://cloud.mongodb.com
2. **Login to your account**
3. **Select your project**
4. **Click "Database Access"** (in left sidebar under Security)
5. **Check if you have a user** - If not, create one:
   - Click **"Add New Database User"**
   - Choose **"Password"** authentication
   - Username: `upscale_user` (or any name)
   - **Password**: Click "Autogenerate Secure Password" and **COPY IT!**
   - OR set your own password (remember it!)
   - Database User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

### Step 2: Whitelist Your IP Address

1. **Click "Network Access"** (in left sidebar under Security)
2. **Click "Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add your current IP address
4. **Click "Confirm"**

### Step 3: Get Correct Connection String

1. **Go back to "Database"** (in left sidebar)
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Driver**: Node.js
5. **Version**: 5.5 or later
6. **Copy the connection string** - It looks like:
   ```
   mongodb+srv://upscale_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace `<password>`** with your actual password from Step 1

### Step 4: Update Your .env.local File

Your `.env.local` file should have this exact format:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://upscale_user:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/upscale?retryWrites=true&w=majority

# IMPORTANT: Replace these:
# - upscale_user = your database username
# - YOUR_ACTUAL_PASSWORD = your database password (from Step 1)
# - cluster0.xxxxx.mongodb.net = your cluster address (from connection string)
# - /upscale = your database name (keep this as upscale)

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-characters
```

### Step 5: Test Connection

After updating `.env.local`:

```bash
# Restart your dev server (Ctrl+C then)
npm run dev

# Test the connection
# Open: http://localhost:3000/api/test
```

You should see:
```json
{
  "success": true,
  "message": "MongoDB connection successful! ✅"
}
```

---

## 🔍 COMMON ISSUES

### Issue 1: "Authentication failed"
**Cause**: Wrong password in connection string

**Fix**:
1. Go to Atlas → Database Access
2. Edit your user → Reset password
3. Copy new password
4. Update `.env.local` with new password
5. **Restart dev server**

### Issue 2: Connection string has `<password>` literally
**Fix**: Replace `<password>` with your actual password (no < > brackets!)

❌ Wrong:
```
mongodb+srv://user:<password>@cluster...
```

✅ Correct:
```
mongodb+srv://user:MyActualPassword123@cluster...
```

### Issue 3: Special characters in password
**Fix**: If your password has special characters (@, #, %, etc.), they need to be URL-encoded:

```
@ → %40
# → %23
% → %25
: → %3A
/ → %2F
? → %3F
```

Example:
- Password: `Pass@123#`
- In connection string: `Pass%40123%23`

### Issue 4: "IP not whitelisted"
**Fix**:
1. Go to Atlas → Network Access
2. Add your current IP
3. OR add 0.0.0.0/0 (allow all - for development only)

### Issue 5: Wrong cluster address
**Fix**: Make sure cluster address matches exactly from Atlas

---

## ✅ COMPLETE .env.local EXAMPLE

```env
# Example with actual values (REPLACE WITH YOUR OWN!)

# MongoDB Atlas
MONGODB_URI=mongodb+srv://upscale_admin:SecurePassword123@cluster0.abc123.mongodb.net/upscale?retryWrites=true&w=majority

# Replace:
# - upscale_admin → Your database username
# - SecurePassword123 → Your actual password
# - cluster0.abc123.mongodb.net → Your cluster URL
# - upscale → Database name (keep this)

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=this-is-a-very-long-secret-key-minimum-32-characters-required-for-production
```

---

## 🎯 QUICK FIX CHECKLIST

- [ ] Database user created in Atlas (Database Access)
- [ ] IP address whitelisted (Network Access) → 0.0.0.0/0 for testing
- [ ] Connection string copied from Atlas
- [ ] Password replaced (no `<password>` placeholder)
- [ ] Special characters URL-encoded if needed
- [ ] Database name is `/upscale` at the end
- [ ] `.env.local` file updated
- [ ] Dev server restarted (Ctrl+C, then npm run dev)
- [ ] Test connection: http://localhost:3000/api/test

---

## 📝 STEP-BY-STEP VIDEO GUIDE

If you need visual help, search YouTube for:
- "MongoDB Atlas setup for Next.js"
- "MongoDB Atlas connection string"
- "MongoDB Atlas authentication"

---

## 🆘 STILL NOT WORKING?

### Try Local MongoDB Instead:

```bash
# Install MongoDB locally or use Docker:
docker run -d -p 27017:27017 --name upscale-mongo mongo:latest

# Update .env.local to:
MONGODB_URI=mongodb://localhost:27017/upscale

# Restart server
npm run dev

# Test: http://localhost:3000/api/test
```

---

## ✅ AFTER FIX

Once connection works:
1. Test: http://localhost:3000/api/test → Should show success ✅
2. Seed jobs: `npm run seed:jobs`
3. Register account: http://localhost:3000/register
4. Everything should work! 🎉

---

**Let me know if you need help with any step!** 🚀

