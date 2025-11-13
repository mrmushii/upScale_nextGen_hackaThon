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

  // Required fields (must have to generate roadmap and apply to jobs)
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

  // Note: educationDepartment, experience, projects, careerInterests, and cvText are optional
  // They enhance the profile but are not required for completion

  // Optional fields (can be filled later, but improve profile completeness)
  const optionalFields = [
    { key: "phone", label: "Phone Number", value: user.phone },
    { key: "bio", label: "Bio/About", value: user.bio },
    { key: "linkedin", label: "LinkedIn Profile", value: user.linkedin },
    { key: "github", label: "GitHub Profile", value: user.github },
    { key: "availability", label: "Availability", value: user.availability },
    { key: "workAuthorization", label: "Work Authorization", value: user.workAuthorization },
  ];

  const completedRequiredFields: string[] = [];
  const missingRequiredFields: string[] = [];
  const completedOptionalFields: string[] = [];

  // Check required fields
  requiredFields.forEach((field) => {
    let isCompleted = false;

    if (field.isArray) {
      const arr = field.value as string[] | undefined;
      isCompleted = !!arr && arr.length >= (field.minLength || 1);
    } else {
      isCompleted = !!field.value && String(field.value).trim().length > 0;
    }

    if (isCompleted) {
      completedRequiredFields.push(field.key);
    } else {
      missingRequiredFields.push(field.label);
    }
  });

  // Check optional fields
  optionalFields.forEach((field) => {
    const isCompleted = !!field.value && String(field.value).trim().length > 0;
    if (isCompleted) {
      completedOptionalFields.push(field.key);
    }
  });

  // Profile is complete if all required fields are filled
  const isComplete = completedRequiredFields.length === requiredFields.length;
  
  // Calculate percentage: required fields (70%) + optional fields (30%)
  const requiredPercentage = (completedRequiredFields.length / requiredFields.length) * 70;
  const optionalPercentage = (completedOptionalFields.length / optionalFields.length) * 30;
  const percentage = Math.round(requiredPercentage + optionalPercentage);

  return {
    isComplete,
    percentage,
    missingFields: missingRequiredFields,
    completedFields: [...completedRequiredFields, ...completedOptionalFields],
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

