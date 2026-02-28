"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const blogPosts = [
  {
    slug: "stoicism-modern-life",
    title: "What Marcus Aurelius Can Teach You About Managing a Startup",
    excerpt: "The Roman Emperor faced plague, war, and political betrayal - yet his daily journal entries reveal a mindset framework that modern entrepreneurs can use to thrive under pressure.",
    author: "Mentor.ai Team",
    tags: ["Stoicism", "Business", "Philosophy"],
    published_at: "2026-02-15",
    readTime: "8 min",
    featured: true,
  },
  {
    slug: "mentor-circle-guide",
    title: "How to Use Mentor Circle: Getting 5 Perspectives on One Problem",
    excerpt: "The most powerful feature in Mentor.ai explained. Learn how to craft the perfect question and select the right combination of mentors for breakthrough insights.",
    author: "Mentor.ai Team",
    tags: ["Guide", "Product", "Strategy"],
    published_at: "2026-02-10",
    readTime: "6 min",
    featured: false,
  },
  {
    slug: "cleopatra-negotiation",
    title: "Cleopatra's 5 Negotiation Principles That Still Work Today",
    excerpt: "The Pharaoh who held Rome in balance wasn't just charismatic - she was a strategic genius who spoke 9 languages and understood power dynamics at a molecular level.",
    author: "Mentor.ai Team",
    tags: ["Leadership", "Negotiation", "History"],
    published_at: "2026-02-05",
    readTime: "7 min",
    featured: false,
  },
  {
    slug: "daily-wisdom-habit",
    title: "The 5-Minute Morning Wisdom Habit That Changed My Year",
    excerpt: "How one user's commitment to Daily Wisdom transformed their decision-making, relationships, and sense of purpose over 365 days.",
    author: "Sarah Chen",
    tags: ["Habits", "Personal Growth", "Testimonial"],
    published_at: "2026-01-28",
    readTime: "5 min",
    featured: false,
  },
  {
    slug: "einstein-problem-solving",
    title: "Einstein's Thought Experiment Method: A Step-by-Step Guide",
    excerpt: "The technique that led to the theory of relativity can help you solve business problems, creative blocks, and personal dilemmas. Here is how.",
    author: "Mentor.ai Team",
    tags: ["Science", "Problem-Solving", "Creativity"],
    published_at: "2026-01-20",
    readTime: "9 min",
    featured: false,
  },
  {
    slug: "vulnerability-leadership",
    title: "Brene Brown vs. Machiavelli: The Great Leadership Debate",
    excerpt: "We asked our AI versions of Brene Brown and Machiavelli the same leadership question. Their answers reveal a surprising convergence.",
    author: "Mentor.ai Team",
    tags: ["Leadership", "Psychology", "Strategy"],
    published_at: "2026-01-15",
    readTime: "10 min",
    featured: false,
  },
];

export default function BlogPage() {
  const user = useStore((s) => s.user);
  const isApp = !!user;
  const featured = blogPosts.find((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className={cn(isApp && "lg:ml-64 pt-14 lg:pt-0")}>
        <div className={cn("max-w-5xl mx-auto px-4 sm:px-6", isApp ? "py-6 sm:py-8" : "py-16 sm:py-24 pt-24")}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-brand-text">Wisdom Blog</h1>
            <p className="text-brand-text-muted mt-2">Insights, guides, and stories from the world of AI mentorship</p>
          </motion.div>

          {/* Featured */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Link href={`/blog/${featured.slug}`}>
                <Card className="mb-8 overflow-hidden group cursor-pointer hover:border-brand-accent/30 transition-all">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gradient-to-br from-brand-accent/20 to-purple-900/30 flex items-center justify-center">
                      <span className="text-6xl opacity-30">📜</span>
                    </div>
                    <div className="p-6">
                      <Badge variant="gold" className="mb-3">Featured</Badge>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-text group-hover:text-brand-accent-light transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-brand-text-muted mt-2 leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-brand-text-muted">
                        <span>{featured.author}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                        <span>{new Date(featured.published_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full group cursor-pointer hover:border-brand-accent/30 transition-all">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                      <h3 className="text-base font-heading font-semibold text-brand-text group-hover:text-brand-accent-light transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-brand-text-muted line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border text-xs text-brand-text-muted">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        {!isApp && <Footer />}
      </main>
    </div>
  );
}
