import { IUser } from "@/models/User";

export interface ProfileCompletionCheck {
  isComplete: boolean;
  percentage: number;
  missingFields: string[];
  completedFields: string[];
}

export function checkProfileCompletion(user: IUser | null): ProfileCompletionCheck {
  if (!user) {
    return {
      isComplete: false,
      percentage: 0,
      missingFields: [],
      completedFields: [],
    };
  }

  // TIER 1: CORE REQUIRED FIELDS (60% of score)
  // Must have for basic functionality: job matching, roadmap generation
  const requiredFields = [
    { key: "fullName", label: "Full Name", value: user.fullName },
    { key: "email", label: "Email", value: user.email },
    { key: "preferredTrack", label: "Preferred Track", value: user.preferredTrack },
    { key: "experienceLevel", label: "Experience Level", value: user.experienceLevel },
    { key: "educationLevel", label: "Education Level", value: user.educationLevel },
    { key: "skills", label: "Skills", value: user.skills, isArray: true, minLength: 3 },
    { key: "targetRoles", label: "Target Roles", value: user.targetRoles, isArray: true, minLength: 1 },
    { key: "country", label: "Country", value: user.country },
    { key: "city", label: "City", value: user.city },
  ];

  // TIER 2: ENHANCEMENT FIELDS (30% of score)
  // Strongly recommended for best results: CV quality, better job matching
  const enhancementFields = [
    { key: "education", label: "Education History", value: user.education, isArray: true, minLength: 1 },
    { key: "experience", label: "Work Experience", value: user.experience, isArray: true, minLength: 1 },
    { key: "projects", label: "Projects Portfolio", value: user.projects, isArray: true, minLength: 1 },
    { key: "bio", label: "Professional Bio", value: user.bio },
  ];

  // TIER 3: OPTIONAL FIELDS (10% of score)
  // Nice to have: networking, personalization
  const optionalFields = [
    { key: "phone", label: "Phone Number", value: user.phone },
    { key: "linkedin", label: "LinkedIn Profile", value: user.linkedin },
    { key: "github", label: "GitHub Profile", value: user.github },
    { key: "portfolio", label: "Portfolio Website", value: user.portfolio },
    { key: "availability", label: "Availability", value: user.availability },
    { key: "workAuthorization", label: "Work Authorization", value: user.workAuthorization },
    { key: "languages", label: "Languages", value: user.languages, isArray: true, minLength: 1 },
  ];

  const completedRequiredFields: string[] = [];
  const missingRequiredFields: string[] = [];
  const completedEnhancementFields: string[] = [];
  const completedOptionalFields: string[] = [];

  // Helper function to check if field is completed
  const isFieldCompleted = (field: any): boolean => {
    if (field.isArray) {
      const arr = field.value as any[] | undefined;
      return !!arr && arr.length >= (field.minLength || 1);
    } else {
      return !!field.value && String(field.value).trim().length > 0;
    }
  };

  // Check required fields (Tier 1 - 60% weight)
  requiredFields.forEach((field) => {
    if (isFieldCompleted(field)) {
      completedRequiredFields.push(field.key);
    } else {
      missingRequiredFields.push(field.label);
    }
  });

  // Check enhancement fields (Tier 2 - 30% weight)
  enhancementFields.forEach((field) => {
    if (isFieldCompleted(field)) {
      completedEnhancementFields.push(field.key);
    }
  });

  // Check optional fields (Tier 3 - 10% weight)
  optionalFields.forEach((field) => {
    if (isFieldCompleted(field)) {
      completedOptionalFields.push(field.key);
    }
  });

  // Profile is complete if all required fields are filled
  const isComplete = completedRequiredFields.length === requiredFields.length;
  
  // Calculate percentage with tiered weighting:
  // Tier 1 (Required): 60% - Must have for basic functionality
  // Tier 2 (Enhancement): 30% - Strongly recommended for best results
  // Tier 3 (Optional): 10% - Nice to have
  const requiredPercentage = (completedRequiredFields.length / requiredFields.length) * 60;
  const enhancementPercentage = (completedEnhancementFields.length / enhancementFields.length) * 30;
  const optionalPercentage = (completedOptionalFields.length / optionalFields.length) * 10;
  const percentage = Math.round(requiredPercentage + enhancementPercentage + optionalPercentage);

  return {
    isComplete,
    percentage,
    missingFields: missingRequiredFields,
    completedFields: [...completedRequiredFields, ...completedEnhancementFields, ...completedOptionalFields],
    // Additional breakdown for UI display
    tier1Complete: completedRequiredFields.length,
    tier1Total: requiredFields.length,
    tier2Complete: completedEnhancementFields.length,
    tier2Total: enhancementFields.length,
    tier3Complete: completedOptionalFields.length,
    tier3Total: optionalFields.length,
  };
}

export function getProfileCompletionMessage(check: ProfileCompletionCheck): string {
  if (check.isComplete) {
    return "Your profile is complete! You can now generate roadmaps and apply to jobs.";
  }

  if (check.missingFields.length > 0) {
    return `Please complete your profile. Missing: ${check.missingFields.slice(0, 3).join(", ")}${check.missingFields.length > 3 ? "..." : ""}`;
  }

  return "Please complete your profile to access all features.";
}

