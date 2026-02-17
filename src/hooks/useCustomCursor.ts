"use client";

// ============================================
// useCustomCursor — High-performance cursor position tracker
// Uses requestAnimationFrame for smooth 60fps tracking.
// Detects hover targets (buttons, links, inputs) and click state.
// Automatically disables on touch/mobile devices.
// ============================================

import { useState, useEffect, useRef, useCallback } from "react";

/** Describes the current cursor interaction context */
export type CursorVariant = "default" | "hover" | "text" | "click" | "hidden";

export interface CursorState {
  /** Actual mouse position (instant) */
  x: number;
  y: number;
  /** Smoothed / trailing position for the outer ring */
  trailX: number;
  trailY: number;
  /** Current interaction variant */
  variant: CursorVariant;
  /** Whether the cursor system is active (false on mobile) */
  isActive: boolean;
  /** Whether reduced-motion is preferred */
  prefersReducedMotion: boolean;
  /** Whether cursor is currently visible in the viewport */
  isVisible: boolean;
}

// Clickable element selector — covers buttons, links, inputs, etc.
const CLICKABLE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="pointer"]';

// Text element selector
const TEXT_SELECTOR =
  'p, span, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, [data-cursor="text"]';

/**
 * Detects if the device is touch-only (no fine pointer).
 * Used to disable the custom cursor on mobile / tablets.
 */
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return true;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function useCustomCursor(): CursorState {
  const [state, setState] = useState<CursorState>({
    x: -100,
    y: -100,
    trailX: -100,
    trailY: -100,
    variant: "default",
    isActive: false,
    prefersReducedMotion: false,
    isVisible: false,
  });

  // Refs to avoid stale closures in rAF loop
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const variant = useRef<CursorVariant>("default");
  const isVisible = useRef(false);
  const rafId = useRef<number>(0);

  // Smoothing factor (0 = no trailing, 1 = instant). Lower = more trailing.
  const LERP_FACTOR = 0.15;

  /** Linear interpolation helper */
  const lerp = useCallback((a: number, b: number, t: number) => a + (b - a) * t, []);

  useEffect(() => {
    // Bail on touch devices
    if (isTouchDevice()) return;

    // Check reduced-motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = motionQuery.matches;

    setState((prev) => ({
      ...prev,
      isActive: true,
      prefersReducedMotion: reducedMotion,
    }));

    // ---- Event handlers ----

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
      }
    };

    const handleMouseDown = () => {
      variant.current = "click";
    };

    const handleMouseUp = () => {
      variant.current = "default";
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
    };

    /**
     * Determine variant based on the element under the cursor.
     * Uses mouseover/mouseout for efficiency (delegation).
     */
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest(CLICKABLE_SELECTOR)) {
        variant.current = "hover";
      } else if (target.closest(TEXT_SELECTOR)) {
        variant.current = "text";
      } else {
        variant.current = "default";
      }
    };

    const handleMouseOut = () => {
      variant.current = "default";
    };

    // ---- rAF loop for smooth trailing ----
    const tick = () => {
      const factor = reducedMotion ? 1 : LERP_FACTOR;

      trailPos.current = {
        x: lerp(trailPos.current.x, mousePos.current.x, factor),
        y: lerp(trailPos.current.y, mousePos.current.y, factor),
      };

      setState({
        x: mousePos.current.x,
        y: mousePos.current.y,
        trailX: trailPos.current.x,
        trailY: trailPos.current.y,
        variant: variant.current,
        isActive: true,
        prefersReducedMotion: reducedMotion,
        isVisible: isVisible.current,
      });

      rafId.current = requestAnimationFrame(tick);
    };

    // Register listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    // Start the loop
    rafId.current = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [lerp]);

  return state;
}
