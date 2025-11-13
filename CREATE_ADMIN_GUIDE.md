# 🔑 Creating Admin & Recruiter Accounts - MongoDB Atlas Guide

> **For MongoDB Atlas Users Only** - No Docker or Compass needed!

---

## 🎯 **Quick Overview**

Your Upscale platform has 4 roles:
- **USER** (default) - Job seekers
- **ADMIN** - Platform owners with full control  
- **RECRUITER** - Companies posting jobs
- **MENTOR** - Industry professionals

---

## ⚡ **FASTEST METHOD: Run the Script (30 seconds)**

### **Step 1: Run the Script**

```bash
npm run create:admin
```

**What it does:**
- ✅ Connects to your MongoDB Atlas database
- ✅ Creates admin account: `admin@upscale.com` / `admin123`
- ✅ Creates recruiter account: `recruiter@company.com` / `recruiter123`
- ✅ Shows you all users with their roles

**Expected Output:**
```
✅ Connected to MongoDB Atlas
✅ Admin user created: admin@upscale.com
✅ Recruiter user created: recruiter@company.com

📊 Current Users with Roles:
  - admin@upscale.com → admin (Platform Admin)
  - recruiter@company.com → recruiter (Company Recruiter)

🎉 Setup complete!

📝 Login Credentials:
   Admin:
   - Email: admin@upscale.com
   - Password: admin123

   Recruiter:
   - Email: recruiter@company.com
   - Password: recruiter123
```

### **Step 2: Test Your Accounts**

```bash
# Start your app
npm run dev
```

1. Go to `http://localhost:3000`
2. **Login as Admin**:
   - Email: `admin@upscale.com`
   - Password: `admin123`
   - ✅ Redirects to `/admin/dashboard`
   
3. **Logout and Login as Recruiter**:
   - Email: `recruiter@company.com`
   - Password: `recruiter123`
   - ✅ Redirects to `/recruiter/dashboard`

---

## 🌐 **Method 2: MongoDB Atlas Web Interface**

### **Step 1: Register Users First**

1. Go to `http://localhost:3000`
2. Click **"Get Started"**
3. Register:
   - `admin@upscale.com` / `yourpassword`
   - `recruiter@company.com` / `yourpassword`

### **Step 2: Update Roles in Atlas**

1. Go to https://cloud.mongodb.com
2. Login to your MongoDB Atlas account
3. Click **"Browse Collections"** on your cluster
4. Select database: **`upscale`**
5. Select collection: **`users`**

**Create Admin:**
1. Find user: `admin@upscale.com`
2. Click **pencil icon** (Edit)
3. Change `"role": "user"` to `"role": "admin"`
4. Click **Update**

**Create Recruiter:**
1. Find user: `recruiter@company.com`
2. Click **pencil icon** (Edit)
3. Change `"role": "user"` to `"role": "recruiter"`
4. Click **Update**

---

## 💻 **Method 3: Using mongosh with Atlas**

### **Step 1: Install mongosh**

**Windows:**
```bash
winget install MongoDB.Shell
```

**Or download:** https://www.mongodb.com/try/download/shell

### **Step 2: Get Your Atlas Connection String**

1. Go to MongoDB Atlas → Your Cluster
2. Click **"Connect"**
3. Choose **"Connect with MongoDB Shell"**
4. Copy the connection string:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/upscale
   ```
5. Replace `<password>` with your actual password

### **Step 3: Connect and Update Roles**

```bash
# Connect to Atlas
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/upscale"
```

Once connected, run:

```javascript
// Create Admin
db.users.updateOne(
  { email: "admin@upscale.com" },
  { $set: { role: "admin" } }
)

// Create Recruiter
db.users.updateOne(
  { email: "recruiter@company.com" },
  { $set: { role: "recruiter" } }
)

// Verify
db.users.find({}, { email: 1, fullName: 1, role: 1 }).pretty()
```

---

## 🔧 **Customize the Script**

Edit `scripts/create-admin.ts` to change credentials:

```typescript
// Change admin email/password
const adminEmail = "youradmin@yourdomain.com";
const hashedPassword = await bcrypt.hash("your-secure-password", 10);

