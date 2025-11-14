// Export all models from a single file for easy importing
export { default as User } from "./User";
export { default as Job } from "./Job";
export { default as Roadmap } from "./Roadmap";
export { default as Mentor } from "./Mentor";
export { default as Application } from "./Application";
export { default as Notification } from "./Notification";
export { default as Portfolio } from "./Portfolio";
export { default as Question } from "./Question";
export { default as Interview } from "./Interview";
export { default as InterviewFeedback } from "./InterviewFeedback";

// Re-export types
export type { IUser } from "./User";
export type { IJob } from "./Job";
export type { IRoadmap } from "./Roadmap";
export type { IMentor } from "./Mentor";
export type { IApplication } from "./Application";
export type { INotification } from "./Notification";
export type { IPortfolio, IPortfolioSection } from "./Portfolio";
export type { IQuestion, IAnswer } from "./Question";
export type { IInterview } from "./Interview";
export type { IInterviewFeedback } from "./InterviewFeedback";

