/**
 * Mentee XP & Levels — Gamification system for Mentor AI.
 * XP is earned through various actions, levels unlock based on cumulative XP.
 */

export type XPAction =
  | "session"
  | "journal_reflection"
  | "daily_wisdom"
  | "circle_discussion"
  | "quiz"
  | "daily_visit"
  | "save_insight"
  | "set_goal"
  | "daily_reflection";

export const XP_VALUES: Record<XPAction, number> = {
  session: 30,
  journal_reflection: 15,
  daily_wisdom: 10,
  circle_discussion: 50,
  quiz: 20,
  daily_visit: 10,
  save_insight: 5,
  set_goal: 10,
  daily_reflection: 15,
};

export interface Level {
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  gradient: string;
  icon: string;
}

export const LEVELS: Level[] = [
  { name: "Seeker", minXP: 0, maxXP: 199, color: "#94A3B8", gradient: "from-slate-400 to-slate-600", icon: "🔍" },
  { name: "Learner", minXP: 200, maxXP: 599, color: "#3B82F6", gradient: "from-blue-400 to-blue-600", icon: "📖" },
  { name: "Apprentice", minXP: 600, maxXP: 1499, color: "#A855F7", gradient: "from-purple-400 to-purple-600", icon: "⚡" },
  { name: "Adept", minXP: 1500, maxXP: 3999, color: "#F59E0B", gradient: "from-amber-400 to-amber-600", icon: "🌟" },
  { name: "Master", minXP: 4000, maxXP: Infinity, color: "#EF4444", gradient: "from-red-400 to-red-600", icon: "👑" },
];

export function getLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevel(xp);
  const idx = LEVELS.indexOf(current);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(xp: number): number {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const progressInLevel = xp - current.minXP;
  const levelRange = next.minXP - current.minXP;
  return Math.min(100, Math.round((progressInLevel / levelRange) * 100));
}

export function getXPToNextLevel(xp: number): number {
  const next = getNextLevel(xp);
  if (!next) return 0;
  return next.minXP - xp;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "streak-7", title: "7-Day Streak", description: "Maintained a 7-day session streak", icon: "🔥", condition: "streak_7" },
  { id: "streak-30", title: "30-Day Streak", description: "Maintained a 30-day session streak", icon: "💫", condition: "streak_30" },
  { id: "sessions-100", title: "100 Sessions", description: "Completed 100 mentoring sessions", icon: "🏆", condition: "sessions_100" },
  { id: "mentors-10", title: "10 Mentors Explored", description: "Had sessions with 10 different mentors", icon: "🧭", condition: "mentors_10" },
  { id: "first-insight", title: "First Insight", description: "Saved your first insight", icon: "💡", condition: "insights_1" },
  { id: "wisdom-keeper", title: "Wisdom Keeper", description: "Saved 25 insights", icon: "📚", condition: "insights_25" },
  { id: "circle-master", title: "Circle Master", description: "Completed 5 mentor circle discussions", icon: "🧠", condition: "circles_5" },
  { id: "goal-setter", title: "Goal Setter", description: "Set your first goal", icon: "🎯", condition: "goals_1" },
  { id: "reflective-mind", title: "Reflective Mind", description: "Completed 10 daily reflections", icon: "🪞", condition: "reflections_10" },
  { id: "level-apprentice", title: "Apprentice Level", description: "Reached Apprentice level", icon: "⚡", condition: "level_apprentice" },
  { id: "level-master", title: "Master Level", description: "Reached Master level", icon: "👑", condition: "level_master" },
];

export function checkAchievements(stats: {
  sessionStreak: number;
  totalSessions: number;
  uniqueMentors: number;
  totalInsights: number;
  totalCircles: number;
  totalGoals: number;
  totalReflections: number;
  xp: number;
}, unlockedIds: string[]): Achievement[] {
  const newAchievements: Achievement[] = [];

  const conditions: Record<string, boolean> = {
    streak_7: stats.sessionStreak >= 7,
    streak_30: stats.sessionStreak >= 30,
    sessions_100: stats.totalSessions >= 100,
    mentors_10: stats.uniqueMentors >= 10,
    insights_1: stats.totalInsights >= 1,
    insights_25: stats.totalInsights >= 25,
    circles_5: stats.totalCircles >= 5,
    goals_1: stats.totalGoals >= 1,
    reflections_10: stats.totalReflections >= 10,
    level_apprentice: getLevel(stats.xp).name === "Apprentice" || getLevel(stats.xp).name === "Adept" || getLevel(stats.xp).name === "Master",
    level_master: getLevel(stats.xp).name === "Master",
  };

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedIds.includes(achievement.id) && conditions[achievement.condition]) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}
