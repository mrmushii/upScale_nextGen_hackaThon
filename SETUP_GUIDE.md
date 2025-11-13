# 🚀 Upscale Platform - Setup Guide

## Quick Start

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Start development server
npm run dev

# 3. Create admin account
npm run create:admin

# 4. Visit http://localhost:3000
```

---

## Important Setup Notes

### MongoDB Atlas Connection
Ensure your `.env.local` has:
```env
MONGODB_URI=your-mongodb-atlas-connection-string
NEXTAUTH_SECRET=your-secret-key-here
```

### Default Credentials

**Admin:**
- Email: `admin@upscale.com`
- Password: `admin123`

**Recruiter (after admin approval):**
- Email: `recruiter@company.com`
- Password: `recruiter123`

**Mentors (when created by admin):**
- Default password: `mentor123`

---

## Key Workflows

### Recruiter Registration:
1. Visit `/register-recruiter`
2. Fill company details
3. Submit → Account created (unverified)
4. Login as admin → `/admin/recruiters`
5. Approve recruiter
6. Recruiter can now login

### Job Posting:
1. Recruiter posts job → Created (unapproved)
2. Admin goes to `/admin/jobs`
3. Reviews and approves job
4. Job now visible to all users

### Mentor Creation:
1. Admin goes to `/admin/mentors`
2. Clicks "Add Mentor"
3. Fills mentor details
4. Submit → Mentor created with password `mentor123`
5. Mentor can login immediately

---

## File Uploads

Avatar uploads are saved to: `public/uploads/`

Make sure this directory exists (it's created automatically).

---

## Pages by Role

**Admin:** `/admin/dashboard`, `/admin/users`, `/admin/jobs`, `/admin/recruiters`, `/admin/mentors`, `/admin/analytics`, `/admin/settings`

**Recruiter:** `/recruiter/dashboard`, `/recruiter/jobs/new`, `/recruiter/analytics`, `/recruiter/settings`

**Mentor:** `/mentor/dashboard`, `/mentor/earnings`, `/mentor/settings`

**User:** `/dashboard`, `/dashboard/jobs`, `/dashboard/roadmap`, `/dashboard/settings`, etc.

---

## Troubleshooting

**Mentor not showing after creation?**
- Check MongoDB connection
- Verify API response in browser console
- Refresh the page

**Recruiter can't login?**
- Ensure admin has approved the recruiter
- Check `verified: true` in database

**Jobs not showing to users?**
- Admin must approve jobs first
- Check `approved: true` in database

---

That's it! Your platform is ready to use. 🎉

