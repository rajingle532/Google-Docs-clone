"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 40, height: 40 }} />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        position: "relative",
        width: 64,
        height: 32,
        borderRadius: 16,
        background: isDark ? "linear-gradient(180deg, #1e1e2d 0%, #2a2a40 100%)" : "linear-gradient(180deg, #d1d5db 0%, #e5e7eb 100%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: 4,
        boxShadow: isDark 
          ? "inset 0 2px 6px rgba(0,0,0,0.6), 0 2px 8px rgba(255,255,255,0.05)"
          : "inset 0 2px 6px rgba(0,0,0,0.2), 0 2px 8px rgba(255,255,255,0.5)",
        flexShrink: 0,
        transition: "background 0.3s ease",
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {/* The 3D Thumb */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          background: isDark 
            ? "linear-gradient(135deg, #4b5563 0%, #1f2937 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
          boxShadow: isDark
            ? "inset 0 1px 1px rgba(255,255,255,0.15), 0 2px 5px rgba(0,0,0,0.6)"
            : "inset 0 -2px 5px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.2)",
          transform: `translateX(${isDark ? 32 : 0}px)`,
          transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isDark ? "#fbbf24" : "#4b5563",
        }}
      >
        {isDark ? <Moon size={14} fill="currentColor" strokeWidth={0} /> : <Sun size={14} strokeWidth={2} />}
      </div>
    </button>
  );
}
