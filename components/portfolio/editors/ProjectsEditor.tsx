"use client";

import { Plus, X, ExternalLink, Github } from "lucide-react";
import { useState } from "react";

interface ProjectsEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export default function ProjectsEditor({ content, onChange }: ProjectsEditorProps) {
  const projects = content.items || [];

  const addProject = () => {
    onChange({
      ...content,
      items: [
        ...projects,
        {
          title: "",
          description: "",
          technologies: [],
          githubUrl: "",
          liveUrl: "",
          image: null,
        },
      ],
    });
  };

  const updateProject = (index: number, updates: any) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], ...updates };
    onChange({ ...content, items: newProjects });
  };

  const removeProject = (index: number) => {
    onChange({
      ...content,
      items: projects.filter((_: any, i: number) => i !== index),
    });
  };

  const addTechnology = (projectIndex: number, tech: string) => {
    if (!tech.trim()) return;
    const project = projects[projectIndex];
    const technologies = project.technologies || [];
    if (!technologies.includes(tech.trim())) {
      updateProject(projectIndex, {
        technologies: [...technologies, tech.trim()],
      });
    }
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const project = projects[projectIndex];
    const technologies = project.technologies || [];
    updateProject(projectIndex, {
      technologies: technologies.filter((_: string, i: number) => i !== techIndex),
    });
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProject(index, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Projects
        </label>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-semibold"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          <p>No projects added yet. Click "Add Project" to showcase your work.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={project.title || ""}
                    onChange={(e) => updateProject(index, { title: e.target.value })}
                    placeholder="e.g., E-Commerce Platform"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Image
                  </label>
                  {project.image ? (
                    <div className="relative">
                      <img
                        src={project.image}
                        alt={project.title || "Project"}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => updateProject(index, { image: null })}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition">
                      <span className="text-sm text-gray-500">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={project.description || ""}
                  onChange={(e) => updateProject(index, { description: e.target.value })}
                  placeholder="Describe your project, its features, and your role..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none min-h-[100px] resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Github size={16} className="inline mr-1" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={project.githubUrl || ""}
                    onChange={(e) => updateProject(index, { githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ExternalLink size={16} className="inline mr-1" />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={project.liveUrl || ""}
                    onChange={(e) => updateProject(index, { liveUrl: e.target.value })}
                    placeholder="https://your-project.com"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(project.technologies || []).map((tech: string, techIndex: number) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex items-center gap-1"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechnology(index, techIndex)}
                        className="hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type technology and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechnology(index, e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => removeProject(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <X size={16} />
                Remove Project
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

