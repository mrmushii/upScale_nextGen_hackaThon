"use client";

import { useState, useEffect } from "react";
import { X, Check, Trash2 } from "lucide-react";
import AboutEditor from "./editors/AboutEditor";
import SkillsEditor from "./editors/SkillsEditor";
import ProjectsEditor from "./editors/ProjectsEditor";
import ExperienceEditor from "./editors/ExperienceEditor";
import EducationEditor from "./editors/EducationEditor";
import ContactEditor from "./editors/ContactEditor";
import CustomEditor from "./editors/CustomEditor";

interface SectionEditorProps {
  section: any;
  onSave: (updates: any) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function SectionEditor({
  section,
  onSave,
  onCancel,
  onDelete,
}: SectionEditorProps) {
  const [formData, setFormData] = useState(section);

  useEffect(() => {
    setFormData(section);
  }, [section]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this section?")) {
      onDelete();
    }
  };

  const renderContentEditor = () => {
    switch (section.type) {
      case "about":
        return (
          <AboutEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        );
      case "skills":
        return (
          <SkillsEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        );
      case "projects":
        return (
          <ProjectsEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        );
      case "experience":
        return (
          <ExperienceEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        );
      case "education":
        return (
          <EducationEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        );
      case "contact":
        return (
          <ContactEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        );
      case "custom":
        return (
          <CustomEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        );
      default:
        return <div className="text-gray-500">Unknown section type</div>;
    }
  };

  return (
    <div className="p-6 border-2 border-primary-300 rounded-xl bg-primary-50/50">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="text-xl font-bold bg-transparent border-b-2 border-transparent focus:border-primary-500 focus:outline-none px-2 py-1"
          placeholder="Section Title"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            title="Save changes"
          >
            <Check size={20} />
          </button>
          <button
            onClick={onCancel}
            className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            title="Cancel editing"
          >
            <X size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            title="Delete section"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="mt-4">{renderContentEditor()}</div>
    </div>
  );
}

