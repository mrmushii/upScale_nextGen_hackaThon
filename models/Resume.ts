import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IResume {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalFilename: string;
  filePath: string;
  imagePath?: string; // Path to preview image (PNG)
  fileSize: number;
  mimeType: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  jobListingUrl?: string;
  parsedStatus: "pending" | "processing" | "completed" | "failed";
  parsedText?: string;
  analysisResult?: {
    overallScore: number;
    ATS: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
      }>;
    };
    toneAndStyle: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    content: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    structure: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    skills: {
      score: number;
      tips: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
  };
  analyzedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    jobDescription: {
      type: String,
    },
    jobListingUrl: {
      type: String,
    },
    parsedStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    parsedText: {
      type: String,
    },
    analysisResult: {
      overallScore: Number,
      ATS: {
        score: Number,
        tips: [
          {
            type: { type: String, enum: ["good", "improve"] },
            tip: String,
          },
        ],
      },
      toneAndStyle: {
        score: Number,
        tips: [
          {
            type: { type: String, enum: ["good", "improve"] },
            tip: String,
            explanation: String,
          },
        ],
      },
      content: {
        score: Number,
        tips: [
          {
            type: { type: String, enum: ["good", "improve"] },
            tip: String,
            explanation: String,
          },
        ],
      },
      structure: {
        score: Number,
        tips: [
          {
            type: { type: String, enum: ["good", "improve"] },
            tip: String,
            explanation: String,
          },
        ],
      },
      skills: {
        score: Number,
        tips: [
          {
            type: { type: String, enum: ["good", "improve"] },
            tip: String,
            explanation: String,
          },
        ],
      },
    },
    analyzedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
ResumeSchema.index({ userId: 1, createdAt: -1 });

const Resume: Model<IResume> = models.Resume || model<IResume>("Resume", ResumeSchema);

export default Resume;

