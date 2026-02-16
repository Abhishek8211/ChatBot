"use client";

// ============================================
// ThemeToggle — Standalone dark/light theme toggle
// Can be used in Header, Sidebar, or any layout component
// ============================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Check for saved preference
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.add("light-theme");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("light-theme", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="relative w-14 h-7 rounded-full glass border border-white/10 hover:border-primary-500/30 transition-all duration-300 flex items-center px-1"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-[10px]"
        animate={{ x: dark ? 0 : 24 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {dark ? "🌙" : "☀️"}
      </motion.div>
    </motion.button>
  );
}
