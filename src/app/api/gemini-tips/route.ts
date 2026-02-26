// ============================================
// POST /api/gemini-tips
// Calls OpenRouter API to generate personalized
// energy-saving tips based on user's device data.
// Uses a fallback chain of free models for reliability.
//
// Env var required: OPENROUTER_API_KEY
// ============================================

import { NextRequest, NextResponse } from "next/server";
import {
  GeminiTipsRequest,
  GeminiTipsResponse,
  buildGeminiPrompt,
  getFallbackTips,
} from "@/utils/geminiPromptBuilder";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Ordered list of free models to try — if one is rate-limited, we try the next */
const FREE_MODELS = [
  "google/gemma-3-27b-it:free",
  "google/gemma-3n-e4b-it:free",
  "google/gemma-3-12b-it:free",
  "deepseek/deepseek-r1-0528:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-4b:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
];

export async function POST(request: NextRequest) {
  try {
    const body: GeminiTipsRequest = await request.json();

    // ---- Validate input ----
    if (
      !body.devices ||
      !Array.isArray(body.devices) ||
      body.devices.length === 0
    ) {
      return NextResponse.json(
        { error: "No devices provided" },
        { status: 400 },
      );
    }

    if (!body.total_kwh || !body.monthly_cost) {
      return NextResponse.json(
        { error: "Missing total_kwh or monthly_cost" },
        { status: 400 },
      );
    }

    // ---- Check API key ----
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn(
        "[gemini-tips] OPENROUTER_API_KEY not set — using fallback tips",
      );
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    // ---- Build prompt ----
    const prompt = buildGeminiPrompt(body);

    // ---- Try each model in fallback chain ----
    let rawText = "";

    for (const model of FREE_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const res = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://energy-calculator.app",
            "X-Title": "Smart Energy Calculator",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1024,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.status === 429 || res.status === 503) {
          console.warn(
            `[gemini-tips] ${model} returned ${res.status}, trying next model...`,
          );
          continue;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            `[gemini-tips] ${model} error ${res.status}:`,
            errorText,
          );
          continue;
        }

        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "";

        if (!content) {
          console.warn(
            `[gemini-tips] ${model} returned empty content, trying next...`,
          );
          continue;
        }

        console.log(`[gemini-tips] Success with model: ${model}`);
        rawText = content;
        break;
      } catch (modelErr) {
        console.warn(
          `[gemini-tips] ${model} failed:`,
          modelErr instanceof Error ? modelErr.message : modelErr,
        );
        continue;
      }
    }

    // If all models failed, use fallback tips
    if (!rawText) {
      console.error("[gemini-tips] All models failed — using fallback tips");
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    // ---- Parse JSON from response (strip markdown code fences if present) ----
    let parsed: {
      tips: Array<{
        icon: string;
        title: string;
        description: string;
        savings?: string;
      }>;
      estimated_savings: string;
    };

    try {
      // Remove ```json ... ``` wrapping if the model adds it
      const cleaned = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("[gemini-tips] Failed to parse response:", parseErr);
      console.error("[gemini-tips] Raw text:", rawText);
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    // ---- Validate parsed data ----
    if (
      !parsed.tips ||
      !Array.isArray(parsed.tips) ||
      parsed.tips.length === 0
    ) {
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    const response: GeminiTipsResponse = {
      tips: parsed.tips.map((t) => ({
        icon: t.icon || "💡",
        title: t.title || "Energy Tip",
        description: t.description || "",
        savings: t.savings,
      })),
      estimated_savings:
        parsed.estimated_savings ||
        `${body.currency}${Math.round(body.monthly_cost * 0.18)}/mo`,
      generated_at: new Date().toISOString(),
      source: "openrouter",
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[gemini-tips] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to generate tips. Please try again." },
      { status: 500 },
    );
  }
}
