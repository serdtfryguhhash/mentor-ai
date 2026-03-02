export type MentorCategory =
  | "Business"
  | "Philosophy"
  | "Science"
  | "Art"
  | "Leadership"
  | "Spirituality"
  | "Modern";

export interface Mentor {
  id: string;
  slug: string;
  name: string;
  title: string;
  era: string;
  born: string;
  died: string | null;
  nationality: string;
  category: MentorCategory;
  specialties: string[];
  shortBio: string;
  fullBio: string;
  philosophy: string;
  famousQuotes: string[];
  communicationStyle: string;
  systemPrompt: string;
  avatarUrl: string;
  accentColor: string;
  greeting: string;
  challengeStyle: string;
  bookRecommendations: string[];
  imageDescription: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  subscription_tier: "free" | "mentee" | "executive";
  stripe_customer_id: string | null;
  daily_wisdom_time: string;
  onboarding_completed: boolean;
  goals: string[];
  recommended_mentors: string[];
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  mentor_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "mentor" | "system";
  content: string;
  timestamp: string;
}

export interface MentorCircle {
  id: string;
  user_id: string;
  question: string;
  mentor_ids: string[];
  responses: CircleResponse[];
  created_at: string;
}

export interface CircleResponse {
  mentor_id: string;
  response: string;
  timestamp: string;
}

export interface Insight {
  id: string;
  user_id: string;
  mentor_id: string;
  session_id: string | null;
  content: string;
  reflection: string | null;
  tags: string[];
  created_at: string;
}

export interface DailyWisdom {
  id: string;
  mentor_id: string;
  content: string;
  type: "quote" | "challenge" | "thought";
  date: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: "free" | "mentee" | "executive";
  stripe_subscription_id: string | null;
  status: "active" | "canceled" | "past_due";
  current_period_end: string | null;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_email: string;
  status: "pending" | "completed";
  commission_rate: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  mentor_id: string | null;
  tags: string[];
  published_at: string;
  cover_image: string;
}

export interface NewsletterSub {
  id: string;
  email: string;
  subscribed_at: string;
  status: "active" | "unsubscribed";
}

export interface OnboardingAnswers {
  goals: string[];
  experience: string;
  interests: MentorCategory[];
  challenges: string[];
  preferredStyle: string;
}

export interface PricingTier {
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  highlighted: boolean;
  stripePriceId: string;
  tier: "free" | "mentee" | "executive";
}

// ====== New Feature Types ======

export type WisdomTag = "career" | "relationships" | "health" | "mindset" | "finance" | "leadership" | "creativity" | "spirituality";

export interface WisdomEntry {
  id: string;
  content: string;
  mentorId: string;
  sessionId: string | null;
  tags: WisdomTag[];
  source: "conversation" | "circle" | "manual";
  created_at: string;
}

export type GrowthDimension = "Career" | "Personal" | "Health" | "Relationships" | "Finance";

export interface GrowthAssessment {
  id: string;
  date: string;
  scores: Record<GrowthDimension, number>;
  overallScore: number;
}

export type GoalCategory = "Career" | "Personal Growth" | "Health" | "Learning" | "Relationships";

export interface MentorGoal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  mentorId: string;
  progress: number;
  milestones: GoalMilestone[];
  created_at: string;
  updated_at: string;
  completed: boolean;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface DailyReflection {
  id: string;
  date: string;
  mentorId: string;
  question: string;
  response: string;
  created_at: string;
}

export interface WeeklyReport {
  id: string;
  weekStarting: string;
  content: string;
  sessionsCount: number;
  insightsCount: number;
  goalsProgressed: number;
  created_at: string;
}

export interface SavedComparison {
  id: string;
  question: string;
  mentorResponses: { mentorId: string; response: string }[];
  created_at: string;
}

export interface XPEvent {
  id: string;
  action: string;
  xp: number;
  timestamp: string;
}
