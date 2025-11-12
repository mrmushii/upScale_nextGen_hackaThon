import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IMentor {
  userId: mongoose.Types.ObjectId;
  name: string;
  bio: string;
  skills: string[];
  roles: string[];
  hourlyRate: number;
  availability: string[];
  rating: number;
  verified: boolean;
  sessionsCompleted: number;
  totalEarnings: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  languages: string[];
  yearsOfExperience: number;
  status: "active" | "inactive" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema = new Schema<IMentor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      maxlength: 500,
    },
    skills: {
      type: [String],
      required: true,
    },
    roles: {
      type: [String],
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    sessionsCompleted: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    languages: {
      type: [String],
      default: ["English", "Bengali"],
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MentorSchema.index({ skills: 1 });
MentorSchema.index({ roles: 1 });
MentorSchema.index({ rating: -1 });
MentorSchema.index({ verified: 1 });
MentorSchema.index({ status: 1 });

const Mentor: Model<IMentor> = models.Mentor || model<IMentor>("Mentor", MentorSchema);

export default Mentor;

