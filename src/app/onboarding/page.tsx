"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useStore } from "@/store/useStore";
import { MentorCategory, OnboardingAnswers } from "@/types";
import { mentors, mentorCategories } from "@/data/mentors";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

const steps = ["Goals", "Experience", "Interests", "Challenges", "Style"];

const goalOptions = [
  { id: "personal-growth", label: "Personal Growth", icon: "🌱" },
  { id: "leadership", label: "Leadership Skills", icon: "👑" },
  { id: "career", label: "Career Advancement", icon: "🚀" },
  { id: "creativity", label: "Creative Expression", icon: "🎨" },
  { id: "resilience", label: "Building Resilience", icon: "💪" },
  { id: "relationships", label: "Better Relationships", icon: "❤️" },
  { id: "spirituality", label: "Spiritual Growth", icon: "✨" },
  { id: "strategy", label: "Strategic Thinking", icon: "♟️" },
  { id: "wisdom", label: "Philosophical Wisdom", icon: "📚" },
  { id: "innovation", label: "Innovation & Ideas", icon: "💡" },
];

const challengeOptions = [
  { id: "overwhelm", label: "Feeling overwhelmed" },
  { id: "direction", label: "Lack of direction" },
  { id: "confidence", label: "Low confidence" },
  { id: "relationships", label: "Relationship struggles" },
  { id: "motivation", label: "Lack of motivation" },
  { id: "decision", label: "Difficulty making decisions" },
  { id: "change", label: "Managing change" },
  { id: "balance", label: "Work-life balance" },
  { id: "creativity-block", label: "Creative blocks" },
  { id: "fear", label: "Fear of failure" },
];

