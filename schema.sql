-- Mentor.ai Database Schema for Supabase (PostgreSQL)

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'mentee', 'executive')),
  stripe_customer_id TEXT,
  daily_wisdom_time TIME DEFAULT '08:00',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  goals TEXT[] DEFAULT '{}',
  recommended_mentors TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id TEXT NOT NULL,
  title TEXT,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mentor Circles
CREATE TABLE public.mentor_circles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  mentor_ids TEXT[] NOT NULL,
  responses JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insights
CREATE TABLE public.insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id TEXT NOT NULL,
  session_id UUID REFERENCES public.sessions(id),
  content TEXT NOT NULL,
  reflection TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Wisdom
CREATE TABLE public.daily_wisdom (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('quote', 'challenge', 'thought')),
  date DATE DEFAULT CURRENT_DATE UNIQUE
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'mentee', 'executive')),
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  commission_rate DECIMAL DEFAULT 0.20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Mentor.ai Team',
  mentor_id TEXT,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscriptions
CREATE TABLE public.newsletter_subs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own sessions" ON public.sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own circles" ON public.mentor_circles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own insights" ON public.insights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);

-- Blog posts are public
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog posts are public" ON public.blog_posts FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_sessions_user ON public.sessions(user_id);
CREATE INDEX idx_sessions_mentor ON public.sessions(mentor_id);
CREATE INDEX idx_insights_user ON public.insights(user_id);
CREATE INDEX idx_insights_mentor ON public.insights(mentor_id);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
