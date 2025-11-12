import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IApplication {
  userId: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  externalLink?: string;
  companyName: string;
  position: string;
  status: "applied" | "interview" | "offer" | "rejected" | "accepted";
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
  nextFollowUpDate?: Date;
  interviewDate?: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    externalLink: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected", "accepted"],
      default: "applied",
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    nextFollowUpDate: {
      type: Date,
    },
    interviewDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ApplicationSchema.index({ userId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ appliedAt: -1 });

const Application: Model<IApplication> = models.Application || model<IApplication>("Application", ApplicationSchema);

export default Application;

