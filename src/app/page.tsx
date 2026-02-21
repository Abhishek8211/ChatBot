"use client";

// ============================================
// Landing / Home Page — Hero + Features + Stats
// ============================================

import { motion } from "framer-motion";
import Link from "next/link";
import CountUp from "react-countup";
import {
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineDownload,
  HiOutlineClock,
  HiOutlineGlobe,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const features = [
  {
    icon: HiOutlineChatAlt2,
    title: "AI Chatbot",
    desc: "Conversational interface that guides you through device input step-by-step.",
    gradient: "from-primary-500/20 to-primary-500/5",
  },
  {
    icon: HiOutlineChartBar,
    title: "Visual Charts",
    desc: "Beautiful pie & bar charts showing device-wise energy distribution.",
    gradient: "from-accent-500/20 to-accent-500/5",
  },
  {
    icon: HiOutlineLightningBolt,
    title: "Real-time Rates",
    desc: "Fetches live electricity tariff rates for accurate cost estimation.",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: HiOutlineDownload,
    title: "PDF Reports",
    desc: "Download detailed energy reports with breakdowns and saving tips.",
    gradient: "from-pink-500/20 to-pink-500/5",
  },
  {
    icon: HiOutlineClock,
    title: "History Tracking",
    desc: "All calculations saved locally so you can track trends over time.",
    gradient: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: HiOutlineGlobe,
    title: "Multi-Country",
    desc: "Support for electricity rates across multiple countries.",
    gradient: "from-cyan-500/20 to-cyan-500/5",
  },
];

const stats = [
  { end: 15, suffix: "+", label: "Device Types" },
  { end: 50, suffix: "+", label: "Countries" },
  { end: 100, suffix: "%", label: "Free Forever" },
  { end: 30, suffix: "s", label: "Quick Calculation" },
];

/** Preview rates shown on home page */
const previewRates = [
  { flag: "🇮🇳", country: "India", rate: "₹8.00", usd: "$0.10" },
  { flag: "🇺🇸", country: "USA", rate: "$0.16", usd: "$0.16" },
  { flag: "🇬🇧", country: "UK", rate: "£0.34", usd: "$0.43" },
  { flag: "🇩🇪", country: "Germany", rate: "€0.39", usd: "$0.42" },
  { flag: "🇯🇵", country: "Japan", rate: "¥31.0", usd: "$0.21" },
  { flag: "🇦🇺", country: "Australia", rate: "A$0.35", usd: "$0.23" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden px-4 py-20 md:py-28">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-primary-400 border border-primary-500/20">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              AI-Powered Energy Calculator
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Know Your{" "}
            <span className="gradient-text text-shadow-glow">Energy Cost</span>
            <br />
            Before the Bill Arrives
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-dark-100 max-w-2xl mx-auto mb-10"
          >
            Chat with our AI to calculate your home electricity consumption,
            estimate monthly costs, and discover smart ways to save energy.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/calculator"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Calculating →
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass text-dark-50 font-medium hover:bg-white/10 transition-all duration-200"
            >
              View Dashboard
            </Link>
          </motion.div>

          {/* Hero chat preview */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 relative mx-auto max-w-2xl"
          >
            <div className="relative glass rounded-2xl p-6 energy-glow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-dark-300">
                  EnergyIQ Chat
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs flex-shrink-0">
                    ⚡
                  </div>
                  <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-dark-50 max-w-xs text-left">
                    How many electrical devices do you use at home?
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary-500/15 border border-primary-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-primary-300 max-w-xs">
                    I have 5 devices — AC, 3 Fans, and a TV.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs flex-shrink-0">
                    ⚡
                  </div>
                  <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-dark-50 max-w-xs text-left">
                    Your estimated monthly cost is{" "}
                    <span className="text-primary-400 font-semibold">
                      ₹2,340
                    </span>
                    . Let me show you a breakdown! 📊
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="px-4 py-16 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 glass rounded-2xl"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    duration={2.5}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <p className="text-sm text-dark-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Save Energy</span>
            </h2>
            <p className="text-dark-200 max-w-xl mx-auto">
              A complete toolkit to understand, analyze, and optimize your
              household energy consumption.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group p-6 rounded-2xl glass hover:energy-glow transition-all duration-300 cursor-default"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-50 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-dark-200 leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== LIVE RATES PREVIEW ===== */}
      <section className="px-4 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-primary-400 border border-primary-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live Data
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Global Electricity <span className="gradient-text">Rates</span>
            </h2>
            <p className="text-dark-200 max-w-xl mx-auto">
              Compare residential electricity prices across 50+ countries in
              local currency and USD.
            </p>
          </motion.div>

          {/* Preview grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {previewRates.map((r, idx) => (
              <motion.div
                key={r.country}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-xl p-4 text-center hover:energy-glow transition-all duration-300 group cursor-default"
              >
                <span className="text-3xl block mb-2">{r.flag}</span>
                <p className="text-xs text-dark-200 mb-1">{r.country}</p>
                <p className="text-lg font-bold text-primary-400">{r.rate}</p>
                <p className="text-[10px] text-dark-300 mt-0.5">
                  ≈ {r.usd}/kWh
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/rates"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500/15 to-accent-500/15 border border-primary-500/20 text-primary-400 font-semibold hover:from-primary-500/25 hover:to-accent-500/25 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <HiOutlineCurrencyDollar className="w-5 h-5" />
              View All 50+ Countries
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Cut Your{" "}
            <span className="gradient-text">Electricity Bill</span>?
          </h2>
          <p className="text-dark-200 mb-8 max-w-lg mx-auto">
            Start chatting with our AI calculator now. It takes less than 30
            seconds to get your energy consumption estimate.
          </p>
          <Link
            href="/calculator"
            className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            Launch Calculator ⚡
          </Link>
        </motion.div>
      </section>

      <footer className="px-4 py-8 border-t border-white/5 text-center">
        <p className="text-sm text-dark-300">
          © {new Date().getFullYear()} EnergyIQ — Built with 💚 for a greener
          planet.
        </p>
      </footer>
    </div>
  );
}
