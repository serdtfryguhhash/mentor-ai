import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export const PRICING_TIERS = [
  {
    name: "Free",
    price: 0,
    interval: "forever",
    description: "Explore the world of AI mentorship",
    features: [
      "Access to 5 mentor personas",
      "3 sessions per month",
      "Basic chat interface",
      "Daily wisdom quotes",
      "Community access",
    ],
    highlighted: false,
    stripePriceId: "",
    tier: "free" as const,
  },
  {
    name: "Mentee",
    price: 12.99,
    interval: "month",
    description: "Unlock the full mentorship experience",
    features: [
      "Access to all 200+ mentor personas",
      "Unlimited sessions",
      "Premium chat interface with memory",
      "Insight Journal with AI summaries",
      "Daily wisdom with custom timing",
      "Export insights as PDF",
      "Priority response speed",
      "Email support",
    ],
    highlighted: true,
    stripePriceId: process.env.STRIPE_MENTEE_PRICE_ID || "price_mentee",
    tier: "mentee" as const,
  },
  {
    name: "Executive",
    price: 29.99,
    interval: "month",
    description: "The ultimate mentorship suite for leaders",
    features: [
      "Everything in Mentee, plus:",
      "Mentor Circle (multi-mentor responses)",
      "Select 3-5 mentors for side-by-side wisdom",
      "Weekly AI-powered insight summaries",
      "Advanced persona customization",
      "Merch discounts",
      "Affiliate program access (20% recurring)",
      "1-on-1 onboarding call",
      "Priority support",
    ],
    highlighted: false,
    stripePriceId: process.env.STRIPE_EXECUTIVE_PRICE_ID || "price_executive",
    tier: "executive" as const,
  },
];
