"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, BookOpen, Calendar, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, formatDate } from "@/lib/utils";

export default function DailyReflection() {
  const { dailyReflections, addDailyReflection } = useStore();
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(mentors[0]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];
  const todayReflection = dailyReflections.find((r) => r.date === todayDate);

  // Pick a random mentor and question on mount
  useEffect(() => {
    if (!todayReflection) {
      const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];
      setSelectedMentor(randomMentor);
      fetchQuestion(randomMentor);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestion = async (mentor: typeof mentors[0]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorName: mentor.name, mentorContext: mentor.philosophy }),
      });
      const data = await res.json();
      if (data.success && data.question) {
        setQuestion(data.question);
      } else {
        // Fallback question
        setQuestion(`${mentor.name} asks: What is one thing you learned about yourself today, and how will you apply it tomorrow?`);
      }
    } catch {
      setQuestion(`${mentor.name} asks: What is one thing you learned about yourself today, and how will you apply it tomorrow?`);
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!response.trim()) return;
    addDailyReflection({
      date: todayDate,
      mentorId: selectedMentor.id,
      question,
      response: response.trim(),
    });
    setSubmitted(true);
  };

  const recentReflections = dailyReflections.slice(0, 5);

  if (todayReflection || submitted) {
    const reflection = todayReflection || { question, response: response.trim(), mentorId: selectedMentor.id, date: todayDate };
    const mentor = mentors.find((m) => m.id === reflection.mentorId) || selectedMentor;

    return (
      <Card className="border-brand-accent/20 bg-gradient-to-br from-brand-accent/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-accent" />
            <CardTitle className="text-lg">Daily Reflection</CardTitle>
            <Badge variant="success" className="ml-auto">Completed</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-3">
            <Avatar size="sm">
              <AvatarFallback
                className="text-[10px]"
                style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
              >
                {getInitials(mentor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-brand-accent-light font-medium">{mentor.name}&apos;s Question</p>
              <p className="text-sm text-brand-text italic">{reflection.question}</p>
            </div>
          </div>
          <div className="rounded-lg bg-brand-background/50 p-3 border border-brand-border/50">
            <p className="text-xs text-brand-text-muted mb-1">Your Reflection</p>
            <p className="text-sm text-brand-text">{reflection.response}</p>
          </div>

          {/* Past reflections */}
          {recentReflections.length > 1 && (
            <div className="mt-4 pt-3 border-t border-brand-border">
              <p className="text-xs text-brand-text-muted mb-2">Recent reflections</p>
              <div className="space-y-2">
                {recentReflections.slice(1, 4).map((r) => {
                  const rMentor = mentors.find((m) => m.id === r.mentorId);
                  return (
                    <div key={r.id} className="flex items-start gap-2">
                      {rMentor && (
                        <Avatar size="sm" className="w-5 h-5 shrink-0 mt-0.5">
                          <AvatarFallback
                            className="text-[6px]"
                            style={{ background: `linear-gradient(135deg, ${rMentor.accentColor}, ${rMentor.accentColor}88)` }}
                          >
                            {getInitials(rMentor.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-brand-text-muted">{formatDate(r.date)}</p>
                        <p className="text-xs text-brand-text truncate">{r.response}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-accent/20 bg-gradient-to-br from-brand-accent/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-accent" />
          <CardTitle className="text-lg">Daily Reflection</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-brand-accent animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-3">
              <Avatar size="sm">
                <AvatarFallback
                  className="text-[10px]"
                  style={{ background: `linear-gradient(135deg, ${selectedMentor.accentColor}, ${selectedMentor.accentColor}88)` }}
                >
                  {getInitials(selectedMentor.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-brand-accent-light font-medium">{selectedMentor.name}</p>
                <p className="text-sm text-brand-text italic">{question}</p>
              </div>
            </div>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write a short reflection (2-3 sentences)..."
              rows={3}
            />
            <Button
              onClick={handleSubmit}
              disabled={!response.trim()}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" /> Submit Reflection
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
