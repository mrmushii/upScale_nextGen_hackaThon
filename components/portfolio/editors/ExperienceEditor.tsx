"use client";

import { Plus, X, Calendar } from "lucide-react";

interface ExperienceEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export default function ExperienceEditor({ content, onChange }: ExperienceEditorProps) {
  const experiences = content.items || [];

  const addExperience = () => {
    onChange({
      ...content,
      items: [
        ...experiences,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: [],
        },
      ],
    });
  };

  const updateExperience = (index: number, updates: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], ...updates };
    onChange({ ...content, items: newExperiences });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...content,
      items: experiences.filter((_: any, i: number) => i !== index),
    });
  };

  const addAchievement = (expIndex: number, achievement: string) => {
    if (!achievement.trim()) return;
    const exp = experiences[expIndex];
    const achievements = exp.achievements || [];
    updateExperience(expIndex, {
      achievements: [...achievements, achievement.trim()],
    });
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const exp = experiences[expIndex];
    const achievements = exp.achievements || [];
    updateExperience(expIndex, {
      achievements: achievements.filter((_: string, i: number) => i !== achIndex),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Work Experience
        </label>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-semibold"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          <p>No experience added yet. Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp: any, index: number) => (
            <div
              key={index}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={exp.title || ""}
                    onChange={(e) => updateExperience(index, { title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={exp.company || ""}
                    onChange={(e) => updateExperience(index, { company: e.target.value })}
                    placeholder="Company name"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location || ""}
                    onChange={(e) => updateExperience(index, { location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Employment Period
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="month"
                      value={exp.startDate || ""}
                      onChange={(e) => updateExperience(index, { startDate: e.target.value })}
                      className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    <span className="text-gray-500">to</span>
                    {exp.current ? (
                      <span className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg font-semibold text-sm">
                        Present
                      </span>
                    ) : (
                      <input
                        type="month"
                        value={exp.endDate || ""}
                        onChange={(e) => updateExperience(index, { endDate: e.target.value })}
                        className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      />
                    )}
                  </div>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={(e) => {
                        updateExperience(index, {
                          current: e.target.checked,
                          endDate: e.target.checked ? "" : exp.endDate,
                        });
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Current position</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={exp.description || ""}
                  onChange={(e) => updateExperience(index, { description: e.target.value })}
                  placeholder="Brief description of your role and responsibilities..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none min-h-[100px] resize-y"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Achievements
                </label>
                <div className="space-y-2 mb-2">
                  {(exp.achievements || []).map((ach: string, achIndex: number) => (
                    <div
                      key={achIndex}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="flex-1 text-sm">{ach}</span>
                      <button
                        onClick={() => removeAchievement(index, achIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add achievement and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAchievement(index, e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => removeExperience(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <X size={16} />
                Remove Experience
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

