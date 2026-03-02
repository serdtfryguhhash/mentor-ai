"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Target,
  Briefcase,
  BookOpen,
  TrendingUp,
  Compass,
  CheckCircle2,
  Star,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import { mentors } from "@/data/mentors";
import { getInitials, cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  options: { id: string; label: string; description: string; tags: string[] }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "challenge",
    title: "What's your biggest challenge right now?",
    subtitle: "This helps us match you with mentors who specialize in your area of need.",
    icon: Target,
    options: [
      {
        id: "leadership",
        label: "Leading & Managing Others",
        description: "Building teams, making decisions, handling conflict",
        tags: ["Leadership", "Political Strategy", "Negotiation", "Team Building", "Power Dynamics"],
      },
      {
        id: "creativity",
        label: "Creative Blocks & Innovation",
        description: "Finding inspiration, thinking differently, building new things",
        tags: ["Creativity", "Innovation", "Cross-Disciplinary Thinking", "Observation", "Artistic Vision"],
      },
      {
        id: "resilience",
        label: "Overcoming Adversity",
        description: "Dealing with setbacks, stress, and uncertainty",
        tags: ["Resilience", "Stoicism", "Self-Discipline", "Perseverance", "Courage"],
      },
      {
        id: "growth",
        label: "Personal Growth & Purpose",
        description: "Finding meaning, building habits, becoming your best self",
        tags: ["Self-Discipline", "Mindfulness", "Inner Peace", "Compassion", "Philosophy"],
      },
      {
        id: "strategy",
        label: "Strategy & Decision-Making",
        description: "Planning ahead, analyzing situations, making smart choices",
        tags: ["Business Strategy", "Innovation", "Strategic Thinking", "Economics", "Disruption"],
      },
    ],
  },
  {
    id: "industry",
    title: "What industry or domain are you in?",
    subtitle: "We'll prioritize mentors whose wisdom applies best to your field.",
    icon: Briefcase,
    options: [
      {
        id: "tech",
        label: "Technology & Startups",
        description: "Software, AI, entrepreneurship, product building",
        tags: ["Innovation", "Disruption", "Business Strategy", "Technology", "Product Design"],
      },
      {
        id: "creative",
        label: "Creative & Arts",
        description: "Design, writing, music, film, visual arts",
        tags: ["Creativity", "Artistic Vision", "Cross-Disciplinary Thinking", "Observation", "Writing"],
      },
      {
        id: "business",
        label: "Business & Finance",
        description: "Corporate, consulting, investing, management",
        tags: ["Business Strategy", "Leadership", "Negotiation", "Economics", "Investing"],
      },
      {
        id: "education",
        label: "Education & Research",
        description: "Teaching, academia, scientific research",
        tags: ["Scientific Method", "Curiosity", "Observation", "Perseverance", "Physics"],
      },
      {
        id: "health",
        label: "Health & Wellness",
        description: "Medicine, fitness, mental health, wellbeing",
        tags: ["Compassion", "Mindfulness", "Inner Peace", "Resilience", "Self-Discipline"],
      },
      {
        id: "social",
        label: "Social Impact & Public Service",
        description: "Non-profit, activism, government, community",
        tags: ["Civil Rights", "Nonviolent Resistance", "Courage", "Activism", "Compassion"],
      },
    ],
  },
  {
    id: "style",
    title: "What learning style do you prefer?",
    subtitle: "Each mentor has a unique communication approach. Let's find yours.",
    icon: BookOpen,
    options: [
      {
        id: "direct",
        label: "Direct & Challenging",
        description: "Push me hard, don't sugarcoat it, challenge my thinking",
        tags: ["Stoicism", "Self-Discipline", "Leadership", "Courage", "Strategic Thinking"],
      },
      {
        id: "storytelling",
        label: "Stories & Analogies",
        description: "Teach me through examples, metaphors, and real experiences",
        tags: ["Cross-Disciplinary Thinking", "Observation", "Creativity", "Writing", "Artistic Vision"],
      },
      {
        id: "analytical",
        label: "Analytical & Structured",
        description: "Break things down logically, give me frameworks",
        tags: ["Scientific Method", "Physics", "Economics", "Business Strategy", "Mathematics"],
      },
      {
        id: "empathetic",
        label: "Empathetic & Supportive",
        description: "Listen deeply, validate my feelings, gentle guidance",
        tags: ["Compassion", "Mindfulness", "Inner Peace", "Emotional Intelligence", "Vulnerability"],
      },
      {
        id: "socratic",
        label: "Questioning & Socratic",
        description: "Ask me questions that make me discover answers myself",
        tags: ["Philosophy", "Curiosity", "Ethics", "Cross-Disciplinary Thinking", "Self-Knowledge"],
      },
    ],
  },
  {
    id: "experience",
    title: "What's your experience level?",
    subtitle: "This helps calibrate the depth and complexity of mentoring advice.",
    icon: TrendingUp,
    options: [
      {
        id: "beginner",
        label: "Just Starting Out",
        description: "New to my field, looking for foundational guidance",
        tags: ["Curiosity", "Self-Discipline", "Perseverance", "Observation", "Learning"],
      },
      {
        id: "intermediate",
        label: "Building Momentum",
        description: "A few years in, ready to level up significantly",
        tags: ["Innovation", "Business Strategy", "Leadership", "Creativity", "Growth"],
      },
      {
        id: "advanced",
        label: "Experienced Professional",
        description: "Deep expertise, seeking refinement and new perspectives",
        tags: ["Strategic Thinking", "Power Dynamics", "Philosophy", "Cross-Disciplinary Thinking", "Disruption"],
      },
      {
        id: "leader",
        label: "Leader & Mentor Myself",
        description: "Leading others, shaping organizations or movements",
        tags: ["Leadership", "Political Strategy", "Negotiation", "Team Building", "Vision"],
      },
    ],
  },
  {
    id: "goal",
    title: "What's your main goal?",
    subtitle: "The final piece. This shapes your ideal mentor match.",
    icon: Compass,
    options: [
      {
        id: "career",
        label: "Advance My Career",
        description: "Get promoted, switch roles, or build my reputation",
        tags: ["Business Strategy", "Leadership", "Negotiation", "Innovation", "Strategic Thinking"],
      },
      {
        id: "business",
        label: "Build Something Great",
        description: "Launch a product, company, or creative project",
        tags: ["Innovation", "Disruption", "Product Design", "Creativity", "Perseverance"],
      },
      {
        id: "wisdom",
        label: "Find Deeper Wisdom",
        description: "Understand life better, make peace with the big questions",
        tags: ["Philosophy", "Stoicism", "Mindfulness", "Inner Peace", "Self-Knowledge"],
      },
      {
        id: "influence",
        label: "Become a Better Leader",
        description: "Inspire others, drive change, build movements",
        tags: ["Leadership", "Civil Rights", "Courage", "Negotiation", "Political Strategy"],
      },
      {
        id: "balance",
        label: "Find Balance & Resilience",
        description: "Handle stress, build healthy habits, stay grounded",
        tags: ["Resilience", "Mindfulness", "Self-Discipline", "Compassion", "Inner Peace"],
      },
    ],
  },
];