// Change recruiter email/password
const recruiterEmail = "recruiter@yourcompany.com";
const hashedPassword = await bcrypt.hash("recruiter-password", 10);
```

Then run:
```bash
npm run create:admin
```

---

## ✅ **Verify Everything Works**

### **Admin Dashboard Checklist:**
Login as admin → You should see:
- ✅ URL: `/admin/dashboard`
- ✅ Navigation: Users, Jobs, Mentors, Recruiters, Analytics
- ✅ Can manage mentors
- ✅ Can view all users
- ✅ Can moderate jobs
- ✅ Platform statistics

### **Recruiter Dashboard Checklist:**
Login as recruiter → You should see:
- ✅ URL: `/recruiter/dashboard`
- ✅ Navigation: Dashboard, My Jobs, Post Job, Analytics
- ✅ Can create job postings
- ✅ Can view applications
- ✅ Job analytics

---

## 🚨 **Troubleshooting**

### **Issue: Still seeing user dashboard after login**
**Solution:** The user wasn't updated. Try:
```bash
npm run create:admin
```

### **Issue: Script connection error**
**Solution:** Check your `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/upscale
```

### **Issue: "User already exists" but still has wrong role**
**Solution:** The script automatically updates the role. Just run it again:
```bash
npm run create:admin
```

### **Issue: Can't connect to Atlas**
**Solutions:**
1. Check your IP is whitelisted in Atlas (Network Access)
2. Verify your database user credentials
3. Ensure you're using the correct connection string

---

## 📊 **What Each Role Can Do**

| Feature | User | Recruiter | Admin |
|---------|------|-----------|-------|
| Browse Jobs | ✅ | ✅ | ✅ |
| Apply to Jobs | ✅ | ❌ | ✅ |
| Post Jobs | ❌ | ✅ | ✅ |
| View Applications (own) | ✅ | ❌ | ❌ |
| View Applications (posted jobs) | ❌ | ✅ | ✅ |
| Approve Mentors | ❌ | ❌ | ✅ |
| View All Users | ❌ | ❌ | ✅ |
| Platform Analytics | ❌ | Own jobs only | ✅ All |
| Manage Recruiters | ❌ | ❌ | ✅ |
| Generate Roadmaps | ✅ | ❌ | ✅ |
| CV Analysis | ✅ | ❌ | ✅ |
| Mock Interviews | ✅ | ❌ | ✅ |

---

## 🎯 **Recommended Setup**

### **For Development:**

Run the script to create test accounts:
```bash
npm run create:admin
```

You get:
- ✅ `admin@upscale.com` - Full admin access
- ✅ `recruiter@company.com` - Job posting access

### **For Production:**

1. Edit `scripts/create-admin.ts` with your actual credentials
2. Run `npm run create:admin`
3. **Change the passwords** immediately after first login!

---

## 🔐 **Security Best Practices**

### **For Production Deployment:**

1. **Change Default Passwords:**
   ```javascript
   // In the script, use strong passwords
   const hashedPassword = await bcrypt.hash("YourStr0ng!P@ssw0rd", 10);
   ```

2. **Use Environment Variables:**
   ```env
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your-secure-password
   ```

3. **Whitelist IPs in Atlas:**
   - Go to Network Access in Atlas
   - Add your production server IP
   - Remove `0.0.0.0/0` (allow all) if present

4. **Enable 2FA:**
   - Add two-factor authentication for admin accounts (future feature)

---

## 🚀 **Quick Reference Commands**

```bash
# Create admin and recruiter
npm run create:admin

# Start development server
npm run dev

# Seed sample jobs
npm run seed:jobs

# View Atlas connection
# Check .env.local for MONGODB_URI
```

---

## 📝 **Next Steps**

1. ✅ Run `npm run create:admin`
2. ✅ Login as admin → Test features
3. ✅ Login as recruiter → Post a test job
4. ✅ Login as regular user → Browse jobs
5. 🎉 Your multi-role system is ready!

---

## 🆘 **Need More Help?**

Check these docs:
- `ROLE_BASED_SYSTEM.md` - Complete role documentation
- `TESTING_GUIDE.md` - How to test all features
- `START_HERE.md` - Platform overview
- `README.md` - Project setup

---

**Your admin and recruiter accounts are ready! 🎉**

Login and start managing your platform! 🚀

