"use client";

import { Plus, Globe, Eye } from "lucide-react";
import { useState } from "react";
import SectionItem from "./SectionItem";
import AddSectionMenu from "./AddSectionMenu";

const SECTION_TYPES = [
  { id: "about", name: "About Me", icon: "👤", description: "Personal introduction" },
  { id: "skills", name: "Skills", icon: "💼", description: "Technical and soft skills" },
  { id: "projects", name: "Projects", icon: "🚀", description: "Portfolio projects" },
  { id: "experience", name: "Experience", icon: "💼", description: "Work experience" },
  { id: "education", name: "Education", icon: "🎓", description: "Academic background" },
  { id: "contact", name: "Contact", icon: "📧", description: "Contact information" },
  { id: "custom", name: "Custom", icon: "✨", description: "Custom section" },
];

interface SectionListProps {
  sections: any[];
  portfolio: any;
  editingSection: string | null;
  onEdit: (sectionId: string) => void;
  onCancel: () => void;
  onUpdate: (sectionId: string, updates: any) => void;
  onDelete: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string) => void;
  onAddSection: (type: string) => void;
  onReorder: (sections: any[]) => void;
}

export default function SectionList({
  sections,
  portfolio,
  editingSection,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
  onToggleVisibility,
  onAddSection,
  onReorder,
}: SectionListProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Sections</h2>
        <div className="flex items-center gap-3">
          {portfolio.published && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <Globe size={18} />
              <span className="font-semibold">Published</span>
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              <Plus size={20} />
              Add Section
            </button>
            {showAddMenu && (
              <AddSectionMenu
                sections={SECTION_TYPES}
                onSelect={(type) => {
                  onAddSection(type);
                  setShowAddMenu(false);
                }}
                onClose={() => setShowAddMenu(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-medium mb-2">No sections yet</p>
            <p className="text-sm">Add a section to get started building your portfolio!</p>
          </div>
        ) : (
          sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <SectionItem
                key={section.id}
                section={section}
                index={index}
                isEditing={editingSection === section.id}
                onEdit={() => onEdit(section.id)}
                onCancel={onCancel}
                onUpdate={(updates) => {
                  onUpdate(section.id, updates);
                }}
                onDelete={() => onDelete(section.id)}
                onToggleVisibility={() => onToggleVisibility(section.id)}
                onMoveUp={index > 0 ? () => {
                  const newSections = [...sections];
                  [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
                  newSections[index - 1].order = index;
                  newSections[index].order = index + 1;
                  onReorder(newSections);
                } : undefined}
                onMoveDown={index < sections.length - 1 ? () => {
                  const newSections = [...sections];
                  [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                  newSections[index].order = index + 1;
                  newSections[index + 1].order = index + 2;
                  onReorder(newSections);
                } : undefined}
              />
            ))
        )}
      </div>
    </div>
  );
}

