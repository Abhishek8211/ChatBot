"use client";

// ============================================
// Dashboard Page — overview with stats and recent data
// ============================================

import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";
import { CalculationResult } from "@/utils/types";
import { getHistory, formatCurrency, formatKwh } from "@/utils/helpers";
import { ENERGY_TIPS } from "@/utils/constants";
import {
  HiOutlineLightningBolt,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineChartBar,
} from "react-icons/hi";
import { HiOutlineCalculator, HiOutlineLightBulb } from "react-icons/hi2";

const EnergyPieChart = lazy(
  () => import("@/components/charts/EnergyPieChart")
);
const EnergyBarChart = lazy(
  () => import("@/components/charts/EnergyBarChart")
);

function ChartSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="h-5 w-40 bg-dark-500 rounded mb-4" />
      <div className="h-72 bg-dark-600 rounded-xl" />
    </div>
  );
}

export default function DashboardPage() {
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [latestResult, setLatestResult] = useState<CalculationResult | null>(
    null
  );

  useEffect(() => {
    const h = getHistory();
    setHistory(h);
    if (h.length > 0) setLatestResult(h[0]);
  }, []);

  // Aggregate stats
  const totalCalculations = history.length;
  const totalDevicesAnalyzed = history.reduce(
    (sum, h) => sum + h.devices.length,
    0
  );
  const avgMonthlyCost =
    history.length > 0
      ? history.reduce((sum, h) => sum + h.totalMonthlyCost, 0) /
        history.length
      : 0;

  const randomTips = ENERGY_TIPS.slice(0, 3);

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-dark-50">
          Dashboard
        </h1>
        <p className="text-sm text-dark-200 mt-1">
          Overview of your energy consumption analysis
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: HiOutlineChartBar,
            label: "Total Calculations",
            value: totalCalculations,
            color: "text-primary-400",
            bg: "from-primary-500/15 to-primary-500/5",
          },
          {
            icon: HiOutlineLightningBolt,
            label: "Devices Analyzed",
            value: totalDevicesAnalyzed,
            color: "text-accent-400",
            bg: "from-accent-500/15 to-accent-500/5",
          },
          {
            icon: HiOutlineCurrencyDollar,
            label: "Avg Monthly Cost",
            value: avgMonthlyCost,
            decimals: 2,
            prefix: latestResult?.currency || "₹",
            color: "text-green-400",
            bg: "from-green-500/15 to-green-500/5",
          },
          {
            icon: HiOutlineCalendar,
            label: "Latest kWh",
            value: latestResult?.totalMonthlyKwh || 0,
            decimals: 2,
            suffix: " kWh",
            color: "text-purple-400",
            bg: "from-purple-500/15 to-purple-500/5",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-dark-200 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-dark-50">
                {stat.prefix && (
                  <span className="text-sm">{stat.prefix}</span>
                )}
                <CountUp
                  end={stat.value}
                  decimals={stat.decimals || 0}
                  duration={2}
                />
                {stat.suffix && (
                  <span className="text-sm text-dark-200">{stat.suffix}</span>
                )}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts (if there's a latest result) */}
      {latestResult ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-dark-50 mb-4">
              📊 Latest Calculation Breakdown
            </h2>
            <p className="text-xs text-dark-300 mb-4">
              From{" "}
              {new Date(latestResult.timestamp).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<ChartSkeleton />}>
              <EnergyPieChart result={latestResult} />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <EnergyBarChart result={latestResult} />
            </Suspense>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-10 text-center"
        >
          <HiOutlineCalculator className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-100 mb-2">
            No calculations yet
          </h3>
          <p className="text-sm text-dark-300 mb-6">
            Start by using the calculator to analyze your energy consumption.
          </p>
          <Link
            href="/calculator"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            Open Calculator
          </Link>
        </motion.div>
      )}

      {/* Energy saving tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-dark-50 mb-4 flex items-center gap-2">
          <HiOutlineLightBulb className="w-5 h-5 text-yellow-400" />
          Energy Saving Tips
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {randomTips.map((tip, idx) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="glass rounded-2xl p-5 hover:energy-glow transition-all duration-300"
            >
              <span className="text-2xl mb-3 block">{tip.icon}</span>
              <h4 className="text-sm font-semibold text-dark-50 mb-1">
                {tip.title}
              </h4>
              <p className="text-xs text-dark-200 leading-relaxed">
                {tip.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent history preview */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-50">
              📋 Recent Calculations
            </h2>
            <Link
              href="/history"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {history.slice(0, 3).map((h, idx) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="text-sm text-dark-50 font-medium">
                    {h.devices.length} device{h.devices.length > 1 ? "s" : ""} —{" "}
                    {h.devices.map((d) => d.device.type).join(", ")}
                  </p>
                  <p className="text-xs text-dark-300">
                    {new Date(h.timestamp).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold gradient-text">
                    {formatCurrency(h.totalMonthlyCost, h.currency)}
                  </p>
                  <p className="text-xs text-dark-300">
                    {formatKwh(h.totalMonthlyKwh)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
