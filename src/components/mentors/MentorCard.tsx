"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Mentor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getCategoryIcon } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

interface MentorCardProps {
  mentor: Mentor;
  index?: number;
}

export default function MentorCard({ mentor, index = 0 }: MentorCardProps) {
  const { favoriteMentors, toggleFavoriteMentor } = useStore();
  const isFavorite = favoriteMentors.includes(mentor.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/mentors/${mentor.slug}`}>
        <div className="group relative rounded-xl border border-brand-border bg-brand-surface hover:bg-brand-surface-light hover:border-brand-accent/30 transition-all duration-300 overflow-hidden cursor-pointer">
          {/* Accent top border */}
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
          />

          <div className="p-5">
            <div className="flex items-start gap-4">
              <Avatar size="lg">
                <AvatarFallback
                  className="text-lg"
                  style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                >
                  {getInitials(mentor.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-brand-text group-hover:text-brand-accent-light transition-colors truncate">
                    {mentor.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavoriteMentor(mentor.id);
                    }}
                    className="shrink-0 ml-2"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-all",
                        isFavorite ? "fill-red-500 text-red-500" : "text-brand-text-muted hover:text-red-400"
                      )}
                    />
                  </button>
                </div>
                <p className="text-xs text-brand-text-muted mt-0.5">{mentor.title}</p>
                <p className="text-xs text-brand-text-muted">{mentor.era}</p>
              </div>
            </div>

            <p className="text-sm text-brand-text-muted mt-3 line-clamp-2 leading-relaxed">
              {mentor.shortBio}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              <Badge variant="outline" className="text-[10px]">
                {getCategoryIcon(mentor.category)} {mentor.category}
              </Badge>
              {mentor.specialties.slice(0, 2).map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px]">
                  {s}
                </Badge>
              ))}
            </div>

            {/* Famous quote preview */}
            <div className="mt-3 pt-3 border-t border-brand-border/50">
              <p className="text-xs text-brand-text-muted italic font-serif line-clamp-1">
                &ldquo;{mentor.famousQuotes[0]}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
