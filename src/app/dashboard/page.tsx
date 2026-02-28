"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle, Brain, Sun, BookOpen, ArrowRight, Clock,
  Sparkles, TrendingUp, Users, ChevronRight, Crown, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, formatDate } from "@/lib/utils";

const dailyQuote = {
  mentor: mentors[0],
  quote: mentors[0].famousQuotes[0],
  type: "thought" as const,
};

export default function DashboardPage() {
  const { user, sessions, insights, favoriteMentors } = useStore();
  const recentSessions = sessions.slice(0, 3);
  const favMentors = mentors.filter((m) => favoriteMentors.includes(m.id));
  const recommendedMentors = user?.recommended_mentors
    ? mentors.filter((m) => user.recommended_mentors.includes(m.id))
    : mentors.slice(0, 5);

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
              Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-brand-text-muted mt-1">Your mentors are ready. What wisdom do you seek today?</p>
          </motion.div>

          {/* Daily Wisdom Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="mb-6 border-brand-accent/30 bg-gradient-to-br from-brand-accent/5 to-purple-900/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">Daily Wisdom</span>
                </div>
                <div className="flex items-start gap-4">
                  <Avatar size="lg" className="shrink-0">
                    <AvatarFallback style={{ background: `linear-gradient(135deg, ${dailyQuote.mentor.accentColor}, ${dailyQuote.mentor.accentColor}88)` }}>
                      {getInitials(dailyQuote.mentor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-serif italic text-brand-text leading-relaxed">
                      &ldquo;{dailyQuote.quote}&rdquo;
                    </p>
                    <p className="text-sm text-brand-text-muted mt-2">
                      &mdash; {dailyQuote.mentor.name}, {dailyQuote.mentor.title}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/mentors/${dailyQuote.mentor.slug}`}>
                    <Button size="sm" variant="outline">
                      Start Session <MessageCircle className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <Link href="/daily">
                    <Button size="sm" variant="ghost">
                      View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { href: "/mentors", icon: Users, label: "Browse Mentors", color: "from-purple-500 to-violet-600" },
              { href: "/circle", icon: Brain, label: "Mentor Circle", color: "from-blue-500 to-cyan-600", premium: true },
              { href: "/insights", icon: BookOpen, label: "My Insights", color: "from-emerald-500 to-green-600" },
              { href: "/daily", icon: Sun, label: "Daily Wisdom", color: "from-amber-500 to-orange-600" },
            ].map((action, i) => (
              <motion.div key={action.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                <Link href={action.href}>
                  <div className="group rounded-xl border border-brand-border bg-brand-surface p-4 hover:border-brand-accent/30 transition-all cursor-pointer text-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-brand-text">{action.label}</p>
                    {action.premium && <Badge variant="gold" className="text-[9px] mt-1">Premium</Badge>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommended Mentors */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recommended For You</CardTitle>
                    <Link href="/mentors"><Button variant="ghost" size="sm">View All <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button></Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendedMentors.slice(0, 4).map((mentor, i) => (
                      <motion.div key={mentor.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                        <Link href={`/mentors/${mentor.slug}`}>
                          <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-brand-background transition-colors cursor-pointer">
                            <Avatar size="md">
                              <AvatarFallback style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}>
                                {getInitials(mentor.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-brand-text group-hover:text-brand-accent-light transition-colors">{mentor.name}</p>
                              <p className="text-xs text-brand-text-muted truncate">{mentor.title}</p>
                            </div>
                            <div className="flex gap-1">
                              {mentor.specialties.slice(0, 1).map((s) => (
                                <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                              ))}
                            </div>
                            <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-brand-accent transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats & Recent */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Your Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Sessions", value: sessions.length, icon: MessageCircle },
                      { label: "Insights", value: insights.length, icon: BookOpen },
                      { label: "Mentors", value: new Set(sessions.map((s) => s.mentor_id)).size, icon: Users },
                      { label: "Favorites", value: favoriteMentors.length, icon: Star },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg bg-brand-background p-3 text-center">
                        <stat.icon className="w-4 h-4 text-brand-accent mx-auto mb-1" />
                        <p className="text-xl font-bold text-brand-text">{stat.value}</p>
                        <p className="text-[10px] text-brand-text-muted">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {recentSessions.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentSessions.map((session) => {
                        const mentor = mentors.find((m) => m.id === session.mentor_id);
                        return (
                          <Link key={session.id} href={`/session/${session.id}`}>
                            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-background transition-colors cursor-pointer">
                              <Avatar size="sm">
                                <AvatarFallback className="text-[10px]" style={{ background: mentor ? `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` : undefined }}>
                                  {mentor ? getInitials(mentor.name) : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-brand-text truncate">{mentor?.name}</p>
                                <p className="text-[10px] text-brand-text-muted">{session.messages.length} messages</p>
                              </div>
                              <Clock className="w-3 h-3 text-brand-text-muted" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upgrade CTA */}
              {user?.subscription_tier === "free" && (
                <Card className="border-brand-accent/30 bg-gradient-to-br from-brand-accent/5 to-purple-900/10">
                  <CardContent className="p-4 text-center">
                    <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm font-heading font-semibold text-brand-text">Unlock All Mentors</p>
                    <p className="text-xs text-brand-text-muted mt-1 mb-3">Get unlimited sessions, Mentor Circle, and more.</p>
                    <Link href="/pricing"><Button size="sm" className="w-full">Upgrade to Mentee</Button></Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
