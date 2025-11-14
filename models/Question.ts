import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IAnswer {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  upvotes: number;
  upvotedBy: mongoose.Types.ObjectId[];
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  upvotedBy: mongoose.Types.ObjectId[];
  views: number;
  answers: IAnswer[];
  isAnswered: boolean;
  acceptedAnswerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    answers: {
      type: [AnswerSchema],
      default: [],
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    acceptedAnswerId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ upvotes: -1 });
QuestionSchema.index({ isAnswered: 1 });

const Question: Model<IQuestion> =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;

