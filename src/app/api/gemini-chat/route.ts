// ============================================
// POST /api/gemini-chat
// General-purpose Q&A powered by OpenRouter.
// Answers ANY type of question from the chatbot.
// Uses a fallback chain of free models for reliability.
//
// Env var required: OPENROUTER_API_KEY
// ============================================

import { NextRequest, NextResponse } from "next/server";

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

const SYSTEM_PROMPT = `You are EnergyIQ, a smart AI assistant built into a Smart Energy Calculator app. You can answer any question the user asks.

About this app:
- Users add their electrical devices (type, quantity, wattage, hours of usage per day).
- The app calculates energy consumption using these formulas:
  * Daily kWh = (Wattage x Quantity x Hours per day) / 1000
  * Monthly kWh = Daily kWh x 30
  * Monthly Cost = Monthly kWh x Electricity Rate per kWh
  * Percentage share = (Device Monthly kWh / Total Monthly kWh) x 100
- The electricity rate is fetched based on the user's country (default: India at approx ₹8/kWh).

Rules:
- You can answer ANY question the user asks — general knowledge, science, math, coding, history, or anything else.
- For electricity and energy questions, provide extra detail and practical tips.
- Keep answers concise (max 3-4 short paragraphs).
- Use simple language anyone can understand.
- If you mention numbers, include units where applicable.
- Do NOT use markdown formatting like ** or ## — use plain text only.`;

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        answer:
          "I'm sorry, the AI service is not configured yet. Please set the OPENROUTER_API_KEY environment variable to enable AI-powered answers.",
        source: "fallback",
      });
    }

    // Try each model in the fallback chain until one succeeds
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
            messages: [
              {
                role: "user",
                content: `${SYSTEM_PROMPT}\n\nUser question: ${question.trim()}`,
              },
            ],
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 800,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // If rate-limited or server error, try the next model
        if (res.status === 429 || res.status === 503) {
          console.warn(
            `[gemini-chat] ${model} returned ${res.status}, trying next model...`,
          );
          continue;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            `[gemini-chat] ${model} error ${res.status}:`,
            errorText,
          );
          continue;
        }

        const data = await res.json();
        const rawText: string = data?.choices?.[0]?.message?.content ?? "";

        if (!rawText) {
          console.warn(
            `[gemini-chat] ${model} returned empty content, trying next...`,
          );
          continue;
        }

        console.log(`[gemini-chat] Success with model: ${model}`);
        return NextResponse.json({
          answer: rawText.trim(),
          source: "openrouter",
        });
      } catch (modelErr) {
        console.warn(
          `[gemini-chat] ${model} failed:`,
          modelErr instanceof Error ? modelErr.message : modelErr,
        );
        continue;
      }
    }

    // All models exhausted
    return NextResponse.json({
      answer:
        "All AI models are temporarily busy. Please wait a few seconds and try again.",
      source: "rate_limited",
    });
  } catch (err: unknown) {
    console.error("[gemini-chat] Unexpected error:", err);

    const isTimeout =
      (err instanceof Error && err.name === "AbortError") ||
      (err instanceof Error && err.message?.includes("timeout")) ||
      (err instanceof Error && err.message?.includes("CONNECT_TIMEOUT"));

    if (isTimeout) {
      return NextResponse.json({
        answer:
          "The AI service is taking too long to respond. This usually means a network issue — try using a VPN or switching to a mobile hotspot, then try again.",
        source: "error",
      });
    }

    return NextResponse.json(
      { error: "Failed to process your question. Please try again." },
      { status: 500 },
    );
  }
}
