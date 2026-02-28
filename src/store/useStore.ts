import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatMessage, Insight, Session, MentorCircle, OnboardingAnswers, DailyWisdom } from "@/types";
import { generateId } from "@/lib/utils";
import { mentors } from "@/data/mentors";

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

      addInsight: (insight) =>
        set((state) => ({
          insights: [
            { ...insight, id: generateId(), created_at: new Date().toISOString() },
            ...state.insights,
          ],
        })),

      updateInsightReflection: (insightId, reflection) =>
        set((state) => ({
          insights: state.insights.map((i) =>
            i.id === insightId ? { ...i, reflection } : i
          ),
        })),

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

      setDailyWisdom: (wisdom) => set({ dailyWisdom: wisdom }),

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
      }),
    }
  )
);
