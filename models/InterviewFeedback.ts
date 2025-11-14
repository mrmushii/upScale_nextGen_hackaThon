import mongoose, { Schema, model, models } from "mongoose";

interface ICategoryScore {
  name: string;
  score: number;
  comment: string;
}

export interface IInterviewFeedback {
  interviewId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  totalScore: number;
  categoryScores: ICategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  transcript: Array<{ role: string; content: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryScoreSchema = new Schema<ICategoryScore>(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const InterviewFeedbackSchema = new Schema<IInterviewFeedback>(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    categoryScores: {
      type: [CategoryScoreSchema],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    areasForImprovement: {
      type: [String],
      default: [],
    },
    finalAssessment: {
      type: String,
      required: true,
    },
    transcript: {
      type: [
        {
          role: { type: String, required: true },
          content: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

InterviewFeedbackSchema.index(
  { interviewId: 1, userId: 1 },
  { unique: true, name: "interview_feedback_unique_user" }
);

const InterviewFeedback =
  models.InterviewFeedback ||
  model<IInterviewFeedback>("InterviewFeedback", InterviewFeedbackSchema);

export default InterviewFeedback;


