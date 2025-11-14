"use client";

import { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  Globe,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  Save,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CAREER_TRACKS, EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "@/lib/constants";
import toast from "react-hot-toast";

const sections = [
  { id: "basic", label: "Basic Information", icon: User },
  { id: "career", label: "Career Goals", icon: Briefcase },
  { id: "education", label: "Education & Experience", icon: GraduationCap },
  { id: "location", label: "Location", icon: MapPin },
  { id: "contact", label: "Contact & Social", icon: Phone },
  { id: "additional", label: "Additional Info", icon: FileText },
];

export default function ProfileCompletionPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    dateOfBirth: "",
    gender: "",

    // Career Goals
    preferredTrack: "",
    targetRoles: [] as string[],
    skills: [] as string[],
    availability: "",
    salaryExpectation: "",
    workAuthorization: "",

    // Education & Experience
    educationLevel: "",
    experienceLevel: "",

    // Location
    country: "",
    city: "",

    // Contact & Social
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",

    // Additional
    languages: [] as string[],
    
    // Education History (NEW)
    education: [] as Array<{
      degree: string;
      institution: string;
      field: string;
      year: string;
      gpa?: string;
    }>,
    
    // Work Experience (NEW - with array description)
    experience: [] as Array<{
      title: string;
      company: string;
      location?: string;
      description: string[];  // Array of bullet points
      startDate: string;
      endDate?: string;
      current: boolean;
      technologies?: string[];
      achievements?: string[];
    }>,
    
    // Projects Portfolio (NEW)
    projects: [] as Array<{
      title: string;
      description: string;
      technologies: string[];
      url?: string;
      githubUrl?: string;
      highlights?: string[];
    }>,
  });

  const [skillInput, setSkillInput] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  
  // Education form state
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    field: "",
    year: "",
    gpa: "",
  });
  
  // Experience form state
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    description: [] as string[],
    startDate: "",
    endDate: "",
    current: false,
    technologies: [] as string[],
    achievements: [] as string[],
  });
  const [expDescriptionInput, setExpDescriptionInput] = useState("");
  const [expTechInput, setExpTechInput] = useState("");
  
  // Project form state
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: [] as string[],
    url: "",
    githubUrl: "",
    highlights: [] as string[],
  });
  const [projectTechInput, setProjectTechInput] = useState("");

  // Calculate progress in real-time based on current formData
  const calculateRealTimeProgress = () => {
    // Required fields
    const requiredFields = [
      { key: "fullName", value: formData.fullName },
      { key: "email", value: formData.email },
      { key: "preferredTrack", value: formData.preferredTrack },
      { key: "experienceLevel", value: formData.experienceLevel },
      { key: "educationLevel", value: formData.educationLevel },
      { key: "skills", value: formData.skills, isArray: true, minLength: 3 },
      { key: "targetRoles", value: formData.targetRoles, isArray: true, minLength: 1 },
      { key: "country", value: formData.country },
      { key: "city", value: formData.city },
    ];

    // Optional fields
    const optionalFields = [
      { key: "phone", value: formData.phone },
      { key: "bio", value: formData.bio },
      { key: "linkedin", value: formData.linkedin },
      { key: "github", value: formData.github },
      { key: "availability", value: formData.availability },
      { key: "workAuthorization", value: formData.workAuthorization },
    ];

    let completedRequired = 0;
    let completedOptional = 0;
    const missingRequired: string[] = [];

    requiredFields.forEach((field) => {
      let isCompleted = false;
      if (field.isArray) {
        const arr = field.value as string[] | undefined;
        isCompleted = !!arr && arr.length >= (field.minLength || 1);
      } else {
        isCompleted = !!field.value && String(field.value).trim().length > 0;
      }
      if (isCompleted) {
        completedRequired++;
      } else {
        missingRequired.push(field.key);
      }
    });

    optionalFields.forEach((field) => {
      const isCompleted = !!field.value && String(field.value).trim().length > 0;
      if (isCompleted) completedOptional++;
    });

    const requiredPercentage = (completedRequired / requiredFields.length) * 70;
    const optionalPercentage = (completedOptional / optionalFields.length) * 30;
    const percentage = Math.min(100, Math.round(requiredPercentage + optionalPercentage));
    const isComplete = completedRequired === requiredFields.length;

    return { 
      percentage, 
      isComplete, 
      completedRequired, 
      totalRequired: requiredFields.length,
      missingRequired 
    };
  };

  useEffect(() => {
    fetchProfile();
    fetchCompletion();
  }, []);

  // Update completion status when formData changes
  useEffect(() => {
    const progress = calculateRealTimeProgress();
    // Update local completion state for real-time feedback
    setCompletion((prev: any) => ({
      ...prev,
      percentage: progress.percentage,
      isComplete: progress.isComplete,
      missingFields: progress.missingRequired.map((key) => {
        const fieldMap: Record<string, string> = {
          fullName: "Full Name",
          email: "Email",
          preferredTrack: "Preferred Track",
          experienceLevel: "Experience Level",
          educationLevel: "Education Level",
          skills: "Skills",
          targetRoles: "Target Roles",
          country: "Country",
          city: "City",
        };
        return fieldMap[key] || key;
      }),
    }));
  }, [formData]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
          gender: user.gender || "",
          preferredTrack: user.preferredTrack || "",
          targetRoles: user.targetRoles || [],
          skills: user.skills || [],
          availability: user.availability || "",
          salaryExpectation: user.salaryExpectation || "",
          workAuthorization: user.workAuthorization || "",
          educationLevel: user.educationLevel || "",
          experienceLevel: user.experienceLevel || "",
          country: user.country || "",
          city: user.city || "",
          linkedin: user.linkedin || "",
          github: user.github || "",
          portfolio: user.portfolio || "",
          website: user.website || "",
          languages: user.languages || [],
          // Ensure these array fields are present to avoid runtime errors
          education: user.education || [],
          experience: user.experience || [],
          projects: user.projects || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletion = async () => {
    try {
      const response = await fetch("/api/user/profile/completion");
      if (response.ok) {
        const data = await response.json();
        console.log("Completion data from server:", data.completion);
        setCompletion(data.completion);
      } else {
        console.error("Failed to fetch completion:", response.status);
      }
    } catch (error) {
      console.error("Error fetching completion:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare data for API - keep all form data as is
      const dataToSave = { ...formData };
      
      // Ensure arrays are properly formatted
      if (!Array.isArray(dataToSave.skills)) {
        dataToSave.skills = [];
      }
      if (!Array.isArray(dataToSave.targetRoles)) {
        dataToSave.targetRoles = [];
      }
      if (!Array.isArray(dataToSave.languages)) {
        dataToSave.languages = [];
      }
      
      console.log("Saving profile data:", dataToSave);
      
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      const responseData = await response.json();
      console.log("Save response:", responseData);

      if (response.ok) {
        // Don't update formData - it already has the user's input
        // Update completion status from server
        await fetchCompletion();
        
        // Also recalculate locally for immediate feedback
        const progress = calculateRealTimeProgress();
        setCompletion({
          percentage: progress.percentage,
          isComplete: progress.isComplete,
          missingFields: [],
          completedFields: [],
        });
        
        toast.success("Profile updated successfully!");
        return true;
      } else {
        toast.error(responseData.error || "Failed to save profile");
        return false;
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addTargetRole = () => {
    if (targetRoleInput.trim() && !formData.targetRoles.includes(targetRoleInput.trim())) {
      setFormData({
        ...formData,
        targetRoles: [...formData.targetRoles, targetRoleInput.trim()],
      });
      setTargetRoleInput("");
    }
  };

  const removeTargetRole = (role: string) => {
    setFormData({
      ...formData,
      targetRoles: formData.targetRoles.filter((r) => r !== role),
    });
  };

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()],
      });
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l !== lang),
    });
  };

  // Education History Functions
  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.field && newEducation.year) {
      setFormData({
        ...formData,
        education: [...formData.education, { ...newEducation }],
      });
      setNewEducation({ degree: "", institution: "", field: "", year: "", gpa: "" });
      setShowAddEducation(false);
    }
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  // Experience Functions
  const addExpDescription = () => {
    if (expDescriptionInput.trim()) {
      setNewExperience({
        ...newExperience,
        description: [...newExperience.description, expDescriptionInput.trim()],
      });
      setExpDescriptionInput("");
    }
  };

  const removeExpDescription = (index: number) => {
    setNewExperience({
      ...newExperience,
      description: newExperience.description.filter((_, i) => i !== index),
    });
  };

  const addExpTech = () => {
    if (expTechInput.trim() && !newExperience.technologies?.includes(expTechInput.trim())) {
      setNewExperience({
        ...newExperience,
        technologies: [...(newExperience.technologies || []), expTechInput.trim()],
      });
      setExpTechInput("");
    }
  };

  const removeExpTech = (tech: string) => {
    setNewExperience({
      ...newExperience,
      technologies: newExperience.technologies?.filter((t) => t !== tech) || [],
    });
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company && newExperience.description.length > 0) {
      setFormData({
        ...formData,
        experience: [
          ...formData.experience,
          {
            ...newExperience,
            startDate: newExperience.startDate || "",
            endDate: newExperience.current ? undefined : newExperience.endDate,
          },
        ],
      });
      setNewExperience({
        title: "",
        company: "",
        location: "",
        description: [],
        startDate: "",
        endDate: "",
        current: false,
        technologies: [],
        achievements: [],
      });
      setExpDescriptionInput("");
      setExpTechInput("");
      setShowAddExperience(false);
    }
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  // Project Functions
  const addProjectTech = () => {
    if (projectTechInput.trim() && !newProject.technologies.includes(projectTechInput.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, projectTechInput.trim()],
      });
      setProjectTechInput("");
    }
  };

  const removeProjectTech = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((t) => t !== tech),
    });
  };

  const addProject = () => {
    if (newProject.title && newProject.description && newProject.technologies.length > 0) {
      setFormData({
        ...formData,
        projects: [...formData.projects, { ...newProject }],
      });
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        url: "",
        githubUrl: "",
        highlights: [],
      });
      setProjectTechInput("");
      setShowAddProject(false);
    }
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Use real-time calculation if available, otherwise use completion from API
  const realTimeProgress = calculateRealTimeProgress();
  const completionPercentage = realTimeProgress.percentage || completion?.percentage || 0;
  const isComplete = realTimeProgress.isComplete || completion?.isComplete || false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <User className="text-primary-600" size={36} />
          Complete Your Profile
        </h1>
        <p className="text-gray-600 mt-2">
          Complete your profile to unlock all features: generate roadmaps, apply to jobs, and get personalized suggestions
        </p>
      </div>

      {/* Progress Bar with Tier Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">Profile Completion</span>
          <span className="text-2xl font-bold text-primary-600">{completionPercentage}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        {/* Tier Breakdown */}
        {completion && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-blue-700 mb-1">Tier 1: Core (60%)</div>
              <div className="text-sm text-blue-900">
                {completion.tier1Complete || 0}/{completion.tier1Total || 9} fields
              </div>
              <div className="h-2 bg-blue-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${((completion.tier1Complete || 0) / (completion.tier1Total || 9)) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-green-700 mb-1">Tier 2: Enhancement (30%)</div>
              <div className="text-sm text-green-900">
                {completion.tier2Complete || 0}/{completion.tier2Total || 4} fields
              </div>
              <div className="h-2 bg-green-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all"
                  style={{ width: `${((completion.tier2Complete || 0) / (completion.tier2Total || 4)) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-gray-700 mb-1">Tier 3: Optional (10%)</div>
              <div className="text-sm text-gray-900">
                {completion.tier3Complete || 0}/{completion.tier3Total || 7} fields
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gray-600 rounded-full transition-all"
                  style={{ width: `${((completion.tier3Complete || 0) / (completion.tier3Total || 7)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        {completion?.missingFields && completion.missingFields.length > 0 && (
          <p className="text-sm text-gray-600 mt-3">
            Missing required fields: {completion.missingFields.slice(0, 5).join(", ")}
            {completion.missingFields.length > 5 && ` +${completion.missingFields.length - 5} more`}
          </p>
        )}
        {realTimeProgress.completedRequired < realTimeProgress.totalRequired && (
          <p className="text-sm text-blue-600 mt-2 font-medium">
            {realTimeProgress.completedRequired} of {realTimeProgress.totalRequired} required fields completed
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar - Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-8">
            <h3 className="font-bold text-gray-900 mb-4">Sections</h3>
            <div className="space-y-2">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                const sectionFields = getSectionFields(section.id);
                const sectionCompleted = sectionFields.every((field) => {
                  const value = formData[field as keyof typeof formData];
                  if (Array.isArray(value)) {
                    return value.length > 0;
                  }
                  return !!value && String(value).trim().length > 0;
                });

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-xl transition ${
                      isActive
                        ? "bg-primary-100 border-2 border-primary-500"
                        : sectionCompleted
                        ? "bg-green-50 hover:bg-green-100"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon
                        size={20}
                        className={isActive ? "text-primary-600" : sectionCompleted ? "text-green-600" : "text-gray-400"}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">{section.label}</div>
                      </div>
                      {sectionCompleted && (
                        <CheckCircle2 size={16} className="text-green-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {/* Basic Information */}
            {activeSection === "basic" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="text-primary-600" size={28} />
                  Basic Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio/About <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="Tell us about yourself, your background, and career aspirations..."
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/1000 characters</p>
                </div>
              </div>
            )}

            {/* Career Goals */}
            {activeSection === "career" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="text-primary-600" size={28} />
                  Career Goals
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Track *
                  </label>
                  <select
                    value={formData.preferredTrack}
                    onChange={(e) => setFormData({ ...formData, preferredTrack: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                  >
                    <option value="">Select Preferred Track</option>
                    {CAREER_TRACKS.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Roles * (At least 1 required)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={targetRoleInput}
                      onChange={(e) => setTargetRoleInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addTargetRole)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="e.g., Frontend Developer"
                    />
                    <button
                      onClick={addTargetRole}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.targetRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {role}
                        <button
                          onClick={() => removeTargetRole(role)}
                          className="hover:text-primary-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills * (At least 3 required)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addSkill)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="e.g., JavaScript, React, Node.js"
                    />
                    <button
                      onClick={addSkill}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-coral-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-primary-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Availability <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    >
                      <option value="">Select Availability</option>
                      <option value="Immediately">Immediately</option>
                      <option value="Within 2 weeks">Within 2 weeks</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Within 3 months">Within 3 months</option>
                      <option value="Not available">Not available</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Salary Expectation <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.salaryExpectation}
                      onChange={(e) => setFormData({ ...formData, salaryExpectation: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="e.g., $50,000 - $70,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Work Authorization <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                    </label>
                    <select
                      value={formData.workAuthorization}
                      onChange={(e) => setFormData({ ...formData, workAuthorization: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    >
                      <option value="">Select Authorization</option>
                      <option value="Citizen">Citizen</option>
                      <option value="Permanent Resident">Permanent Resident</option>
                      <option value="Work Visa">Work Visa</option>
                      <option value="Student Visa">Student Visa</option>
                      <option value="Requires Sponsorship">Requires Sponsorship</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Education & Experience */}
            {activeSection === "education" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="text-primary-600" size={28} />
                  Education & Experience
                </h2>

                {/* Basic Education & Experience Level */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Education Level *
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    >
                      <option value="">Select Education Level</option>
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience Level *
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    >
                      <option value="">Select Experience Level</option>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Education History Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Education History</h3>
                    <span className="text-sm text-gray-500">Strongly Recommended</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add your educational background. This improves CV quality and job matching.
                  </p>

                  {formData.education.length > 0 && (
                    <div className="space-y-4 mb-4">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                              <p className="text-gray-600">{edu.institution}</p>
                              <p className="text-sm text-gray-500">Year: {edu.year}</p>
                              {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                            </div>
                            <button
                              onClick={() => removeEducation(index)}
                              className="text-red-600 hover:text-red-700 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showAddEducation ? (
                    <button
                      onClick={() => setShowAddEducation(true)}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition text-gray-600 font-semibold"
                    >
                      + Add Education Entry
                    </button>
                  ) : (
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Add Education</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Degree *</label>
                          <select
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                          >
                            <option value="">Select Degree</option>
                            <option value="High School">High School</option>
                            <option value="Associate's">Associate's</option>
                            <option value="Bachelor's">Bachelor's</option>
                            <option value="Master's">Master's</option>
                            <option value="PhD">PhD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Institution *</label>
                          <input
                            type="text"
                            value={newEducation.institution}
                            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                            placeholder="University/College name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study *</label>
                          <input
                            type="text"
                            value={newEducation.field}
                            onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                          <input
                            type="text"
                            value={newEducation.year}
                            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                            placeholder="e.g., 2020 or 2018-2022"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">GPA (Optional)</label>
                          <input
                            type="text"
                            value={newEducation.gpa}
                            onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                            placeholder="e.g., 3.8/4.0"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={addEducation}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
                        >
                          Add Education
                        </button>
                        <button
                          onClick={() => {
                            setShowAddEducation(false);
                            setNewEducation({ degree: "", institution: "", field: "", year: "", gpa: "" });
                          }}
                          className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Work Experience Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Work Experience</h3>
                    <span className="text-sm text-gray-500">Strongly Recommended</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add your work experience with detailed descriptions. This significantly improves CV quality.
                  </p>

                  {formData.experience.length > 0 && (
                    <div className="space-y-4 mb-4">
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                              <p className="text-gray-600">{exp.company}</p>
                              {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                              <p className="text-sm text-gray-500">
                                {exp.startDate} - {exp.current ? "Present" : exp.endDate || "N/A"}
                              </p>
                              {exp.description && exp.description.length > 0 && (
                                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                                  {exp.description.map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                  ))}
                                </ul>
                              )}
                              {exp.technologies && exp.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {exp.technologies.map((tech, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeExperience(index)}
                              className="text-red-600 hover:text-red-700 font-semibold ml-4"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showAddExperience ? (
                    <button
                      onClick={() => setShowAddExperience(true)}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition text-gray-600 font-semibold"
                    >
                      + Add Work Experience
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Add Work Experience</h4>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                            <input
                              type="text"
                              value={newExperience.title}
                              onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="e.g., Frontend Developer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company *</label>
                            <input
                              type="text"
                              value={newExperience.company}
                              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="Company name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={newExperience.location}
                              onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="City, Country"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                            <input
                              type="date"
                              value={newExperience.startDate}
                              onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                            <input
                              type="date"
                              value={newExperience.endDate}
                              onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                              disabled={newExperience.current}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-100"
                            />
                          </div>
                          <div className="flex items-center pt-6">
                            <input
                              type="checkbox"
                              checked={newExperience.current}
                              onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                              className="w-4 h-4 text-primary-600"
                            />
                            <label className="ml-2 text-sm font-semibold text-gray-700">Current Position</label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description/Bullet Points * (3-5 recommended)
                          </label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={expDescriptionInput}
                              onChange={(e) => setExpDescriptionInput(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addExpDescription()}
                              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="e.g., Developed responsive web applications using React"
                            />
                            <button
                              onClick={addExpDescription}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                              Add
                            </button>
                          </div>
                          {newExperience.description.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 bg-white p-3 rounded-lg mb-2">
                              {newExperience.description.map((desc, i) => (
                                <li key={i} className="flex justify-between items-center">
                                  <span>{desc}</span>
                                  <button
                                    onClick={() => removeExpDescription(i)}
                                    className="text-red-600 hover:text-red-700 ml-2"
                                  >
                                    ×
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies Used</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={expTechInput}
                              onChange={(e) => setExpTechInput(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addExpTech()}
                              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="e.g., React, Node.js"
                            />
                            <button
                              onClick={addExpTech}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                              Add
                            </button>
                          </div>
                          {newExperience.technologies && newExperience.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {newExperience.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                  {tech}
                                  <button
                                    onClick={() => removeExpTech(tech)}
                                    className="hover:text-blue-900"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={addExperience}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
                          >
                            Add Experience
                          </button>
                          <button
                            onClick={() => {
                              setShowAddExperience(false);
                              setNewExperience({
                                title: "",
                                company: "",
                                location: "",
                                description: [],
                                startDate: "",
                                endDate: "",
                                current: false,
                                technologies: [],
                                achievements: [],
                              });
                            }}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects Portfolio Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Projects Portfolio</h3>
                    <span className="text-sm text-gray-500">Strongly Recommended</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add your projects to showcase your skills. This improves CV quality and portfolio.
                  </p>

                  {formData.projects.length > 0 && (
                    <div className="space-y-4 mb-4">
                      {formData.projects.map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{project.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.technologies.map((tech, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-4 mt-2 text-sm">
                                {project.url && (
                                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    Live Demo
                                  </a>
                                )}
                                {project.githubUrl && (
                                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
                                    GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeProject(index)}
                              className="text-red-600 hover:text-red-700 font-semibold ml-4"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showAddProject ? (
                    <button
                      onClick={() => setShowAddProject(true)}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition text-gray-600 font-semibold"
                    >
                      + Add Project
                    </button>
                  ) : (
                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Add Project</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                          <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                            placeholder="e.g., E-Commerce Platform"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                          <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                            placeholder="Describe your project..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies Used *</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={projectTechInput}
                              onChange={(e) => setProjectTechInput(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addProjectTech()}
                              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="e.g., React, Node.js, MongoDB"
                            />
                            <button
                              onClick={addProjectTech}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                              Add
                            </button>
                          </div>
                          {newProject.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {newProject.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                >
                                  {tech}
                                  <button
                                    onClick={() => removeProjectTech(tech)}
                                    className="hover:text-purple-900"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Live URL</label>
                            <input
                              type="url"
                              value={newProject.url}
                              onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="https://yourproject.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                            <input
                              type="url"
                              value={newProject.githubUrl}
                              onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={addProject}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
                          >
                            Add Project
                          </button>
                          <button
                            onClick={() => {
                              setShowAddProject(false);
                              setNewProject({
                                title: "",
                                description: "",
                                technologies: [],
                                url: "",
                                githubUrl: "",
                                highlights: [],
                              });
                            }}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {activeSection === "location" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-primary-600" size={28} />
                  Location
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="Bangladesh"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="Dhaka"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact & Social */}
            {activeSection === "contact" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="text-primary-600" size={28} />
                  Contact & Social Profiles
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Linkedin className="text-blue-600" size={18} />
                    LinkedIn Profile <span className="text-gray-400 font-normal text-xs ml-2">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Github className="text-gray-800" size={18} />
                    GitHub Profile <span className="text-gray-400 font-normal text-xs ml-2">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="text-primary-600" size={18} />
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="text-primary-600" size={18} />
                    Personal Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            )}

            {/* Additional Info */}
            {activeSection === "additional" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-primary-600" size={28} />
                  Additional Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addLanguage)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
                      placeholder="e.g., English, Bengali"
                    />
                    <button
                      onClick={addLanguage}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {lang}
                        <button
                          onClick={() => removeLanguage(lang)}
                          className="hover:text-gray-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex((s) => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                  }
                }}
                disabled={activeSection === sections[0].id}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                Previous
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Progress"}
              </button>

              <button
                onClick={async () => {
                  // Save before moving to next section
                  const saveSuccess = await handleSave();
                  
                  // Only proceed if save was successful
                  if (saveSuccess) {
                    const currentIndex = sections.findIndex((s) => s.id === activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1].id);
                    } else if (isComplete) {
                      router.push("/dashboard");
                      toast.success("Profile completed! Welcome to Upscale!");
                    }
                  }
                }}
                disabled={(activeSection === sections[sections.length - 1].id && !isComplete) || saving}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeSection === sections[sections.length - 1].id && isComplete
                  ? "Complete & Continue"
                  : "Next"}
                <ArrowRight size={18} />
              </button>
            </div>

            {isComplete && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={32} className="text-green-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Profile Complete! 🎉</h3>
                    <p className="text-gray-700">
                      Your profile is 100% complete. You can now generate roadmaps and apply to jobs!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getSectionFields(sectionId: string): string[] {
  const sectionFieldsMap: Record<string, string[]> = {
    basic: ["fullName", "email", "phone", "bio"],
    career: ["preferredTrack", "targetRoles", "skills", "availability", "workAuthorization"],
    education: ["educationLevel", "experienceLevel"],
    location: ["country", "city"],
    contact: ["linkedin", "github"],
    additional: [],
  };
  return sectionFieldsMap[sectionId] || [];
}

