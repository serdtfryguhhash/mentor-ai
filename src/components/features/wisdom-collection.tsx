"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Tag, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, formatDate } from "@/lib/utils";
import { WisdomTag } from "@/types";

const ALL_TAGS: WisdomTag[] = ["career", "relationships", "health", "mindset", "finance", "leadership", "creativity", "spirituality"];

const TAG_COLORS: Record<WisdomTag, string> = {
  career: "bg-purple-500/20 text-purple-400",
  relationships: "bg-pink-500/20 text-pink-400",
  health: "bg-emerald-500/20 text-emerald-400",
  mindset: "bg-blue-500/20 text-blue-400",
  finance: "bg-amber-500/20 text-amber-400",
  leadership: "bg-orange-500/20 text-orange-400",
  creativity: "bg-rose-500/20 text-rose-400",
  spirituality: "bg-teal-500/20 text-teal-400",
};

export default function WisdomCollection() {
  const { wisdomCollection, addWisdom, removeWisdom } = useStore();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<WisdomTag | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState<WisdomTag[]>([]);

  const filtered = useMemo(() => {
    return wisdomCollection.filter((w) => {
      const matchesSearch = !search || w.content.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || w.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [wisdomCollection, search, selectedTag]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    wisdomCollection.forEach((w) => {
      w.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return counts;
  }, [wisdomCollection]);

  const handleAddWisdom = () => {
    if (!newContent.trim()) return;
    addWisdom({
      content: newContent.trim(),
      mentorId: "",
      sessionId: null,
      tags: newTags,
      source: "manual",
    });
    setNewContent("");
    setNewTags([]);
    setShowAdd(false);
  };

  const toggleNewTag = (tag: WisdomTag) => {
    setNewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-brand-text">Wisdom Collection</h2>
            <p className="text-brand-text-muted text-sm">{wisdomCollection.length} pieces of wisdom saved</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Wisdom
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Card className="border-brand-accent/30">
              <CardContent className="p-4 space-y-3">
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter a quote, insight, or piece of advice..."
                  rows={3}
                />
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleNewTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        newTags.includes(tag) ? TAG_COLORS[tag] : "bg-brand-background text-brand-text-muted hover:text-brand-text"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddWisdom} disabled={!newContent.trim()}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <Input
            placeholder="Search your wisdom collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              !selectedTag ? "bg-brand-accent/20 text-brand-accent-light" : "bg-brand-background text-brand-text-muted hover:text-brand-text"
            }`}
          >
            All ({wisdomCollection.length})
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                selectedTag === tag ? TAG_COLORS[tag] : "bg-brand-background text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {tag} ({tagCounts[tag] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Wisdom Entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 text-brand-text-muted mx-auto mb-3 opacity-50" />
          <p className="text-sm text-brand-text-muted">
            {wisdomCollection.length === 0
              ? "Save wisdom from conversations using the bookmark icon, or add manually."
              : "No wisdom matches your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((wisdom, i) => {
            const mentor = mentors.find((m) => m.id === wisdom.mentorId);
            return (
              <motion.div
                key={wisdom.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, ease: [0.4, 0, 0.2, 1] as const }}
              >
                <Card className="group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {mentor && (
                        <Avatar size="sm" className="shrink-0 mt-0.5">
                          <AvatarFallback
                            className="text-[10px]"
                            style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                          >
                            {getInitials(mentor.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-brand-text-muted">
                            {mentor?.name || "Personal"} &middot; {formatDate(wisdom.created_at)}
                          </p>
                          <button
                            onClick={() => removeWisdom(wisdom.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-text-muted hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm text-brand-text leading-relaxed italic font-serif">
                          &ldquo;{wisdom.content}&rdquo;
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {wisdom.tags.map((tag) => (
                            <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${TAG_COLORS[tag]}`}>
                              {tag}
                            </span>
                          ))}
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
    </div>
  );
}
