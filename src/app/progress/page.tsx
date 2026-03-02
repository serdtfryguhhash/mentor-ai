"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  Flame,
  Lightbulb,
  TrendingUp,
  Calendar,
  Star,
  Clock,
  BookOpen,
  ChevronRight,
  Trophy,
  Target,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, cn, getCategoryIcon } from "@/lib/utils";
import { getStats } from "@/lib/engagement";
import { getMentorsExplored, type MentorExplored } from "@/lib/progress";
import { getLevel, getLevelProgress } from "@/lib/gamification";
import ProgressCharts from "@/components/progress/ProgressCharts";
import GrowthRadar from "@/components/features/growth-radar";
import MentorGoals from "@/components/features/mentor-goals";

function getWeeklyActivity(): { day: string; sessions: number; insights: number }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];

    const sessionsForDay = Math.floor(Math.random() * 4);
    const insightsForDay = Math.floor(Math.random() * 3);

    result.push({
      day: dayName,
      sessions: sessionsForDay,
      insights: insightsForDay,
    });
  }

  return result;
}

function getCategoryDistribution(
  sessions: { mentor_id: string }[]
): { name: string; value: number; color: string }[] {
  const categoryColors: Record<string, string> = {
    Business: "#10B981",
    Philosophy: "#A855F7",
    Science: "#3B82F6",
    Art: "#EC4899",
    Leadership: "#F59E0B",
    Spirituality: "#14B8A6",
    Modern: "#EF4444",
  };

  const counts: Record<string, number> = {};

  sessions.forEach((session) => {
    const mentor = mentors.find((m) => m.id === session.mentor_id);
    if (mentor) {
      counts[mentor.category] = (counts[mentor.category] || 0) + 1;
    }
  });

  if (Object.keys(counts).length === 0) {
    return [
      { name: "Philosophy", value: 8, color: "#A855F7" },
      { name: "Leadership", value: 6, color: "#F59E0B" },
      { name: "Business", value: 5, color: "#10B981" },
      { name: "Science", value: 4, color: "#3B82F6" },
      { name: "Art", value: 3, color: "#EC4899" },
      { name: "Spirituality", value: 2, color: "#14B8A6" },
    ];
  }

  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || "#6B7280",
    }))
    .sort((a, b) => b.value - a.value);
}

