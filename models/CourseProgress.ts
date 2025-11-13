import mongoose, { Schema, Model, model, models } from "mongoose";

export interface ICourseProgress {
  userId: mongoose.Types.ObjectId;
  courseId: string;
  courseType: "youtube" | "udemy";
  courseTitle: string;
  courseThumbnail?: string;
  videoId?: string; // For YouTube courses
  progress: number; // 0-100 percentage
  lastWatchedTimestamp: number; // Last watched position in seconds (for YouTube)
  duration?: number; // Total duration in seconds
  completed: boolean;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    courseType: {
      type: String,
      enum: ["youtube", "udemy"],
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    courseThumbnail: {
      type: String,
    },
    videoId: {
      type: String, // YouTube video ID
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastWatchedTimestamp: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one progress record per user per course
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseProgress: Model<ICourseProgress> =
  models.CourseProgress || model<ICourseProgress>("CourseProgress", CourseProgressSchema);

export default CourseProgress;

