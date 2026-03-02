"use client";

export interface MentorExplored {
  mentorId: string;
  visitedAt: string;
  count: number;
}

export function getMentorsExplored(): MentorExplored[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("mentor-ai-explored");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function trackMentorExplored(mentorId: string) {
  if (typeof window === "undefined") return;
  const explored = getMentorsExplored();
  const existing = explored.find((e) => e.mentorId === mentorId);
  if (existing) {
    existing.count += 1;
    existing.visitedAt = new Date().toISOString();
  } else {
    explored.push({
      mentorId,
      visitedAt: new Date().toISOString(),
      count: 1,
    });
  }
  localStorage.setItem("mentor-ai-explored", JSON.stringify(explored));
}
