"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Eye,
  Download,
  Share2,
  Plus,
  Edit,
  X,
  Save,
  GripVertical,
  Trash2,
  Check,
  Globe,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface PortfolioSection {
  id: string;
  type: "about" | "skills" | "projects" | "experience" | "education" | "contact" | "custom";
  title: string;
  content: any;
  order: number;
  visible: boolean;
}

interface Portfolio {
  _id?: string;
  template: "basic" | "professional" | "creative";
  sections: PortfolioSection[];
  published: boolean;
  publicUrl?: string;
  views?: number;
}

const TEMPLATES = [
  { id: "basic", name: "Basic", description: "Clean and simple design" },
  { id: "professional", name: "Professional", description: "Corporate and polished" },
  { id: "creative", name: "Creative", description: "Bold and artistic" },
];

const SECTION_TYPES = [
  { id: "about", name: "About Me", icon: "👤" },
  { id: "skills", name: "Skills", icon: "💼" },
  { id: "projects", name: "Projects", icon: "🚀" },
  { id: "experience", name: "Experience", icon: "💼" },
  { id: "education", name: "Education", icon: "🎓" },
  { id: "contact", name: "Contact", icon: "📧" },
];

export default function PortfolioPage() {
  const { data: session } = useSession();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [session]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePortfolio = async () => {
    if (!portfolio) return;

    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolio),
      });

      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
        alert("Portfolio saved successfully!");
      } else {
        alert("Failed to save portfolio");
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Error saving portfolio");
    } finally {
      setSaving(false);
    }
  };

  const selectTemplate = (templateId: string) => {
    if (!portfolio) return;
    setPortfolio({ ...portfolio, template: templateId as any });
    setShowTemplateSelection(false);
    savePortfolio();
  };

  const addSection = (type: string) => {
    if (!portfolio) return;

    const newSection: PortfolioSection = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      title: SECTION_TYPES.find((s) => s.id === type)?.name || type,
      content: getDefaultContent(type),
      order: portfolio.sections.length + 1,
      visible: true,
    };

    setPortfolio({
      ...portfolio,
      sections: [...portfolio.sections, newSection],
    });
    setShowAddSection(false);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "about":
        return { text: "" };
      case "skills":
        return { items: [] };
      case "projects":
        return { items: [] };
      case "experience":
        return { items: [] };
      case "education":
        return { items: [] };
      case "contact":
        return { email: "", phone: "", social: {} };
      default:
        return {};
    }
  };

  const updateSection = (sectionId: string, updates: Partial<PortfolioSection>) => {
    if (!portfolio) return;
    setPortfolio({
      ...portfolio,
      sections: portfolio.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!portfolio) return;
    if (confirm("Are you sure you want to delete this section?")) {
      setPortfolio({
        ...portfolio,
        sections: portfolio.sections.filter((s) => s.id !== sectionId),
      });
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    if (!portfolio) return;
    updateSection(sectionId, {
      visible: !portfolio.sections.find((s) => s.id === sectionId)?.visible,
    });
  };

  const publishPortfolio = async () => {
    if (!portfolio) return;
    if (confirm("Publish this portfolio? It will be visible to the public.")) {
      setPortfolio({ ...portfolio, published: true });
      await savePortfolio();
    }
  };

  const copyPublicLink = () => {
    if (portfolio?.publicUrl) {
      const link = `${window.location.origin}/portfolio/${portfolio.publicUrl}`;
      navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return <div>Error loading portfolio</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Portfolio Builder</h1>
          <p className="text-gray-600 mt-2">Create a professional portfolio to showcase your work</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={savePortfolio}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save"}
          </button>
          {portfolio.published && (
            <button
              onClick={copyPublicLink}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
            >
              <Share2 size={20} />
              Copy Link
            </button>
          )}
        </div>
      </div>

      {/* Template Selection */}
      {showTemplateSelection ? (
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
            <button
              onClick={() => setShowTemplateSelection(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => selectTemplate(template.id)}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer border-2 ${
                  portfolio.template === template.id
                    ? "border-primary-600"
                    : "border-gray-200"
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-coral-100 rounded-xl mb-4 flex items-center justify-center text-6xl">
                  📄
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                {portfolio.template === template.id && (
                  <div className="flex items-center gap-2 text-primary-600 font-semibold">
                    <Check size={20} />
                    Current Template
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Current Template</h3>
              <p className="text-gray-600">
                {TEMPLATES.find((t) => t.id === portfolio.template)?.name || "Basic"}
              </p>
            </div>
            <button
              onClick={() => setShowTemplateSelection(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Change Template
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Sections */}
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
            {!portfolio.published && (
              <button
                onClick={publishPortfolio}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                <Globe size={18} />
                Publish
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowAddSection(!showAddSection)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                <Plus size={20} />
                Add Section
              </button>
              {showAddSection && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-10">
                  <div className="p-2">
                    {SECTION_TYPES.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => addSection(section.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-left"
                      >
                        <span className="text-2xl">{section.icon}</span>
                        <span className="font-medium text-gray-900">{section.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {portfolio.sections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No sections yet. Add a section to get started!</p>
            </div>
          ) : (
            portfolio.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  isEditing={editingSection === section.id}
                  onEdit={() => setEditingSection(section.id)}
                  onCancel={() => setEditingSection(null)}
                  onUpdate={(updates) => {
                    updateSection(section.id, updates);
                    setEditingSection(null);
                  }}
                  onDelete={() => deleteSection(section.id)}
                  onToggleVisibility={() => toggleSectionVisibility(section.id)}
                />
              ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <a
          href={portfolio.published && portfolio.publicUrl ? `/portfolio/${portfolio.publicUrl}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition font-semibold ${
            portfolio.published
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Eye size={20} />
          Preview
        </a>
        <button
          disabled
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 transition font-semibold opacity-50 cursor-not-allowed"
        >
          <Download size={20} />
          Export PDF (Coming Soon)
        </button>
        {portfolio.published && portfolio.publicUrl && (
          <button
            onClick={copyPublicLink}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 transition font-semibold"
          >
            <Share2 size={20} />
            Share Link
          </button>
        )}
      </div>
    </div>
  );
}

function SectionEditor({
  section,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
  onToggleVisibility,
}: {
  section: PortfolioSection;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (updates: Partial<PortfolioSection>) => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  const [formData, setFormData] = useState(section);

  useEffect(() => {
    setFormData(section);
  }, [section]);

  const handleSave = () => {
    onUpdate(formData);
  };

  const renderContentEditor = () => {
    switch (section.type) {
      case "about":
        return (
          <textarea
            value={formData.content.text || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                content: { ...formData.content, text: e.target.value },
              })
            }
            placeholder="Write about yourself..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none min-h-[200px]"
          />
        );
      case "skills":
        const skills = formData.content.items || [];
        return (
          <div className="space-y-3">
            {skills.map((skill: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill.name || ""}
                  onChange={(e) => {
                    const newItems = [...skills];
                    newItems[index] = { ...skill, name: e.target.value };
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items: newItems },
                    });
                  }}
                  placeholder="Skill name"
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.level || 0}
                  onChange={(e) => {
                    const newItems = [...skills];
                    newItems[index] = { ...skill, level: parseInt(e.target.value) };
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items: newItems },
                    });
                  }}
                  placeholder="Level %"
                  className="w-24 p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const newItems = skills.filter((_: any, i: number) => i !== index);
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items: newItems },
                    });
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    items: [...skills, { name: "", level: 0 }],
                  },
                });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition text-gray-600 font-medium"
            >
              + Add Skill
            </button>
          </div>
        );
      case "projects":
      case "experience":
      case "education":
        const items = formData.content.items || [];
        return (
          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <div key={index} className="p-4 border-2 border-gray-200 rounded-xl space-y-3">
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, title: e.target.value };
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items: newItems },
                    });
                  }}
                  placeholder="Title"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={item.subtitle || ""}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, subtitle: e.target.value };
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items: newItems },
                    });
                  }}
                  placeholder="Subtitle/Company/Institution"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <textarea
                  value={item.description || ""}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, description: e.target.value };
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items: newItems },
                    });
                  }}
                  placeholder="Description"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none min-h-[100px]"
                />
                <button
                  onClick={() => {
                    const newItems = items.filter((_: any, i: number) => i !== index);
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items: newItems },
                    });
                  }}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    items: [...items, { title: "", subtitle: "", description: "" }],
                  },
                });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition text-gray-600 font-medium"
            >
              + Add Item
            </button>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <input
              type="email"
              value={formData.content.email || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, email: e.target.value },
                })
              }
              placeholder="Email"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
            <input
              type="tel"
              value={formData.content.phone || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, phone: e.target.value },
                })
              }
              placeholder="Phone"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            />
          </div>
        );
      default:
        return <div>Edit content for {section.type}</div>;
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 border-2 border-primary-300 rounded-xl bg-primary-50/50">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-xl font-bold bg-transparent border-none focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Check size={20} />
            </button>
            <button
              onClick={onCancel}
              className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {renderContentEditor()}
      </div>
    );
  }

  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <GripVertical size={20} className="text-gray-400 cursor-move" />
        <FileText size={20} className="text-primary-600" />
        <div className="flex-1">
          <span className="font-semibold text-gray-900">{section.title}</span>
          {!section.visible && (
            <span className="ml-2 text-xs text-gray-500">(Hidden)</span>
          )}
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
        >
          <Edit size={18} className="text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-100 rounded-lg transition"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>
    </div>
  );
}
