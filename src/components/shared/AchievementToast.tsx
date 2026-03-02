"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export function AchievementToast() {
  const { pendingAchievements, dismissAchievement } = useStore();
  const current = pendingAchievements[0] || null;

  useEffect(() => {
    if (current) {
      const timer = setTimeout(() => {
        dismissAchievement();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [current, dismissAchievement]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-4 right-4 z-[100] max-w-sm"
        >
          <div className="bg-brand-surface border border-amber-500/30 rounded-xl p-4 shadow-2xl shadow-amber-500/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-amber-400 mb-0.5">Achievement Unlocked!</p>
                <p className="text-sm font-heading font-semibold text-brand-text">
                  {current.icon} {current.title}
                </p>
                <p className="text-xs text-brand-text-muted mt-0.5">{current.description}</p>
              </div>
              <button
                onClick={dismissAchievement}
                className="text-brand-text-muted hover:text-brand-text p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
