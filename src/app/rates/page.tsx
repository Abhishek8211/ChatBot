"use client";

// ============================================
// Global Electricity Rates — beautiful explorer
// ============================================

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineGlobeAlt,
  HiOutlineSearch,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiOutlineLightningBolt,
} from "react-icons/hi";

interface Rate {
  country: string;
  rate_per_kwh: number;
  currency: string;
  usd_per_kwh: number;
  flag: string;
  region: string;
}

const REGIONS = ["All", "Asia", "Europe", "Americas", "Middle East", "Africa", "Oceania"];

const regionColors: Record<string, string> = {
  Asia: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
  Europe: "from-blue-500/20 to-indigo-500/10 border-blue-500/20",
  Americas: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
  "Middle East": "from-purple-500/20 to-pink-500/10 border-purple-500/20",
  Africa: "from-rose-500/20 to-red-500/10 border-rose-500/20",
  Oceania: "from-cyan-500/20 to-sky-500/10 border-cyan-500/20",
};

const regionDotColors: Record<string, string> = {
  Asia: "bg-amber-400",
  Europe: "bg-blue-400",
  Americas: "bg-emerald-400",
  "Middle East": "bg-purple-400",
  Africa: "bg-rose-400",
  Oceania: "bg-cyan-400",
};

export default function RatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/electricity-rate/all")
      .then((r) => r.json())
      .then((d) => {
        setRates(d.rates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const maxUsd = useMemo(() => Math.max(...rates.map((r) => r.usd_per_kwh), 0.01), [rates]);

  const filtered = useMemo(() => {
    let list = rates;
    if (region !== "All") list = list.filter((r) => r.region === region);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.country.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) =>
      sortAsc ? a.usd_per_kwh - b.usd_per_kwh : b.usd_per_kwh - a.usd_per_kwh,
    );
  }, [rates, region, search, sortAsc]);

  // Stats
  const cheapest = useMemo(() => (filtered.length ? filtered.reduce((a, b) => (a.usd_per_kwh < b.usd_per_kwh ? a : b)) : null), [filtered]);
  const expensive = useMemo(() => (filtered.length ? filtered.reduce((a, b) => (a.usd_per_kwh > b.usd_per_kwh ? a : b)) : null), [filtered]);
  const avg = useMemo(() => (filtered.length ? filtered.reduce((s, r) => s + r.usd_per_kwh, 0) / filtered.length : 0), [filtered]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero header */}
      <section className="relative overflow-hidden px-4 pt-12 pb-8">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-accent-500/8 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Global Electricity <span className="gradient-text">Rates</span>
              </h1>
              <p className="text-xs text-dark-200">
                Residential rates across {rates.length} countries · Updated 2024
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center">
              <HiOutlineArrowSmDown className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-dark-200">Cheapest</p>
              <p className="text-sm font-semibold text-green-400">
                {cheapest ? `${cheapest.flag} ${cheapest.country}` : "—"}
              </p>
              <p className="text-xs text-dark-300">
                {cheapest ? `$${cheapest.usd_per_kwh.toFixed(4)}/kWh` : ""}
              </p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-500/15 flex items-center justify-center">
              <HiOutlineLightningBolt className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-dark-200">Average</p>
              <p className="text-sm font-semibold text-primary-400">
                ${avg.toFixed(4)}/kWh
              </p>
              <p className="text-xs text-dark-300">{filtered.length} countries</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
              <HiOutlineArrowSmUp className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-dark-200">Most Expensive</p>
              <p className="text-sm font-semibold text-red-400">
                {expensive ? `${expensive.flag} ${expensive.country}` : "—"}
              </p>
              <p className="text-xs text-dark-300">
                {expensive ? `$${expensive.usd_per_kwh.toFixed(4)}/kWh` : ""}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-200" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-sm text-dark-50 placeholder:text-dark-300 focus:outline-none focus:ring-1 focus:ring-primary-500/40 transition"
            />
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-dark-100 hover:text-primary-400 transition shrink-0"
          >
            {sortAsc ? (
              <HiOutlineArrowSmUp className="w-4 h-4" />
            ) : (
              <HiOutlineArrowSmDown className="w-4 h-4" />
            )}
            {sortAsc ? "Cheapest first" : "Expensive first"}
          </button>
        </motion.div>

        {/* Region tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                region === r
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/20"
                  : "glass text-dark-100 hover:text-white hover:bg-white/10"
              }`}
            >
              {r === "All" ? `All (${rates.length})` : r}
            </button>
          ))}
        </motion.div>

        {/* Rate cards grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-dark-200"
            >
              <HiOutlineGlobeAlt className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No countries match your search.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((rate, idx) => {
                const barWidth = Math.max((rate.usd_per_kwh / maxUsd) * 100, 2);
                const isHovered = hoveredIdx === idx;
                const priceLevel =
                  rate.usd_per_kwh <= 0.08
                    ? "text-green-400"
                    : rate.usd_per_kwh <= 0.2
                      ? "text-primary-400"
                      : rate.usd_per_kwh <= 0.35
                        ? "text-amber-400"
                        : "text-red-400";
                const barColor =
                  rate.usd_per_kwh <= 0.08
                    ? "from-green-500 to-green-400"
                    : rate.usd_per_kwh <= 0.2
                      ? "from-primary-500 to-primary-400"
                      : rate.usd_per_kwh <= 0.35
                        ? "from-amber-500 to-amber-400"
                        : "from-red-500 to-red-400";

                return (
                  <motion.div
                    layout
                    key={rate.country}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.02 }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`group glass rounded-xl p-4 transition-all duration-200 cursor-default border ${
                      isHovered
                        ? regionColors[rate.region] || "border-primary-500/20"
                        : "border-transparent"
                    }`}
                    style={{
                      background: isHovered
                        ? "rgba(32, 201, 151, 0.04)"
                        : undefined,
                    }}
                  >
                    {/* Top row: flag + country + region dot */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl leading-none">{rate.flag}</span>
                        <div>
                          <p className="text-sm font-semibold text-dark-50 leading-tight">
                            {rate.country}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${regionDotColors[rate.region] || "bg-dark-300"}`}
                            />
                            <span className="text-[10px] text-dark-300">
                              {rate.region}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${priceLevel} leading-tight`}>
                          {rate.currency}
                          {rate.rate_per_kwh < 1
                            ? rate.rate_per_kwh.toFixed(3)
                            : rate.rate_per_kwh < 100
                              ? rate.rate_per_kwh.toFixed(2)
                              : Math.round(rate.rate_per_kwh).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-dark-300">per kWh</p>
                      </div>
                    </div>

                    {/* Price bar */}
                    <div className="relative h-1.5 rounded-full bg-dark-600 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.02 }}
                        className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${barColor}`}
                      />
                    </div>

                    {/* USD equiv */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-dark-300">
                        USD equivalent
                      </span>
                      <span className="text-xs text-dark-100 font-medium">
                        ${rate.usd_per_kwh.toFixed(4)}/kWh
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[11px] text-dark-300 pt-4"
        >
          Rates are residential averages sourced from GlobalPetrolPrices, IEA &
          Statista (2024). Actual rates may vary by provider and usage tier.
        </motion.p>
      </div>
    </div>
  );
}
