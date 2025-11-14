import mongoose, { Schema, Model, model, models } from "mongoose";

interface Exercise {
  title: string;
  description: string;
  code: string;
  solution: string;
  hints: string[];
  testCases: Array<{
    input: string;
    expected: string;
  }>;
  completed: boolean;
  lastSubmission?: string;
}

interface SuggestedCourses {
  youtube: string[];
  udemy: string[];
}

interface RoadmapStage {
  name: string;
  goals: string[];
  exercises: Exercise[];
  resources: string[];
  projects: string[];
  estimatedWeeks: number;
  completed: boolean;
  completedExercises: number;
  suggestedCourses?: SuggestedCourses;
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

const ExerciseSchema = new Schema<Exercise>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    solution: { type: String, required: true },
    hints: { type: [String], default: [] },
    testCases: {
      type: [
        new Schema(
          {
            input: { type: String, required: true },
            expected: { type: String, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    completed: { type: Boolean, default: false },
    lastSubmission: { type: String, default: "" },
  },
  { _id: false }
);

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
    exercises: {
      type: [ExerciseSchema],
      default: [],
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
    completedExercises: {
      type: Number,
      default: 0,
      min: 0,
    },
    suggestedCourses: {
      type: new Schema(
        {
          youtube: { type: [String], default: [] },
          udemy: { type: [String], default: [] },
        },
        { _id: false }
      ),
      default: undefined,
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

