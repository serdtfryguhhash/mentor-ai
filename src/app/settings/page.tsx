"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, CreditCard, Shield, Save, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [wisdomTime, setWisdomTime] = useState(user?.daily_wisdom_time || "08:00");

  const handleSave = () => {
    if (user) {
      setUser({ ...user, full_name: name, email, daily_wisdom_time: wisdomTime });
      toast.success("Settings saved!");
    }
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">Settings</h1>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-brand-text-muted mb-1.5 block">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-brand-text-muted mb-1.5 block">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Daily Wisdom */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Daily Wisdom</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-brand-text-muted mb-1.5 block">Delivery Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-text-muted" />
                    <Input type="time" value={wisdomTime} onChange={(e) => setWisdomTime(e.target.value)} className="w-40" />
                  </div>
                  <p className="text-xs text-brand-text-muted mt-1">A new piece of wisdom will be ready for you each day at this time.</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><CreditCard className="w-4 h-4" /> Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-brand-background border border-brand-border">
                  <div>
                    <p className="text-sm font-medium text-brand-text capitalize">{user?.subscription_tier || "Free"} Plan</p>
                    <p className="text-xs text-brand-text-muted">
                      {user?.subscription_tier === "free" ? "Upgrade for unlimited access" : "Your subscription is active"}
                    </p>
                  </div>
                  <Badge variant={user?.subscription_tier === "free" ? "secondary" : "gold"} className="capitalize">
                    {user?.subscription_tier || "Free"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => toast.success("Redirecting to billing portal...")}>
                    Manage Billing
                  </Button>
                  {user?.subscription_tier === "free" && (
                    <Button size="sm" onClick={() => toast.success("Redirecting to checkout...")}>
                      Upgrade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy & Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-brand-text-muted mb-3">
                  Your conversations are private and encrypted. We do not share your data with third parties.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success("Data export initiated. Check your email.")}>
                    Export My Data
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => toast.error("Please contact support to delete your account.")}>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
