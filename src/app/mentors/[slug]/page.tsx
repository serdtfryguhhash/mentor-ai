"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Heart, BookOpen, Quote, Star,
  MapPin, Calendar, Globe, Sparkles, Brain, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import { getMentorBySlug, mentors } from "@/data/mentors";
import { useStore } from "@/store/useStore";
import { getInitials, getCategoryIcon, cn } from "@/lib/utils";

export default function MentorProfilePage({ params }: { params: { slug: string } }) {
  const mentor = getMentorBySlug(params.slug);
  const router = useRouter();
  const { createSession, favoriteMentors, toggleFavoriteMentor, sessions } = useStore();

  if (!mentor) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-text text-xl font-heading">Mentor not found</p>
          <Link href="/mentors"><Button variant="outline" className="mt-4">Browse Mentors</Button></Link>
        </div>
      </div>
    );
  }

  const isFavorite = favoriteMentors.includes(mentor.id);
  const mentorSessions = sessions.filter((s) => s.mentor_id === mentor.id);
  const relatedMentors = mentors.filter((m) => m.category === mentor.category && m.id !== mentor.id).slice(0, 4);

  const startSession = () => {
    const session = createSession(mentor.id);
    router.push(`/session/${session.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Back */}
          <Link href="/mentors" className="inline-flex items-center gap-1.5 text-sm text-brand-text-muted hover:text-brand-text mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Mentors
          </Link>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-xl border border-brand-border bg-brand-surface overflow-hidden">
              <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${mentor.accentColor}, ${mentor.accentColor}44)` }} />
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar size="xl" className="shrink-0">
                    <AvatarFallback
                      className="text-2xl"
                      style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                    >
                      {getInitials(mentor.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">{mentor.name}</h1>
                        <p className="text-brand-text-muted mt-1">{mentor.title}</p>
                      </div>
                      <button onClick={() => toggleFavoriteMentor(mentor.id)}>
                        <Heart className={cn("w-6 h-6 transition-all", isFavorite ? "fill-red-500 text-red-500" : "text-brand-text-muted hover:text-red-400")} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-brand-text-muted">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {mentor.era}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {mentor.born}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {mentor.nationality}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <Badge variant="outline">{getCategoryIcon(mentor.category)} {mentor.category}</Badge>
                      {mentor.specialties.map((s) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-5">
                      <Button onClick={startSession} size="lg">
                        <MessageCircle className="w-4 h-4 mr-2" /> Start Session
                      </Button>
                      <Link href="/circle">
                        <Button variant="outline" size="lg">
                          <Brain className="w-4 h-4 mr-2" /> Add to Circle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <div className="mt-4 px-4 py-2 rounded-lg bg-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs text-brand-accent-light text-center">
              AI simulation for educational purposes. This is not the actual person. Responses are generated based on historical writings, biography, and philosophy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-heading font-semibold text-brand-text mb-3">Biography</h2>
                  <p className="text-sm text-brand-text-muted leading-relaxed">{mentor.fullBio}</p>
                </CardContent>
              </Card>

              {/* Philosophy */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-heading font-semibold text-brand-text mb-3">Philosophy</h2>
                  <p className="text-sm text-brand-text leading-relaxed font-serif italic">{mentor.philosophy}</p>
                </CardContent>
              </Card>

              {/* Quotes */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-heading font-semibold text-brand-text mb-4">Famous Quotes</h2>
                  <div className="space-y-4">
                    {mentor.famousQuotes.map((quote, i) => (
                      <div key={i} className="flex gap-3">
                        <Quote className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                        <p className="text-sm text-brand-text font-serif italic">&ldquo;{quote}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Greeting preview */}
              <Card className="border-brand-accent/20 bg-gradient-to-br from-brand-accent/5 to-transparent">
                <CardContent className="p-6">
                  <h2 className="text-lg font-heading font-semibold text-brand-text mb-3">How They Greet You</h2>
                  <div className="flex gap-3">
                    <Avatar size="md">
                      <AvatarFallback style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}>
                        {getInitials(mentor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-brand-surface rounded-2xl rounded-tl-sm px-4 py-3 border border-brand-border">
                      <p className="text-sm text-brand-text leading-relaxed">{mentor.greeting}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-heading font-semibold text-brand-text mb-3">Mentoring Style</h3>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{mentor.communicationStyle}</p>
                  <h3 className="text-sm font-heading font-semibold text-brand-text mt-4 mb-2">Challenge Approach</h3>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{mentor.challengeStyle}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-heading font-semibold text-brand-text mb-3">Recommended Reading</h3>
                  <div className="space-y-2">
                    {mentor.bookRecommendations.map((book) => (
                      <div key={book} className="flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-brand-text-muted">{book}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {mentorSessions.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-heading font-semibold text-brand-text mb-3">Your Sessions ({mentorSessions.length})</h3>
                    <div className="space-y-2">
                      {mentorSessions.slice(0, 3).map((s) => (
                        <Link key={s.id} href={`/session/${s.id}`}>
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-background text-xs text-brand-text-muted cursor-pointer">
                            <MessageCircle className="w-3 h-3" />
                            <span>{s.messages.length} messages</span>
                            <ChevronRight className="w-3 h-3 ml-auto" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {relatedMentors.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-heading font-semibold text-brand-text mb-3">Similar Mentors</h3>
                    <div className="space-y-2">
                      {relatedMentors.map((m) => (
                        <Link key={m.id} href={`/mentors/${m.slug}`}>
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-background cursor-pointer">
                            <Avatar size="sm">
                              <AvatarFallback className="text-[10px]" style={{ background: `linear-gradient(135deg, ${m.accentColor}, ${m.accentColor}88)` }}>
                                {getInitials(m.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-brand-text truncate">{m.name}</p>
                              <p className="text-[10px] text-brand-text-muted truncate">{m.era}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
