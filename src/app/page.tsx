"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, MessageCircle, Brain, Sun, BookOpen,
  Star, Users, Zap, ChevronRight, Quote, Crown, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mentors } from "@/data/mentors";
import { getInitials } from "@/lib/utils";
import { PRICING_TIERS } from "@/lib/stripe";

const featuredMentors = mentors.slice(0, 8);
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Startup Founder",
    content: "Having a session with Steve Jobs AI about product design literally changed how I approach my MVP. The questions it asked were exactly what I needed to hear.",
    mentor: "Steve Jobs",
    rating: 5,
  },
  {
    name: "Marcus Williams",
    role: "Executive Coach",
    content: "The Mentor Circle feature is extraordinary. Getting Marcus Aurelius, Sun Tzu, and Brene Brown to all weigh in on a leadership challenge gave me perspectives I never would have found alone.",
    mentor: "Multiple Mentors",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "PhD Student",
    content: "I use Marie Curie as my daily mentor. The persistence and focus her AI embodies has genuinely helped me push through my dissertation struggles.",
    mentor: "Marie Curie",
    rating: 5,
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden hero-mesh">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="gold" className="mb-6 py-1.5 px-4 text-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                200+ AI Mentor Personas Available
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight"
            >
              Learn from{" "}
              <span className="text-gradient from-brand-accent via-purple-400 to-brand-accent-light">
                History&apos;s Greatest
              </span>{" "}
              Minds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-brand-text-muted mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              What if you could sit down with Marcus Aurelius, Cleopatra, Einstein, or Maya Angelou
              and ask them anything? Now you can. AI-powered mentorship that feels authentically personal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <Link href="/signup">
                <Button size="xl" className="group">
                  Start Free Mentorship
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/mentors">
                <Button size="xl" variant="outline">
                  Browse Mentors
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xs text-brand-text-muted mt-4"
            >
              AI simulation for educational purposes. Not the actual person.
            </motion.p>
          </div>

          {/* Floating mentor avatars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center mt-12 -space-x-3"
          >
            {featuredMentors.map((mentor, i) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="relative group"
              >
                <Avatar size="lg" className="border-2 border-brand-background ring-2 ring-brand-border hover:ring-brand-accent transition-all cursor-pointer hover:z-10 hover:scale-110">
                  <AvatarFallback
                    style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                  >
                    {getInitials(mentor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className="text-xs bg-brand-surface px-2 py-1 rounded-md border border-brand-border text-brand-text">
                    {mentor.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Demo chat preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto mt-20"
          >
            <div className="rounded-2xl border border-brand-border bg-brand-surface shadow-2xl shadow-brand-accent/5 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border bg-brand-background/50">
                <Avatar size="sm">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-amber-700 to-amber-900">MA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-brand-text">Marcus Aurelius</p>
                  <p className="text-[10px] text-brand-text-muted">Roman Emperor & Stoic Philosopher</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-[10px]">AI Mentor</Badge>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-amber-700 to-amber-900">MA</AvatarFallback>
                  </Avatar>
                  <div className="bg-brand-background rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-brand-text leading-relaxed">
                      Welcome, seeker. I have sat in the purple of empire and yet found that the greatest kingdom to govern is one&apos;s own mind. What weighs upon your thoughts today?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                  <div className="bg-brand-accent rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-white">
                      I keep getting overwhelmed by things I can&apos;t control at work. How do I stop stressing about it?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-amber-700 to-amber-900">MA</AvatarFallback>
                  </Avatar>
                  <div className="bg-brand-background rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-brand-text leading-relaxed">
                      Ah, the most ancient of human struggles. I wrote in my journal, during a campaign on the frozen Danube, these words: <em className="text-brand-accent-light font-serif">&ldquo;You have power over your mind - not outside events. Realize this, and you will find strength.&rdquo;</em>
                    </p>
                    <p className="text-sm text-brand-text leading-relaxed mt-2">
                      Tell me precisely: what are these things you cannot control? Let us separate them from what you can. I suspect you will find your power is greater than you imagine.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-brand-border bg-brand-background/30">
                <div className="flex items-center gap-2 text-brand-text-muted">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Start your own session...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Everything You Need to{" "}
              <span className="text-gradient from-brand-accent to-brand-accent-light">Learn from the Best</span>
            </h2>
            <p className="text-brand-text-muted mt-4 max-w-2xl mx-auto">
              Each mentor is crafted from real historical writings, biographies, and philosophy to deliver authentic, personalized guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Mentoring Sessions",
                description: "Deep, chat-based conversations where your mentor responds in character with their unique perspective, stories, and provocative questions.",
                color: "from-purple-500 to-violet-600",
              },
              {
                icon: Brain,
                title: "Mentor Circle",
                description: "Ask one question to 3-5 mentors simultaneously. Compare Marcus Aurelius's Stoic advice with Oprah's emotional intelligence side by side.",
                color: "from-blue-500 to-cyan-600",
                premium: true,
              },
              {
                icon: Sun,
                title: "Daily Wisdom",
                description: "A rotating mentor delivers a thought, quote, or challenge at your chosen time. Start each day with wisdom from a different era.",
                color: "from-amber-500 to-orange-600",
              },
              {
                icon: BookOpen,
                title: "Insight Journal",
                description: "Save advice, add personal reflections, export as PDF. Weekly AI-powered summaries of your growth themes and patterns.",
                color: "from-emerald-500 to-green-600",
              },
              {
                icon: Users,
                title: "200+ Mentor Personas",
                description: "From Socrates to Steve Jobs, each mentor has a custom system prompt built from their real writings, biography, and communication style.",
                color: "from-pink-500 to-rose-600",
              },
              {
                icon: Zap,
                title: "Onboarding Quiz",
                description: "Tell us your goals and challenges, and we'll recommend the perfect starter mentors for your journey. Personalized from day one.",
                color: "from-indigo-500 to-purple-600",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-brand-border bg-brand-surface p-6 hover:border-brand-accent/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-heading font-semibold text-brand-text">{feature.title}</h3>
                  {feature.premium && <Crown className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-sm text-brand-text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-20 border-t border-brand-border bg-brand-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Meet Your{" "}
              <span className="text-gradient from-brand-accent to-brand-accent-light">Mentors</span>
            </h2>
            <p className="text-brand-text-muted mt-4">
              Each mind brings unique wisdom, challenge styles, and perspectives spanning millennia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mentors.slice(0, 8).map((mentor, i) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/mentors/${mentor.slug}`}>
                  <div className="group rounded-xl border border-brand-border bg-brand-surface p-5 hover:border-brand-accent/30 hover:bg-brand-surface-light transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar size="lg">
                        <AvatarFallback
                          style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                        >
                          {getInitials(mentor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-heading font-semibold text-brand-text group-hover:text-brand-accent-light transition-colors text-sm">
                          {mentor.name}
                        </h3>
                        <p className="text-[11px] text-brand-text-muted">{mentor.era}</p>
                      </div>
                    </div>
                    <p className="text-xs text-brand-text-muted italic font-serif">
                      &ldquo;{mentor.famousQuotes[0]}&rdquo;
                    </p>
                    <div className="flex gap-1.5 mt-3">
                      {mentor.specialties.slice(0, 2).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/mentors">
              <Button variant="outline" size="lg">
                Browse All 200+ Mentors
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Wisdom That{" "}
              <span className="text-gradient from-brand-accent to-brand-accent-light">Transforms</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-brand-border bg-brand-surface p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-brand-accent/30 mb-2" />
                <p className="text-sm text-brand-text leading-relaxed mb-4">{t.content}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-brand-border">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-text">{t.name}</p>
                    <p className="text-xs text-brand-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 border-t border-brand-border bg-brand-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Simple, Transparent{" "}
              <span className="text-gradient from-brand-accent to-brand-accent-light">Pricing</span>
            </h2>
            <p className="text-brand-text-muted mt-4">Start free. Upgrade when you are ready for deeper mentorship.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-6 relative ${
                  tier.highlighted
                    ? "border-brand-accent bg-brand-surface glow-purple"
                    : "border-brand-border bg-brand-surface"
                }`}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-white border-0">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-xl font-heading font-bold text-brand-text">{tier.name}</h3>
                <div className="mt-3 mb-4">
                  <span className="text-4xl font-bold text-brand-text">
                    ${tier.price}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-brand-text-muted text-sm">/{tier.interval}</span>
                  )}
                </div>
                <p className="text-sm text-brand-text-muted mb-6">{tier.description}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-brand-text">
                      <Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.price === 0 ? "Get Started Free" : "Start 7-Day Trial"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 border-t border-brand-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-br from-brand-accent/10 to-purple-900/20 p-8 sm:p-12">
            <Sparkles className="w-10 h-10 text-brand-accent mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">Weekly Wisdom Digest</h2>
            <p className="text-brand-text-muted mb-6">
              A curated selection of insights from history&apos;s greatest minds, delivered to your inbox every Sunday.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button>Subscribe Free</Button>
            </div>
            <p className="text-xs text-brand-text-muted mt-3">Join 15,000+ seekers. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
