"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials, generateId } from "@/lib/utils";
import { Mentor, ChatMessage } from "@/types";
import { useStore } from "@/store/useStore";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  mentor: Mentor;
  sessionId: string;
}

export default function ChatInterface({ mentor, sessionId }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sessions, addMessage, addInsight } = useStore();

  const session = sessions.find((s) => s.id === sessionId);
  const messages = session?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateMentorResponse = async (userMessage: string) => {
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000));

    const responses = getContextualResponse(mentor, userMessage);
    const response = responses[Math.floor(Math.random() * responses.length)];

    addMessage(sessionId, {
      id: generateId(),
      role: "mentor",
      content: response,
      timestamp: new Date().toISOString(),
    });

    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");

    addMessage(sessionId, {
      id: generateId(),
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    });

    await simulateMentorResponse(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const saveInsight = (message: ChatMessage) => {
    addInsight({
      user_id: "demo",
      mentor_id: mentor.id,
      session_id: sessionId,
      content: message.content,
      reflection: null,
      tags: mentor.specialties.slice(0, 3),
    });
  };

  return (
    <div className="flex flex-col h-full bg-brand-background">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-brand-surface border-b border-brand-border">
        <Avatar size="md">
          <AvatarFallback style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}>
            {getInitials(mentor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-brand-text text-sm">{mentor.name}</h3>
          <p className="text-xs text-brand-text-muted">{mentor.title}</p>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          AI Simulation
        </Badge>
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-2 bg-brand-accent/5 border-b border-brand-accent/20">
        <p className="text-[10px] text-brand-accent-light text-center">
          AI simulation for educational purposes. This is not the actual person. Responses are generated based on historical writings and philosophy.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {message.role === "mentor" ? (
                <Avatar size="sm" className="shrink-0 mt-1">
                  <AvatarFallback
                    className="text-xs"
                    style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                  >
                    {getInitials(mentor.name)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-surface-light flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-brand-text-muted" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 relative group",
                  message.role === "user"
                    ? "bg-brand-accent text-white rounded-tr-sm"
                    : "bg-brand-surface border border-brand-border rounded-tl-sm"
                )}
              >
                <div className={cn(
                  "text-sm leading-relaxed prose prose-sm max-w-none",
                  message.role === "user" ? "text-white prose-invert" : "text-brand-text"
                )}>
                  {message.role === "mentor" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        em: ({ children }) => <em className="font-serif text-brand-accent-light">{children}</em>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>

                {message.role === "mentor" && (
                  <button
                    onClick={() => saveInsight(message)}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-surface border border-brand-border rounded-full p-1.5 shadow-lg hover:bg-brand-accent/20"
                    title="Save to Insights"
                  >
                    <Bookmark className="w-3 h-3 text-brand-accent-light" />
                  </button>
                )}

                <p className={cn(
                  "text-[10px] mt-1",
                  message.role === "user" ? "text-white/60 text-right" : "text-brand-text-muted"
                )}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <Avatar size="sm" className="shrink-0 mt-1">
              <AvatarFallback
                className="text-xs"
                style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
              >
                {getInitials(mentor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-brand-surface border border-brand-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <motion.div
                  className="w-2 h-2 rounded-full bg-brand-text-muted"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-brand-text-muted"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-brand-text-muted"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-brand-surface border-t border-brand-border">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${mentor.name.split(" ")[0]} anything...`}
              className="min-h-[44px] max-h-[120px] py-3 pr-12 resize-none bg-brand-background"
              rows={1}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-[44px] w-[44px] shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getContextualResponse(mentor: Mentor, userMessage: string): string[] {
  const lower = userMessage.toLowerCase();


  const baseResponses = [
    `${mentor.philosophy}\n\nLet me share something from my experience that relates to what you've described. ${mentor.famousQuotes[0]} This is not merely a saying - it is a principle I have lived by, often through great difficulty.\n\nTell me more about what brings this question to your mind. What is the deeper concern beneath your words?`,

    `Ah, this touches on something I have thought deeply about. ${mentor.famousQuotes[1]}\n\nIn my time, I faced a similar challenge. The answer I found was not what I expected - it required me to look inward before looking outward. What have you already tried? And more importantly, what are you afraid to try?`,

    `You raise a question that goes to the heart of what it means to live well. Let me respond with something that may seem indirect but is, I believe, precisely what you need to hear.\n\n*${mentor.famousQuotes[2]}*\n\nNow, let me challenge you: are you asking me this question because you genuinely do not know the answer, or because you know the answer but are hoping I will give you a different one?`,

    `I appreciate the depth of your question. In my experience - and I have had a great deal of it, in circumstances both triumphant and devastating - the answer to questions like yours lies not in what to *do* but in who to *become*.\n\n${mentor.philosophy}\n\nWhat would the best version of yourself do in this situation? You already know. The question is whether you have the courage to do it.`,
  ];

  if (lower.includes("afraid") || lower.includes("fear") || lower.includes("scared") || lower.includes("anxious")) {
    return [
      `Fear. Yes, I know it well. ${mentor.famousQuotes[0]}\n\nLet me tell you something about fear that I learned through my own struggles: fear is not the enemy. Fear is information. It tells you where the growth is. The question is not how to eliminate fear, but whether you will let it be your guide or your prison.\n\nWhat specifically are you afraid of? Name it precisely. Fear loses much of its power when you look at it directly.`,

      `You speak of fear, and I will not dismiss it - I have felt it keenly in my own life. But I will tell you what I have learned: *${mentor.famousQuotes[2]}*\n\nThe fear you feel is often a sign that you are approaching something important. What would you do tomorrow if this fear suddenly vanished? Start there - not by conquering the fear, but by acting alongside it.`,
    ];
  }

  if (lower.includes("purpose") || lower.includes("meaning") || lower.includes("lost") || lower.includes("direction")) {
    return [
      `The search for purpose - this is perhaps the most important question a human being can ask. And I will tell you something that may surprise you: the answer is not found through thinking alone. It is found through *engagement with life*.\n\n${mentor.philosophy}\n\nPurpose reveals itself not to those who sit and wait for a sign, but to those who act, reflect, and then act again. What activities cause you to lose track of time? What injustice makes your blood boil? What would you do if no one were watching? The answers to these questions are your compass.`,

      `*${mentor.famousQuotes[1]}*\n\nI have found that purpose is not a destination but a practice. It is not something you discover once and hold forever - it is something you cultivate daily through attention and courage.\n\nTell me: when in your life have you felt most alive? Most yourself? What were you doing, and why did you stop?`,
    ];
  }

  if (lower.includes("relationship") || lower.includes("love") || lower.includes("partner") || lower.includes("friend")) {
    return [
      `Relationships - they are both the source of our greatest joy and our deepest pain, are they not? In my experience, the quality of our relationships mirrors the quality of our relationship with ourselves.\n\n*${mentor.famousQuotes[0]}*\n\nBefore we discuss the other person, tell me: what are you bringing to this relationship? Not what you think you should bring, but what you honestly are bringing - including the parts you would rather not acknowledge.`,

      `The challenge of human connection is that it requires us to be vulnerable, and vulnerability feels like danger. But ${mentor.philosophy.toLowerCase()}\n\nWhat I have learned is this: the relationships that transform us are the ones where we allow ourselves to be truly seen. Not the polished version. Not the carefully curated self. The real one.\n\nWhat are you hiding from this person, and what would happen if you stopped?`,
    ];
  }

  if (lower.includes("work") || lower.includes("career") || lower.includes("job") || lower.includes("business")) {
    return [
      `Work and vocation - let me share something I believe deeply: *${mentor.famousQuotes[1]}*\n\nThe question is not merely what work you should do, but what work will allow you to become who you are meant to be. Too many people choose their work based on what others expect, what pays well, or what feels safe. True vocation lies at the intersection of what you love, what you are good at, what the world needs, and what you can be sustained by.\n\nWhich of these four elements is missing in your current situation?`,

      `${mentor.philosophy}\n\nI have seen too many people sacrifice their deepest calling at the altar of security or approval. And I have also seen people pursue passion without practical wisdom and suffer for it.\n\nThe path forward requires both courage and strategy. Tell me more about what you are considering, and let us think about it together with clear eyes and a brave heart.`,
    ];
  }

  return baseResponses;
}
