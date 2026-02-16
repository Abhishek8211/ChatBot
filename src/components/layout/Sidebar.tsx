"use client";

// ============================================
// Sidebar Component — navigation panel
// ============================================

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineCalculator,
  HiOutlineClock,
  HiOutlineXMark,
  HiOutlineLightBulb,
} from "react-icons/hi2";
import { HiOutlineLightningBolt } from "react-icons/hi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Home", href: "/", icon: HiOutlineHome },
  { label: "Dashboard", href: "/dashboard", icon: HiOutlineLightningBolt },
  { label: "Calculator", href: "/calculator", icon: HiOutlineCalculator },
  { label: "History", href: "/history", icon: HiOutlineClock },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Close button (mobile) */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <span className="text-sm font-semibold gradient-text">Menu</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-primary-500/15 to-accent-500/10 text-primary-400 border border-primary-500/20"
                  : "text-dark-100 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-primary-400"
                    : "text-dark-200 group-hover:text-primary-400"
                } transition-colors`}
              />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="p-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/10">
          <HiOutlineLightBulb className="w-8 h-8 text-primary-400 mb-2" />
          <p className="text-xs text-dark-100 leading-relaxed">
            Save energy, save money. Track your consumption and make smarter
            choices.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 lg:w-64 border-r border-white/5 glass">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-50 w-72 h-full bg-dark-800 border-r border-white/5 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
