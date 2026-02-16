"use client";

// ============================================
// History Page — past calculations list
// ============================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculationResult } from "@/utils/types";
import {
  getHistory,
  clearHistory,
  deleteHistoryEntry,
  formatCurrency,
  formatKwh,
} from "@/utils/helpers";
import { downloadReport } from "@/utils/pdf";
import { DEVICE_ICONS } from "@/utils/constants";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  HiOutlineTrash,
  HiOutlineArrowDown,
  HiOutlineClock,
} from "react-icons/hi";
import { HiOutlineCalculator } from "react-icons/hi2";

export default function HistoryPage() {
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    toast.success("History cleared!");
  };

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    toast.success("Entry deleted.");
  };

  const handleDownload = (result: CalculationResult) => {
    downloadReport(result);
    toast.success("PDF downloaded!");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark-50">
            Calculation History
          </h1>
          <p className="text-sm text-dark-200 mt-1">
            {history.length} calculation{history.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition-all"
          >
            <HiOutlineTrash className="w-4 h-4" />
            Clear All
          </button>
        )}
      </motion.div>

      {/* History list */}
      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-10 text-center"
        >
          <HiOutlineClock className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-100 mb-2">
            No history yet
          </h3>
          <p className="text-sm text-dark-300 mb-6">
            Your calculations will appear here after you use the calculator.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            <HiOutlineCalculator className="w-5 h-5" />
            Open Calculator
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {history.map((entry, idx) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Card header (clickable) */}
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === entry.id ? null : entry.id
                    )
                  }
                  className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 flex items-center justify-center text-xl">
                      ⚡
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-50">
                        {entry.devices
                          .map(
                            (d) =>
                              `${DEVICE_ICONS[d.device.type]} ${d.device.type}`
                          )
                          .join(", ")}
                      </p>
                      <p className="text-xs text-dark-300 mt-0.5">
                        {new Date(entry.timestamp).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        • {entry.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold gradient-text">
                      {formatCurrency(entry.totalMonthlyCost, entry.currency)}
                    </p>
                    <p className="text-xs text-dark-300">
                      {formatKwh(entry.totalMonthlyKwh)}
                    </p>
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedId === entry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-4">
                        {/* Device breakdown table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm mb-4">
                            <thead>
                              <tr className="text-left text-dark-300 text-xs">
                                <th className="pb-2 pr-3">Device</th>
                                <th className="pb-2 pr-3">Qty</th>
                                <th className="pb-2 pr-3">Watts</th>
                                <th className="pb-2 pr-3">Hours</th>
                                <th className="pb-2 pr-3">kWh/month</th>
                                <th className="pb-2 pr-3">Cost</th>
                                <th className="pb-2">Share</th>
                              </tr>
                            </thead>
                            <tbody>
                              {entry.devices.map((d, i) => (
                                <tr
                                  key={i}
                                  className="border-t border-white/5"
                                >
                                  <td className="py-2 pr-3 text-dark-50">
                                    {DEVICE_ICONS[d.device.type]}{" "}
                                    {d.device.type}
                                  </td>
                                  <td className="py-2 pr-3">
                                    {d.device.quantity}
                                  </td>
                                  <td className="py-2 pr-3">
                                    {d.device.wattage}W
                                  </td>
                                  <td className="py-2 pr-3">
                                    {d.device.hoursPerDay}h
                                  </td>
                                  <td className="py-2 pr-3 text-primary-400">
                                    {d.monthlyKwh}
                                  </td>
                                  <td className="py-2 pr-3 text-accent-400">
                                    {entry.currency}
                                    {d.monthlyCost}
                                  </td>
                                  <td className="py-2">{d.percentage}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary row */}
                        <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-dark-700/50 text-sm mb-4">
                          <span className="text-dark-200">
                            Rate: {entry.currency}
                            {entry.ratePerKwh}/kWh
                          </span>
                          <span className="text-dark-200">
                            Daily: {formatKwh(entry.totalDailyKwh)}
                          </span>
                          <span className="text-dark-200">
                            Monthly: {formatKwh(entry.totalMonthlyKwh)}
                          </span>
                          <span className="font-semibold text-primary-400">
                            Cost:{" "}
                            {formatCurrency(
                              entry.totalMonthlyCost,
                              entry.currency
                            )}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(entry)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs text-dark-100 transition-all"
                          >
                            <HiOutlineArrowDown className="w-3.5 h-3.5" />
                            Download PDF
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-all"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
