"use client";

// ============================================
// CustomCursor — Animated custom cursor with theme-aware glow
//
// Dark mode  → soft white glow, futuristic pulse, blur halo
// Light mode → green-to-blue gradient glow, animated gradient, fintech style
//
// Features:
//   • Dual-layer design (dot + trailing ring)
//   • Hover expansion on buttons/links
//   • Text-mode shrink on paragraphs
//   • Click ripple animation
//   • Toggle to enable/disable
//   • Respects prefers-reduced-motion
//   • Hides automatically on mobile
// ============================================

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomCursor, CursorVariant } from "@/hooks/useCustomCursor";

// ---- Size config per variant ----
interface VariantConfig {
  dotSize: number;
  ringSize: number;
  dotOpacity: number;
  ringOpacity: number;
}

const VARIANT_MAP: Record<CursorVariant, VariantConfig> = {
  default: { dotSize: 8, ringSize: 36, dotOpacity: 1, ringOpacity: 0.5 },
  hover: { dotSize: 12, ringSize: 52, dotOpacity: 1, ringOpacity: 0.7 },
  text: { dotSize: 4, ringSize: 24, dotOpacity: 1, ringOpacity: 0.35 },
  click: { dotSize: 6, ringSize: 28, dotOpacity: 1, ringOpacity: 0.9 },
  hidden: { dotSize: 0, ringSize: 0, dotOpacity: 0, ringOpacity: 0 },
};

