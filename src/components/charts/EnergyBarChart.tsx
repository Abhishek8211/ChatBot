"use client";

// ============================================
// EnergyBarChart — daily vs monthly comparison
// ============================================

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CalculationResult } from "@/utils/types";
import { CHART_COLORS, DEVICE_ICONS } from "@/utils/constants";

interface Props {
  result: CalculationResult;
}

export default function EnergyBarChart({ result }: Props) {
  const data = result.devices.map((d, idx) => ({
    name: `${DEVICE_ICONS[d.device.type]} ${d.device.type}`,
    daily: d.dailyKwh,
    monthly: d.monthlyKwh,
    fill: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl px-4 py-3 text-sm border border-white/10">
          <p className="font-semibold text-dark-50 mb-1">{label}</p>
          {payload.map((p: { name: string; value: number; color: string }) => (
            <p key={p.name} style={{ color: p.color }}>
              {p.name}: {p.value} kWh
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-dark-50 mb-4">
        📈 Daily vs Monthly Consumption
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#909296", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#909296", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
            label={{
              value: "kWh",
              angle: -90,
              position: "insideLeft",
              fill: "#909296",
              fontSize: 12,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="daily"
            name="Daily"
            fill="#20c997"
            radius={[6, 6, 0, 0]}
            animationBegin={300}
            animationDuration={800}
          />
          <Bar
            dataKey="monthly"
            name="Monthly"
            fill="#339af0"
            radius={[6, 6, 0, 0]}
            animationBegin={500}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
