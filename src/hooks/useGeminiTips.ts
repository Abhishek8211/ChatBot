"use client";

// ============================================
// useGeminiTips — Hook for fetching AI energy-saving tips
//
// Features:
//   • Debounced to prevent duplicate calls
//   • Caches result in localStorage
//   • Supports regeneration
//   • Tracks loading / error / success states
//   • Returns typed GeminiTipsResponse
// ============================================

import { useState, useCallback, useRef } from "react";
import {
  GeminiTipsRequest,
  GeminiTipsResponse,
  GeminiTip,
} from "@/utils/geminiPromptBuilder";
import { CalculationResult } from "@/utils/types";

/** Storage key for cached tips */
const TIPS_CACHE_KEY = "gemini_tips_cache";

/** Minimum interval between API calls (ms) */
const DEBOUNCE_MS = 2000;

export interface UseGeminiTipsReturn {
  /** Fetched tips data */
  tips: GeminiTip[];
  /** Estimated monthly savings string */
  estimatedSavings: string;
  /** ISO timestamp of generation */
  generatedAt: string;
  /** Whether tips came from Gemini or fallback */
  source: "gemini" | "fallback" | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if failed */
  error: string | null;
  /** Fetch tips for a calculation result */
  fetchTips: (result: CalculationResult) => Promise<void>;
  /** Regenerate tips (clears cache, re-fetches) */
  regenerate: (result: CalculationResult) => Promise<void>;
  /** Clear all tips state */
  clear: () => void;
}

/**
 * Convert a CalculationResult into the Gemini request format
 */
function buildRequestFromResult(result: CalculationResult): GeminiTipsRequest {
  return {
    devices: result.devices.map((d) => ({
      name: d.device.type,
      watts: d.device.wattage * d.device.quantity,
      hours: d.device.hoursPerDay,
      monthly_kwh: d.monthlyKwh,
      monthly_cost: d.monthlyCost,
    })),
    total_kwh: result.totalMonthlyKwh,
    monthly_cost: result.totalMonthlyCost,
    currency: result.currency,
    country: result.country,
  };
}

/**
 * Load cached tips from localStorage
 */
function loadCachedTips(): GeminiTipsResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TIPS_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GeminiTipsResponse;
  } catch {
    return null;
  }
}

/**
 * Save tips to localStorage
 */
function saveTipsToCache(data: GeminiTipsResponse): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TIPS_CACHE_KEY, JSON.stringify(data));
  } catch {
    console.warn("[useGeminiTips] Failed to cache tips");
  }
}

export function useGeminiTips(): UseGeminiTipsReturn {
  const [tips, setTips] = useState<GeminiTip[]>([]);
  const [estimatedSavings, setEstimatedSavings] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [source, setSource] = useState<"gemini" | "fallback" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce ref — tracks last call timestamp
  const lastCallRef = useRef<number>(0);
  // Prevent concurrent calls
  const inFlightRef = useRef(false);

  /**
   * Core fetch function
   */
  const doFetch = useCallback(async (result: CalculationResult, skipCache: boolean) => {
    // Debounce guard
    const now = Date.now();
    if (now - lastCallRef.current < DEBOUNCE_MS) {
      return;
    }
    // Prevent duplicate in-flight requests
    if (inFlightRef.current) return;

    // Check cache first (unless regenerating)
    if (!skipCache) {
      const cached = loadCachedTips();
      if (cached && cached.tips.length > 0) {
        setTips(cached.tips);
        setEstimatedSavings(cached.estimated_savings);
        setGeneratedAt(cached.generated_at);
        setSource(cached.source);
        return;
      }
    }

    lastCallRef.current = now;
    inFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const requestBody = buildRequestFromResult(result);

      const res = await fetch("/api/gemini-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data: GeminiTipsResponse = await res.json();

      setTips(data.tips);
      setEstimatedSavings(data.estimated_savings);
      setGeneratedAt(data.generated_at);
      setSource(data.source);

      // Cache result
      saveTipsToCache(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tips";
      setError(message);
      console.error("[useGeminiTips]", message);
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  }, []);

  const fetchTips = useCallback(
    async (result: CalculationResult) => {
      await doFetch(result, false);
    },
    [doFetch]
  );

  const regenerate = useCallback(
    async (result: CalculationResult) => {
      // Clear cache and re-fetch
      if (typeof window !== "undefined") {
        localStorage.removeItem(TIPS_CACHE_KEY);
      }
      setTips([]);
      setEstimatedSavings("");
      setGeneratedAt("");
      setSource(null);
      await doFetch(result, true);
    },
    [doFetch]
  );

  const clear = useCallback(() => {
    setTips([]);
    setEstimatedSavings("");
    setGeneratedAt("");
    setSource(null);
    setError(null);
  }, []);

  return {
    tips,
    estimatedSavings,
    generatedAt,
    source,
    isLoading,
    error,
    fetchTips,
    regenerate,
    clear,
  };
}