export default function CustomCursor() {
  const cursor = useCustomCursor();
  const [enabled, setEnabled] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [showRipple, setShowRipple] = useState(false);

  // ---- Track theme changes ----
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(!document.documentElement.classList.contains("light-theme"));
    };
    checkTheme();

    // Observe class changes on <html> to detect theme toggle
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ---- Click ripple effect ----
  useEffect(() => {
    if (cursor.variant === "click") {
      setShowRipple(true);
      const timer = setTimeout(() => setShowRipple(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cursor.variant]);

  // ---- Toggle handler (stored in localStorage) ----
  useEffect(() => {
    const saved = localStorage.getItem("custom-cursor");
    if (saved === "disabled") setEnabled(false);
  }, []);

  // ---- Add / remove class that hides native cursor ----
  useEffect(() => {
    if (!cursor.isActive) return;
    const html = document.documentElement;
    if (enabled) {
      html.classList.add("custom-cursor-active");
    } else {
      html.classList.remove("custom-cursor-active");
    }
    return () => html.classList.remove("custom-cursor-active");
  }, [enabled, cursor.isActive]);

  const toggleCursor = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("custom-cursor", next ? "enabled" : "disabled");
      return next;
    });
  }, []);

  // Don't render on mobile / touch devices
  if (!cursor.isActive) return null;

  const config = VARIANT_MAP[cursor.variant] || VARIANT_MAP.default;
  const isReducedMotion = cursor.prefersReducedMotion;

  // ---- Dark-mode glow styles ----
  const darkDotStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: [
      "0 0 8px 2px rgba(255,255,255,0.6)",
      "0 0 20px 6px rgba(255,255,255,0.3)",
      "0 0 40px 12px rgba(255,255,255,0.1)",
    ].join(", "),
  };

  const darkRingStyle: React.CSSProperties = {
    border: "1.5px solid rgba(255,255,255,0.25)",
    boxShadow: [
      "0 0 15px 4px rgba(255,255,255,0.08)",
      "inset 0 0 15px 4px rgba(255,255,255,0.03)",
    ].join(", "),
    background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
    backdropFilter: "blur(1px)",
  };

  // ---- Light-mode glow styles ----
  const lightDotStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #00ff99, #00ccff)",
    boxShadow: [
      "0 0 10px 3px rgba(0,255,153,0.5)",
      "0 0 25px 8px rgba(0,204,255,0.3)",
      "0 0 50px 15px rgba(0,204,255,0.1)",
    ].join(", "),
  };

  const lightRingStyle: React.CSSProperties = {
    border: "1.5px solid rgba(0,204,255,0.3)",
    boxShadow: [
      "0 0 18px 5px rgba(0,255,153,0.1)",
      "inset 0 0 18px 5px rgba(0,204,255,0.04)",
    ].join(", "),
    background:
      "radial-gradient(circle, rgba(0,255,153,0.06) 0%, rgba(0,204,255,0.03) 50%, transparent 70%)",
  };

  const dotStyle = isDark ? darkDotStyle : lightDotStyle;
  const ringStyle = isDark ? darkRingStyle : lightRingStyle;

  // Spring transition config — fast & responsive
  const springConfig = isReducedMotion
    ? { type: "tween" as const, duration: 0 }
    : { type: "spring" as const, stiffness: 500, damping: 28, mass: 0.5 };

  const trailSpringConfig = isReducedMotion
    ? { type: "tween" as const, duration: 0 }
    : { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.8 };

  return (
    <>
      {/* ---- Toggle button (fixed bottom-right) ---- */}
      <button
        onClick={toggleCursor}
        className="fixed bottom-4 right-4 z-[99999] w-8 h-8 rounded-full glass border border-white/10
                   hover:border-primary-500/30 transition-all duration-300 flex items-center justify-center
                   text-xs text-dark-300 hover:text-primary-400"
        title={enabled ? "Disable custom cursor" : "Enable custom cursor"}
        aria-label="Toggle custom cursor"
        data-cursor-toggle
        style={{ cursor: "pointer" }} // keep native cursor on the toggle
      >
        {enabled ? "✦" : "⊘"}
      </button>

      {/* ---- Cursor layers ---- */}
      {enabled && (
        <div
          className="pointer-events-none fixed inset-0 z-[99998]"
          aria-hidden="true"
        >
          <AnimatePresence>
            {cursor.isVisible && (
              <>
                {/* === Inner dot === */}
                <motion.div
                  key="cursor-dot"
                  className="absolute rounded-full will-change-transform"
                  style={{
                    ...dotStyle,
                    mixBlendMode: isDark ? "screen" : "multiply",
                  }}
                  animate={{
                    x: cursor.x - config.dotSize / 2,
                    y: cursor.y - config.dotSize / 2,
                    width: config.dotSize,
                    height: config.dotSize,
                    opacity: config.dotOpacity,
                  }}
                  transition={springConfig}
                  initial={false}
                />

                {/* === Outer trailing ring === */}
                <motion.div
                  key="cursor-ring"
                  className="absolute rounded-full will-change-transform"
                  style={ringStyle}
                  animate={{
                    x: cursor.trailX - config.ringSize / 2,
                    y: cursor.trailY - config.ringSize / 2,
                    width: config.ringSize,
                    height: config.ringSize,
                    opacity: config.ringOpacity,
                  }}
                  transition={trailSpringConfig}
                  initial={false}
                />

                {/* === Ambient glow (larger, faint) === */}
                <motion.div
                  key="cursor-glow"
                  className="absolute rounded-full will-change-transform"
                  style={{
                    background: isDark
                      ? "radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(0,255,153,0.04) 0%, rgba(0,204,255,0.02) 40%, transparent 70%)",
                    mixBlendMode: isDark ? "screen" : "soft-light",
                    filter: "blur(2px)",
                  }}
                  animate={{
                    x: cursor.trailX - 60,
                    y: cursor.trailY - 60,
                    width: 120,
                    height: 120,
                    opacity: cursor.variant === "hover" ? 0.9 : 0.6,
                  }}
                  transition={trailSpringConfig}
                  initial={false}
                />

                {/* === Pulse animation (dark mode only, non-reduced-motion) === */}
                {isDark && !isReducedMotion && (
                  <motion.div
                    key="cursor-pulse"
                    className="absolute rounded-full will-change-transform"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    animate={{
                      x: cursor.trailX - 24,
                      y: cursor.trailY - 24,
                      width: 48,
                      height: 48,
                      opacity: [0.4, 0, 0.4],
                      scale: [1, 1.8, 1],
                    }}
                    transition={{
                      x: trailSpringConfig,
                      y: trailSpringConfig,
                      opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                    initial={false}
                  />
                )}

                {/* === Gradient rotation ring (light mode only) === */}
                {!isDark && !isReducedMotion && (
                  <motion.div
                    key="cursor-gradient-spin"
                    className="absolute rounded-full will-change-transform"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #00ff99, #00ccff, #00ff99)",
                      WebkitMask:
                        "radial-gradient(circle, transparent 60%, black 61%, black 100%)",
                      mask:
                        "radial-gradient(circle, transparent 60%, black 61%, black 100%)",
                    }}
                    animate={{
                      x: cursor.trailX - 28,
                      y: cursor.trailY - 28,
                      width: 56,
                      height: 56,
                      rotate: [0, 360],
                      opacity: cursor.variant === "hover" ? 0.35 : 0.18,
                    }}
                    transition={{
                      x: trailSpringConfig,
                      y: trailSpringConfig,
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 0.3 },
                    }}
                    initial={false}
                  />
                )}

                {/* === Click ripple === */}
                <AnimatePresence>
                  {showRipple && !isReducedMotion && (
                    <motion.div
                      key="cursor-ripple"
                      className="absolute rounded-full will-change-transform"
                      style={{
                        border: isDark
                          ? "2px solid rgba(255,255,255,0.3)"
                          : "2px solid rgba(0,204,255,0.4)",
                      }}
                      initial={{
                        x: cursor.x - 10,
                        y: cursor.y - 10,
                        width: 20,
                        height: 20,
                        opacity: 0.8,
                      }}
                      animate={{
                        x: cursor.x - 40,
                        y: cursor.y - 40,
                        width: 80,
                        height: 80,
                        opacity: 0,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
