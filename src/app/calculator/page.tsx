"use client";

// ============================================
// Calculator Page — Chat + Charts
// ============================================

import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "@/components/ChatBot";
import { CalculationResult } from "@/utils/types";
import { downloadReport } from "@/utils/pdf";
import { formatCurrency, formatKwh } from "@/utils/helpers";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import {
  HiOutlineArrowDown,
  HiOutlineLightningBolt,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
} from "react-icons/hi";

// Lazy load charts for code splitting
const EnergyPieChart = lazy(
  () => import("@/components/charts/EnergyPieChart")
);
const EnergyBarChart = lazy(
  () => import("@/components/charts/EnergyBarChart")
);
const CostBreakdownChart = lazy(
  () => import("@/components/charts/CostBreakdownChart")
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

  const handleComplete = (calcResult: CalculationResult) => {
    setResult(calcResult);
    toast.success("Calculation complete! Scroll down for charts.");
  };

  const handleDownloadPDF = () => {
    if (result) {
      downloadReport(result);
      toast.success("PDF downloaded!");
    }
  };

  const handleReset = () => {
    setResult(null);
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
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm text-dark-50 transition-all"
            >
              <HiOutlineArrowDown className="w-4 h-4" />
              Download PDF
            </button>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
