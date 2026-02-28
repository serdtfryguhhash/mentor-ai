"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    setUser({
      id: "demo-user",
      email,
      full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      subscription_tier: "mentee",
      onboarding_completed: true,
      goals: ["personal-growth", "leadership"],
      recommended_mentors: ["marcus-aurelius", "steve-jobs", "maya-angelou"],
      daily_wisdom_time: "08:00",
    });

    toast.success("Welcome back!");
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 hero-mesh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-purple-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-brand-text">
              Mentor<span className="text-brand-accent">.ai</span>
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-brand-text">Welcome Back</h1>
          <p className="text-brand-text-muted mt-1">Your mentors are waiting</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-brand-text-muted mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-brand-text-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-brand-text-muted">
                <input type="checkbox" className="rounded border-brand-border bg-brand-background" />
                Remember me
              </label>
              <a href="#" className="text-sm text-brand-accent hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-brand-surface px-2 text-brand-text-muted">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => {
              setUser({
                id: "demo-google", email: "demo@gmail.com", full_name: "Demo User",
                subscription_tier: "mentee", onboarding_completed: true,
                goals: ["personal-growth"], recommended_mentors: ["marcus-aurelius"],
                daily_wisdom_time: "08:00",
              });
              toast.success("Welcome!");
              router.push("/dashboard");
            }}>
              Google
            </Button>
            <Button variant="outline" onClick={() => {
              setUser({
                id: "demo-github", email: "demo@github.com", full_name: "Demo User",
                subscription_tier: "mentee", onboarding_completed: true,
                goals: ["career"], recommended_mentors: ["steve-jobs"],
                daily_wisdom_time: "08:00",
              });
              toast.success("Welcome!");
              router.push("/dashboard");
            }}>
              GitHub
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-brand-text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-accent hover:underline font-medium">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
