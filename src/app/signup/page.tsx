"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    setUser({
      id: "new-user-" + Date.now(),
      email,
      full_name: name,
      subscription_tier: "free",
      onboarding_completed: false,
      goals: [],
      recommended_mentors: [],
      daily_wisdom_time: "08:00",
    });

    toast.success("Account created! Let's find your mentors.");
    router.push("/onboarding");
    setLoading(false);
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 hero-mesh">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-brand-text">
              Mentor<span className="text-brand-accent">.ai</span>
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-brand-text">Begin Your Journey</h1>
          <p className="text-brand-text-muted mt-1">200+ mentors are ready to guide you</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-brand-text-muted mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div>
              <label className="text-sm text-brand-text-muted mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div>
              <label className="text-sm text-brand-text-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((level) => (
                    <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength >= level ? (level === 1 ? "bg-red-500" : level === 2 ? "bg-yellow-500" : "bg-emerald-500") : "bg-brand-border"}`} />
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating account..." : "Create Free Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            {["Access to 5 mentor personas", "3 sessions per month", "Daily wisdom quotes"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-brand-text-muted">
                <Check className="w-3.5 h-3.5 text-brand-accent" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-brand-surface px-2 text-brand-text-muted">or sign up with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => { toast.success("Welcome!"); router.push("/onboarding"); }}>Google</Button>
            <Button variant="outline" onClick={() => { toast.success("Welcome!"); router.push("/onboarding"); }}>GitHub</Button>
          </div>
        </div>

        <p className="text-center text-sm text-brand-text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-accent hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
