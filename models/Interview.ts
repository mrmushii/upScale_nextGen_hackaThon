import mongoose, { Schema, model, models } from "mongoose";

export interface IInterview {
  userId: mongoose.Types.ObjectId;
  role: string;
  type: string;
  level: string;
  techstack: string[];
  questions: string[];
  finalized: boolean;
  coverTheme: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },
    techstack: {
      type: [String],
      default: [],
    },
    questions: {
      type: [String],
      default: [],
    },
    finalized: {
      type: Boolean,
      default: false,
    },
    coverTheme: {
      type: String,
      default: "indigo",
    },
  },
  {
    timestamps: true,
  }
);

InterviewSchema.index({ createdAt: -1 });

const Interview =
  models.Interview || model<IInterview>("Interview", InterviewSchema);

export default Interview;


