import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "recruiter" | "mentor";
  educationLevel: string;
  educationDepartment?: string;
  education?: Array<{
    degree: string;
    institution: string;
    field: string;
    year: string;
    gpa?: string;
  }>;
  experienceLevel: string;
  preferredTrack: string;
  targetRoles: string[];
  tools?: string[];
  skills: string[];
  experience?: Array<{
    title: string;
    company?: string;
    location?: string;
    description: string[];  // Array of bullet points
    startDate?: Date;
    endDate?: Date;
    current?: boolean;
    technologies?: string[];
    achievements?: string[];
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string[];
    url?: string;
    githubUrl?: string;
    startDate?: Date;
    endDate?: Date;
    highlights?: string[];
  }>;
  careerInterests?: string[];
  cvText?: string;
  country: string;
  city: string;
  avatar?: string;
  verified?: boolean;
  phone?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  dateOfBirth?: Date;
  gender?: string;
  languages?: string[];
  availability?: string;
  salaryExpectation?: string;
  workAuthorization?: string;
  profileCompleted?: boolean;
  profileCompletionPercentage?: number;
  companyName?: string;
  companyWebsite?: string;
  position?: string;
  subscription?: {
    tier: "basic" | "pro" | "ultimate";
    status: "active" | "cancelled" | "expired";
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
  };
  usageLimits?: {
    evaluationInterviews: number;
    careerRoadmaps: number;
    mockInterviews: number;
    cvAnalyses: number;
    mentorSessions: number;
    resetDate: Date;
  };
  preferences?: {
    account?: {
      twoFactorEnabled: boolean;
      loginAlerts: boolean;
      backupEmail?: string;
    };
    notifications?: {
      emailUpdates: boolean;
      productUpdates: boolean;
      jobAlerts: boolean;
      mentorReminders: boolean;
    };
    privacy?: {
      profileVisibility: "public" | "community" | "private";
      showSkills: boolean;
      showProjects: boolean;
      showActivity: boolean;
      allowMessages: boolean;
    };
    billing?: {
      defaultPaymentMethod: "card" | "bkash" | "nagad" | string;
      sendInvoices: boolean;
      taxId?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "recruiter", "mentor"],
      default: "user",
    },
    educationLevel: {
      type: String,
      required: true,
    },
    educationDepartment: {
      type: String,
    },
    education: {
      type: [
        {
          degree: String,        // e.g., "Bachelor's", "Master's", "PhD"
          institution: String,   // University/College name
          field: String,         // Field of study (e.g., "Computer Science")
          year: String,          // Graduation year or range (e.g., "2020" or "2018-2022")
          gpa: String,           // Optional GPA
        },
      ],
      default: [],
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    preferredTrack: {
      type: String,
      required: true,
    },
    targetRoles: {
      type: [String],
      default: [],
    },
    tools: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: [
        {
          title: String,
          company: String,
          location: String,      // Optional location
          description: [String],  // Array of bullet points (3-5 recommended)
          startDate: Date,
          endDate: Date,
          current: { type: Boolean, default: false },
          technologies: [String], // Technologies used
          achievements: [String], // Key achievements (optional)
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          technologies: [String],
          url: String,           // Live URL
          githubUrl: String,     // GitHub repository URL
          startDate: Date,
          endDate: Date,
          highlights: [String],  // Key features/achievements
        },
      ],
      default: [],
    },
    careerInterests: {
      type: [String],
      default: [],
    },
    cvText: {
      type: String,
    },
    country: {
      type: String,
      default: "Bangladesh",
    },
    city: {
      type: String,
    },
    avatar: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: true, // Default true for users, false for recruiters/mentors
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    linkedin: {
      type: String,
    },
    github: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    website: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    languages: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
    },
    salaryExpectation: {
      type: String,
    },
    workAuthorization: {
      type: String,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    companyName: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    position: {
      type: String,
    },
    subscription: {
      tier: {
        type: String,
        enum: ["basic", "pro", "ultimate"],
        default: "basic",
      },
      status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
      autoRenew: {
        type: Boolean,
        default: false,
      },
    },
    usageLimits: {
      evaluationInterviews: {
        type: Number,
        default: 0,
      },
      careerRoadmaps: {
        type: Number,
        default: 0,
      },
      mockInterviews: {
        type: Number,
        default: 0,
      },
      cvAnalyses: {
        type: Number,
        default: 0,
      },
      mentorSessions: {
        type: Number,
        default: 0,
      },
      resetDate: {
        type: Date,
        default: () => {
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          return date;
        },
      },
    },
    preferences: {
      account: {
        twoFactorEnabled: { type: Boolean, default: false },
        loginAlerts: { type: Boolean, default: true },
        backupEmail: { type: String, default: "" },
      },
      notifications: {
        emailUpdates: { type: Boolean, default: true },
        productUpdates: { type: Boolean, default: true },
        jobAlerts: { type: Boolean, default: true },
        mentorReminders: { type: Boolean, default: true },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "community", "private"],
          default: "public",
        },
        showSkills: { type: Boolean, default: true },
        showProjects: { type: Boolean, default: true },
        showActivity: { type: Boolean, default: false },
        allowMessages: { type: Boolean, default: true },
      },
      billing: {
        defaultPaymentMethod: { type: String, default: "card" },
        sendInvoices: { type: Boolean, default: true },
        taxId: { type: String, default: "" },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// Note: email index is automatically created by unique: true
UserSchema.index({ skills: 1 });
UserSchema.index({ preferredTrack: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;

