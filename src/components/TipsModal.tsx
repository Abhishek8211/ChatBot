"use client";

// ============================================
// TipsModal — Animated floating panel for AI energy-saving tips
//
// Dark mode:  glassmorphism + white glow edges
// Light mode: soft green-blue gradient border
//
// Features:
//   • Framer Motion fade-in + scale + slide-up
//   • Smooth backdrop blur
//   • Close on X / ESC / click outside
//   • Typing effect for AI response
//   • Loading skeleton animation
//   • Regenerate, Copy, Download PDF buttons
//   • Timestamp + source badge
//   • Estimated monthly savings highlight
//   • Per-tip fade-in animation
//   • Success toast on load
// ============================================

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { CalculationResult } from "@/utils/types";
import { GeminiTip } from "@/utils/geminiPromptBuilder";
import { useGeminiTips } from "@/hooks/useGeminiTips";
import {
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineClipboardCopy,
  HiOutlineDocumentDownload,
  HiOutlineLightningBolt,
  HiOutlineSparkles,
} from "react-icons/hi";

// ---- Props ----

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
}

// ---- Typing effect hook ----

function useTypingEffect(text: string, speed: number = 15, enabled: boolean = true) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || "");
      setIsDone(true);
      return;
    }

    setDisplayed("");
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayed, isDone };
}

// ---- PDF generation for tips ----

async function downloadTipsPDF(tips: GeminiTip[], estimatedSavings: string, result: CalculationResult) {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(32, 201, 151);
  doc.text("Energy Saving Tips", pageWidth / 2, 20, { align: "center" });

  // Subtitle
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })} | ${result.country}`,
    pageWidth / 2,
    28,
    { align: "center" }
  );

  // Savings highlight
  doc.setFontSize(13);
  doc.setTextColor(32, 154, 240);
  doc.text(`Estimated Monthly Savings: ${estimatedSavings}`, pageWidth / 2, 40, {
    align: "center",
  });

  // Tips
  let y = 55;
  doc.setFontSize(11);

  tips.forEach((tip, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(32, 201, 151);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}. ${tip.icon} ${tip.title}`, 14, y);
    y += 7;

    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Word-wrap description
    const lines = doc.splitTextToSize(tip.description, pageWidth - 28);
    lines.forEach((line: string) => {
      doc.text(line, 18, y);
      y += 5;
    });

    if (tip.savings) {
      doc.setTextColor(32, 154, 240);
      doc.text(`💰 ${tip.savings}`, 18, y);
      y += 5;
    }

    y += 6;
    doc.setFontSize(11);
  });

  doc.save("energy-saving-tips.pdf");
}

// ---- Component ----

