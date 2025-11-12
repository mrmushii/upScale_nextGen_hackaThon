import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IJob {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  requiredSkills: string[];
  recommendedExperience: string;
  jobType: string;
  description: string;
  tags: string[];
  track: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  applicationUrl?: string;
  postedBy?: mongoose.Types.ObjectId;
  status: "active" | "closed" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    requiredSkills: {
      type: [String],
      required: true,
    },
    recommendedExperience: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Freelance", "Internship"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    track: {
      type: String,
      required: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "BDT",
      },
    },
    applicationUrl: {
      type: String,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
JobSchema.index({ title: "text", description: "text" });
JobSchema.index({ requiredSkills: 1 });
JobSchema.index({ track: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ createdAt: -1 });

const Job: Model<IJob> = models.Job || model<IJob>("Job", JobSchema);

export default Job;

