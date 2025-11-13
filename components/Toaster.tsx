"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#1f2937",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
          style: {
            borderLeft: "4px solid #10b981",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          style: {
            borderLeft: "4px solid #ef4444",
          },
        },
        loading: {
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}

