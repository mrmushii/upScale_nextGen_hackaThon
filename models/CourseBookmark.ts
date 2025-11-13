import mongoose, { Schema, Model, model, models } from "mongoose";

export interface ICourseBookmark {
  userId: mongoose.Types.ObjectId;
  courseId: string;
  courseType: "youtube" | "udemy";
  courseTitle: string;
  courseThumbnail?: string;
  videoId?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseBookmarkSchema = new Schema<ICourseBookmark>(
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
      type: String,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one bookmark per user per course
CourseBookmarkSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseBookmark: Model<ICourseBookmark> =
  models.CourseBookmark || model<ICourseBookmark>("CourseBookmark", CourseBookmarkSchema);

export default CourseBookmark;

