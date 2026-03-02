"use client";

import React, { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Share2, Sparkles, Zap, Flame, MessageCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { getLevel } from "@/lib/gamification";
import toast from "react-hot-toast";

export default function ShareCard() {
  const { sessions, insights, xp, sessionStreak, growthAssessments } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const level = getLevel(xp);
  const uniqueMentors = new Set(sessions.map((s) => s.mentor_id)).size;
  const latestAssessment = growthAssessments[growthAssessments.length - 1];

  const shareText = `I've completed ${sessions.length} mentoring sessions and gained ${insights.length} insights on Mentor AI! Currently at ${level.name} level with a ${sessionStreak}-day streak. #MentorAI #Growth`;

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(shareText);
    toast.success("Copied to clipboard!");
  }, [shareText]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand-accent" />
            Growth Share Card
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={cardRef}
          className="relative rounded-xl overflow-hidden bg-gradient-to-br from-brand-accent/20 via-brand-surface to-purple-900/20 border border-brand-accent/30 p-6"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-heading font-bold text-brand-text">
                Mentor<span className="text-brand-accent">.ai</span>
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-brand-background/50 p-3 text-center">
                <MessageCircle className="w-4 h-4 text-brand-accent mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-text">{sessions.length}</p>
                <p className="text-[10px] text-brand-text-muted">Sessions</p>
              </div>
              <div className="rounded-lg bg-brand-background/50 p-3 text-center">
                <Lightbulb className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-text">{insights.length}</p>
                <p className="text-[10px] text-brand-text-muted">Insights</p>
              </div>
              <div className="rounded-lg bg-brand-background/50 p-3 text-center">
                <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-text">{sessionStreak}</p>
                <p className="text-[10px] text-brand-text-muted">Day Streak</p>
              </div>
              <div className="rounded-lg bg-brand-background/50 p-3 text-center">
                <Zap className="w-4 h-4 text-brand-accent mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-text">{xp}</p>
                <p className="text-[10px] text-brand-text-muted">Total XP</p>
              </div>
            </div>

            {/* Level Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${level.gradient} text-white text-sm font-semibold`}>
                {level.icon} {level.name} Level
              </div>
            </div>

            {/* Mini Radar */}
            {latestAssessment && (
              <div className="flex justify-center mb-3">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {[0.25, 0.5, 0.75, 1].map((scale) => (
                    <polygon
                      key={scale}
                      points={generatePentagonPoints(60, 60, 45 * scale)}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="0.5"
                      opacity={0.3}
                    />
                  ))}
                  <polygon
                    points={generateScorePoints(latestAssessment.scores, 60, 60, 45)}
                    fill="rgba(168, 85, 247, 0.2)"
                    stroke="#A855F7"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            )}

            {/* Mentors explored */}
            <p className="text-xs text-center text-brand-text-muted">
              Learning from {uniqueMentors} mentor{uniqueMentors !== 1 ? "s" : ""} across history
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function generatePentagonPoints(cx: number, cy: number, r: number): string {
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;
  return Array.from({ length: 5 }, (_, i) => {
    const angle = startAngle + i * angleStep;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

function generateScorePoints(
  scores: Record<string, number>,
  cx: number,
  cy: number,
  maxR: number
): string {
  const dims = ["Career", "Personal", "Health", "Relationships", "Finance"];
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;
  return dims.map((dim, i) => {
    const angle = startAngle + i * angleStep;
    const r = maxR * ((scores[dim] || 0) / 10);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}
