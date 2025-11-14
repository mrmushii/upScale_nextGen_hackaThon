"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Settings,
  ArrowLeft,
  Plus,
  X,
  FileText,
  Calendar,
  Building2,
  Code,
  Target,
  Save,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CAREER_TRACKS, EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "@/lib/constants";
import toast from "react-hot-toast";
import SkillExtractionPanel from "@/components/skills/SkillExtractionPanel";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    educationLevel: "",
    educationDepartment: "",
    education: [] as any[],
    experienceLevel: "",
    preferredTrack: "",
    skills: [] as string[],
    tools: [] as string[],
    targetRoles: [] as string[],
    careerInterests: [] as string[],
    experience: [] as any[],
    projects: [] as any[],
    cvText: "",
    country: "",
    city: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [careerInterestInput, setCareerInterestInput] = useState("");
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    description: "" as string | string[],
    startDate: "",
    endDate: "",
    current: false,
    technologies: [] as string[],
  });
  const [expDescriptionInput, setExpDescriptionInput] = useState("");
  const [expTechInput, setExpTechInput] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: [] as string[],
    url: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    highlights: [] as string[],
  });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchCompletion();
  }, []);

  const fetchCompletion = async () => {
    try {
      const response = await fetch("/api/user/profile/completion");
      if (response.ok) {
        const data = await response.json();
        setCompletion(data.completion);
      }
    } catch (error) {
      console.error("Error fetching completion:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setFormData({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          educationLevel: data.user.educationLevel || "",
          educationDepartment: data.user.educationDepartment || "",
          education: data.user.education || [],
          experienceLevel: data.user.experienceLevel || "",
          preferredTrack: data.user.preferredTrack || "",
          skills: data.user.skills || [],
          tools: data.user.tools || [],
          targetRoles: data.user.targetRoles || [],
          careerInterests: data.user.careerInterests || [],
          experience: (data.user.experience || []).map((exp: any) => ({
            ...exp,
            description: Array.isArray(exp.description) ? exp.description : exp.description ? [exp.description] : [],
          })),
          projects: data.user.projects || [],
          cvText: data.user.cvText || "",
          country: data.user.country || "",
          city: data.user.city || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setEditing(false);
        toast.success("Profile updated successfully!");
        await fetchProfile();
        await fetchCompletion();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
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

  const addTool = () => {
    if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
      setFormData({
        ...formData,
        tools: [...formData.tools, toolInput.trim()],
      });
      setToolInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s: string) => s !== skill),
    });
  };

  const removeTool = (tool: string) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter((t: string) => t !== tool),
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
      targetRoles: formData.targetRoles.filter((r: string) => r !== role),
    });
  };

  const addCareerInterest = () => {
    if (careerInterestInput.trim() && !formData.careerInterests.includes(careerInterestInput.trim())) {
      setFormData({
        ...formData,
        careerInterests: [...formData.careerInterests, careerInterestInput.trim()],
      });
      setCareerInterestInput("");
    }
  };

  const removeCareerInterest = (interest: string) => {
    setFormData({
      ...formData,
      careerInterests: formData.careerInterests.filter((i: string) => i !== interest),
    });
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.description) {
      setFormData({
        ...formData,
        experience: [
          ...formData.experience,
          {
            ...newExperience,
            startDate: newExperience.startDate ? new Date(newExperience.startDate) : undefined,
            endDate: newExperience.endDate ? new Date(newExperience.endDate) : undefined,
          },
        ],
      });
      setNewExperience({
        title: "",
        company: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
        technologies: [],
      });
      setShowAddExperience(false);
    }
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_: any, i: number) => i !== index),
    });
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setFormData({
        ...formData,
        projects: [
          ...formData.projects,
          {
            ...newProject,
            startDate: newProject.startDate ? new Date(newProject.startDate) : undefined,
            endDate: newProject.endDate ? new Date(newProject.endDate) : undefined,
          },
        ],
      });
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        url: "",
        githubUrl: "",
        startDate: "",
        endDate: "",
        highlights: [],
      });
      setShowAddProject(false);
    }
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_: any, i: number) => i !== index),
    });
  };

  const addTech = () => {
    if (techInput.trim() && !newProject.technologies.includes(techInput.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((t: string) => t !== tech),
    });
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

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found</p>
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your profile information</p>
          
          {/* Profile Completion Status */}
          {completion && (
            <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">Profile Completion</span>
                <span className="text-2xl font-bold text-primary-600">{completion.percentage || 0}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full transition-all duration-500"
                  style={{ width: `${completion.percentage || 0}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-blue-50 rounded p-2">
                  <div className="font-semibold text-blue-700">Tier 1: Core</div>
                  <div className="text-blue-900">{completion.tier1Complete || 0}/{completion.tier1Total || 9}</div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="font-semibold text-green-700">Tier 2: Enhancement</div>
                  <div className="text-green-900">{completion.tier2Complete || 0}/{completion.tier2Total || 4}</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="font-semibold text-gray-700">Tier 3: Optional</div>
                  <div className="text-gray-900">{completion.tier3Complete || 0}/{completion.tier3Total || 7}</div>
                </div>
              </div>
              {completion.missingFields && completion.missingFields.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Missing: {completion.missingFields.slice(0, 3).join(", ")}
                  {completion.missingFields.length > 3 && ` +${completion.missingFields.length - 3} more`}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  fetchProfile(); // Reset form
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-coral-600 p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {profile.avatar ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={profile.avatar}
                    alt={profile.fullName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold">
                  {profile.fullName?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="text-3xl font-bold mb-2 bg-white/20 border-2 border-white/30 rounded-lg px-4 py-2 w-full max-w-md text-white placeholder-white/70"
                  placeholder="Full Name"
                />
              ) : (
                <h2 className="text-3xl font-bold mb-2">{profile.fullName || "User"}</h2>
              )}
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                </div>
                {(profile.city || profile.country) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    {editing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm w-24"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm w-32"
                          placeholder="Country"
                        />
                      </div>
                    ) : (
                      <span>{[profile.city, profile.country].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={24} className="text-primary-600" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Education Level
                </label>
                {editing ? (
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Select Education Level</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-lg font-semibold text-gray-900">
                      {profile.educationLevel || "Not specified"}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.educationDepartment}
                    onChange={(e) => setFormData({ ...formData, educationDepartment: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    placeholder="e.g., Computer Science, Business Administration"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-lg font-semibold text-gray-900">
                      {profile.educationDepartment || "Not specified"}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level
                </label>
                {editing ? (
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Select Experience Level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-lg font-semibold text-gray-900">
                      {profile.experienceLevel || "Not specified"}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Career Track
                </label>
                {editing ? (
                  <select
                    value={formData.preferredTrack}
                    onChange={(e) => setFormData({ ...formData, preferredTrack: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Select Career Track</option>
                    {CAREER_TRACKS.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-lg font-semibold text-gray-900">
                      {profile.preferredTrack || "Not specified"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Education History */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap size={24} className="text-primary-600" />
              Education History
            </h3>
            {editing ? (
              <div className="space-y-4">
                {formData.education && formData.education.length > 0 ? (
                  formData.education.map((edu: any, index: number) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                      <div className="font-bold text-gray-900">{edu.degree} {edu.field ? `in ${edu.field}` : ""}</div>
                      <div className="text-gray-600">{edu.institution}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {edu.year && `Year: ${edu.year}`}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No education history added. Add it in the profile completion page.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="font-bold text-gray-900">{edu.degree} {edu.field ? `in ${edu.field}` : ""}</div>
                      <div className="text-gray-600">{edu.institution}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {edu.year && `Year: ${edu.year}`}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No education history added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={24} className="text-primary-600" />
              Skills
            </h3>
            {editing ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    placeholder="Add a skill (e.g., JavaScript, Communication)"
                  />
                  <button
                    onClick={addSkill}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-coral-50 text-primary-700 rounded-lg font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-primary-900"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-primary-50 to-coral-50 text-primary-700 rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Tools & Technologies */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code size={24} className="text-primary-600" />
              Tools & Technologies
            </h3>
            {editing ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTool();
                      }
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    placeholder="Add a tool (e.g., React, AWS, TensorFlow)"
                  />
                  <button
                    onClick={addTool}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tools.map((tool: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium"
                    >
                      {tool}
                      <button onClick={() => removeTool(tool)} className="hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.tools && profile.tools.length > 0 ? (
                  profile.tools.map((tool: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium"
                    >
                      {tool}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No tools added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Target Roles */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={24} className="text-primary-600" />
              Target Roles / Career Interests
            </h3>
            {editing ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetRoleInput}
                    onChange={(e) => setTargetRoleInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTargetRole();
                      }
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    placeholder="Add target role (e.g., Frontend Developer)"
                  />
                  <button
                    onClick={addTargetRole}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.targetRoles.map((role: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium"
                    >
                      {role}
                      <button
                        onClick={() => removeTargetRole(role)}
                        className="hover:text-primary-900"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Career Interests
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={careerInterestInput}
                      onChange={(e) => setCareerInterestInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCareerInterest();
                        }
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                      placeholder="Add career interest"
                    />
                    <button
                      onClick={addCareerInterest}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.careerInterests.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium"
                      >
                        {interest}
                        <button
                          onClick={() => removeCareerInterest(interest)}
                          className="hover:text-purple-900"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.targetRoles && profile.targetRoles.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Target Roles</div>
                    <div className="flex flex-wrap gap-2">
                      {profile.targetRoles.map((role: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.careerInterests && profile.careerInterests.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Career Interests</div>
                    <div className="flex flex-wrap gap-2">
                      {profile.careerInterests.map((interest: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(!profile.targetRoles || profile.targetRoles.length === 0) &&
                  (!profile.careerInterests || profile.careerInterests.length === 0) && (
                    <p className="text-gray-500">No target roles or interests added yet</p>
                  )}
              </div>
            )}
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={24} className="text-primary-600" />
              Experience
            </h3>
            {editing ? (
              <div className="space-y-4">
                {formData.experience.map((exp: any, index: number) => (
                  <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{exp.title}</div>
                        {exp.company && <div className="text-gray-600">{exp.company}</div>}
                        <div className="text-sm text-gray-500 mt-1">
                          {exp.startDate
                            ? new Date(exp.startDate).toLocaleDateString()
                            : "Start date"}
                          {" - "}
                          {exp.current
                            ? "Present"
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString()
                            : "End date"}
                        </div>
                        {Array.isArray(exp.description) && exp.description.length > 0 ? (
                          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                            {exp.description.map((desc: string, i: number) => (
                              <li key={i}>{desc}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700 mt-2">{exp.description || "No description"}</p>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {exp.technologies.map((tech: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeExperience(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {showAddExperience ? (
                  <div className="p-4 border-2 border-dashed border-primary-300 rounded-xl bg-primary-50">
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={newExperience.title}
                        onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                        placeholder="Job Title *"
                      />
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                        placeholder="Company"
                      />
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description/Bullet Points * (Add multiple)
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={expDescriptionInput}
                            onChange={(e) => setExpDescriptionInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const desc = Array.isArray(newExperience.description) 
                                  ? newExperience.description 
                                  : newExperience.description 
                                  ? [newExperience.description] 
                                  : [];
                                setNewExperience({ ...newExperience, description: [...desc, expDescriptionInput.trim()] });
                                setExpDescriptionInput("");
                              }
                            }}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                            placeholder="e.g., Developed responsive web applications"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const desc = Array.isArray(newExperience.description) 
                                ? newExperience.description 
                                : newExperience.description 
                                ? [newExperience.description] 
                                : [];
                              setNewExperience({ ...newExperience, description: [...desc, expDescriptionInput.trim()] });
                              setExpDescriptionInput("");
                            }}
                            className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                          >
                            Add
                          </button>
                        </div>
                        {Array.isArray(newExperience.description) && newExperience.description.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-2">
                            {newExperience.description.map((desc: string, i: number) => (
                              <li key={i} className="flex justify-between items-center">
                                <span>{desc}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const desc = newExperience.description as string[];
                                    setNewExperience({ ...newExperience, description: desc.filter((_, idx) => idx !== i) });
                                  }}
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
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const techs = newExperience.technologies || [];
                                if (!techs.includes(expTechInput.trim())) {
                                  setNewExperience({ ...newExperience, technologies: [...techs, expTechInput.trim()] });
                                  setExpTechInput("");
                                }
                              }
                            }}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                            placeholder="e.g., React, Node.js"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const techs = newExperience.technologies || [];
                              if (!techs.includes(expTechInput.trim())) {
                                setNewExperience({ ...newExperience, technologies: [...techs, expTechInput.trim()] });
                                setExpTechInput("");
                              }
                            }}
                            className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                          >
                            Add
                          </button>
                        </div>
                        {newExperience.technologies && newExperience.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newExperience.technologies.map((tech: string, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewExperience({ 
                                      ...newExperience, 
                                      technologies: newExperience.technologies?.filter((t) => t !== tech) || [] 
                                    });
                                  }}
                                  className="hover:text-blue-900"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={newExperience.location}
                          onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="date"
                          value={newExperience.startDate}
                          onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                          placeholder="Start Date"
                        />
                        <div className="flex items-center gap-4">
                          <input
                            type="date"
                            value={newExperience.endDate}
                            onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                            disabled={newExperience.current}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none disabled:bg-gray-100"
                            placeholder="End Date"
                          />
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newExperience.current}
                              onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Current</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={addExperience}
                          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
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
                              description: "",
                              startDate: "",
                              endDate: "",
                              current: false,
                              technologies: [],
                            });
                            setExpDescriptionInput("");
                            setExpTechInput("");
                          }}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddExperience(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition flex items-center justify-center gap-2 text-gray-600"
                  >
                    <Plus size={20} />
                    Add Experience
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {profile.experience && profile.experience.length > 0 ? (
                  profile.experience.map((exp: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="font-bold text-gray-900">{exp.title}</div>
                      {exp.company && <div className="text-gray-600">{exp.company}</div>}
                      <div className="text-sm text-gray-500 mt-1">
                        {exp.startDate
                          ? new Date(exp.startDate).toLocaleDateString()
                          : "Start date"}
                        {" - "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString()
                          : "End date"}
                      </div>
                      {Array.isArray(exp.description) && exp.description.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                          {exp.description.map((desc: string, i: number) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 mt-2">{exp.description || "No description"}</p>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exp.technologies.map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No experience added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code size={24} className="text-primary-600" />
              Projects
            </h3>
            {editing ? (
              <div className="space-y-4">
                {formData.projects.map((project: any, index: number) => (
                  <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{project.title}</div>
                        <div className="flex gap-4 mt-2 text-sm">
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:underline"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                        <p className="text-gray-700 mt-2">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech: string, techIndex: number) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeProject(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {showAddProject ? (
                  <div className="p-4 border-2 border-dashed border-primary-300 rounded-xl bg-primary-50">
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                        placeholder="Project Title *"
                      />
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                        placeholder="Project Description *"
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="url"
                          value={newProject.url}
                          onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                          placeholder="Live URL (optional)"
                        />
                        <input
                          type="url"
                          value={newProject.githubUrl}
                          onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                          placeholder="GitHub URL (optional)"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTech();
                              }
                            }}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                            placeholder="Add technology"
                          />
                          <button
                            onClick={addTech}
                            className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newProject.technologies.map((tech: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              {tech}
                              <button onClick={() => removeTech(tech)}>
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="url"
                            value={newProject.url}
                            onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                            placeholder="Live URL (optional)"
                          />
                          <input
                            type="url"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                            placeholder="GitHub URL (optional)"
                          />
                        </div>
                      <div className="flex gap-2">
                        <button
                          onClick={addProject}
                          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
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
                              startDate: "",
                              endDate: "",
                              highlights: [],
                            });
                          }}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition flex items-center justify-center gap-2 text-gray-600"
                  >
                    <Plus size={20} />
                    Add Project
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((project: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="font-bold text-gray-900">{project.title}</div>
                        <p className="text-gray-700 mt-2">{project.description}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:underline"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No projects added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Smart Skill Extraction */}
          {editing && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles size={24} className="text-primary-600" />
                Smart Skill Extraction
              </h3>
              <SkillExtractionPanel
                context="profile"
                existingSkills={formData.skills}
                existingTools={formData.tools}
                existingRoles={formData.targetRoles}
                onApply={async (update) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    skills: update.skills,
                    tools: update.tools,
                    targetRoles: update.roles,
                  }));
                  toast.success("Skills extracted and applied! Review and save your profile to persist changes.");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
