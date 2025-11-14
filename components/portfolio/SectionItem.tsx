"use client";

import { GripVertical, FileText, Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import SectionEditor from "./SectionEditor";

interface SectionItemProps {
  section: any;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function SectionItem({
  section,
  index,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
}: SectionItemProps) {
  if (isEditing) {
    return (
      <SectionEditor
        section={section}
        onSave={(updates) => {
          onUpdate(updates);
          onCancel();
        }}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    );
  }

  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition flex items-center justify-between group">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex flex-col gap-1">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 hover:bg-gray-100 rounded transition"
              title="Move up"
            >
              <ChevronUp size={16} className="text-gray-400" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 hover:bg-gray-100 rounded transition"
              title="Move down"
            >
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          )}
        </div>
        <GripVertical size={20} className="text-gray-400 cursor-move" />
        <FileText size={20} className="text-primary-600" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{section.title}</span>
            {!section.visible && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                Hidden
              </span>
            )}
            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium capitalize">
              {section.type}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleVisibility}
          className={`p-2 rounded-lg transition ${
            section.visible
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title={section.visible ? "Hide section" : "Show section"}
        >
          <Eye size={18} />
        </button>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Edit section"
        >
          <Edit size={18} className="text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-100 rounded-lg transition"
          title="Delete section"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>
    </div>
  );
}

