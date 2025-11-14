"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import TemplateSelector from "@/components/portfolio/TemplateSelector";
import SectionList from "@/components/portfolio/SectionList";

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

const SECTION_TYPES = [
  { id: "about", name: "About Me", icon: "👤" },
  { id: "skills", name: "Skills", icon: "💼" },
  { id: "projects", name: "Projects", icon: "🚀" },
  { id: "experience", name: "Experience", icon: "💼" },
  { id: "education", name: "Education", icon: "🎓" },
  { id: "contact", name: "Contact", icon: "📧" },
  { id: "custom", name: "Custom", icon: "✨" },
];

export default function PortfolioPage() {
  const { data: session } = useSession();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);

  useEffect(() => {
    if (session) {
    fetchPortfolio();
    }
  }, [session]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
      } else {
        toast.error("Failed to load portfolio");
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("Error loading portfolio");
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
        toast.success("Portfolio saved successfully!");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save portfolio");
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast.error("Error saving portfolio");
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

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "about":
        return { text: "", image: null };
      case "skills":
        return { items: [] };
      case "projects":
        return { items: [] };
      case "experience":
        return { items: [] };
      case "education":
        return { items: [] };
      case "contact":
        return { email: "", phone: "", location: "", social: {} };
      case "custom":
        return { text: "", html: "" };
      default:
        return {};
    }
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
    setEditingSection(newSection.id);
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
      if (editingSection === sectionId) {
        setEditingSection(null);
      }
      toast.success("Section deleted");
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    if (!portfolio) return;
    const section = portfolio.sections.find((s) => s.id === sectionId);
    if (section) {
      updateSection(sectionId, { visible: !section.visible });
    }
  };

  const reorderSections = (newSections: PortfolioSection[]) => {
    if (!portfolio) return;
    // Update order numbers
    const reordered = newSections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));
    setPortfolio({
      ...portfolio,
      sections: reordered,
    });
  };

  const publishPortfolio = async () => {
    if (!portfolio) return;
    if (confirm("Publish this portfolio? It will be visible to the public.")) {
      setPortfolio({ ...portfolio, published: true });
      await savePortfolio();
      toast.success("Portfolio published successfully!");
    }
  };

  const copyPublicLink = () => {
    if (portfolio?.publicUrl) {
      const link = `${window.location.origin}/portfolio/${portfolio.publicUrl}`;
      navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
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
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Portfolio</h2>
        <button
          onClick={fetchPortfolio}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PortfolioHeader
        portfolio={portfolio}
        saving={saving}
        onSave={savePortfolio}
        onPublish={publishPortfolio}
        onCopyLink={copyPublicLink}
      />

      {showTemplateSelection ? (
        <TemplateSelector
          currentTemplate={portfolio.template}
          isOpen={showTemplateSelection}
          onClose={() => setShowTemplateSelection(false)}
          onSelect={selectTemplate}
        />
      ) : (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Current Template</h3>
              <p className="text-gray-600 capitalize">
                {portfolio.template}
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

      <SectionList
        sections={portfolio.sections}
        portfolio={portfolio}
        editingSection={editingSection}
        onEdit={(sectionId) => setEditingSection(sectionId)}
                  onCancel={() => setEditingSection(null)}
        onUpdate={(sectionId, updates) => {
          updateSection(sectionId, updates);
                    setEditingSection(null);
                  }}
        onDelete={deleteSection}
        onToggleVisibility={toggleSectionVisibility}
        onAddSection={addSection}
        onReorder={reorderSections}
      />
    </div>
  );
}
