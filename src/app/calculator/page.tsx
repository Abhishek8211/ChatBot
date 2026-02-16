"use client";

// ============================================
// Calculator Page — Chat + Charts + Share + AI
// ============================================

import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "@/components/ChatBot";
import { CalculationResult } from "@/utils/types";
import { downloadReport } from "@/utils/pdf";
import {
  formatCurrency,
  formatKwh,
  exportToCSV,
  getTwitterShareUrl,
  shareAsImage,
} from "@/utils/helpers";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import {
  HiOutlineArrowDown,
  HiOutlineLightningBolt,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineShare,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineSparkles,
} from "react-icons/hi";

// Lazy load charts for code splitting
const EnergyPieChart = lazy(() => import("@/components/charts/EnergyPieChart"));
const EnergyBarChart = lazy(() => import("@/components/charts/EnergyBarChart"));
const CostBreakdownChart = lazy(
  () => import("@/components/charts/CostBreakdownChart"),
);

/** Loading skeleton for charts */
function ChartSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="h-5 w-40 bg-dark-500 rounded mb-4" />
      <div className="h-72 bg-dark-600 rounded-xl" />
    </div>
  );
}

export default function CalculatorPage() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<
    {
      icon: string;
      title: string;
      description: string;
      savingsEstimate: string;
      priority: "high" | "medium" | "low";
    }[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  /** Fire confetti celebration */
  const fireConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const end = Date.now() + 1500;
    const colors = ["#20c997", "#339af0", "#845ef7", "#fcc419"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  /** Fetch AI-powered suggestions */
  const fetchAiSuggestions = async (calcResult: CalculationResult) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devices: calcResult.devices.map((d) => ({
            type: d.device.type,
            quantity: d.device.quantity,
            wattage: d.device.wattage,
            hoursPerDay: d.device.hoursPerDay,
            monthlyKwh: d.monthlyKwh,
            monthlyCost: d.monthlyCost,
          })),
          totalMonthlyCost: calcResult.totalMonthlyCost,
          currency: calcResult.currency,
        }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch {
      console.error("Failed to fetch AI suggestions");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleComplete = (calcResult: CalculationResult) => {
    setResult(calcResult);
    fireConfetti();
    fetchAiSuggestions(calcResult);
    toast.success("🎉 Calculation complete! Scroll down for charts.");
  };

  const handleDownloadPDF = () => {
    if (result) {
      downloadReport(result);
      toast.success("PDF downloaded!");
    }
  };

  const handleExportCSV = () => {
    if (result) {
      exportToCSV(result);
      toast.success("CSV exported!");
    }
  };

  const handleShareTwitter = () => {
    if (result) {
      const url = getTwitterShareUrl(result);
      window.open(url, "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  const handleShareImage = async () => {
    if (result) {
      toast.loading("Capturing image...", { id: "capture" });
      await shareAsImage("results-section");
      toast.success("Image saved!", { id: "capture" });
      setShowShareMenu(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAiSuggestions([]);
    setShowShareMenu(false);
    toast("Reset! Start a new calculation.", { icon: "🔄" });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark-50">
            Energy Calculator
          </h1>
          <p className="text-sm text-dark-200 mt-1">
            Chat with our AI to estimate your electricity consumption
          </p>
        </div>
        {result && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm text-dark-50 transition-all"
            >
              <HiOutlineArrowDown className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm text-dark-50 transition-all"
            >
              <HiOutlineDocumentText className="w-4 h-4" />
              CSV
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm text-dark-50 transition-all"
              >
                <HiOutlineShare className="w-4 h-4" />
                Share
              </button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-12 z-50 glass rounded-xl p-2 min-w-[180px] border border-white/10 shadow-xl"
                  >
                    <button
                      onClick={handleShareTwitter}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-dark-50 transition-all"
                    >
                      🐦 Share on Twitter
                    </button>
                    <button
                      onClick={handleShareImage}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-dark-50 transition-all"
                    >
                      <HiOutlinePhotograph className="w-4 h-4" />
                      Save as Image
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition-all"
            >
              Reset
            </button>
          </div>
        )}
      </motion.div>

      {/* Chat section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden energy-glow"
      >
        <ChatBot onCalculationComplete={handleComplete} />
      </motion.div>

      {/* Results section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
            id="results-section"
          >
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <HiOutlineLightningBolt className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <p className="text-sm text-dark-200 mb-1">Daily Usage</p>
                <p className="text-2xl font-bold text-dark-50">
                  <CountUp
                    end={result.totalDailyKwh}
                    decimals={2}
                    duration={1.5}
                  />
                  <span className="text-sm text-dark-200 ml-1">kWh</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <HiOutlineCalendar className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                <p className="text-sm text-dark-200 mb-1">Monthly Usage</p>
                <p className="text-2xl font-bold text-dark-50">
                  <CountUp
                    end={result.totalMonthlyKwh}
                    decimals={2}
                    duration={1.5}
                  />
                  <span className="text-sm text-dark-200 ml-1">kWh</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6 text-center energy-glow"
              >
                <HiOutlineCurrencyDollar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-dark-200 mb-1">Monthly Cost</p>
                <p className="text-2xl font-bold gradient-text">
                  {result.currency}
                  <CountUp
                    end={result.totalMonthlyCost}
                    decimals={2}
                    duration={1.5}
                  />
                </p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<ChartSkeleton />}>
                <EnergyPieChart result={result} />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <EnergyBarChart result={result} />
              </Suspense>
            </div>
            <Suspense fallback={<ChartSkeleton />}>
              <CostBreakdownChart result={result} />
            </Suspense>

            {/* Device table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-6 overflow-x-auto"
            >
              <h3 className="text-lg font-semibold text-dark-50 mb-4">
                🔌 Device Details
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-dark-200 border-b border-white/5">
                    <th className="pb-3 pr-4">Device</th>
                    <th className="pb-3 pr-4">Qty</th>
                    <th className="pb-3 pr-4">Wattage</th>
                    <th className="pb-3 pr-4">Hours/Day</th>
                    <th className="pb-3 pr-4">Monthly kWh</th>
                    <th className="pb-3 pr-4">Cost</th>
                    <th className="pb-3">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {result.devices.map((d, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 pr-4 text-dark-50 font-medium">
                        {d.device.type}
                      </td>
                      <td className="py-3 pr-4">{d.device.quantity}</td>
                      <td className="py-3 pr-4">{d.device.wattage}W</td>
                      <td className="py-3 pr-4">{d.device.hoursPerDay}h</td>
                      <td className="py-3 pr-4 text-primary-400">
                        {formatKwh(d.monthlyKwh)}
                      </td>
                      <td className="py-3 pr-4 text-accent-400">
                        {formatCurrency(d.monthlyCost, result.currency)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-dark-600 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${d.percentage}%` }}
                              transition={{ duration: 1, delay: 0.8 }}
                              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                            />
                          </div>
                          <span className="text-xs text-dark-200">
                            {d.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* AI-Powered Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineSparkles className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-dark-50">
                  AI-Powered Suggestions
                </h3>
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/20">
                  SMART
                </span>
              </div>

              {loadingSuggestions ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dark-600" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-dark-600 rounded" />
                        <div className="h-3 w-2/3 bg-dark-600 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {aiSuggestions.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-default ${
                        s.priority === "high"
                          ? "border-red-500/20 bg-red-500/5"
                          : s.priority === "medium"
                            ? "border-yellow-500/20 bg-yellow-500/5"
                            : "border-green-500/20 bg-green-500/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">{s.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-dark-50">
                              {s.title}
                            </h4>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                s.priority === "high"
                                  ? "bg-red-500/20 text-red-400"
                                  : s.priority === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {s.priority}
                            </span>
                          </div>
                          <p className="text-xs text-dark-200 mb-1.5 leading-relaxed">
                            {s.description}
                          </p>
                          <p className="text-xs text-primary-400 font-medium">
                            💰 {s.savingsEstimate}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-300">
                  No suggestions available.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

