"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ChatInterface from "@/components/chat/ChatInterface";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { Button } from "@/components/ui/button";

export default function SessionPage({ params }: { params: { id: string } }) {
  const { sessions } = useStore();
  const session = sessions.find((s) => s.id === params.id);
  const mentor = session ? mentors.find((m) => m.id === session.mentor_id) : null;

  if (!session || !mentor) {
    return (
      <div className="min-h-screen bg-brand-background">
        <Navbar />
        <main className="lg:ml-64 pt-14 lg:pt-0 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-brand-text text-xl font-heading">Session not found</p>
            <p className="text-brand-text-muted mt-2">This session may have expired or been removed.</p>
            <Link href="/mentors"><Button variant="outline" className="mt-4">Browse Mentors</Button></Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0 h-screen flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-brand-border bg-brand-surface">
          <Link href={`/mentors/${mentor.slug}`} className="text-brand-text-muted hover:text-brand-text">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs text-brand-text-muted">Session with {mentor.name}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface mentor={mentor} sessionId={session.id} />
        </div>
      </main>
    </div>
  );
}