function calculateMatches(
  answers: Record<string, string>
): { mentor: (typeof mentors)[0]; score: number; matchPercentage: number; reasons: string[] }[] {
  const allTags: string[] = [];

  Object.entries(answers).forEach(([questionId, answerId]) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    const option = question?.options.find((o) => o.id === answerId);
    if (option) {
      allTags.push(...option.tags);
    }
  });

  const scored = mentors.map((mentor) => {
    let score = 0;
    const reasons: string[] = [];

    // Score based on specialty matches
    mentor.specialties.forEach((specialty) => {
      const matches = allTags.filter(
        (tag) => tag.toLowerCase() === specialty.toLowerCase()
      ).length;
      if (matches > 0) {
        score += matches * 3;
        reasons.push(specialty);
      }
    });

    // Score based on category alignment
    const categoryTags: Record<string, string[]> = {
      Business: ["Business Strategy", "Innovation", "Economics", "Investing", "Disruption"],
      Philosophy: ["Philosophy", "Stoicism", "Ethics", "Self-Knowledge", "Curiosity"],
      Science: ["Scientific Method", "Physics", "Mathematics", "Observation", "Curiosity"],
      Art: ["Creativity", "Artistic Vision", "Cross-Disciplinary Thinking", "Writing", "Observation"],
      Leadership: ["Leadership", "Political Strategy", "Negotiation", "Courage", "Strategic Thinking"],
      Spirituality: ["Mindfulness", "Inner Peace", "Compassion", "Self-Discipline", "Resilience"],
      Modern: ["Innovation", "Disruption", "Product Design", "Technology", "Emotional Intelligence"],
    };

    const catTags = categoryTags[mentor.category] || [];
    catTags.forEach((ct) => {
      if (allTags.some((t) => t.toLowerCase() === ct.toLowerCase())) {
        score += 1;
      }
    });

    return { mentor, score, reasons: Array.from(new Set(reasons)).slice(0, 3) };
  });

  const maxScore = Math.max(...scored.map((s) => s.score), 1);

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item, index) => ({
      ...item,
      matchPercentage: Math.round(
        Math.max(78, Math.min(98, (item.score / maxScore) * 100 - index * 4))
      ),
    }));
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const { createSession } = useStore();

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + (showResults ? 1 : 0)) / quizQuestions.length) * 100;

  const matches = useMemo(() => {
    if (!showResults) return [];
    return calculateMatches(answers);
  }, [showResults, answers]);

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    if (currentStep < quizQuestions.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const startSession = (mentorId: string) => {
    const session = createSession(mentorId);
    router.push(`/session/${session.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => (currentStep === 0 && !showResults ? router.push("/mentors") : handleBack())}
              className="inline-flex items-center gap-1.5 text-sm text-brand-text-muted hover:text-brand-text mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 0 && !showResults ? "Back to Mentors" : "Previous Question"}
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
                  Find Your Perfect Mentor
                </h1>
                <p className="text-sm text-brand-text-muted">
                  {showResults
                    ? "Your personalized mentor matches are ready"
                    : `Question ${currentStep + 1} of ${quizQuestions.length}`}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-brand-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-accent to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-3">
              {quizQuestions.map((q, i) => (
                <div key={q.id} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                      i < currentStep || showResults
                        ? "bg-brand-accent text-white"
                        : i === currentStep && !showResults
                        ? "bg-brand-accent/20 text-brand-accent-light border border-brand-accent"
                        : "bg-brand-surface text-brand-text-muted border border-brand-border"
                    )}
                  >
                    {i < currentStep || showResults ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-[10px] text-brand-text-muted hidden sm:inline">
                    {q.id.charAt(0).toUpperCase() + q.id.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quiz Content */}
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <currentQuestion.icon className="w-6 h-6 text-brand-accent" />
                    <h2 className="text-xl font-heading font-semibold text-brand-text">
                      {currentQuestion.title}
                    </h2>
                  </div>
                  <p className="text-sm text-brand-text-muted ml-9">
                    {currentQuestion.subtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected = answers[currentQuestion.id] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, ease: [0.4, 0, 0.2, 1] as const }}
                        onClick={() => handleSelect(option.id)}
                        className={cn(
                          "w-full text-left rounded-xl border p-4 sm:p-5 transition-all duration-200 group",
                          isSelected
                            ? "border-brand-accent bg-brand-accent/10 ring-1 ring-brand-accent/30"
                            : "border-brand-border bg-brand-surface hover:border-brand-accent/30 hover:bg-brand-surface-light"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                              isSelected
                                ? "border-brand-accent bg-brand-accent"
                                : "border-brand-border group-hover:border-brand-accent/50"
                            )}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-medium transition-colors",
                                isSelected
                                  ? "text-brand-accent-light"
                                  : "text-brand-text group-hover:text-brand-accent-light"
                              )}
                            >
                              {option.label}
                            </p>
                            <p className="text-sm text-brand-text-muted mt-0.5">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Results */
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-heading font-bold text-brand-text">
                    Your Top Mentor Matches
                  </h2>
                  <p className="text-brand-text-muted mt-1">
                    Based on your responses, here are the mentors best suited for your journey.
                  </p>
                </div>

                <div className="space-y-4">
                  {matches.map((match, i) => (
                    <motion.div
                      key={match.mentor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.15, ease: [0.4, 0, 0.2, 1] as const }}
                    >
                      <Card className="overflow-hidden hover:border-brand-accent/30 transition-all duration-300">
                        <div
                          className="h-1.5 w-full"
                          style={{
                            background: `linear-gradient(90deg, ${match.mentor.accentColor}, ${match.mentor.accentColor}44)`,
                          }}
                        />
                        <CardContent className="p-5 sm:p-6">
                          <div className="flex items-start gap-4">
                            <div className="relative shrink-0">
                              <Avatar size="xl">
                                <AvatarFallback
                                  className="text-xl"
                                  style={{
                                    background: `linear-gradient(135deg, ${match.mentor.accentColor}, ${match.mentor.accentColor}88)`,
                                  }}
                                >
                                  {getInitials(match.mentor.name)}
                                </AvatarFallback>
                              </Avatar>
                              {i === 0 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-heading font-semibold text-brand-text">
                                      {match.mentor.name}
                                    </h3>
                                    {i === 0 && (
                                      <Badge variant="gold" className="text-[10px]">
                                        Best Match
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-brand-text-muted">
                                    {match.mentor.title}
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-2xl font-bold text-brand-accent">
                                    {match.matchPercentage}%
                                  </div>
                                  <p className="text-[10px] text-brand-text-muted">match</p>
                                </div>
                              </div>

                              {/* Match reasons */}
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {match.reasons.map((reason) => (
                                  <Badge
                                    key={reason}
                                    variant="secondary"
                                    className="text-[10px]"
                                  >
                                    {reason}
                                  </Badge>
                                ))}
                                <Badge variant="outline" className="text-[10px]">
                                  {match.mentor.category}
                                </Badge>
                              </div>

                              {/* Quote */}
                              <p className="text-sm text-brand-text-muted italic font-serif mt-3 line-clamp-2">
                                &ldquo;{match.mentor.famousQuotes[0]}&rdquo;
                              </p>

                              {/* Actions */}
                              <div className="flex gap-2 mt-4">
                                <Button
                                  onClick={() => startSession(match.mentor.id)}
                                  size="sm"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                  Start Session
                                </Button>
                                <Link href={`/mentors/${match.mentor.slug}`}>
                                  <Button variant="outline" size="sm">
                                    View Profile
                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Retake / Browse */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAnswers({});
                      setCurrentStep(0);
                      setShowResults(false);
                    }}
                  >
                    Retake Quiz
                  </Button>
                  <Link href="/mentors">
                    <Button variant="ghost">
                      Browse All Mentors
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
