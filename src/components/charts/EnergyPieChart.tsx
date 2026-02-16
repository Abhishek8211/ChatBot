"use client";

// ============================================
// EnergyPieChart — device-wise distribution
// ============================================

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CalculationResult } from "@/utils/types";
import { CHART_COLORS, DEVICE_ICONS } from "@/utils/constants";

interface Props {
  result: CalculationResult;
}

export default function EnergyPieChart({ result }: Props) {
  const data = result.devices.map((d, idx) => ({
    name: `${DEVICE_ICONS[d.device.type]} ${d.device.type}`,
    value: d.monthlyKwh,
    cost: d.monthlyCost,
    percentage: d.percentage,
    fill: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass rounded-xl px-4 py-3 text-sm border border-white/10">
          <p className="font-semibold text-dark-50">{item.name}</p>
          <p className="text-primary-400">
            {item.value} kWh ({item.percentage}%)
          </p>
          <p className="text-accent-400">
            Cost: {result.currency}
            {item.cost}
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
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-dark-50 mb-4">
        📊 Energy Distribution
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            animationBegin={200}
            animationDuration={800}
          >
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={entry.fill}
                stroke="transparent"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span className="text-xs text-dark-100">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
