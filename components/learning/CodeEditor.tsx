"use client";

import { useState } from "react";
import { Play, RotateCcw, Eye, CheckCircle2, Lightbulb } from "lucide-react";

interface CodeEditorProps {
  exercise: {
    title: string;
    description: string;
    code: string;
    solution: string;
    hints: string[];
  };
  onComplete: () => void;
  isCompleted: boolean;
}

export default function CodeEditor({ exercise, onComplete, isCompleted }: CodeEditorProps) {
  const [code, setCode] = useState(exercise.code);
  const [output, setOutput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const runCode = () => {
    // Create iframe for safe code execution
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(code);
      iframeDoc.close();
    }

    // For now, show success message
    setOutput("Code executed! Check the preview below.");
    
    // Remove iframe after a moment
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  };

  const resetCode = () => {
    setCode(exercise.code);
    setOutput("");
  };

  const checkSolution = () => {
    // Simple check - in production, use proper validation
    const hasContent = code.trim().length > exercise.code.trim().length;
    if (hasContent) {
      setOutput("✅ Great job! Exercise completed!");
      onComplete();
    } else {
      setOutput("⚠️ Add some code first before checking!");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Exercise Header */}
      <div className="bg-gradient-to-r from-primary-600 to-coral-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{exercise.title}</h3>
          {isCompleted && (
            <div className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded-full">
              <CheckCircle2 size={16} />
              <span className="text-sm font-semibold">Completed</span>
            </div>
          )}
        </div>
        <p className="text-white/90">{exercise.description}</p>
      </div>

      {/* Code Editor */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={runCode}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <Play size={16} />
              Run Code
            </button>
            <button
              onClick={checkSolution}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <CheckCircle2 size={16} />
              Check
            </button>
            <button
              onClick={resetCode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-500 text-yellow-700 rounded-lg hover:bg-yellow-50 transition font-semibold"
            >
              <Lightbulb size={16} />
              Hints
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-primary-500 text-primary-700 rounded-lg hover:bg-primary-50 transition font-semibold"
            >
              <Eye size={16} />
              Solution
            </button>
          </div>
        </div>

        {/* Hints */}
        {showHints && (
          <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">💡 Hints:</h4>
            <ul className="space-y-1">
              {exercise.hints.map((hint, index) => (
                <li key={index} className="text-gray-700 text-sm">
                  {index + 1}. {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">✅ Solution:</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{exercise.solution}</code>
            </pre>
          </div>
        )}

        {/* Code Editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 px-4 py-3 bg-gray-900 text-gray-100 font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          spellCheck={false}
        />

        {/* Output */}
        {output && (
          <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">Output:</h4>
            <pre className="text-gray-700 text-sm whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {/* Live Preview */}
        <div className="mt-4">
          <h4 className="font-bold text-gray-900 mb-2">Live Preview:</h4>
          <div className="border-2 border-gray-200 rounded-xl p-4 bg-white min-h-[200px]">
            <iframe
              srcDoc={code}
              className="w-full h-full min-h-[180px] border-none"
              sandbox="allow-scripts"
              title="preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}




