"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Calendar, Users, MessageCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials } from "@/lib/utils";

interface BadgeInfo {
  id: string;
  label: string;
  icon: React.ReactNode;
  unlocked: boolean;
  color: string;
}

export default function SessionStreak() {
  const { sessions, sessionStreak, insights } = useStore();

  const uniqueMentors = useMemo(
    () => new Set(sessions.map((s) => s.mentor_id)).size,
    [sessions]
  );

  const mentorSessionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach((s) => {
      counts[s.mentor_id] = (counts[s.mentor_id] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({
        mentor: mentors.find((m) => m.id === id),
        count,
      }))
      .filter((item) => item.mentor);
  }, [sessions]);

  const badges: BadgeInfo[] = [
    {
      id: "streak-7",
      label: "7-Day Streak",
      icon: <Flame className="w-4 h-4" />,
      unlocked: sessionStreak >= 7,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "streak-30",
      label: "30-Day Streak",
      icon: <Calendar className="w-4 h-4" />,
      unlocked: sessionStreak >= 30,
      color: "from-purple-500 to-violet-600",
    },
    {
      id: "sessions-100",
      label: "100 Sessions",
      icon: <MessageCircle className="w-4 h-4" />,
      unlocked: sessions.length >= 100,
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "mentors-10",
      label: "10 Mentors",
      icon: <Users className="w-4 h-4" />,
      unlocked: uniqueMentors >= 10,
      color: "from-emerald-500 to-green-600",
    },
  ];

  // Calendar heatmap for last 28 days
  const last28Days = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = sessions.filter((s) => s.created_at.startsWith(dateStr)).length;
      days.push({ date: dateStr, count });
    }
    return days;
  }, [sessions]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Session Streak
          </CardTitle>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-400">{sessionStreak}</span>
            <span className="text-xs text-orange-400/70">days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Activity Heatmap */}
        <div>
          <p className="text-xs text-brand-text-muted mb-2">Last 28 days</p>
          <div className="grid grid-cols-7 gap-1">
            {last28Days.map((day, i) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01, ease: [0.4, 0, 0.2, 1] as const }}
                className={`aspect-square rounded-sm ${
                  day.count === 0
                    ? "bg-brand-background"
                    : day.count === 1
                    ? "bg-brand-accent/30"
                    : day.count === 2
                    ? "bg-brand-accent/50"
                    : "bg-brand-accent/80"
                }`}
                title={`${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[9px] text-brand-text-muted">Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-brand-background" />
            <div className="w-2.5 h-2.5 rounded-sm bg-brand-accent/30" />
            <div className="w-2.5 h-2.5 rounded-sm bg-brand-accent/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-brand-accent/80" />
            <span className="text-[9px] text-brand-text-muted">More</span>
          </div>
        </div>

        {/* Badges */}
        <div>
          <p className="text-xs text-brand-text-muted mb-2">Achievements</p>
          <div className="grid grid-cols-2 gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-2 p-2 rounded-lg border ${
                  badge.unlocked
                    ? "border-brand-accent/30 bg-brand-accent/5"
                    : "border-brand-border bg-brand-background opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    badge.unlocked
                      ? `bg-gradient-to-br ${badge.color} text-white`
                      : "bg-brand-surface text-brand-text-muted"
                  }`}
                >
                  {badge.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-text">{badge.label}</p>
                  <p className="text-[10px] text-brand-text-muted">
                    {badge.unlocked ? "Unlocked!" : "Locked"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-mentor counts */}
        {mentorSessionCounts.length > 0 && (
          <div>
            <p className="text-xs text-brand-text-muted mb-2">Top mentors by sessions</p>
            <div className="space-y-1.5">
              {mentorSessionCounts.map(({ mentor, count }) =>
                mentor ? (
                  <div key={mentor.id} className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback
                        className="text-[9px]"
                        style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                      >
                        {getInitials(mentor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-brand-text flex-1 truncate">{mentor.name}</span>
                    <span className="text-xs font-semibold text-brand-text-muted">{count}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
