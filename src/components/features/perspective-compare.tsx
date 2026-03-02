"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, X, Sparkles, Loader2, BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function PerspectiveCompare() {
  const [question, setQuestion] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{ mentorId: string; response: string }[]>([]);
  const [saved, setSaved] = useState(false);
  const { saveComparison, addWisdom } = useStore();

  const toggleMentor = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((m) => m !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const askMentors = async () => {
    if (!question.trim() || selectedIds.length < 2) return;
    setLoading(true);
    setResponses([]);
    setSaved(false);

    for (const mentorId of selectedIds) {
      const mentor = mentors.find((m) => m.id === mentorId);
      if (!mentor) continue;

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "mentor-chat",
            mentorName: mentor.name,
            mentorSystemPrompt: mentor.systemPrompt,
            message: question,
            conversationHistory: [],
          }),
        });
        const data = await res.json();
        if (data.success && data.response) {
          setResponses((prev) => [...prev, { mentorId, response: data.response }]);
        }
      } catch {
        setResponses((prev) => [
          ...prev,
          { mentorId, response: "Unable to generate perspective at this time." },
        ]);
      }
    }

    setLoading(false);
  };

  const handleSaveComparison = () => {
    saveComparison({
      question,
      mentorResponses: responses,
    });

    // Also save each response to wisdom collection
    responses.forEach((r) => {
      addWisdom({
        content: r.response.substring(0, 300),
        mentorId: r.mentorId,
        sessionId: null,
        tags: ["mindset"],
        source: "circle",
      });
    });

    setSaved(true);
    toast.success("Comparison saved to your collection!");
  };

  return (
    <div className="space-y-4">
      {/* Mentor Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select 2-3 Mentors to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mentors.slice(0, 20).map((mentor) => {
              const selected = selectedIds.includes(mentor.id);
              return (
                <button
                  key={mentor.id}
                  onClick={() => toggleMentor(mentor.id)}
                  disabled={!selected && selectedIds.length >= 3}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all border",
                    selected
                      ? "border-brand-accent bg-brand-accent/10 text-brand-accent-light"
                      : "border-brand-border text-brand-text-muted hover:border-brand-accent/30 disabled:opacity-30"
                  )}
                >
                  <Avatar size="sm" className="w-5 h-5">
                    <AvatarFallback
                      className="text-[7px]"
                      style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                    >
                      {getInitials(mentor.name)}
                    </AvatarFallback>
                  </Avatar>
                  {mentor.name.split(" ")[0]}
                  {selected && <X className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardContent className="p-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question to compare perspectives..."
            rows={3}
          />
          <Button
            onClick={askMentors}
            disabled={!question.trim() || selectedIds.length < 2 || loading}
            className="w-full mt-3"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gathering Perspectives...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Compare Perspectives ({selectedIds.length})</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Side-by-side Responses */}
      {(responses.length > 0 || loading) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-brand-text">Perspectives</p>
            {responses.length >= 2 && !loading && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveComparison}
                disabled={saved}
              >
                {saved ? (
                  <><Check className="w-3.5 h-3.5 mr-1.5" /> Saved</>
                ) : (
                  <><BookmarkPlus className="w-3.5 h-3.5 mr-1.5" /> Save Comparison</>
                )}
              </Button>
            )}
          </div>

          <div className={`grid gap-4 ${responses.length >= 3 || selectedIds.length >= 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
            <AnimatePresence>
              {responses.map(({ mentorId, response }, i) => {
                const mentor = mentors.find((m) => m.id === mentorId);
                if (!mentor) return null;
                return (
                  <motion.div
                    key={mentorId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, ease: [0.4, 0, 0.2, 1] as const }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-brand-border">
                          <Avatar size="sm">
                            <AvatarFallback
                              className="text-[10px]"
                              style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                            >
                              {getInitials(mentor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-brand-text">{mentor.name}</p>
                            <p className="text-[10px] text-brand-text-muted">{mentor.category}</p>
                          </div>
                        </div>
                        <p className="text-sm text-brand-text leading-relaxed whitespace-pre-line">
                          {response}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Loading placeholders */}
            {loading &&
              selectedIds
                .filter((id) => !responses.find((r) => r.mentorId === id))
                .map((id) => {
                  const mentor = mentors.find((m) => m.id === id);
                  if (!mentor) return null;
                  return (
                    <Card key={id} className="h-full animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-brand-border">
                          <Avatar size="sm">
                            <AvatarFallback
                              className="text-[10px]"
                              style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                            >
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
  );
}
