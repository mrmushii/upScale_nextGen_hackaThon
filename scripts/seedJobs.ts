import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import Job from "../models/Job";

const sampleJobs = [
  {
    title: "Frontend Developer",
    company: "Tech Solutions Ltd",
    location: "Dhaka, Bangladesh",
    remote: true,
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Git"],
    recommendedExperience: "Entry Level (0-1 years)",
    jobType: "Full-Time",
    description: "We are looking for a talented Frontend Developer to join our growing team.",
    tags: ["Frontend", "React", "Remote"],
    track: "Frontend Development",
    salary: {
      min: 40000,
      max: 60000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "React Developer",
    company: "Digital Innovations",
    location: "Remote",
    remote: true,
    requiredSkills: ["React", "JavaScript", "REST API", "Git", "HTML", "CSS"],
    recommendedExperience: "Junior (1-3 years)",
    jobType: "Full-Time",
    description: "Join our remote team and build amazing web applications with React.",
    tags: ["React", "Remote", "Frontend"],
    track: "Frontend Development",
    salary: {
      min: 50000,
      max: 70000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "Full Stack Developer",
    company: "StartupHub",
    location: "Chattogram, Bangladesh",
    remote: false,
    requiredSkills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
    recommendedExperience: "Mid-Level (3-5 years)",
    jobType: "Full-Time",
    description: "Build end-to-end solutions for our growing startup.",
    tags: ["Full Stack", "Startup", "MERN"],
    track: "Full Stack Development",
    salary: {
      min: 45000,
      max: 65000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "Backend Developer",
    company: "Enterprise Corp",
    location: "Dhaka, Bangladesh",
    remote: true,
    requiredSkills: ["Node.js", "MongoDB", "Express", "REST API", "Docker"],
    recommendedExperience: "Junior (1-3 years)",
    jobType: "Full-Time",
    description: "Work on scalable backend systems for enterprise clients.",
    tags: ["Backend", "Node.js", "MongoDB"],
    track: "Backend Development",
    salary: {
      min: 55000,
      max: 80000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "UI/UX Developer",
    company: "Creative Studio BD",
    location: "Dhaka, Bangladesh",
    remote: false,
    requiredSkills: ["HTML", "CSS", "JavaScript", "Figma", "Responsive Design"],
    recommendedExperience: "Entry Level (0-1 years)",
    jobType: "Contract",
    description: "Create beautiful and intuitive user interfaces.",
    tags: ["UI/UX", "Design", "Frontend"],
    track: "Frontend Development",
    salary: {
      min: 35000,
      max: 50000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "Junior Frontend Developer",
    company: "WebTech Solutions",
    location: "Sylhet, Bangladesh",
    remote: true,
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    recommendedExperience: "Entry Level (0-1 years)",
    jobType: "Full-Time",
    description: "Perfect for fresh graduates looking to start their career in web development.",
    tags: ["Junior", "Frontend", "Remote"],
    track: "Frontend Development",
    salary: {
      min: 30000,
      max: 45000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "Senior React Developer",
    company: "Tech Giants BD",
    location: "Dhaka, Bangladesh",
    remote: true,
    requiredSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "AWS",
      "Docker",
      "GraphQL",
    ],
    recommendedExperience: "Senior (5-10 years)",
    jobType: "Full-Time",
    description: "Lead frontend architecture for our flagship products.",
    tags: ["Senior", "React", "AWS"],
    track: "Frontend Development",
    salary: {
      min: 80000,
      max: 120000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "MERN Stack Developer",
    company: "Digital Agency",
    location: "Remote",
    remote: true,
    requiredSkills: ["MongoDB", "Express", "React", "Node.js", "REST API"],
    recommendedExperience: "Junior (1-3 years)",
    jobType: "Full-Time",
    description: "Work on exciting client projects using the MERN stack.",
    tags: ["MERN", "Full Stack", "Remote"],
    track: "Full Stack Development",
    salary: {
      min: 48000,
      max: 68000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "Mobile App Developer",
    company: "AppCraft BD",
    location: "Dhaka, Bangladesh",
    remote: false,
    requiredSkills: ["React Native", "JavaScript", "Mobile UI", "REST API"],
    recommendedExperience: "Mid-Level (3-5 years)",
    jobType: "Full-Time",
    description: "Build cross-platform mobile applications for iOS and Android.",
    tags: ["Mobile", "React Native", "Apps"],
    track: "Mobile Development",
    salary: {
      min: 60000,
      max: 90000,
      currency: "BDT",
    },
    status: "active",
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Services BD",
    location: "Remote",
    remote: true,
    requiredSkills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    recommendedExperience: "Mid-Level (3-5 years)",
    jobType: "Full-Time",
    description: "Manage cloud infrastructure and deployment pipelines.",
    tags: ["DevOps", "Cloud", "Remote"],
    track: "DevOps",
    salary: {
      min: 70000,
      max: 100000,
      currency: "BDT",
    },
    status: "active",
  },
];

async function seedJobs() {
  try {
    await connectDB();

    // Clear existing jobs
    await Job.deleteMany({});
    console.log("Cleared existing jobs");

    // Insert sample jobs
    const jobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Seeded ${jobs.length} jobs successfully`);

    // Display summary
    console.log("\nJobs by Track:");
    const tracks = [...new Set(jobs.map((j) => j.track))];
    tracks.forEach((track) => {
      const count = jobs.filter((j) => j.track === track).length;
      console.log(`  - ${track}: ${count} jobs`);
    });

    mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
}

seedJobs();

