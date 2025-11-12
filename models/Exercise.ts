import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IExercise {
  roadmapId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  stageIndex: number;
  exerciseIndex: number;
  title: string;
  userCode: string;
  completed: boolean;
  completedAt?: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    roadmapId: {
      type: Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stageIndex: {
      type: Number,
      required: true,
    },
    exerciseIndex: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    userCode: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ExerciseSchema.index({ roadmapId: 1, userId: 1 });
ExerciseSchema.index({ userId: 1, completed: 1 });

const Exercise: Model<IExercise> = models.Exercise || model<IExercise>("Exercise", ExerciseSchema);

export default Exercise;

