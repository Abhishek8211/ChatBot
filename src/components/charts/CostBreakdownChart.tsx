"use client";

// ============================================
// CostBreakdownChart — bar chart showing costs per device
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
  Cell,
} from "recharts";
import { CalculationResult } from "@/utils/types";
import { CHART_COLORS, DEVICE_ICONS } from "@/utils/constants";

interface Props {
  result: CalculationResult;
}

export default function CostBreakdownChart({ result }: Props) {
  const data = result.devices.map((d, idx) => ({
    name: `${DEVICE_ICONS[d.device.type]} ${d.device.type}`,
    cost: d.monthlyCost,
    fill: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl px-4 py-3 text-sm border border-white/10">
          <p className="font-semibold text-dark-50">{label}</p>
          <p className="text-primary-400">
            Cost: {result.currency}
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-dark-50 mb-4">
        💰 Cost Breakdown by Device
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" barCategoryGap="15%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: "#909296", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#909296", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="cost"
            name="Monthly Cost"
            radius={[0, 6, 6, 0]}
            animationBegin={600}
            animationDuration={800}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
