"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-brand-text">
                Mentor<span className="text-brand-accent">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-brand-text-muted leading-relaxed">
              AI mentorship from history&apos;s greatest minds. Learn from the wisdom of ages, powered by modern AI.
            </p>
            <p className="text-xs text-brand-text-muted mt-4 italic">
              AI simulation for educational purposes. Not the actual person.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-brand-text mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/mentors" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Browse Mentors</Link></li>
              <li><Link href="/circle" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Mentor Circle</Link></li>
              <li><Link href="/pricing" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Pricing</Link></li>
              <li><Link href="/daily" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Daily Wisdom</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-brand-text mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Blog</Link></li>
              <li><Link href="/referrals" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Affiliate Program</Link></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-brand-text mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Cookie Policy</a></li>
              <li><a href="mailto:support@mentor-ai.com" className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-text-muted">
            &copy; {new Date().getFullYear()} Mentor.ai. All rights reserved.
          </p>
          <p className="text-xs text-brand-text-muted">
            Built with wisdom from the ages.
          </p>
        </div>
      </div>
    </footer>
  );
}
