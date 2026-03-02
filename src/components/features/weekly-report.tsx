"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, Calendar, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function WeeklyReportWidget() {
  const { sessions, insights, mentorGoals, weeklyReports, addWeeklyReport } = useStore();
  const [loading, setLoading] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const latestReport = weeklyReports[0];

  const generateReport = async () => {
    setLoading(true);
    try {
      // Get sessions from last 7 days
      const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const recentSessions = sessions.filter((s) => s.created_at > oneWeekAgo);
      const recentInsights = insights.filter((i) => i.created_at > oneWeekAgo);
      const activeGoals = mentorGoals.filter((g) => !g.completed);

      const sessionSummaries = recentSessions.slice(0, 10).map((s) => {
        const mentor = mentors.find((m) => m.id === s.mentor_id);
        return {
          mentor: mentor?.name || "Unknown",
          messages: s.messages.length,
          date: s.created_at,
        };
      });

      const goalSummaries = activeGoals.map((g) => ({
        title: g.title,
        category: g.category,
        progress: g.progress,
      }));

      const res = await fetch("/api/ai/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessions: sessionSummaries,
          insights: recentInsights.map((i) => ({
            mentor: mentors.find((m) => m.id === i.mentor_id)?.name || "Unknown",
            content: i.content.substring(0, 200),
          })),
          goals: goalSummaries,
          totalSessionsAllTime: sessions.length,
          totalInsightsAllTime: insights.length,
        }),
      });

      const data = await res.json();

      if (data.success && data.report) {
        addWeeklyReport({
          weekStarting: oneWeekAgo,
          content: data.report,
          sessionsCount: recentSessions.length,
          insightsCount: recentInsights.length,
          goalsProgressed: activeGoals.length,
        });
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-accent" />
            Weekly Growth Report
          </CardTitle>
          <Button size="sm" variant="outline" onClick={generateReport} disabled={loading}>
            {loading ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Generating...</>
            ) : (
              <><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Generate</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!latestReport ? (
          <div className="text-center py-6">
            <FileText className="w-8 h-8 text-brand-text-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm text-brand-text-muted">Generate your first weekly growth report.</p>
            <p className="text-xs text-brand-text-muted mt-1">AI will analyze your sessions, insights, and goals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-brand-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span>Generated {formatDate(latestReport.created_at)}</span>
            </div>

            <div className="flex gap-3">
              <div className="rounded-lg bg-brand-background p-2 text-center flex-1">
                <p className="text-lg font-bold text-brand-text">{latestReport.sessionsCount}</p>
                <p className="text-[10px] text-brand-text-muted">Sessions</p>
              </div>
              <div className="rounded-lg bg-brand-background p-2 text-center flex-1">
                <p className="text-lg font-bold text-brand-text">{latestReport.insightsCount}</p>
                <p className="text-[10px] text-brand-text-muted">Insights</p>
              </div>
              <div className="rounded-lg bg-brand-background p-2 text-center flex-1">
                <p className="text-lg font-bold text-brand-text">{latestReport.goalsProgressed}</p>
                <p className="text-[10px] text-brand-text-muted">Active Goals</p>
              </div>
            </div>

            <div className="prose prose-sm prose-invert max-w-none text-sm text-brand-text leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-sm text-brand-text-muted">{children}</p>,
                  strong: ({ children }) => <strong className="text-brand-text font-semibold">{children}</strong>,
                  li: ({ children }) => <li className="text-sm text-brand-text-muted ml-4">{children}</li>,
                  ul: ({ children }) => <ul className="list-disc space-y-1 mb-2">{children}</ul>,
                  h3: ({ children }) => <h3 className="text-sm font-heading font-semibold text-brand-text mt-3 mb-1">{children}</h3>,
                }}
              >
                {latestReport.content}
              </ReactMarkdown>
            </div>

            {/* Past reports */}
            {weeklyReports.length > 1 && (
              <div className="pt-2 border-t border-brand-border">
                <button
                  onClick={() => setShowPast(!showPast)}
                  className="flex items-center gap-1 text-xs text-brand-accent hover:underline"
                >
                  {showPast ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {weeklyReports.length - 1} past report{weeklyReports.length > 2 ? "s" : ""}
                </button>
                <AnimatePresence>
                  {showPast && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-2"
                    >
                      {weeklyReports.slice(1, 4).map((report) => (
                        <div key={report.id} className="rounded-lg bg-brand-background p-3">
                          <p className="text-[10px] text-brand-text-muted mb-1">{formatDate(report.created_at)}</p>
                          <p className="text-xs text-brand-text line-clamp-2">{report.content.substring(0, 150)}...</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