export default function TipsModal({ isOpen, onClose, result }: TipsModalProps) {
  const {
    tips,
    estimatedSavings,
    generatedAt,
    source,
    isLoading,
    error,
    fetchTips,
    regenerate,
  } = useGeminiTips();

  const modalRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(true);
  const [tipsFetched, setTipsFetched] = useState(false);

  // ---- Detect theme ----
  useEffect(() => {
    const check = () =>
      setIsDark(!document.documentElement.classList.contains("light-theme"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ---- Fetch tips when modal opens ----
  useEffect(() => {
    if (isOpen && result && !tipsFetched) {
      fetchTips(result);
      setTipsFetched(true);
    }
  }, [isOpen, result, tipsFetched, fetchTips]);

  // ---- Reset fetched flag when modal closes ----
  useEffect(() => {
    if (!isOpen) {
      setTipsFetched(false);
    }
  }, [isOpen]);

  // ---- Success toast when tips load ----
  useEffect(() => {
    if (tips.length > 0 && !isLoading) {
      toast.success(
        source === "gemini"
          ? "✨ AI tips generated successfully!"
          : "💡 Tips loaded (offline mode)",
        { id: "tips-loaded" }
      );
    }
  }, [tips.length, isLoading, source]);

  // ---- Close on ESC ----
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // ---- Close on click outside ----
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  // ---- Copy tips to clipboard ----
  const handleCopy = useCallback(async () => {
    const text = tips
      .map(
        (t, i) =>
          `${i + 1}. ${t.icon} ${t.title}\n   ${t.description}${t.savings ? `\n   💰 ${t.savings}` : ""}`
      )
      .join("\n\n");

    const full = `Energy Saving Tips\n${"=".repeat(30)}\n\n${text}\n\nEstimated Monthly Savings: ${estimatedSavings}`;

    try {
      await navigator.clipboard.writeText(full);
      toast.success("Tips copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  }, [tips, estimatedSavings]);

  // ---- Download PDF ----
  const handleDownloadPDF = useCallback(async () => {
    if (tips.length === 0) return;
    try {
      await downloadTipsPDF(tips, estimatedSavings, result);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    }
  }, [tips, estimatedSavings, result]);

  // ---- Regenerate ----
  const handleRegenerate = useCallback(async () => {
    if (result) {
      await regenerate(result);
    }
  }, [result, regenerate]);

  // ---- Format timestamp ----
  const formattedTime = generatedAt
    ? new Date(generatedAt).toLocaleString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl ${
              isDark
                ? "bg-dark-800/95 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.06),0_0_60px_rgba(32,201,151,0.05)]"
                : "bg-white/95 border-2 border-transparent shadow-xl"
            }`}
            style={
              !isDark
                ? {
                    backgroundImage:
                      "linear-gradient(white, white), linear-gradient(135deg, #00ff99, #00ccff)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }
                : undefined
            }
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Glowing border animation (dark mode) */}
            {isDark && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 1px rgba(255,255,255,0.15), 0 0 15px rgba(32,201,151,0.08)",
                }}
                animate={{
                  boxShadow: [
                    "inset 0 0 1px rgba(255,255,255,0.15), 0 0 15px rgba(32,201,151,0.08)",
                    "inset 0 0 2px rgba(255,255,255,0.25), 0 0 30px rgba(32,201,151,0.15)",
                    "inset 0 0 1px rgba(255,255,255,0.15), 0 0 15px rgba(32,201,151,0.08)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Header */}
            <div
              className={`flex items-center justify-between p-5 border-b ${
                isDark ? "border-white/8" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <HiOutlineLightningBolt className="w-5 h-5 text-primary-400" />
                </motion.div>
                <div>
                  <h2
                    className={`text-lg font-bold ${isDark ? "text-dark-50" : "text-gray-900"}`}
                  >
                    AI Energy Saving Tips
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    {source && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          source === "gemini"
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                            : "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20"
                        }`}
                      >
                        {source === "gemini" ? "✨ GEMINI AI" : "📋 OFFLINE"}
                      </span>
                    )}
                    {formattedTime && (
                      <span
                        className={`text-[10px] ${isDark ? "text-dark-300" : "text-gray-400"}`}
                      >
                        {formattedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isDark
                    ? "hover:bg-white/10 text-dark-200"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                aria-label="Close tips panel"
              >
                <HiOutlineX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-5 space-y-4 custom-scrollbar">
              {/* ---- Loading state ---- */}
              {isLoading && (
                <div className="space-y-4">
                  {/* Animated header skeleton */}
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="space-y-1.5">
                      <motion.div
                        className={`h-4 w-48 rounded ${isDark ? "bg-dark-600" : "bg-gray-200"}`}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className={`h-3 w-32 rounded ${isDark ? "bg-dark-600" : "bg-gray-200"}`}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  {/* Tip skeletons */}
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        isDark ? "border-white/5 bg-dark-700/50" : "border-gray-100 bg-gray-50"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          className={`w-10 h-10 rounded-xl ${isDark ? "bg-dark-600" : "bg-gray-200"}`}
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                        />
                        <div className="flex-1 space-y-2">
                          <motion.div
                            className={`h-4 w-1/3 rounded ${isDark ? "bg-dark-600" : "bg-gray-200"}`}
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                          <motion.div
                            className={`h-3 w-full rounded ${isDark ? "bg-dark-600" : "bg-gray-200"}`}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                          />
                          <motion.div
                            className={`h-3 w-2/3 rounded ${isDark ? "bg-dark-600" : "bg-gray-200"}`}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading label */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-accent-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-purple-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                    />
                    <span className={`text-xs ml-2 ${isDark ? "text-dark-300" : "text-gray-400"}`}>
                      Analyzing your energy data with AI...
                    </span>
                  </div>
                </div>
              )}

              {/* ---- Error state ---- */}
              {error && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border text-center ${
                    isDark
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <p className="text-sm font-medium mb-2">⚠️ {error}</p>
                  <button
                    onClick={handleRegenerate}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {/* ---- Tips list ---- */}
              {!isLoading && tips.length > 0 && (
                <>
                  {/* Estimated savings banner */}
                  {estimatedSavings && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border text-center ${
                        isDark
                          ? "border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-accent-500/10"
                          : "border-green-200 bg-gradient-to-r from-green-50 to-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <HiOutlineSparkles
                          className={`w-5 h-5 ${isDark ? "text-primary-400" : "text-green-600"}`}
                        />
                        <span
                          className={`text-xs font-medium ${isDark ? "text-dark-200" : "text-gray-600"}`}
                        >
                          Estimated Monthly Savings
                        </span>
                      </div>
                      <p
                        className={`text-2xl font-bold ${
                          isDark ? "gradient-text" : "text-green-700"
                        }`}
                      >
                        {estimatedSavings}
                      </p>
                    </motion.div>
                  )}

                  {/* Individual tip cards */}
                  {tips.map((tip, idx) => (
                    <TipCard
                      key={`${tip.title}-${idx}`}
                      tip={tip}
                      index={idx}
                      isDark={isDark}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Footer — action buttons */}
            {!isLoading && tips.length > 0 && (
              <div
                className={`flex flex-wrap items-center gap-2 p-4 border-t ${
                  isDark ? "border-white/8" : "border-gray-200"
                }`}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRegenerate}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isDark
                      ? "glass hover:bg-white/10 text-dark-100"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <HiOutlineRefresh className="w-3.5 h-3.5" />
                  Regenerate
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isDark
                      ? "glass hover:bg-white/10 text-dark-100"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <HiOutlineClipboardCopy className="w-3.5 h-3.5" />
                  Copy
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadPDF}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isDark
                      ? "glass hover:bg-white/10 text-dark-100"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <HiOutlineDocumentDownload className="w-3.5 h-3.5" />
                  PDF
                </motion.button>

                <span
                  className={`ml-auto text-[10px] ${isDark ? "text-dark-400" : "text-gray-400"}`}
                >
                  {source === "gemini" ? "Powered by Gemini AI" : "Static analysis"}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---- Individual tip card with typing effect ----

function TipCard({
  tip,
  index,
  isDark,
}: {
  tip: GeminiTip;
  index: number;
  isDark: boolean;
}) {
  const { displayed: typedDesc, isDone } = useTypingEffect(
    tip.description,
    12,
    true
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
      className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${
        isDark
          ? "border-white/6 bg-dark-700/40 hover:border-white/12 hover:bg-dark-700/60"
          : "border-gray-100 bg-gray-50/80 hover:border-gray-200 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
            isDark
              ? "bg-gradient-to-br from-primary-500/15 to-accent-500/15"
              : "bg-gradient-to-br from-green-100 to-blue-100"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 400 }}
        >
          {tip.icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-semibold mb-1 ${isDark ? "text-dark-50" : "text-gray-900"}`}
          >
            {tip.title}
          </h4>
          <p
            className={`text-xs leading-relaxed ${isDark ? "text-dark-200" : "text-gray-600"}`}
          >
            {typedDesc}
            {!isDone && (
              <motion.span
                className="inline-block w-0.5 h-3.5 bg-primary-400 ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </p>

          {/* Savings badge */}
          {tip.savings && isDone && (
            <motion.p
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-xs mt-1.5 font-medium ${
                isDark ? "text-primary-400" : "text-green-600"
              }`}
            >
              💰 {tip.savings}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
