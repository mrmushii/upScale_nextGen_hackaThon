"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, ShieldCheck, Sparkles, Upload } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

interface SkillExtractionPanelProps {
  context?: "profile" | "resume";
  resumeId?: string;
  defaultText?: string;
  existingSkills?: string[];
  existingTools?: string[];
  existingRoles?: string[];
  onApply?: (update: { skills: string[]; tools: string[]; roles: string[] }) => Promise<void> | void;
}

type ExtractionMode = "resume" | "text" | "upload";

interface ExtractionResult {
  skills: string[];
  tools: string[];
  roles: { name: string; confidence: number; category?: string }[];
  evidence: Array<{ item: string; source: "LLM" | "Heuristic"; rationale: string; matchedTerms?: string[] }>;
}

const defaultResult: ExtractionResult = {
  skills: [],
  tools: [],
  roles: [],
  evidence: [],
};

const MODE_LABELS: Record<ExtractionMode, string> = {
  resume: "Use Resume",
  text: "Paste Text",
  upload: "Upload File",
};

const signature = (items: string[]) =>
  [...items].map((item) => item.trim()).filter(Boolean).sort().join("|");

export default function SkillExtractionPanel({
  context = "profile",
  resumeId,
  defaultText = "",
  existingSkills = [],
  existingTools = [],
  existingRoles = [],
  onApply,
}: SkillExtractionPanelProps) {
  const defaultMode: ExtractionMode = useMemo(() => {
    if (resumeId) return "resume";
    return "text";
  }, [resumeId]);

  const [mode, setMode] = useState<ExtractionMode>(defaultMode);
  const [textInput, setTextInput] = useState(defaultText);
  const [file, setFile] = useState<File | null>(null);

  // Sync textInput with defaultText when it changes (e.g., when CV text is updated)
  useEffect(() => {
    if (defaultText && mode === "text") {
      setTextInput(defaultText);
    }
  }, [defaultText, mode]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [usedFallback, setUsedFallback] = useState(false);
  const [result, setResult] = useState<ExtractionResult>(defaultResult);
  const [editableSkills, setEditableSkills] = useState<string[]>(existingSkills);
  const [editableTools, setEditableTools] = useState<string[]>(existingTools);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(existingRoles);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== "success") {
      setEditableSkills(existingSkills);
      setEditableTools(existingTools);
      setSelectedRoles(existingRoles);
    }
  }, [existingSkills, existingTools, existingRoles, status]);

  const resetEdits = useCallback(() => {
    setEditableSkills(result.skills);
    setEditableTools(result.tools);
    setSelectedRoles(result.roles.map((role) => role.name));
  }, [result]);

  const handleAnalyze = async () => {
    try {
      setStatus("loading");
      setMessage("");
      setUsedFallback(false);

      const endpoint = "/api/skills/extract";
      let response;

      if (mode === "upload") {
        if (!file) {
          toast.error("Please select a file to upload.");
          setStatus("idle");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      } else {
        const payload: Record<string, any> = {};
        if (mode === "resume" && resumeId) {
          payload.resumeId = resumeId;
        } else if (mode === "text") {
          if (!textInput || textInput.trim().length < 40) {
            toast.error("Please paste at least 40 characters of CV content.");
            setStatus("idle");
            return;
          }
          payload.cvText = textInput;
        }
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to extract skills.");
      }

      const data = await response.json();
      const extracted: ExtractionResult = data.result || data;

      setResult(extracted);
      setEditableSkills(extracted.skills);
      setEditableTools(extracted.tools);
      setSelectedRoles(extracted.roles.map((role) => role.name));
      setUsedFallback(Boolean(data.usedFallback));
      setMessage(data.message || "");
      setStatus("success");
      toast.success("Smart extraction complete!");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      toast.error(error.message || "Failed to extract skills.");
    }
  };

  const handleApply = async () => {
    try {
      setSaving(true);
      const payload = {
        skills: editableSkills,
        tools: editableTools,
        targetRoles: selectedRoles,
      };

      if (onApply) {
        await onApply({
          skills: editableSkills,
          tools: editableTools,
          roles: selectedRoles,
        });
      } else {
        const response = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Failed to save to profile.");
        }
      }
      toast.success("Skills applied to profile.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to apply skills.");
    } finally {
      setSaving(false);
    }
  };

  const addItem = (value: string, list: string[], setter: (items: string[]) => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setter([...list, trimmed]);
    }
  };

  const removeItem = (value: string, list: string[], setter: (items: string[]) => void) => {
    setter(list.filter((item) => item !== value));
  };

  const selectableRoles = useMemo(() => result.roles.map((role) => role.name), [result.roles]);

  const isApplyDisabled =
    saving ||
    (signature(editableSkills) === signature(existingSkills) &&
      signature(editableTools) === signature(existingTools) &&
      signature(selectedRoles) === signature(existingRoles));

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-primary-50 text-primary-600">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Smart Skill Extraction</h3>
          <p className="text-gray-600 text-sm">
            Automatically detect skills, tools, and roles from your resume or profile. Review before saving.
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(resumeId ? (["resume", "text", "upload"] as ExtractionMode[]) : ["text", "upload"] as ExtractionMode[]).map(
          (option: ExtractionMode) => (
            <button
              key={option}
              onClick={() => setMode(option)}
              className={clsx(
                "px-4 py-2 rounded-xl border-2 text-sm font-semibold transition",
                mode === option
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-primary-200 text-gray-600"
              )}
            >
              {MODE_LABELS[option]}
            </button>
          )
        )}
      </div>

      {/* Input sections */}
      {mode === "text" && (
        <div className="mb-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={6}
            placeholder="Paste your CV or summary here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-2">We recommend pasting at least 3-4 bullet points for best accuracy.</p>
        </div>
      )}

      {mode === "upload" && (
        <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-2xl py-6 text-gray-600 hover:border-primary-300 cursor-pointer mb-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) {
                setFile(selected);
              }
            }}
          />
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-primary-600 font-semibold mb-1">
              <Upload className="w-4 h-4" />
              {file ? file.name : "Choose PDF / DOCX"}
            </div>
            <p className="text-xs text-gray-500">Max 20MB. Text-based resumes only.</p>
          </div>
        </label>
      )}

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <button
          onClick={handleAnalyze}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run Extraction
            </>
          )}
        </button>
        {status === "success" && (
          <button
            onClick={resetEdits}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-primary-200"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Suggestions
          </button>
        )}
        {usedFallback && (
          <div className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
            <ShieldCheck className="w-3 h-3" />
            Using heuristic fallback
          </div>
        )}
      </div>

      {message && (
        <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          {message}
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <TagGroup
            title="Detected Skills"
            placeholder="Add skill"
            items={editableSkills}
            onAdd={(value) => addItem(value, editableSkills, setEditableSkills)}
            onRemove={(value) => removeItem(value, editableSkills, setEditableSkills)}
          />

          <TagGroup
            title="Tools & Technologies"
            placeholder="Add tool"
            items={editableTools}
            onAdd={(value) => addItem(value, editableTools, setEditableTools)}
            onRemove={(value) => removeItem(value, editableTools, setEditableTools)}
          />

          <RoleSelector
            roles={result.roles}
            selectedRoles={selectedRoles}
            onToggle={(roleName) => {
              if (selectedRoles.includes(roleName)) {
                setSelectedRoles(selectedRoles.filter((role) => role !== roleName));
              } else {
                setSelectedRoles([...selectedRoles, roleName]);
              }
            }}
          />

          <EvidenceList evidence={result.evidence} />

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleApply}
              disabled={isApplyDisabled}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Apply to Profile
                </>
              )}
            </button>
            <p className="text-xs text-gray-500">
              Changes are not applied until you confirm. Review the tags and remove anything irrelevant.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TagGroup({
  title,
  items,
  placeholder,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  placeholder: string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">{items.length} selected</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-full px-3 py-1 text-sm"
          >
            {item}
            <button onClick={() => onRemove(item)} className="text-primary-500 hover:text-primary-700">
              ×
            </button>
          </span>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">No items detected yet.</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          onClick={() => {
            onAdd(input);
            setInput("");
          }}
          className="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-200 hover:border-primary-200"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function RoleSelector({
  roles,
  selectedRoles,
  onToggle,
}: {
  roles: { name: string; confidence: number; category?: string }[];
  selectedRoles: string[];
  onToggle: (name: string) => void;
}) {
  if (!roles.length) return null;
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">Recommended Roles</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {roles.map((role) => (
          <button
            key={role.name}
            onClick={() => onToggle(role.name)}
            className={clsx(
              "text-left border rounded-2xl p-4 transition",
              selectedRoles.includes(role.name)
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-primary-200"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900">{role.name}</span>
              <span className="text-xs text-gray-500">{Math.round(role.confidence * 100)}% match</span>
            </div>
            {role.category && <p className="text-xs text-gray-500 mb-1 capitalize">{role.category} track</p>}
            <p className="text-xs text-gray-500">
              Detected from your experience and skills.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function EvidenceList({
  evidence,
}: {
  evidence: Array<{ item: string; source: "LLM" | "Heuristic"; rationale: string; matchedTerms?: string[] }>;
}) {
  if (!evidence.length) return null;
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-primary-600" />
        <h4 className="font-semibold text-gray-900 text-sm">Why we detected these</h4>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {evidence.slice(0, 30).map((entry, index) => (
          <div key={`${entry.item}-${index}`} className="text-xs text-gray-600">
            <span className="font-semibold text-gray-800">{entry.item}</span>{" "}
            <span className="uppercase text-[10px] text-gray-400 tracking-wider">{entry.source}</span> —{" "}
            {entry.rationale}
            {entry.matchedTerms && entry.matchedTerms.length > 0 && (
              <span className="text-gray-500"> (matched: {entry.matchedTerms.join(", ")})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

