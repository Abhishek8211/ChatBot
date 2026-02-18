// ============================================
// Gemini Prompt Builder — Constructs a structured prompt
// for the Gemini API to generate energy-saving tips.
// ============================================

/** Device data sent from the frontend */
export interface GeminiDeviceInput {
  name: string;
  watts: number;
  hours: number;
  monthly_kwh: number;
  monthly_cost: number;
}

/** Request payload for /api/gemini-tips */
export interface GeminiTipsRequest {
  devices: GeminiDeviceInput[];
  total_kwh: number;
  monthly_cost: number;
  currency: string;
  country: string;
}

/** Parsed tip returned from Gemini */
export interface GeminiTip {
  icon: string;
  title: string;
  description: string;
  savings?: string;
}

/** Response from /api/gemini-tips */
export interface GeminiTipsResponse {
  tips: GeminiTip[];
  estimated_savings: string;
  generated_at: string;
  source: "gemini" | "fallback";
}

/**
 * Build the system prompt + user context for Gemini.
 * Returns a single string ready to be sent as the prompt.
 */
export function buildGeminiPrompt(data: GeminiTipsRequest): string {
  const deviceList = data.devices
    .map(
      (d, i) =>
        `${i + 1}. ${d.name} — ${d.watts}W × ${d.hours}h/day → ${d.monthly_kwh} kWh/mo (${data.currency}${d.monthly_cost}/mo)`
    )
    .join("\n");

  return `You are an energy efficiency expert and sustainability advisor.

Based on the following household electricity usage data, provide personalized, practical, and cost-saving tips.

HOUSEHOLD DATA:
- Country: ${data.country}
- Total monthly consumption: ${data.total_kwh} kWh
- Total monthly cost: ${data.currency}${data.monthly_cost}
- Currency: ${data.currency}

DEVICE BREAKDOWN:
${deviceList}

INSTRUCTIONS:
1. Analyze the usage pattern and identify the biggest energy wasters.
2. Provide exactly 6 actionable energy-saving tips.
3. Each tip should directly relate to the user's actual devices and usage.
4. Include specific numbers (e.g., "save 15-20%", "reduce by 2 kWh/day").
5. At the end, provide an estimated total monthly savings amount in ${data.currency}.

RESPONSE FORMAT (strict JSON — no markdown, no code fences):
{
  "tips": [
    {
      "icon": "<single emoji>",
      "title": "<short title, 3-6 words>",
      "description": "<actionable tip, 1-2 sentences with specific numbers>",
      "savings": "<estimated savings for this tip, e.g. '${data.currency}150/mo'>"
    }
  ],
  "estimated_savings": "<total estimated monthly savings, e.g. '${data.currency}800/mo'>"
}

Respond with ONLY the JSON object. No additional text.`;
}

/**
 * Fallback tips when Gemini API is unavailable.
 * Uses device data to generate basic rule-based tips.
 */
export function getFallbackTips(data: GeminiTipsRequest): GeminiTipsResponse {
  const tips: GeminiTip[] = [];

  // Sort devices by cost descending
  const sorted = [...data.devices].sort((a, b) => b.monthly_cost - a.monthly_cost);

  // Top consumer tip
  if (sorted.length > 0) {
    const top = sorted[0];
    tips.push({
      icon: "⚡",
      title: `Optimize ${top.name} Usage`,
      description: `Your ${top.name} is your biggest energy consumer at ${top.monthly_kwh} kWh/mo. Reduce usage by 1-2 hours daily to save ~${data.currency}${Math.round(top.monthly_cost * 0.2)}/mo.`,
      savings: `${data.currency}${Math.round(top.monthly_cost * 0.2)}/mo`,
    });
  }

  // AC-specific tip
  const ac = data.devices.find((d) => d.name === "AC");
  if (ac) {
    tips.push({
      icon: "❄️",
      title: "Set AC to 24°C",
      description: `Each degree above 18°C saves ~6% energy. Setting to 24°C could save ${data.currency}${Math.round(ac.monthly_cost * 0.25)}/mo.`,
      savings: `${data.currency}${Math.round(ac.monthly_cost * 0.25)}/mo`,
    });
  }

  // General tips
  tips.push(
    {
      icon: "💡",
      title: "Switch to LED Bulbs",
      description: "LED bulbs use 75% less energy than incandescent and last 25x longer. Switch all bulbs for immediate savings.",
      savings: `${data.currency}${Math.round(data.monthly_cost * 0.05)}/mo`,
    },
    {
      icon: "🔌",
      title: "Eliminate Phantom Loads",
      description: "Unplug chargers and devices when not in use. Phantom loads account for 5-10% of your electricity bill.",
      savings: `${data.currency}${Math.round(data.monthly_cost * 0.07)}/mo`,
    },
    {
      icon: "⭐",
      title: "Upgrade to 5-Star Appliances",
      description: "5-star rated appliances consume up to 45% less energy. Prioritize replacing your highest-consuming devices.",
      savings: `${data.currency}${Math.round(data.monthly_cost * 0.15)}/mo`,
    },
    {
      icon: "📊",
      title: "Monitor & Schedule Usage",
      description: `Track consumption patterns and shift heavy usage to off-peak hours. Smart plugs can automate this.`,
      savings: `${data.currency}${Math.round(data.monthly_cost * 0.08)}/mo`,
    }
  );

  return {
    tips: tips.slice(0, 6),
    estimated_savings: `${data.currency}${Math.round(data.monthly_cost * 0.18)}/mo`,
    generated_at: new Date().toISOString(),
    source: "fallback",
  };
}
