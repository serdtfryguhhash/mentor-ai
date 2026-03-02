import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ChatMessage,
  Insight,
  Session,
  MentorCircle,
  OnboardingAnswers,
  DailyWisdom,
  WisdomEntry,
  WisdomTag,
  GrowthAssessment,
  GrowthDimension,
  MentorGoal,
  GoalCategory,
  GoalMilestone,
  DailyReflection,
  WeeklyReport,
  SavedComparison,
  XPEvent,
} from "@/types";
import { generateId } from "@/lib/utils";
import { mentors } from "@/data/mentors";
import { XP_VALUES, XPAction, checkAchievements, Achievement } from "@/lib/gamification";
import { calculateOverallScore } from "@/lib/growth-score";

interface AppState {
  user: {
    id: string;
    email: string;
    full_name: string;
    subscription_tier: "free" | "mentee" | "executive";
    onboarding_completed: boolean;
    goals: string[];
    recommended_mentors: string[];
    daily_wisdom_time: string;
  } | null;
  sessions: Session[];
  insights: Insight[];
  circles: MentorCircle[];
  dailyWisdom: DailyWisdom | null;
  favoriteMentors: string[];
  sidebarOpen: boolean;

  // New feature state
  wisdomCollection: WisdomEntry[];
  growthAssessments: GrowthAssessment[];
  xp: number;
  xpHistory: XPEvent[];
  unlockedAchievements: string[];
  pendingAchievements: Achievement[];
  sessionStreak: number;
  lastSessionDate: string;
  mentorGoals: MentorGoal[];
  savedComparisons: SavedComparison[];
  weeklyReports: WeeklyReport[];
  dailyReflections: DailyReflection[];

  // Existing actions
  setUser: (user: AppState["user"]) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleFavoriteMentor: (mentorId: string) => void;

  createSession: (mentorId: string) => Session;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  getSessions: (mentorId?: string) => Session[];

  addInsight: (insight: Omit<Insight, "id" | "created_at">) => void;
  updateInsightReflection: (insightId: string, reflection: string) => void;

  createCircle: (question: string, mentorIds: string[]) => MentorCircle;
  addCircleResponse: (circleId: string, mentorId: string, response: string) => void;

  setDailyWisdom: (wisdom: DailyWisdom) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;

  // New feature actions
  addWisdom: (entry: Omit<WisdomEntry, "id" | "created_at">) => void;
  removeWisdom: (id: string) => void;

  addGrowthAssessment: (scores: Record<GrowthDimension, number>) => void;

  addXP: (action: XPAction) => void;
  dismissAchievement: () => void;

  updateSessionStreak: () => void;

  addMentorGoal: (goal: Omit<MentorGoal, "id" | "created_at" | "updated_at" | "completed" | "milestones"> & { milestones?: GoalMilestone[] }) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  completeGoal: (goalId: string) => void;
  removeGoal: (goalId: string) => void;

  saveComparison: (comparison: Omit<SavedComparison, "id" | "created_at">) => void;

  addWeeklyReport: (report: Omit<WeeklyReport, "id" | "created_at">) => void;

  addDailyReflection: (reflection: Omit<DailyReflection, "id" | "created_at">) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      sessions: [],
      insights: [],
      circles: [],
      dailyWisdom: null,
      favoriteMentors: [],
      sidebarOpen: true,

      // New feature initial state
      wisdomCollection: [],
      growthAssessments: [],
      xp: 0,
      xpHistory: [],
      unlockedAchievements: [],
      pendingAchievements: [],
      sessionStreak: 0,
      lastSessionDate: "",
      mentorGoals: [],
      savedComparisons: [],
      weeklyReports: [],
      dailyReflections: [],

