import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Business: "💼",
    Philosophy: "🧠",
    Science: "🔬",
    Art: "🎨",
    Leadership: "👑",
    Spirituality: "✨",
    Modern: "⚡",
  };
  return icons[category] || "📚";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Business: "from-emerald-500 to-emerald-700",
    Philosophy: "from-purple-500 to-purple-700",
    Science: "from-blue-500 to-blue-700",
    Art: "from-pink-500 to-pink-700",
    Leadership: "from-amber-500 to-amber-700",
    Spirituality: "from-teal-500 to-teal-700",
    Modern: "from-red-500 to-red-700",
  };
  return colors[category] || "from-gray-500 to-gray-700";
}
