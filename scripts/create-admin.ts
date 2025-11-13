import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import bcrypt from "bcryptjs";

async function createAdminAndRecruiter() {
  try {
    // This will use your MONGODB_URI from .env.local (Atlas connection)
    await connectDB();
    console.log("✅ Connected to MongoDB Atlas");

    // 1️⃣ CREATE/UPDATE ADMIN
    const adminEmail = "admin@upscale.com";
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        fullName: "Platform Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        skills: [],
        preferredTrack: "Full Stack Development",
        targetRoles: ["Platform Administrator"],
        subscription: {
          tier: "ultimate",
          status: "active",
        },
        usageLimits: {
          evaluationInterviews: 999,
          careerRoadmaps: 999,
          mockInterviews: 999,
          projectReviews: 999,
        },
      });
      console.log("✅ Admin user created:", adminEmail);
    } else {
      await User.updateOne(
        { email: adminEmail },
        { $set: { role: "admin" } }
      );
      console.log("✅ Admin role updated for:", adminEmail);
    }

    // 2️⃣ CREATE/UPDATE RECRUITER
    const recruiterEmail = "recruiter@company.com";
    const recruiterExists = await User.findOne({ email: recruiterEmail });
    
    if (!recruiterExists) {
      const hashedPassword = await bcrypt.hash("recruiter123", 10);
      await User.create({
        fullName: "Company Recruiter",
        email: recruiterEmail,
        password: hashedPassword,
        role: "recruiter",
        skills: [],
        preferredTrack: "Recruitment",
        targetRoles: ["HR Manager"],
        subscription: {
          tier: "pro",
          status: "active",
        },
        usageLimits: {
          evaluationInterviews: 50,
          careerRoadmaps: 50,
          mockInterviews: 50,
          projectReviews: 50,
        },
      });
      console.log("✅ Recruiter user created:", recruiterEmail);
    } else {
      await User.updateOne(
        { email: recruiterEmail },
        { $set: { role: "recruiter" } }
      );
      console.log("✅ Recruiter role updated for:", recruiterEmail);
    }

    // 3️⃣ VERIFY
    console.log("\n📊 Current Users with Roles:");
    const allUsers = await User.find(
      {},
      { email: 1, fullName: 1, role: 1 }
    ).lean();
    
    allUsers.forEach(user => {
      console.log(`  - ${user.email} → ${user.role || "user"} (${user.fullName})`);
    });

    console.log("\n🎉 Setup complete!");
    console.log("\n📝 Login Credentials:");
    console.log("   Admin:");
    console.log("   - Email: admin@upscale.com");
    console.log("   - Password: admin123");
    console.log("\n   Recruiter:");
    console.log("   - Email: recruiter@company.com");
    console.log("   - Password: recruiter123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createAdminAndRecruiter();

