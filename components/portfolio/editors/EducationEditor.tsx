"use client";

import { Plus, X, GraduationCap, Calendar } from "lucide-react";

interface EducationEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export default function EducationEditor({ content, onChange }: EducationEditorProps) {
  const educations = content.items || [];

  const addEducation = () => {
    onChange({
      ...content,
      items: [
        ...educations,
        {
          degree: "",
          institution: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
          description: "",
        },
      ],
    });
  };

  const updateEducation = (index: number, updates: any) => {
    const newEducations = [...educations];
    newEducations[index] = { ...newEducations[index], ...updates };
    onChange({ ...content, items: newEducations });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...content,
      items: educations.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Education
        </label>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-semibold"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          <p>No education added yet. Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu: any, index: number) => (
            <div
              key={index}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap size={16} className="inline mr-1" />
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) => updateEducation(index, { degree: e.target.value })}
                    placeholder="e.g., Bachelor of Science"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ""}
                    onChange={(e) => updateEducation(index, { institution: e.target.value })}
                    placeholder="University/College name"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field || ""}
                    onChange={(e) => updateEducation(index, { field: e.target.value })}
                    placeholder="e.g., Computer Science"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={edu.location || ""}
                    onChange={(e) => updateEducation(index, { location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={edu.startDate || ""}
                    onChange={(e) => updateEducation(index, { startDate: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate || ""}
                    onChange={(e) => updateEducation(index, { endDate: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ""}
                    onChange={(e) => updateEducation(index, { gpa: e.target.value })}
                    placeholder="e.g., 3.8/4.0"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={edu.description || ""}
                  onChange={(e) => updateEducation(index, { description: e.target.value })}
                  placeholder="Relevant coursework, honors, achievements..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none min-h-[80px] resize-y"
                />
              </div>

              <button
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <X size={16} />
                Remove Education
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

