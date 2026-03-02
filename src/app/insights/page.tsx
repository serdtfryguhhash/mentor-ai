"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Search, Filter, Edit2, Save, X, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, formatDate } from "@/lib/utils";
import WisdomCollection from "@/components/features/wisdom-collection";

type TabView = "insights" | "wisdom";

export default function InsightsPage() {
  const { insights, updateInsightReflection } = useStore();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [activeTab, setActiveTab] = useState<TabView>("insights");

  const filtered = insights.filter((i) => {
    if (!search) return true;
    const lower = search.toLowerCase();
    const mentor = mentors.find((m) => m.id === i.mentor_id);
    return (
      i.content.toLowerCase().includes(lower) ||
      mentor?.name.toLowerCase().includes(lower) ||
      i.tags.some((t) => t.toLowerCase().includes(lower))
    );
  });

  const startEdit = (id: string, existing: string | null) => {
    setEditingId(id);
    setReflectionDraft(existing || "");
  };

  const saveReflection = (id: string) => {
    updateInsightReflection(id, reflectionDraft);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">Insight Journal</h1>
                  <p className="text-brand-text-muted text-sm">{insights.length} saved insights</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1.5" /> Export PDF
              </Button>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mb-6 p-1 bg-brand-surface rounded-lg border border-brand-border w-fit">
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "insights"
                  ? "bg-brand-accent/20 text-brand-accent-light"
                  : "text-brand-text-muted hover:text-brand-text"
              }`}
            >
              <BookOpen className="w-4 h-4 inline-block mr-1.5" />
              Insights ({insights.length})
            </button>
            <button
              onClick={() => setActiveTab("wisdom")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "wisdom"
                  ? "bg-brand-accent/20 text-brand-accent-light"
                  : "text-brand-text-muted hover:text-brand-text"
              }`}
            >
              <Sparkles className="w-4 h-4 inline-block mr-1.5" />
              Wisdom Collection
            </button>
          </div>

          {activeTab === "wisdom" ? (
            <WisdomCollection />
          ) : (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input placeholder="Search insights by content, mentor, or tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-12 h-12 text-brand-text-muted mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-heading font-semibold text-brand-text-muted">
                    {insights.length === 0 ? "No insights yet" : "No matching insights"}
                  </h3>
                  <p className="text-sm text-brand-text-muted mt-1">
                    {insights.length === 0
                      ? "During your mentoring sessions, click the bookmark icon on any message to save it here."
                      : "Try adjusting your search terms."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((insight, i) => {
                    const mentor = mentors.find((m) => m.id === insight.mentor_id);
                    return (
                      <motion.div key={insight.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card>
                          <CardContent className="p-5">
                            <div className="flex items-start gap-3">
                              {mentor && (
                                <Avatar size="md" className="shrink-0">
                                  <AvatarFallback className="text-xs" style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}>
                                    {getInitials(mentor.name)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-medium text-brand-text">{mentor?.name || "Unknown Mentor"}</p>
                                  <span className="text-[10px] text-brand-text-muted">{formatDate(insight.created_at)}</span>
                                </div>
                                <p className="text-sm text-brand-text-muted leading-relaxed">{insight.content}</p>

                                <div className="flex flex-wrap gap-1 mt-2">
                                  {insight.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                                  ))}
                                </div>

                                {/* Reflection */}
                                <div className="mt-3 pt-3 border-t border-brand-border">
                                  {editingId === insight.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={reflectionDraft}
                                        onChange={(e) => setReflectionDraft(e.target.value)}
                                        placeholder="Write your personal reflection on this insight..."
                                        rows={3}
                                        className="text-sm"
                                      />
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={() => saveReflection(insight.id)}>
                                          <Save className="w-3 h-3 mr-1" /> Save
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                          <X className="w-3 h-3 mr-1" /> Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      {insight.reflection ? (
                                        <div>
                                          <p className="text-xs text-brand-accent-light font-medium mb-1">My Reflection</p>
                                          <p className="text-sm text-brand-text-muted italic">{insight.reflection}</p>
                                          <button onClick={() => startEdit(insight.id, insight.reflection)} className="text-[10px] text-brand-accent hover:underline mt-1">Edit reflection</button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => startEdit(insight.id, null)}
                                          className="flex items-center gap-1.5 text-xs text-brand-accent hover:underline"
                                        >
                                          <Edit2 className="w-3 h-3" /> Add personal reflection
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
