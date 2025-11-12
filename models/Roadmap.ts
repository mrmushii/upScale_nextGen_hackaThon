import mongoose, { Schema, Model, model, models } from "mongoose";

interface RoadmapStage {
  name: string;
  goals: string[];
  resources: string[];
  projects: string[];
  estimatedWeeks: number;
  completed: boolean;
}

export interface IRoadmap {
  userId: mongoose.Types.ObjectId;
  targetRole: string;
  stages: RoadmapStage[];
  progress: number;
  status: "active" | "completed" | "paused";
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapStageSchema = new Schema<RoadmapStage>(
  {
    name: {
      type: String,
      required: true,
    },
    goals: {
      type: [String],
      required: true,
    },
    resources: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    estimatedWeeks: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    stages: {
      type: [RoadmapStageSchema],
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RoadmapSchema.index({ userId: 1 });
RoadmapSchema.index({ targetRole: 1 });
RoadmapSchema.index({ status: 1 });

const Roadmap: Model<IRoadmap> = models.Roadmap || model<IRoadmap>("Roadmap", RoadmapSchema);

export default Roadmap;

