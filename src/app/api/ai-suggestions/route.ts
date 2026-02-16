// ============================================
// AI-Powered Energy Suggestions API
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { AI_SUGGESTION_RULES } from "@/utils/constants";
import { DeviceType } from "@/utils/types";

interface DeviceInput {
  type: DeviceType;
  quantity: number;
  wattage: number;
  hoursPerDay: number;
  monthlyKwh: number;
  monthlyCost: number;
}

export async function POST(request: NextRequest) {
  try {
    const { devices, totalMonthlyCost, currency } = await request.json();

    if (!devices || !Array.isArray(devices) || devices.length === 0) {
      return NextResponse.json(
        { error: "No devices provided" },
        { status: 400 },
      );
    }

    const suggestions: {
      icon: string;
      title: string;
      description: string;
      savingsEstimate: string;
      priority: "high" | "medium" | "low";
    }[] = [];

    // Sort devices by monthly cost descending (highest consumer first)
    const sorted = [...devices].sort(
      (a: DeviceInput, b: DeviceInput) => b.monthlyCost - a.monthlyCost,
    );

    // Generate personalized suggestions based on actual device usage
    sorted.forEach((d: DeviceInput) => {
      const rules = AI_SUGGESTION_RULES[d.type] || [];
      if (rules.length === 0) return;

      // Pick 1-2 relevant tips per device
      const tipCount = d.monthlyCost > totalMonthlyCost * 0.2 ? 2 : 1;
      const selectedRules = rules
        .sort(() => Math.random() - 0.5)
        .slice(0, tipCount);

      const priority: "high" | "medium" | "low" =
        d.monthlyCost > totalMonthlyCost * 0.3
          ? "high"
          : d.monthlyCost > totalMonthlyCost * 0.1
            ? "medium"
            : "low";

      const savingsPercent =
        priority === "high"
          ? "15-30%"
          : priority === "medium"
            ? "8-15%"
            : "3-8%";
      const savingsAmount = Math.round(
        d.monthlyCost *
          (priority === "high" ? 0.2 : priority === "medium" ? 0.1 : 0.05),
      );

      selectedRules.forEach((rule: string) => {
        suggestions.push({
          icon: getDeviceIcon(d.type),
          title: `${d.type} Optimization`,
          description: rule,
          savingsEstimate: `Save ~${currency}${savingsAmount}/mo (${savingsPercent})`,
          priority,
        });
      });
    });

    // Add general suggestions
    if (totalMonthlyCost > 500) {
      suggestions.push({
        icon: "☀️",
        title: "Consider Solar Panels",
        description:
          "With your monthly bill, a rooftop solar system could pay for itself in 3-4 years and save significantly.",
        savingsEstimate: `Save ~${currency}${Math.round(totalMonthlyCost * 0.6)}/mo`,
        priority: "high",
      });
    }

    if (devices.length >= 5) {
      suggestions.push({
        icon: "🏠",
        title: "Smart Home Automation",
        description:
          "With multiple devices, a smart power management system can automatically optimize energy usage across all appliances.",
        savingsEstimate: `Save ~${currency}${Math.round(totalMonthlyCost * 0.12)}/mo`,
        priority: "medium",
      });
    }

    // Sort by priority: high > medium > low
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );

    return NextResponse.json({
      suggestions: suggestions.slice(0, 6),
      totalPotentialSavings: `${currency}${Math.round(totalMonthlyCost * 0.18)}/month`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 },
    );
  }
}

function getDeviceIcon(type: string): string {
  const icons: Record<string, string> = {
    AC: "❄️",
    Fan: "🌀",
    TV: "📺",
    Refrigerator: "🧊",
    "Washing Machine": "🧺",
    Microwave: "📡",
    "Water Heater": "🔥",
    "Light Bulb": "💡",
    Computer: "💻",
    Iron: "👔",
    "Hair Dryer": "💇",
    Dishwasher: "🍽️",
    "Electric Stove": "🍳",
    Router: "📶",
    "Phone Charger": "🔌",
  };
  return icons[type] || "⚡";
}
