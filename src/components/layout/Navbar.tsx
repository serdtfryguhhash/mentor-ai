"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Menu, X, BookOpen, Users, Compass, Brain,
  Settings, LogOut, Crown, LayoutDashboard, MessageCircle,
  Lightbulb, Sun, CreditCard, Share2, Target, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { StreakBadge } from "@/components/shared/StreakBadge";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mentors", label: "Mentors", icon: Users },
  { href: "/quiz", label: "Find My Mentor", icon: Target },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/circle", label: "Circle", icon: Brain, premium: true },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/daily", label: "Daily Wisdom", icon: Sun },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const user = useStore((s) => s.user);

  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-background/80 backdrop-blur-xl border-b border-brand-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-brand-text">
                Mentor<span className="text-brand-accent">.ai</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/mentors" className="text-brand-text-muted hover:text-brand-text transition-colors text-sm">
                Mentors
              </Link>
              <Link href="/pricing" className="text-brand-text-muted hover:text-brand-text transition-colors text-sm">
                Pricing
              </Link>
              <Link href="/blog" className="text-brand-text-muted hover:text-brand-text transition-colors text-sm">
                Blog
              </Link>
              <StreakBadge />
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Start Free</Button>
              </Link>
            </div>

            <button className="md:hidden text-brand-text" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-surface border-t border-brand-border"
            >
              <div className="px-4 py-4 space-y-3">
                <Link href="/mentors" className="block text-brand-text-muted hover:text-brand-text py-2">Mentors</Link>
                <Link href="/pricing" className="block text-brand-text-muted hover:text-brand-text py-2">Pricing</Link>
                <Link href="/blog" className="block text-brand-text-muted hover:text-brand-text py-2">Blog</Link>
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="flex-1"><Button variant="outline" className="w-full">Log In</Button></Link>
                  <Link href="/signup" className="flex-1"><Button className="w-full">Start Free</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-brand-surface border-r border-brand-border flex-col z-40">
        <div className="p-4 border-b border-brand-border">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-brand-text">
                Mentor<span className="text-brand-accent">.ai</span>
              </span>
            </Link>
            <StreakBadge />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-brand-accent/20 text-brand-accent-light font-medium"
                    : "text-brand-text-muted hover:text-brand-text hover:bg-brand-background"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
                {link.premium && (
                  <Crown className="w-3.5 h-3.5 text-amber-400 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 space-y-1 border-t border-brand-border">
          <Link
            href="/pricing"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              pathname === "/pricing"
                ? "bg-brand-accent/20 text-brand-accent-light font-medium"
                : "text-brand-text-muted hover:text-brand-text hover:bg-brand-background"
            )}
          >
            <CreditCard className="w-5 h-5" />
            <span>Pricing</span>
          </Link>
          <Link
            href="/referrals"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              pathname === "/referrals"
                ? "bg-brand-accent/20 text-brand-accent-light font-medium"
                : "text-brand-text-muted hover:text-brand-text hover:bg-brand-background"
            )}
          >
            <Share2 className="w-5 h-5" />
            <span>Referrals</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              pathname === "/settings"
                ? "bg-brand-accent/20 text-brand-accent-light font-medium"
                : "text-brand-text-muted hover:text-brand-text hover:bg-brand-background"
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>

        <div className="p-3 border-t border-brand-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center text-white text-xs font-bold">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-text truncate">{user?.full_name || "Demo User"}</p>
              <p className="text-xs text-brand-text-muted capitalize">{user?.subscription_tier || "free"} plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-surface/95 backdrop-blur-xl border-b border-brand-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-brand-text">
              Mentor<span className="text-brand-accent">.ai</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <StreakBadge />
            <button className="text-brand-text p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-brand-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 h-14 border-b border-brand-border">
                <span className="text-lg font-heading font-bold text-brand-text">Menu</span>
                <button className="text-brand-text p-2" onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all",
                      pathname.startsWith(link.href)
                        ? "bg-brand-accent/20 text-brand-accent-light font-medium"
                        : "text-brand-text-muted hover:text-brand-text"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                    {link.premium && <Crown className="w-4 h-4 text-amber-400 ml-auto" />}
                  </Link>
                ))}
                <div className="border-t border-brand-border my-3" />
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-brand-text-muted hover:text-brand-text">
                  <CreditCard className="w-5 h-5" /><span>Pricing</span>
                </Link>
                <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-brand-text-muted hover:text-brand-text">
                  <Settings className="w-5 h-5" /><span>Settings</span>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
