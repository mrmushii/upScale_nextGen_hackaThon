import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFavoriteJob extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: string; // Can be MongoDB ObjectId or external job ID
  jobTitle: string;
  company: string;
  jobData: any; // Full job data for analysis
  skillGaps?: {
    missingSkills: string[];
    existingSkills: string[];
    matchPercentage: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteJobSchema = new Schema<IFavoriteJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    jobData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    skillGaps: {
      missingSkills: [String],
      existingSkills: [String],
      matchPercentage: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate favorites
FavoriteJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const FavoriteJob: Model<IFavoriteJob> =
  mongoose.models.FavoriteJob ||
  mongoose.model<IFavoriteJob>("FavoriteJob", FavoriteJobSchema);

export default FavoriteJob;

