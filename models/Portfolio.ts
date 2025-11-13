import mongoose, { Schema, Model, model, models } from "mongoose";

export interface IPortfolioSection {
  id: string;
  type: "about" | "skills" | "projects" | "experience" | "education" | "contact" | "custom";
  title: string;
  content: any; // Flexible content structure
  order: number;
  visible: boolean;
}

export interface IPortfolio {
  userId: mongoose.Types.ObjectId;
  template: "basic" | "professional" | "creative";
  sections: IPortfolioSection[];
  published: boolean;
  publicUrl?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSectionSchema = new Schema<IPortfolioSection>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["about", "skills", "projects", "experience", "education", "contact", "custom"],
    required: true,
  },
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, default: {} },
  order: { type: Number, required: true },
  visible: { type: Boolean, default: true },
});

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    template: {
      type: String,
      enum: ["basic", "professional", "creative"],
      default: "basic",
    },
    sections: {
      type: [PortfolioSectionSchema],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    publicUrl: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

PortfolioSchema.index({ publicUrl: 1 });

const Portfolio: Model<IPortfolio> =
  models.Portfolio || model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;

