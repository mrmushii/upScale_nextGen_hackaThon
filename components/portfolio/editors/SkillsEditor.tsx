"use client";

import { Plus, X } from "lucide-react";

interface SkillsEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export default function SkillsEditor({ content, onChange }: SkillsEditorProps) {
  const skills = content.items || [];

  const addSkill = () => {
    onChange({
      ...content,
      items: [...skills, { name: "", level: 50, category: "technical" }],
    });
  };

  const updateSkill = (index: number, updates: any) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], ...updates };
    onChange({ ...content, items: newSkills });
  };

  const removeSkill = (index: number) => {
    onChange({
      ...content,
      items: skills.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Skills & Expertise
        </label>
        <button
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-semibold"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          <p>No skills added yet. Click "Add Skill" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill: any, index: number) => (
            <div
              key={index}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  value={skill.name || ""}
                  onChange={(e) => updateSkill(index, { name: e.target.value })}
                  placeholder="Skill name (e.g., JavaScript, React)"
                  className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <select
                  value={skill.category || "technical"}
                  onChange={(e) => updateSkill(index, { category: e.target.value })}
                  className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skills</option>
                  <option value="language">Language</option>
                  <option value="tool">Tool</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level || 50}
                    onChange={(e) =>
                      updateSkill(index, { level: parseInt(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                    {skill.level || 50}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${skill.level || 50}%` }}
                />
              </div>
              <button
                onClick={() => removeSkill(index)}
                className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <X size={16} />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

