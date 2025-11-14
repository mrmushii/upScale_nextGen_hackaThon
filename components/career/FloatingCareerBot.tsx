"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Minimize2, Send, MessageCircle } from "lucide-react";
import CareerBot from "./CareerBot";

export default function FloatingCareerBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  // Don't close on outside click - let users control it manually
  // This provides better UX for a chat interface

  const toggleWindow = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleWindow}
        className={`floating-careerbot-button fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary-600 to-coral-600 text-white shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group ${
          isOpen && !isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label={isOpen && isMinimized ? "Restore CareerBot" : "Open CareerBot"}
      >
        {isOpen && isMinimized ? (
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition" />
        ) : (
          <Bot className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition" />
        )}
        {/* Pulse animation - only when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-20" />
        )}
      </button>

      {/* Floating Window */}
      {isOpen && (
        <div
          ref={windowRef}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${
            isMinimized
              ? "w-80 h-16 opacity-0 pointer-events-none"
              : "w-[calc(100vw-2rem)] sm:w-[420px] h-[calc(100vh-8rem)] sm:h-[600px] max-h-[600px] opacity-100 shadow-2xl"
          }`}
          style={{
            animation: isMinimized
              ? undefined
              : "slideUp 0.3s ease-out",
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Window Header */}
            <div className="bg-gradient-to-r from-primary-600 to-coral-600 text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">CareerBot</h3>
                  <p className="text-xs text-white/90 hidden sm:block">Your AI career mentor</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleMinimize}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden">
                <CareerBot />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

