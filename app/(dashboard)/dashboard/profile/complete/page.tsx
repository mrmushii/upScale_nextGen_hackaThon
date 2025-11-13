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
  });

  const [skillInput, setSkillInput] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

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

      {/* Progress Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">Profile Completion</span>
          <span className="text-2xl font-bold text-primary-600">{completionPercentage}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="text-primary-600" size={28} />
                  Education & Experience
                </h2>

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

