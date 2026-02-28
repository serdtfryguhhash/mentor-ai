"use client";

import React from "react";

import { motion } from "framer-motion";
import { Check, Crown, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRICING_TIERS } from "@/lib/stripe";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How realistic are the AI mentors?", a: "Each mentor is built from extensive research into their real writings, biographies, communication styles, and philosophies. While they are AI simulations, users consistently report that the guidance feels authentically different between mentors." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time from your settings page. You will retain access until the end of your billing period." },
  { q: "What is the Mentor Circle?", a: "Mentor Circle lets you ask one question to 2-5 mentors simultaneously and compare their responses side by side. It is an Executive feature that provides remarkable multi-perspective wisdom." },
  { q: "Is this a replacement for real therapy or coaching?", a: "No. Mentor.ai is an educational tool that provides historical perspectives and philosophical guidance. For mental health concerns, please consult a licensed professional." },
  { q: "How does the affiliate program work?", a: "Executive members earn 20% recurring commission on every referral. Share your unique link, and when someone subscribes, you earn a commission for as long as they remain subscribed." },
];

export default function PricingPage() {
  const user = useStore((s) => s.user);
  const isApp = !!user;

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className={cn(isApp && "lg:ml-64 pt-14 lg:pt-0")}>
        <div className={cn("max-w-6xl mx-auto px-4 sm:px-6", isApp ? "py-6 sm:py-8" : "py-16 sm:py-24 pt-24")}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge variant="gold" className="mb-4 py-1 px-3">
              <Crown className="w-3 h-3 mr-1" /> Premium Mentorship
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-brand-text">
              Invest in{" "}
              <span className="text-gradient from-brand-accent to-brand-accent-light">Your Growth</span>
            </h1>
            <p className="text-brand-text-muted mt-4 max-w-xl mx-auto">
              Choose the mentorship level that matches your ambition. Start free, upgrade when you are ready.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "rounded-xl border p-6 relative flex flex-col",
                  tier.highlighted
                    ? "border-brand-accent bg-brand-surface glow-purple scale-105"
                    : "border-brand-border bg-brand-surface"
                )}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-white border-0 shadow-lg">
                    Most Popular
                  </Badge>
                )}

                <div>
                  <h3 className="text-xl font-heading font-bold text-brand-text">{tier.name}</h3>
                  <div className="mt-3 mb-2">
                    <span className="text-4xl font-bold text-brand-text">${tier.price}</span>
                    {tier.price > 0 && <span className="text-brand-text-muted text-sm">/{tier.interval}</span>}
                  </div>
                  <p className="text-sm text-brand-text-muted mb-6">{tier.description}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-brand-text">
                      <Check className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={tier.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {user?.subscription_tier === tier.tier ? (
                    "Current Plan"
                  ) : tier.price === 0 ? (
                    "Get Started Free"
                  ) : (
                    <>Start 7-Day Trial <ArrowRight className="w-4 h-4 ml-1" /></>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-heading font-bold text-brand-text text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-brand-text mb-1">{faq.q}</h3>
                          <p className="text-sm text-brand-text-muted leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {!isApp && <Footer />}
      </main>
    </div>
  );
}
