import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "recruiter" | "mentor";
  educationLevel: string;
  experienceLevel: string;
  preferredTrack: string;
  targetRoles: string[];
  skills: string[];
  cvText?: string;
  country: string;
  city: string;
  avatar?: string;
  verified?: boolean;
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
    skills: {
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