const styleOptions = [
  { id: "gentle", label: "Gentle & Supportive", description: "Patient guidance, warm encouragement" },
  { id: "direct", label: "Direct & Challenging", description: "Honest feedback, tough love" },
  { id: "philosophical", label: "Deep & Philosophical", description: "Thought-provoking questions" },
  { id: "practical", label: "Practical & Actionable", description: "Step-by-step advice, clear actions" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    goals: [],
    experience: "beginner",
    interests: [],
    challenges: [],
    preferredStyle: "gentle",
  });
  const router = useRouter();
  const { completeOnboarding, setUser, user } = useStore();

  const toggleGoal = (id: string) => {
    setAnswers((a) => ({
      ...a,
      goals: a.goals.includes(id) ? a.goals.filter((g) => g !== id) : [...a.goals, id],
    }));
  };

  const toggleInterest = (cat: MentorCategory) => {
    setAnswers((a) => ({
      ...a,
      interests: a.interests.includes(cat) ? a.interests.filter((i) => i !== cat) : [...a.interests, cat],
    }));
  };

  const toggleChallenge = (id: string) => {
    setAnswers((a) => ({
      ...a,
      challenges: a.challenges.includes(id) ? a.challenges.filter((c) => c !== id) : [...a.challenges, id],
    }));
  };

  const handleComplete = () => {
    completeOnboarding(answers);
    if (!user) {
      setUser({
        id: "demo-user",
        email: "demo@mentor.ai",
        full_name: "Demo User",
        subscription_tier: "free",
        onboarding_completed: true,
        goals: answers.goals,
        recommended_mentors: mentors.filter((m) => answers.interests.includes(m.category)).slice(0, 5).map((m) => m.id),
        daily_wisdom_time: "08:00",
      });
    }
    toast.success("Your mentors are ready!");
    router.push("/dashboard");
  };

  const recommendedMentors = mentors
    .filter((m) => answers.interests.includes(m.category))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 hero-mesh">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-brand-text">Mentor<span className="text-brand-accent">.ai</span></span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-brand-text">Find Your Perfect Mentors</h1>

          {/* Progress */}
          <div className="flex items-center gap-2 justify-center mt-6">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? "bg-brand-accent text-white" : "bg-brand-surface border border-brand-border text-brand-text-muted"}`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 transition-colors ${i < step ? "bg-brand-accent" : "bg-brand-border"}`} />}
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-brand-text-muted mt-2">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-heading font-semibold text-brand-text mb-2">What are your goals?</h2>
                <p className="text-sm text-brand-text-muted mb-4">Select all that apply. We will match you with mentors who specialize in these areas.</p>
                <div className="grid grid-cols-2 gap-2">
                  {goalOptions.map((g) => (
                    <button key={g.id} onClick={() => toggleGoal(g.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-all border ${answers.goals.includes(g.id) ? "border-brand-accent bg-brand-accent/10 text-brand-text" : "border-brand-border bg-brand-background text-brand-text-muted hover:border-brand-accent/30"}`}>
                      <span>{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-heading font-semibold text-brand-text mb-2">What is your experience with mentorship?</h2>
                <p className="text-sm text-brand-text-muted mb-4">This helps us calibrate the depth of your sessions.</p>
                <div className="space-y-3">
                  {[
                    { id: "beginner", label: "New to mentorship", desc: "I have not had formal mentoring before" },
                    { id: "some", label: "Some experience", desc: "I have had a mentor or coach in the past" },
                    { id: "experienced", label: "Very experienced", desc: "I regularly work with mentors and coaches" },
                  ].map((opt) => (
                    <button key={opt.id} onClick={() => setAnswers((a) => ({ ...a, experience: opt.id }))}
                      className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-all border ${answers.experience === opt.id ? "border-brand-accent bg-brand-accent/10" : "border-brand-border bg-brand-background hover:border-brand-accent/30"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${answers.experience === opt.id ? "border-brand-accent" : "border-brand-border"}`}>
                        {answers.experience === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-text">{opt.label}</p>
                        <p className="text-xs text-brand-text-muted">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="interests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-heading font-semibold text-brand-text mb-2">Which categories interest you?</h2>
                <p className="text-sm text-brand-text-muted mb-4">Select the areas of wisdom that call to you most.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mentorCategories.map((cat) => (
                    <button key={cat.name} onClick={() => toggleInterest(cat.name as MentorCategory)}
                      className={`flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-all border ${answers.interests.includes(cat.name as MentorCategory) ? "border-brand-accent bg-brand-accent/10" : "border-brand-border bg-brand-background hover:border-brand-accent/30"}`}>
                      <div>
                        <p className="text-sm font-medium text-brand-text">{cat.name}</p>
                        <p className="text-xs text-brand-text-muted">{cat.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="challenges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-heading font-semibold text-brand-text mb-2">What challenges are you facing?</h2>
                <p className="text-sm text-brand-text-muted mb-4">Select all that resonate. No judgment - everyone faces these.</p>
                <div className="grid grid-cols-2 gap-2">
                  {challengeOptions.map((c) => (
                    <button key={c.id} onClick={() => toggleChallenge(c.id)}
                      className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border ${answers.challenges.includes(c.id) ? "border-brand-accent bg-brand-accent/10 text-brand-text" : "border-brand-border bg-brand-background text-brand-text-muted hover:border-brand-accent/30"}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="style" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-heading font-semibold text-brand-text mb-2">What mentoring style do you prefer?</h2>
                <p className="text-sm text-brand-text-muted mb-4">This helps us recommend the right personality matches.</p>
                <div className="space-y-2 mb-6">
                  {styleOptions.map((s) => (
                    <button key={s.id} onClick={() => setAnswers((a) => ({ ...a, preferredStyle: s.id }))}
                      className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-all border ${answers.preferredStyle === s.id ? "border-brand-accent bg-brand-accent/10" : "border-brand-border bg-brand-background hover:border-brand-accent/30"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${answers.preferredStyle === s.id ? "border-brand-accent" : "border-brand-border"}`}>
                        {answers.preferredStyle === s.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-text">{s.label}</p>
                        <p className="text-xs text-brand-text-muted">{s.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {recommendedMentors.length > 0 && (
                  <div className="border-t border-brand-border pt-4">
                    <h3 className="text-sm font-heading font-semibold text-brand-text mb-3">Your Recommended Mentors</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {recommendedMentors.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-background border border-brand-border">
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]" style={{ background: `linear-gradient(135deg, ${m.accentColor}, ${m.accentColor}88)` }}>
                              {getInitials(m.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-brand-text truncate">{m.name}</p>
                            <p className="text-[10px] text-brand-text-muted truncate">{m.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-border">
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button size="sm" onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleComplete}>
                Meet Your Mentors <Sparkles className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
