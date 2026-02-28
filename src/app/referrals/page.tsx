"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, DollarSign, Users, TrendingUp, Gift, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import toast from "react-hot-toast";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://mentor.ai/ref/YOUR_CODE_HERE";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">Affiliate Program</h1>
                <p className="text-brand-text-muted text-sm">Earn 20% recurring commission on every referral</p>
              </div>
              <Badge variant="gold" className="ml-auto"><Crown className="w-3 h-3 mr-1" /> Executive</Badge>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Referrals", value: "0", icon: Users, color: "from-blue-500 to-cyan-600" },
              { label: "Active Subs", value: "0", icon: Check, color: "from-green-500 to-emerald-600" },
              { label: "Monthly Earnings", value: "$0.00", icon: DollarSign, color: "from-amber-500 to-orange-600" },
              { label: "Total Earned", value: "$0.00", icon: TrendingUp, color: "from-purple-500 to-violet-600" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xl font-bold text-brand-text">{stat.value}</p>
                    <p className="text-xs text-brand-text-muted">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Referral Link */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Your Referral Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="font-mono text-sm" />
                <Button onClick={copyLink} variant={copied ? "default" : "outline"}>
                  {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-brand-text-muted mt-2">Share this link. When someone subscribes through it, you earn 20% of their subscription fee every month, for as long as they remain subscribed.</p>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { step: "1", title: "Share Your Link", desc: "Send your unique referral link to friends, colleagues, or your audience." },
                  { step: "2", title: "They Subscribe", desc: "When someone signs up for Mentee ($12.99) or Executive ($29.99) through your link." },
                  { step: "3", title: "You Earn 20%", desc: "You receive 20% recurring commission every month. $2.60 or $6.00 per referral, forever." },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 text-brand-accent font-bold flex items-center justify-center mx-auto mb-3 text-lg">
                      {item.step}
                    </div>
                    <h3 className="text-sm font-heading font-semibold text-brand-text mb-1">{item.title}</h3>
                    <p className="text-xs text-brand-text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Merch */}
          <Card className="mt-6 border-brand-accent/30 bg-gradient-to-br from-brand-accent/5 to-purple-900/10">
            <CardContent className="p-6 text-center">
              <Gift className="w-10 h-10 text-brand-accent mx-auto mb-3" />
              <h3 className="text-lg font-heading font-semibold text-brand-text mb-2">
                &ldquo;What Would [Mentor] Do?&rdquo; Merch
              </h3>
              <p className="text-sm text-brand-text-muted mb-4">
                Coming soon: Premium merchandise featuring your favorite mentor&apos;s wisdom. T-shirts, mugs, notebooks, and more.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Marcus Aurelius", "Cleopatra", "Einstein", "Maya Angelou", "Sun Tzu"].map((name) => (
                  <Badge key={name} variant="outline" className="text-xs">WWMD? - {name}</Badge>
                ))}
              </div>
              <Button variant="outline" className="mt-4" onClick={() => toast.success("You will be notified when merch launches!")}>
                Notify Me When Available
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
