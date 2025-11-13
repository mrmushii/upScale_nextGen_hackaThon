"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, Eye, CheckCircle2, Lightbulb, XCircle } from "lucide-react";

interface CodeEditorProps {
  exercise: {
    title: string;
    description: string;
    code: string;
    solution: string;
    hints: string[];
    testCases?: Array<{ input: string; expected: string }>;
    completed?: boolean;
  };
  onComplete: () => void;
  isCompleted: boolean;
}

export default function CodeEditor({ exercise, onComplete, isCompleted }: CodeEditorProps) {
  // Validate exercise data
  const safeExercise = {
    title: exercise?.title || "Untitled Exercise",
    description: exercise?.description || "Complete this exercise",
    code: exercise?.code || "// Write your code here",
    solution: exercise?.solution || exercise?.code || "",
    hints: exercise?.hints || [],
    testCases: exercise?.testCases || [],
    completed: exercise?.completed || false,
  };

  const [code, setCode] = useState(safeExercise.code);
  const [output, setOutput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (exercise) {
      const newCode = exercise?.code || "// Write your code here";
      setCode(newCode);
      setOutput("");
      setTestResults([]);
      setShowSolution(false);
      setShowHints(false);
    }
  }, [exercise?.title, exercise?.code, exercise]);

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    setTestResults([]);

    try {
      // Check if it's HTML/CSS code
      if (code.includes("<!DOCTYPE") || code.includes("<html") || code.includes("<div")) {
        // HTML/CSS code - show in preview
        setOutput("✅ HTML/CSS code ready! Check the preview below.");
        setIsRunning(false);
        return;
      }

      // JavaScript code execution
      try {
        // Create a safe execution context
        const result = eval(code);
        
        if (result !== undefined) {
          setOutput(`✅ Code executed successfully!\nResult: ${JSON.stringify(result)}`);
        } else {
          setOutput("✅ Code executed successfully!");
        }
      } catch (evalError: any) {
        setOutput(`❌ Error: ${evalError.message}`);
      }
    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(safeExercise.code);
    setOutput("");
    setTestResults([]);
    setShowSolution(false);
  };

  const checkSolution = () => {
    if (!safeExercise.testCases || safeExercise.testCases.length === 0) {
      // No test cases - simple validation
      const hasContent = code.trim().length > safeExercise.code.trim().length;
      if (hasContent) {
        setOutput("✅ Great job! Exercise completed!");
        setTestResults([{ passed: true, message: "Code submitted successfully!" }]);
        onComplete();
      } else {
        setOutput("⚠️ Add some code first before checking!");
        setTestResults([{ passed: false, message: "Please write some code before submitting." }]);
      }
      return;
    }

    // Run test cases
    setIsRunning(true);
    const results: Array<{ passed: boolean; message: string }> = [];
    let allPassed = true;

    try {
      safeExercise.testCases.forEach((testCase, index) => {
        try {
          // Create a function from the user's code
          const userFunction = new Function("input", `
            ${code}
            // Try to find and execute the main function
            if (typeof solution !== 'undefined') {
              return solution(input);
            }
            if (typeof main !== 'undefined') {
              return main(input);
            }
            // If no function found, try to execute the code directly
            return eval(code);
          `);

          const result = userFunction(testCase.input);
          const passed = String(result) === String(testCase.expected) || 
                        JSON.stringify(result) === JSON.stringify(testCase.expected);

          if (passed) {
            results.push({
              passed: true,
              message: `Test ${index + 1}: ✅ Passed (Input: ${testCase.input}, Expected: ${testCase.expected}, Got: ${result})`,
            });
          } else {
            allPassed = false;
            results.push({
              passed: false,
              message: `Test ${index + 1}: ❌ Failed (Input: ${testCase.input}, Expected: ${testCase.expected}, Got: ${result})`,
            });
          }
        } catch (error: any) {
          allPassed = false;
          results.push({
            passed: false,
            message: `Test ${index + 1}: ❌ Error - ${error.message}`,
          });
        }
      });

      setTestResults(results);

      if (allPassed) {
        setOutput("🎉 All tests passed! Exercise completed!");
        onComplete();
      } else {
        setOutput(`⚠️ Some tests failed. Please review and try again.`);
      }
    } catch (error: any) {
      setOutput(`❌ Error running tests: ${error.message}`);
      setTestResults([{ passed: false, message: error.message }]);
    } finally {
      setIsRunning(false);
    }
  };

  const compareWithSolution = () => {
    // Simple comparison - check if code is similar to solution
    const userCodeClean = code.trim().toLowerCase().replace(/\s+/g, " ");
    const solutionClean = safeExercise.solution.trim().toLowerCase().replace(/\s+/g, " ");
    
    if (userCodeClean === solutionClean) {
      return true;
    }

    // Check if key parts match (for more flexible validation)
    const solutionKeywords = solutionClean.split(" ").filter(w => w.length > 3);
    const userKeywords = userCodeClean.split(" ").filter(w => w.length > 3);
    const matchCount = userKeywords.filter(kw => solutionKeywords.includes(kw)).length;
    const similarity = matchCount / solutionKeywords.length;

    return similarity > 0.7; // 70% similarity threshold
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Exercise Header */}
      <div className="bg-gradient-to-r from-primary-600 to-coral-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{safeExercise.title}</h3>
          {isCompleted && (
            <div className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded-full">
              <CheckCircle2 size={16} />
              <span className="text-sm font-semibold">Completed</span>
            </div>
          )}
        </div>
        <p className="text-white/90">{safeExercise.description}</p>
      </div>

      {/* Code Editor */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={16} />
              Run Code
            </button>
            <button
              onClick={checkSolution}
              disabled={isRunning || isCompleted}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={16} />
              {safeExercise.testCases && safeExercise.testCases.length > 0 ? "Run Tests" : "Check Solution"}
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
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Lightbulb size={20} className="text-yellow-600" />
              Hints:
            </h4>
            <ul className="space-y-1">
              {safeExercise.hints && safeExercise.hints.length > 0 ? (
                safeExercise.hints.map((hint, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    {index + 1}. {hint}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm italic">No hints available for this exercise.</li>
              )}
            </ul>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              Solution:
            </h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{safeExercise.solution}</code>
            </pre>
          </div>
        )}

        {/* Code Editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isCompleted}
          className="w-full h-64 px-4 py-3 bg-gray-900 text-gray-100 font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          spellCheck={false}
          placeholder="Write your code here..."
        />

        {/* Output */}
        {output && (
          <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">Output:</h4>
            <pre className="text-gray-700 text-sm whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">Test Results:</h4>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}
                    <span className={`text-sm ${result.passed ? "text-green-700" : "text-red-700"}`}>
                      {result.message}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Preview (for HTML/CSS) */}
        {(code.includes("<!DOCTYPE") || code.includes("<html") || code.includes("<div")) && (
          <div className="mt-4">
            <h4 className="font-bold text-gray-900 mb-2">Live Preview:</h4>
            <div className="border-2 border-gray-200 rounded-xl p-4 bg-white min-h-[200px]">
              <iframe
                srcDoc={code}
                className="w-full h-full min-h-[180px] border-none"
                sandbox="allow-scripts allow-same-origin"
                title="preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
