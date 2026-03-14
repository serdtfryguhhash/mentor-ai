"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getLevel, getNextLevel, getLevelProgress, getXPToNextLevel } from "@/lib/gamification";

export function XPBar() {
  const { xp } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const level = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const progress = getLevelProgress(xp);
  const xpToNext = getXPToNextLevel(xp);

  return (
    <div
      className="relative flex items-center gap-2 cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={`w-6 h-6 rounded-md bg-gradient-to-br ${level.gradient} flex items-center justify-center`}
        >
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-brand-text">{level.name}</span>
          </div>
          <div className="w-16 h-1.5 bg-brand-background rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${level.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
            />
          </div>
        </div>
      </div>

      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
          <div className="font-semibold">{level.icon} {level.name} - {xp} XP</div>
          {nextLevel && (
            <div className="text-gray-400 mt-0.5">{xpToNext} XP to {nextLevel.name}</div>
          )}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
}