      // Existing actions
      setUser: (user) => set({ user }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleFavoriteMentor: (mentorId) =>
        set((state) => ({
          favoriteMentors: state.favoriteMentors.includes(mentorId)
            ? state.favoriteMentors.filter((id) => id !== mentorId)
            : [...state.favoriteMentors, mentorId],
        })),

      createSession: (mentorId) => {
        const mentor = mentors.find((m) => m.id === mentorId);
        const session: Session = {
          id: generateId(),
          user_id: get().user?.id || "demo",
          mentor_id: mentorId,
          title: `Session with ${mentor?.name || "Mentor"}`,
          messages: [
            {
              id: generateId(),
              role: "mentor",
              content: mentor?.greeting || "Welcome. How can I help you today?",
              timestamp: new Date().toISOString(),
            },
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ sessions: [session, ...state.sessions] }));

        // Award XP for session and update streak
        get().addXP("session");
        get().updateSessionStreak();

        return session;
      },

      addMessage: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, message], updated_at: new Date().toISOString() }
              : s
          ),
        })),

      getSessions: (mentorId) => {
        const sessions = get().sessions;
        return mentorId ? sessions.filter((s) => s.mentor_id === mentorId) : sessions;
      },

      addInsight: (insight) => {
        set((state) => ({
          insights: [
            { ...insight, id: generateId(), created_at: new Date().toISOString() },
            ...state.insights,
          ],
        }));
        get().addXP("save_insight");
      },

      updateInsightReflection: (insightId, reflection) => {
        set((state) => ({
          insights: state.insights.map((i) =>
            i.id === insightId ? { ...i, reflection } : i
          ),
        }));
        get().addXP("journal_reflection");
      },

      createCircle: (question, mentorIds) => {
        const circle: MentorCircle = {
          id: generateId(),
          user_id: get().user?.id || "demo",
          question,
          mentor_ids: mentorIds,
          responses: [],
          created_at: new Date().toISOString(),
        };
        set((state) => ({ circles: [circle, ...state.circles] }));
        get().addXP("circle_discussion");
        return circle;
      },

      addCircleResponse: (circleId, mentorId, response) =>
        set((state) => ({
          circles: state.circles.map((c) =>
            c.id === circleId
              ? {
                  ...c,
                  responses: [
                    ...c.responses,
                    { mentor_id: mentorId, response, timestamp: new Date().toISOString() },
                  ],
                }
              : c
          ),
        })),

      setDailyWisdom: (wisdom) => {
        set({ dailyWisdom: wisdom });
        get().addXP("daily_wisdom");
      },

      completeOnboarding: (answers) => {
        const recommended = mentors
          .filter((m) => answers.interests.includes(m.category))
          .slice(0, 5)
          .map((m) => m.id);

        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                onboarding_completed: true,
                goals: answers.goals,
                recommended_mentors: recommended,
              }
            : null,
        }));
      },

      // ====== New Feature Actions ======

      addWisdom: (entry) =>
        set((state) => ({
          wisdomCollection: [
            { ...entry, id: generateId(), created_at: new Date().toISOString() },
            ...state.wisdomCollection,
          ],
        })),

      removeWisdom: (id) =>
        set((state) => ({
          wisdomCollection: state.wisdomCollection.filter((w) => w.id !== id),
        })),

      addGrowthAssessment: (scores) =>
        set((state) => ({
          growthAssessments: [
            ...state.growthAssessments,
            {
              id: generateId(),
              date: new Date().toISOString(),
              scores,
              overallScore: calculateOverallScore(scores),
            },
          ],
        })),

      addXP: (action) => {
        const xpAmount = XP_VALUES[action] || 0;
        if (xpAmount === 0) return;

        set((state) => {
          const newXP = state.xp + xpAmount;
          const newHistory = [
            ...state.xpHistory,
            { id: generateId(), action, xp: xpAmount, timestamp: new Date().toISOString() },
          ].slice(-100);

          // Check for new achievements
          const stats = {
            sessionStreak: state.sessionStreak,
            totalSessions: state.sessions.length,
            uniqueMentors: new Set(state.sessions.map((s) => s.mentor_id)).size,
            totalInsights: state.insights.length,
            totalCircles: state.circles.length,
            totalGoals: state.mentorGoals.length,
            totalReflections: state.dailyReflections.length,
            xp: newXP,
          };

          const newAchievements = checkAchievements(stats, state.unlockedAchievements);
          const newUnlocked = [
            ...state.unlockedAchievements,
            ...newAchievements.map((a) => a.id),
          ];

          return {
            xp: newXP,
            xpHistory: newHistory,
            unlockedAchievements: newUnlocked,
            pendingAchievements: newAchievements.length > 0
              ? [...state.pendingAchievements, ...newAchievements]
              : state.pendingAchievements,
          };
        });
      },

      dismissAchievement: () =>
        set((state) => ({
          pendingAchievements: state.pendingAchievements.slice(1),
        })),

      updateSessionStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          if (state.lastSessionDate === today) return {};

          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          const newStreak = state.lastSessionDate === yesterday
            ? state.sessionStreak + 1
            : state.lastSessionDate === today
            ? state.sessionStreak
            : 1;

          return {
            sessionStreak: newStreak,
            lastSessionDate: today,
          };
        });
      },

      addMentorGoal: (goal) => {
        set((state) => ({
          mentorGoals: [
            ...state.mentorGoals,
            {
              ...goal,
              id: generateId(),
              milestones: goal.milestones || [],
              completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
        }));
        get().addXP("set_goal");
      },

      updateGoalProgress: (goalId, progress) =>
        set((state) => ({
          mentorGoals: state.mentorGoals.map((g) =>
            g.id === goalId
              ? { ...g, progress: Math.min(100, Math.max(0, progress)), updated_at: new Date().toISOString() }
              : g
          ),
        })),

      toggleGoalMilestone: (goalId, milestoneId) =>
        set((state) => ({
          mentorGoals: state.mentorGoals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: g.milestones.map((m) =>
                    m.id === milestoneId ? { ...m, completed: !m.completed } : m
                  ),
                  updated_at: new Date().toISOString(),
                }
              : g
          ),
        })),

      completeGoal: (goalId) =>
        set((state) => ({
          mentorGoals: state.mentorGoals.map((g) =>
            g.id === goalId
              ? { ...g, completed: true, progress: 100, updated_at: new Date().toISOString() }
              : g
          ),
        })),

      removeGoal: (goalId) =>
        set((state) => ({
          mentorGoals: state.mentorGoals.filter((g) => g.id !== goalId),
        })),

      saveComparison: (comparison) =>
        set((state) => ({
          savedComparisons: [
            { ...comparison, id: generateId(), created_at: new Date().toISOString() },
            ...state.savedComparisons,
          ],
        })),

      addWeeklyReport: (report) =>
        set((state) => ({
          weeklyReports: [
            { ...report, id: generateId(), created_at: new Date().toISOString() },
            ...state.weeklyReports,
          ],
        })),

      addDailyReflection: (reflection) => {
        set((state) => ({
          dailyReflections: [
            { ...reflection, id: generateId(), created_at: new Date().toISOString() },
            ...state.dailyReflections,
          ],
        }));
        get().addXP("daily_reflection");
      },
    }),
    {
      name: "mentor-ai-store",
      partialize: (state) => ({
        user: state.user,
        sessions: state.sessions,
        insights: state.insights,
        circles: state.circles,
        dailyWisdom: state.dailyWisdom,
        favoriteMentors: state.favoriteMentors,
        wisdomCollection: state.wisdomCollection,
        growthAssessments: state.growthAssessments,
        xp: state.xp,
        xpHistory: state.xpHistory,
        unlockedAchievements: state.unlockedAchievements,
        sessionStreak: state.sessionStreak,
        lastSessionDate: state.lastSessionDate,
        mentorGoals: state.mentorGoals,
        savedComparisons: state.savedComparisons,
        weeklyReports: state.weeklyReports,
        dailyReflections: state.dailyReflections,
      }),
    }
  )
);
