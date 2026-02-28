import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mentor.ai - AI Mentorship from History's Greatest Minds",
  description: "Learn from 200+ AI-powered mentors including Marcus Aurelius, Cleopatra, Einstein, and more. Premium mentorship sessions, Mentor Circle, and Daily Wisdom.",
  keywords: "AI mentorship, historical figures, wisdom, coaching, personal development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-brand-background text-brand-text antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E293B",
              color: "#F1F5F9",
              border: "1px solid #334155",
            },
          }}
        />
      </body>
    </html>
  );
}
