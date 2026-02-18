"use client";

// ============================================
// Header Component — sticky top bar with logo
// ============================================

import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { HiOutlineBars3 } from "react-icons/hi2";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 z-50 glass border-b border-white/5"
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Menu toggle (mobile) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          <HiOutlineBars3 className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="p-2 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20"
          >
            <HiOutlineLightningBolt className="w-6 h-6 text-primary-400" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold gradient-text leading-tight">
              EnergyIQ
            </h1>
            <p className="text-[10px] text-dark-200 -mt-1">Smart Calculator</p>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary-400" />
            <span className="text-xs text-primary-400">Live Rates</span>
          </motion.div>

          <Link
            href="/calculator"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
          >
            Calculate Now
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
