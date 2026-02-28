"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import MentorCard from "@/components/mentors/MentorCard";
import { mentors, mentorCategories } from "@/data/mentors";
import { cn } from "@/lib/utils";

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = mentors;
    if (selectedCategory) result = result.filter((m) => m.category === selectedCategory);
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(lower) ||
          m.specialties.some((s) => s.toLowerCase().includes(lower)) ||
          m.shortBio.toLowerCase().includes(lower) ||
          m.category.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">Browse Mentors</h1>
            <p className="text-brand-text-muted mt-1">Explore {mentors.length} AI mentors spanning millennia of human wisdom</p>
          </motion.div>

          {/* Search & Filter */}
          <div className="mt-6 mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <Input
                placeholder="Search by name, specialty, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                  !selectedCategory
                    ? "bg-brand-accent text-white border-brand-accent"
                    : "bg-brand-surface text-brand-text-muted border-brand-border hover:border-brand-accent/30"
                )}
              >
                All ({mentors.length})
              </button>
              {mentorCategories.map((cat) => {
                const count = mentors.filter((m) => m.category === cat.name).length;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      selectedCategory === cat.name
                        ? "bg-brand-accent text-white border-brand-accent"
                        : "bg-brand-surface text-brand-text-muted border-brand-border hover:border-brand-accent/30"
                    )}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((mentor, i) => (
              <MentorCard key={mentor.id} mentor={mentor} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-brand-text-muted">No mentors found matching your search.</p>
              <button onClick={() => { setSearch(""); setSelectedCategory(null); }} className="text-brand-accent hover:underline text-sm mt-2">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
