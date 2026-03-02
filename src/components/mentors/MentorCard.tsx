"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Star, Sparkles } from "lucide-react";
import { Mentor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getCategoryIcon, cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

interface MentorCardProps {
  mentor: Mentor;
  index?: number;
}

// Deterministic rating based on mentor id for consistency
function getMentorRating(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const base = 4.5 + (Math.abs(hash) % 6) / 10;
  return Math.min(5.0, Math.round(base * 10) / 10);
}

// Deterministic session count
function getMentorSessionCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 3) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return 120 + (Math.abs(hash) % 880);
}

export default function MentorCard({ mentor, index = 0 }: MentorCardProps) {
  const { favoriteMentors, toggleFavoriteMentor, createSession, sessions } = useStore();
  const router = useRouter();
  const isFavorite = favoriteMentors.includes(mentor.id);
  const rating = useMemo(() => getMentorRating(mentor.id), [mentor.id]);
  const sessionCount = useMemo(() => getMentorSessionCount(mentor.id), [mentor.id]);
  const userSessions = sessions.filter((s) => s.mentor_id === mentor.id).length;

  const handleStartSession = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const session = createSession(mentor.id);
    router.push(`/session/${session.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/mentors/${mentor.slug}`}>
        <div className="group relative rounded-xl border border-brand-border bg-brand-surface hover:border-brand-accent/40 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-brand-accent/5 hover:-translate-y-0.5">
          {/* Gradient accent top border */}
          <div
            className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
            style={{
              background: `linear-gradient(90deg, ${mentor.accentColor}, ${mentor.accentColor}66, transparent)`,
            }}
          />

          {/* Subtle gradient overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top left, ${mentor.accentColor}08, transparent 70%)`,
            }}
          />

          <div className="p-5 relative">
            {/* Header: Avatar + Info + Favorite */}
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <Avatar size="lg" className="ring-2 ring-transparent group-hover:ring-brand-accent/20 transition-all">
                  <AvatarFallback
                    className="text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)`,
                    }}
                  >
                    {getInitials(mentor.name)}
                  </AvatarFallback>
                </Avatar>
                {userSessions > 0 && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center ring-2 ring-brand-surface">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-heading font-semibold text-brand-text group-hover:text-brand-accent-light transition-colors truncate text-[15px]">
                    {mentor.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavoriteMentor(mentor.id);
                    }}
                    className="shrink-0 ml-1 p-1 rounded-full hover:bg-brand-background transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-all",
                        isFavorite
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-brand-text-muted hover:text-red-400"
                      )}
                    />
                  </button>
                </div>
                <p className="text-xs text-brand-text-muted mt-0.5 truncate">{mentor.title}</p>

                {/* Rating & Session count */}
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < Math.floor(rating)
                            ? "fill-amber-400 text-amber-400"
                            : i < rating
                            ? "fill-amber-400/50 text-amber-400/50"
                            : "text-brand-border"
                        )}
                      />
                    ))}
                    <span className="text-[10px] text-brand-text-muted ml-0.5 font-medium">
                      {rating}
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-text-muted">
                    {sessionCount.toLocaleString()} sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Specialty Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Badge variant="outline" className="text-[10px]">
                {getCategoryIcon(mentor.category)} {mentor.category}
              </Badge>
              {mentor.specialties.slice(0, 2).map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px]">
                  {s}
                </Badge>
              ))}
              {mentor.specialties.length > 2 && (
                <Badge variant="secondary" className="text-[10px] opacity-60">
                  +{mentor.specialties.length - 2}
                </Badge>
              )}
            </div>

            {/* Short bio */}
            <p className="text-sm text-brand-text-muted mt-3 line-clamp-2 leading-relaxed">
              {mentor.shortBio}
            </p>

            {/* Famous quote preview */}
            <div className="mt-3 pt-3 border-t border-brand-border/50">
              <p className="text-xs text-brand-text-muted italic font-serif line-clamp-1">
                &ldquo;{mentor.famousQuotes[0]}&rdquo;
              </p>
            </div>

            {/* Start Session CTA */}
            <div className="mt-3 pt-3 border-t border-brand-border/50">
              <Button
                onClick={handleStartSession}
                size="sm"
                className="w-full group/btn opacity-80 group-hover:opacity-100 transition-opacity"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Start Session
                <span className="ml-auto text-[10px] opacity-70 group-hover/btn:opacity-100 transition-opacity">
                  {mentor.era}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
