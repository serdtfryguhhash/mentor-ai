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

    try {
      // Build conversation history from existing messages for context
      const conversationHistory = messages.map((m) => ({
        role: m.role === "mentor" ? "assistant" : m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mentor-chat",
          mentorName: mentor.name,
          mentorSystemPrompt: mentor.systemPrompt,
          message: userMessage,
          conversationHistory,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.response) {
        throw new Error(data.error || "Failed to get response");
      }

      addMessage(sessionId, {
        id: generateId(),
        role: "mentor",
        content: data.response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("AI chat error:", error);
      addMessage(sessionId, {
        id: generateId(),
        role: "mentor",
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
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

