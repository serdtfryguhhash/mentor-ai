"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, RefreshCw, Heart, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getRandomWisdom = () => {
  const mentor = mentors[Math.floor(Math.random() * mentors.length)];
  const types = ["quote", "challenge", "thought"] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  let content = "";

  if (type === "quote") {
    content = mentor.famousQuotes[Math.floor(Math.random() * mentor.famousQuotes.length)];
  } else if (type === "challenge") {
    content = `Today's challenge from ${mentor.name}: ${mentor.challengeStyle} Take one concrete action today that reflects this approach.`;
  } else {
    content = `${mentor.philosophy} Reflect on how this applies to what you are facing right now.`;
  }

  return { mentor, type, content, date: new Date().toISOString() };
};

const pastWisdom = Array.from({ length: 7 }, (_, i) => {
  const w = getRandomWisdom();
  const d = new Date();
  d.setDate(d.getDate() - i - 1);
  return { ...w, date: d.toISOString() };
});

export default function DailyWisdomPage() {
  const [wisdom, setWisdom] = useState(getRandomWisdom());
  const router = useRouter();
  const { createSession } = useStore();

  const refresh = () => setWisdom(getRandomWisdom());

  const startSession = () => {
    const session = createSession(wisdom.mentor.id);
    router.push(`/session/${session.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">Daily Wisdom</h1>
                <p className="text-brand-text-muted text-sm">A new perspective from a different mind, every day</p>
              </div>
            </div>
          </motion.div>

          {/* Today's Wisdom */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-brand-accent/30 bg-gradient-to-br from-brand-accent/5 via-brand-surface to-purple-900/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">Today&apos;s Wisdom</span>
                  </div>
                  <Badge variant="outline" className="capitalize">{wisdom.type}</Badge>
                </div>

                <div className="text-center max-w-2xl mx-auto">
                  <Avatar size="xl" className="mx-auto mb-4">
                    <AvatarFallback
                      className="text-2xl"
                      style={{ background: `linear-gradient(135deg, ${wisdom.mentor.accentColor}, ${wisdom.mentor.accentColor}88)` }}
                    >
                      {getInitials(wisdom.mentor.name)}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-xl sm:text-2xl font-serif italic text-brand-text leading-relaxed mb-4">
                    &ldquo;{wisdom.content}&rdquo;
                  </p>

                  <p className="text-brand-text-muted">
                    &mdash; {wisdom.mentor.name}
                  </p>
                  <p className="text-xs text-brand-text-muted mt-1">{wisdom.mentor.title} | {wisdom.mentor.era}</p>
                </div>

                <div className="flex items-center justify-center gap-3 mt-8">
                  <Button onClick={startSession}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Discuss with {wisdom.mentor.name.split(" ")[0]}
                  </Button>
                  <Button variant="outline" onClick={refresh}>
                    <RefreshCw className="w-4 h-4 mr-2" /> New Wisdom
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Past Wisdom */}
          <div className="mt-8">
            <h2 className="text-lg font-heading font-semibold text-brand-text mb-4">Past 7 Days</h2>
            <div className="space-y-3">
              {pastWisdom.map((w, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar size="md" className="shrink-0">
                          <AvatarFallback className="text-xs" style={{ background: `linear-gradient(135deg, ${w.mentor.accentColor}, ${w.mentor.accentColor}88)` }}>
                            {getInitials(w.mentor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-brand-text">{w.mentor.name}</p>
                              <Badge variant="secondary" className="text-[10px] capitalize">{w.type}</Badge>
                            </div>
                            <span className="text-[10px] text-brand-text-muted">{formatDate(w.date)}</span>
                          </div>
                          <p className="text-sm text-brand-text-muted italic font-serif line-clamp-2">&ldquo;{w.content}&rdquo;</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