function getMilestones(
  sessionsCount: number,
  insightsCount: number,
  streak: number,
  mentorsExplored: number
): { label: string; target: number; current: number; icon: React.ElementType; color: string }[] {
  return [
    {
      label: "Sessions Completed",
      target:
        sessionsCount >= 50
          ? 100
          : sessionsCount >= 25
          ? 50
          : sessionsCount >= 10
          ? 25
          : 10,
      current: sessionsCount,
      icon: MessageCircle,
      color: "from-purple-500 to-violet-600",
    },
    {
      label: "Insights Saved",
      target:
        insightsCount >= 25 ? 50 : insightsCount >= 10 ? 25 : 10,
      current: insightsCount,
      icon: Lightbulb,
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Day Streak",
      target: streak >= 30 ? 60 : streak >= 14 ? 30 : streak >= 7 ? 14 : 7,
      current: streak,
      icon: Flame,
      color: "from-red-500 to-orange-500",
    },
    {
      label: "Mentors Explored",
      target:
        mentorsExplored >= 20
          ? 34
          : mentorsExplored >= 10
          ? 20
          : 10,
      current: mentorsExplored,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
  ];
}

export default function ProgressPage() {
  const { sessions, insights, favoriteMentors, xp, sessionStreak: storeStreak } = useStore();
  const [engagementStats, setEngagementStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalVisits: 0,
    actionsCompleted: 0,
    joinedDate: "",
  });
  const [explored, setExplored] = useState<MentorExplored[]>([]);

  const level = getLevel(xp);
  const levelProgress = getLevelProgress(xp);

  useEffect(() => {
    const stats = getStats();
    setEngagementStats(stats);
    setExplored(getMentorsExplored());
  }, []);

  const weeklyActivity = useMemo(() => getWeeklyActivity(), []);
  const categoryDistribution = useMemo(
    () => getCategoryDistribution(sessions),
    [sessions]
  );
  const uniqueMentorsUsed = useMemo(
    () => new Set(sessions.map((s) => s.mentor_id)).size,
    [sessions]
  );
  const totalMessages = useMemo(
    () => sessions.reduce((acc, s) => acc + s.messages.length, 0),
    [sessions]
  );
  const milestones = useMemo(
    () =>
      getMilestones(
        sessions.length,
        insights.length,
        engagementStats.currentStreak,
        explored.length || uniqueMentorsUsed
      ),
    [sessions.length, insights.length, engagementStats.currentStreak, explored.length, uniqueMentorsUsed]
  );

  const topMentors = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach((s) => {
      counts[s.mentor_id] = (counts[s.mentor_id] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({
        mentor: mentors.find((m) => m.id === id),
        sessionCount: count,
      }))
      .filter((item) => item.mentor);
  }, [sessions]);

  const statCards = [
    {
      label: "Sessions",
      value: sessions.length,
      icon: MessageCircle,
      color: "from-purple-500 to-violet-600",
      description: "Total mentoring sessions",
    },
    {
      label: "Mentors",
      value: uniqueMentorsUsed || explored.length,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      description: "Unique mentors explored",
    },
    {
      label: "Day Streak",
      value: storeStreak || engagementStats.currentStreak,
      icon: Flame,
      color: "from-orange-500 to-red-500",
      description: `Best: ${engagementStats.longestStreak} days`,
    },
    {
      label: "XP",
      value: xp,
      icon: Zap,
      color: "from-purple-400 to-violet-500",
      description: `${level.icon} ${level.name} Level`,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
                  Your Progress
                </h1>
                <p className="text-brand-text-muted mt-1">
                  Track your learning journey across {mentors.length} mentors
                </p>
              </div>
              <Link href="/quiz">
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-1.5" />
                  Take Quiz
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: [0.4, 0, 0.2, 1] as const }}
              >
                <Card className="relative overflow-hidden group hover:border-brand-accent/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-br ${stat.color} blur-xl`}
                    />
                  </div>
                  <CardContent className="p-4 sm:p-5">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-brand-text">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-brand-text mt-0.5">
                      {stat.label}
                    </p>
                    <p className="text-xs text-brand-text-muted mt-0.5">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Growth Radar + Goal Accountability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, ease: [0.4, 0, 0.2, 1] as const }}
            >
              <GrowthRadar />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
            >
              <MentorGoals />
            </motion.div>
          </div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ease: [0.4, 0, 0.2, 1] as const }}
            className="mb-8"
          >
            <ProgressCharts
              weeklyActivity={weeklyActivity}
              categoryDistribution={categoryDistribution}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <CardTitle className="text-lg">Milestones</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {milestones.map((milestone, i) => {
                      const percentage = Math.min(
                        100,
                        Math.round((milestone.current / milestone.target) * 100)
                      );
                      return (
                        <div
                          key={milestone.label}
                          className="rounded-xl border border-brand-border bg-brand-background p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${milestone.color} flex items-center justify-center`}
                            >
                              <milestone.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-brand-text">
                                {milestone.label}
                              </p>
                              <p className="text-xs text-brand-text-muted">
                                {milestone.current} / {milestone.target}
                              </p>
                            </div>
                          </div>
                          <div className="h-2 bg-brand-surface rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${milestone.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{
                                duration: 1,
                                delay: 0.4 + i * 0.1,
                                ease: [0.4, 0, 0.2, 1] as const,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-brand-text-muted mt-1.5 text-right">
                            {percentage}% complete
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Mentors Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Top Mentors</CardTitle>
                    <Link href="/mentors">
                      <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {topMentors.length > 0 ? (
                    <div className="space-y-3">
                      {topMentors.map(({ mentor, sessionCount }, i) =>
                        mentor ? (
                          <Link key={mentor.id} href={`/mentors/${mentor.slug}`}>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-background transition-colors cursor-pointer">
                              <div className="relative">
                                <Avatar size="md">
                                  <AvatarFallback
                                    style={{
                                      background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)`,
                                    }}
                                  >
                                    {getInitials(mentor.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-brand-accent">
                                    {i + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-text truncate">
                                  {mentor.name}
                                </p>
                                <p className="text-[10px] text-brand-text-muted">
                                  {sessionCount} session{sessionCount !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 text-brand-text-muted" />
                            </div>
                          </Link>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="w-8 h-8 text-brand-text-muted mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-brand-text-muted">
                        Start sessions to see your top mentors
                      </p>
                      <Link href="/mentors">
                        <Button variant="outline" size="sm" className="mt-3">
                          Browse Mentors
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Total Messages",
                        value: totalMessages,
                        icon: MessageCircle,
                      },
                      {
                        label: "Total Visits",
                        value: engagementStats.totalVisits,
                        icon: Calendar,
                      },
                      {
                        label: "Favorites",
                        value: favoriteMentors.length,
                        icon: Star,
                      },
                      {
                        label: "Best Streak",
                        value: `${engagementStats.longestStreak} days`,
                        icon: Flame,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between py-2 border-b border-brand-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-4 h-4 text-brand-text-muted" />
                          <span className="text-sm text-brand-text-muted">
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-brand-text">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
