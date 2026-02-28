"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Crown, X, Plus, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, generateId, cn } from "@/lib/utils";

export default function CirclePage() {
  const [question, setQuestion] = useState("");
  const [selectedMentorIds, setSelectedMentorIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [responses, setResponses] = useState<{ mentorId: string; response: string }[]>([]);
  const { circles, createCircle, addCircleResponse } = useStore();

  const toggleMentor = (id: string) => {
    if (selectedMentorIds.includes(id)) {
      setSelectedMentorIds(selectedMentorIds.filter((m) => m !== id));
    } else if (selectedMentorIds.length < 5) {
      setSelectedMentorIds([...selectedMentorIds, id]);
    }
  };

  const askCircle = async () => {
    if (!question.trim() || selectedMentorIds.length < 2) return;
    setLoading(true);
    setShowResults(true);
    setResponses([]);

    const circle = createCircle(question, selectedMentorIds);

    for (const mentorId of selectedMentorIds) {
      await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));
      const mentor = mentors.find((m) => m.id === mentorId);
      if (!mentor) continue;

      const response = generateCircleResponse(mentor, question);
      addCircleResponse(circle.id, mentorId, response);
      setResponses((prev) => [...prev, { mentorId, response }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">Mentor Circle</h1>
                <p className="text-brand-text-muted text-sm">Ask one question, receive wisdom from multiple mentors side by side</p>
              </div>
              <Badge variant="gold" className="ml-auto"><Crown className="w-3 h-3 mr-1" /> Executive</Badge>
            </div>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Setup */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Select 2-5 Mentors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {mentors.map((mentor) => {
                      const selected = selectedMentorIds.includes(mentor.id);
                      return (
                        <button
                          key={mentor.id}
                          onClick={() => toggleMentor(mentor.id)}
                          disabled={!selected && selectedMentorIds.length >= 5}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all border",
                            selected
                              ? "border-brand-accent bg-brand-accent/10"
                              : "border-transparent hover:bg-brand-background disabled:opacity-40"
                          )}
                        >
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]" style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}>
                              {getInitials(mentor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-brand-text truncate">{mentor.name}</p>
                            <p className="text-[10px] text-brand-text-muted truncate">{mentor.category}</p>
                          </div>
                          {selected && <div className="w-4 h-4 rounded-full bg-brand-accent flex items-center justify-center"><X className="w-2.5 h-2.5 text-white" /></div>}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-heading font-semibold text-brand-text mb-2">Your Question</h3>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question that would benefit from multiple perspectives..."
                    rows={4}
                  />
                  <Button
                    onClick={askCircle}
                    disabled={!question.trim() || selectedMentorIds.length < 2 || loading}
                    className="w-full mt-3"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gathering Wisdom...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Ask the Circle ({selectedMentorIds.length} mentors)</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right: Responses */}
            <div className="lg:col-span-2">
              {!showResults ? (
                <div className="rounded-xl border border-brand-border border-dashed bg-brand-surface/50 flex items-center justify-center min-h-[400px] p-8">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-brand-text-muted mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-heading font-semibold text-brand-text-muted">Circle Responses Will Appear Here</h3>
                    <p className="text-sm text-brand-text-muted mt-1">Select 2-5 mentors, ask a question, and compare their wisdom side by side.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-brand-accent/5 border border-brand-accent/20 p-4">
                    <p className="text-xs text-brand-accent-light font-medium mb-1">Your Question</p>
                    <p className="text-sm text-brand-text">{question}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {responses.map(({ mentorId, response }, i) => {
                        const mentor = mentors.find((m) => m.id === mentorId);
                        if (!mentor) return null;
                        return (
                          <motion.div
                            key={mentorId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Card className="h-full">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-brand-border">
                                  <Avatar size="sm">
                                    <AvatarFallback className="text-[10px]" style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}>
                                      {getInitials(mentor.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-brand-text">{mentor.name}</p>
                                    <p className="text-[10px] text-brand-text-muted">{mentor.category}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-brand-text leading-relaxed whitespace-pre-line">{response}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {loading && selectedMentorIds
                      .filter((id) => !responses.find((r) => r.mentorId === id))
                      .map((id) => {
                        const mentor = mentors.find((m) => m.id === id);
                        if (!mentor) return null;
                        return (
                          <Card key={id} className="h-full animate-pulse">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-brand-border">
                                <Avatar size="sm">
                                  <AvatarFallback className="text-[10px]" style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}>
                                    {getInitials(mentor.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium text-brand-text">{mentor.name}</p>
                                  <p className="text-[10px] text-brand-text-muted">Contemplating...</p>
                                </div>
                                <Loader2 className="w-4 h-4 text-brand-accent ml-auto animate-spin" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-3 bg-brand-border/50 rounded w-full" />
                                <div className="h-3 bg-brand-border/50 rounded w-4/5" />
                                <div className="h-3 bg-brand-border/50 rounded w-3/5" />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function generateCircleResponse(mentor: typeof mentors[0], question: string): string {
  const responses: Record<string, string[]> = {
    default: [
      `From my perspective and experience, I would say this: ${mentor.philosophy}\n\nMore specifically to your question - ${mentor.famousQuotes[0]} This is not merely rhetoric. It is a principle I have tested through the crucible of my own life.\n\nWhat I would encourage you to consider is whether you are approaching this challenge from a place of clarity or a place of habit. The distinction matters greatly.`,
      `"${mentor.famousQuotes[1]}"\n\nThis question touches on something I feel strongly about. In my experience, the answer lies not in choosing the right path, but in becoming the kind of person for whom the right path becomes obvious.\n\n${mentor.philosophy}\n\nI would ask you to sit with this question: what would you do if you trusted yourself completely?`,
    ],
  };

  const pool = responses.default;
  return pool[Math.floor(Math.random() * pool.length)];
}
