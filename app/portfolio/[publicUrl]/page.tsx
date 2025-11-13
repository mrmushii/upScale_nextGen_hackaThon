"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mail, Phone, Globe, Linkedin, Github, Twitter, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PortfolioSection {
  id: string;
  type: string;
  title: string;
  content: any;
  visible: boolean;
}

interface Portfolio {
  _id?: string;
  template: string;
  sections: PortfolioSection[];
  views?: number;
}

export default function PublicPortfolioPage() {
  const params = useParams();
  const publicUrl = params.publicUrl as string;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (publicUrl) {
      fetchPortfolio();
    }
  }, [publicUrl]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`/api/portfolio?publicUrl=${publicUrl}`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-4">This portfolio doesn't exist or is not published.</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const renderSection = (section: PortfolioSection) => {
    if (!section.visible) return null;

    switch (section.type) {
      case "about":
        return (
          <section key={section.id} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {section.content?.text || ""}
            </p>
          </section>
        );

      case "skills":
        const skills = section.content?.items || [];
        return (
          <section key={section.id} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((skill: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{skill.name || "Skill"}</span>
                    <span className="text-sm text-gray-600">{skill.level || 0}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full"
                      style={{ width: `${skill.level || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
      case "experience":
      case "education":
        const items = section.content?.items || [];
        return (
          <section key={section.id} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <div className="space-y-6">
              {items.map((item: any, index: number) => (
                <div key={index} className="p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-primary-300 transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title || "Untitled"}</h3>
                  {item.subtitle && (
                    <p className="text-primary-600 font-semibold mb-3">{item.subtitle}</p>
                  )}
                  {item.description && (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "contact":
        return (
          <section key={section.id} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <div className="space-y-4">
              {section.content?.email && (
                <a
                  href={`mailto:${section.content.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition"
                >
                  <Mail size={20} />
                  <span>{section.content.email}</span>
                </a>
              )}
              {section.content?.phone && (
                <a
                  href={`tel:${section.content.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition"
                >
                  <Phone size={20} />
                  <span>{section.content.phone}</span>
                </a>
              )}
              {section.content?.social && (
                <div className="flex items-center gap-4 mt-4">
                  {section.content.social.linkedin && (
                    <a
                      href={section.content.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {section.content.social.github && (
                    <a
                      href={section.content.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {section.content.social.twitter && (
                    <a
                      href={section.content.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const visibleSections = portfolio.sections.filter((s) => s.visible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {visibleSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">This portfolio is empty.</p>
            </div>
          ) : (
            visibleSections.map(renderSection)
          )}
        </div>

        {portfolio.views !== undefined && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            {portfolio.views} view{portfolio.views !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

