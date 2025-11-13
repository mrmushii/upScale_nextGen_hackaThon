import mongoose, { Schema, Model, model, models } from "mongoose";

export interface ISession {
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  topic: string;
  description?: string;
  scheduledDate: Date;
  duration: number; // in minutes
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  earnings?: number; // Amount earned from this session
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60, // Default 1 hour
      min: 15,
      max: 240,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    meetingLink: {
      type: String,
    },
    notes: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
    earnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SessionSchema.index({ mentorId: 1, scheduledDate: 1 });
SessionSchema.index({ studentId: 1 });
SessionSchema.index({ status: 1 });
SessionSchema.index({ scheduledDate: 1 });

const Session: Model<ISession> = models.Session || model<ISession>("Session", SessionSchema);

export default Session;

