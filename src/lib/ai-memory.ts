/**
 * Mentor Memory — Accumulates per-mentor memory across sessions.
 * Tracks past conversation summaries, goals discussed, challenges, and advice given.
 * This memory is injected into AI context so mentors reference past conversations.
 */

import { Session, ChatMessage } from "@/types";

export interface MentorMemory {
  mentorId: string;
  summaries: string[];
  goalsDiscussed: string[];
  challengesMentioned: string[];
  adviceGiven: string[];
  lastSessionDate: string;
  totalSessions: number;
}

/**
 * Build memory for a specific mentor from all past sessions.
 * Extracts key themes from conversation history.
 */
export function buildMentorMemory(
  mentorId: string,
  sessions: Session[]
): MentorMemory {
  const mentorSessions = sessions
    .filter((s) => s.mentor_id === mentorId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (mentorSessions.length === 0) {
    return {
      mentorId,
      summaries: [],
      goalsDiscussed: [],
      challengesMentioned: [],
      adviceGiven: [],
      lastSessionDate: "",
      totalSessions: 0,
    };
  }

  const summaries: string[] = [];
  const goalsDiscussed: string[] = [];
  const challengesMentioned: string[] = [];
  const adviceGiven: string[] = [];

  for (const session of mentorSessions.slice(-5)) {
    const userMessages = session.messages.filter((m) => m.role === "user");
    const mentorMessages = session.messages.filter((m) => m.role === "mentor");

    if (userMessages.length > 0) {
      const topicSummary = userMessages
        .map((m) => m.content)
        .join(" ")
        .substring(0, 200);
      summaries.push(topicSummary);
    }

    for (const msg of userMessages) {
      const lower = msg.content.toLowerCase();
      if (lower.includes("goal") || lower.includes("want to") || lower.includes("trying to") || lower.includes("plan to")) {
        goalsDiscussed.push(msg.content.substring(0, 150));
      }
      if (lower.includes("struggle") || lower.includes("challenge") || lower.includes("difficult") || lower.includes("problem") || lower.includes("stuck")) {
        challengesMentioned.push(msg.content.substring(0, 150));
      }
    }

    for (const msg of mentorMessages) {
      if (msg.content.length > 100) {
        adviceGiven.push(msg.content.substring(0, 200));
      }
    }
  }

  return {
    mentorId,
    summaries: summaries.slice(-5),
    goalsDiscussed: goalsDiscussed.slice(-5),
    challengesMentioned: challengesMentioned.slice(-5),
    adviceGiven: adviceGiven.slice(-3),
    lastSessionDate: mentorSessions[mentorSessions.length - 1].updated_at,
    totalSessions: mentorSessions.length,
  };
}

/**
 * Format mentor memory as context string for injection into the AI system prompt.
 */
export function formatMemoryForPrompt(memory: MentorMemory): string {
  if (memory.totalSessions === 0) return "";

  const parts: string[] = [
    `\n\nMENTOR MEMORY — Previous interactions with this mentee (${memory.totalSessions} sessions):`,
  ];

  if (memory.lastSessionDate) {
    parts.push(`Last session: ${new Date(memory.lastSessionDate).toLocaleDateString()}`);
  }

  if (memory.summaries.length > 0) {
    parts.push(`\nPast conversation topics:\n${memory.summaries.map((s, i) => `- Session ${i + 1}: ${s}`).join("\n")}`);
  }

  if (memory.goalsDiscussed.length > 0) {
    parts.push(`\nGoals the mentee has discussed:\n${memory.goalsDiscussed.map((g) => `- ${g}`).join("\n")}`);
  }

  if (memory.challengesMentioned.length > 0) {
    parts.push(`\nChallenges the mentee has mentioned:\n${memory.challengesMentioned.map((c) => `- ${c}`).join("\n")}`);
  }

  parts.push(`\nIMPORTANT: Reference previous conversations naturally. For example: "Last time we discussed...", "You mentioned wanting to...", "How has your progress been with...". This builds trust and continuity.`);

  return parts.join("\n");
}

/**
 * Format active goals as context for the AI prompt.
 */
export function formatGoalsForPrompt(
  goals: Array<{ title: string; category: string; progress: number; mentorId: string }>,
  mentorId: string
): string {
  const mentorGoals = goals.filter((g) => g.mentorId === mentorId && g.progress < 100);
  if (mentorGoals.length === 0) return "";

  return `\n\nACTIVE GOALS the mentee is working on with you:\n${mentorGoals.map((g) => `- ${g.title} (${g.category}, ${g.progress}% complete)`).join("\n")}\n\nFollow up on these goals naturally. Ask about progress, offer encouragement, and suggest next steps.`;
}
