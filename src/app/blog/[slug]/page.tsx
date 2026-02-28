"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const articleContent = `
## The Emperor's Morning Routine

Every morning, before the demands of empire pressed upon him, Marcus Aurelius sat down with his journal. Not to plan his day or list his tasks - but to remind himself of the principles that would guide his decisions.

"When you arise in the morning," he wrote, "think of what a privilege it is to be alive, to think, to enjoy, to love."

This was not idle philosophy. This was a man governing an empire during a pandemic (the Antonine Plague killed millions), defending borders against constant invasion, and managing a political system rife with corruption.

## The Dichotomy of Control

The most powerful framework Marcus used was what Stoics call the **dichotomy of control** - distinguishing between what is "up to us" and what is not.

In startup terms:
- **Up to you**: Your product quality, your team culture, your response to setbacks, your ethics
- **Not up to you**: Market conditions, competitor actions, investor decisions, viral moments

Marcus would say: pour all your energy into the first category. Accept the second with equanimity.

> "You have power over your mind - not outside events. Realize this, and you will find strength."

## The Obstacle Is the Way

Perhaps Marcus's most famous insight for entrepreneurs: every obstacle contains within it the seed of an equal or greater opportunity.

When his generals failed him, he learned to be a better judge of character. When plague struck Rome, he reformed public health. When his co-emperor proved unreliable, he developed greater self-reliance.

The modern startup equivalent: your biggest challenges - the failed launch, the lost customer, the technical debt - are precisely where your competitive advantage will be forged.

## Practical Applications

1. **Start each day with a journal entry** - Not tasks, but principles. What kind of leader will you be today?
2. **Identify your "not up to me" list** - Stop spending energy on things you cannot control
3. **Reframe obstacles as opportunities** - Ask "what skill is this forcing me to develop?"
4. **Practice negative visualization** - Imagine losing what you have to appreciate it more deeply
5. **End each day with reflection** - What did you do well? Where did you fall short? What will you do differently?

## The Bottom Line

Marcus Aurelius ran the most powerful organization in the ancient world during its most challenging period. His management philosophy - focus on what you control, find opportunity in obstacles, lead by example, reflect daily - is more relevant now than ever.

The difference between a good founder and a great one is not strategy or talent. It is the quality of their thinking under pressure. And no one thought better under pressure than Marcus Aurelius.

---

*Want to discuss these ideas with Marcus Aurelius directly? Start a mentoring session and explore how Stoic principles apply to your specific challenges.*
`;

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const user = useStore((s) => s.user);
  const isApp = !!user;

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className={cn(isApp && "lg:ml-64 pt-14 lg:pt-0")}>
        <div className={cn("max-w-3xl mx-auto px-4 sm:px-6", isApp ? "py-6 sm:py-8" : "py-16 sm:py-24 pt-24")}>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-brand-text-muted hover:text-brand-text mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge variant="secondary">Stoicism</Badge>
              <Badge variant="secondary">Business</Badge>
              <Badge variant="secondary">Philosophy</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-brand-text leading-tight">
              What Marcus Aurelius Can Teach You About Managing a Startup
            </h1>

            <div className="flex items-center gap-4 mt-4 mb-8 text-sm text-brand-text-muted">
              <span>Mentor.ai Team</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 8 min read</span>
              <span>Feb 15, 2026</span>
            </div>

            <div className="prose prose-invert prose-sm max-w-none">
              {articleContent.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-heading font-bold text-brand-text mt-8 mb-4">{line.replace("## ", "")}</h2>;
                }
                if (line.startsWith("> ")) {
                  return (
                    <blockquote key={i} className="border-l-2 border-brand-accent pl-4 my-4 italic text-brand-accent-light font-serif">
                      {line.replace("> ", "")}
                    </blockquote>
                  );
                }
                if (line.startsWith("---")) {
                  return <hr key={i} className="border-brand-border my-8" />;
                }
                if (line.startsWith("*") && line.endsWith("*")) {
                  return <p key={i} className="text-sm text-brand-text-muted italic my-4">{line.replace(/\*/g, "")}</p>;
                }
                if (line.match(/^\d\./)) {
                  return <p key={i} className="text-sm text-brand-text leading-relaxed ml-4 my-1">{line}</p>;
                }
                if (line.match(/^- \*\*/)) {
                  return <p key={i} className="text-sm text-brand-text leading-relaxed ml-4 my-1">{line.replace(/\*\*/g, "")}</p>;
                }
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="text-sm text-brand-text-muted leading-relaxed my-3">{line.replace(/\*\*/g, "")}</p>;
              })}
            </div>

            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-brand-border">
              <Button variant="outline" size="sm"><Share2 className="w-3.5 h-3.5 mr-1.5" /> Share</Button>
              <Button variant="outline" size="sm"><BookmarkPlus className="w-3.5 h-3.5 mr-1.5" /> Save</Button>
              <Link href="/mentors/marcus-aurelius" className="ml-auto">
                <Button size="sm">Talk to Marcus Aurelius</Button>
              </Link>
            </div>
          </motion.article>
        </div>
        {!isApp && <Footer />}
      </main>
    </div>
  );
}
