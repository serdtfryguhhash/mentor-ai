/**
 * Growth Score — Composite growth scoring system across 5 dimensions.
 * Career, Personal, Health, Relationships, Finance.
 */

export type GrowthDimension = "Career" | "Personal" | "Health" | "Relationships" | "Finance";

export const GROWTH_DIMENSIONS: GrowthDimension[] = [
  "Career",
  "Personal",
  "Health",
  "Relationships",
  "Finance",
];

export const DIMENSION_COLORS: Record<GrowthDimension, string> = {
  Career: "#A855F7",
  Personal: "#3B82F6",
  Health: "#10B981",
  Relationships: "#EC4899",
  Finance: "#F59E0B",
};

export const DIMENSION_ICONS: Record<GrowthDimension, string> = {
  Career: "💼",
  Personal: "🧠",
  Health: "💪",
  Relationships: "❤️",
  Finance: "💰",
};

export interface GrowthAssessment {
  id: string;
  date: string;
  scores: Record<GrowthDimension, number>;
  overallScore: number;
}

export function calculateOverallScore(scores: Record<GrowthDimension, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

export function getGrowthTrend(
  assessments: GrowthAssessment[]
): { dimension: GrowthDimension; trend: "up" | "down" | "stable"; change: number }[] {
  if (assessments.length < 2) {
    return GROWTH_DIMENSIONS.map((d) => ({ dimension: d, trend: "stable" as const, change: 0 }));
  }

  const latest = assessments[assessments.length - 1];
  const previous = assessments[assessments.length - 2];

  return GROWTH_DIMENSIONS.map((dimension) => {
    const change = latest.scores[dimension] - previous.scores[dimension];
    const trend = change > 0 ? "up" : change < 0 ? "down" : "stable";
    return { dimension, trend: trend as "up" | "down" | "stable", change };
  });
}

/**
 * Generate radar chart points for SVG pentagon.
 */
export function generateRadarPoints(
  scores: Record<GrowthDimension, number>,
  centerX: number,
  centerY: number,
  radius: number
): { x: number; y: number; dimension: GrowthDimension }[] {
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;

  return GROWTH_DIMENSIONS.map((dim, i) => {
    const angle = startAngle + i * angleStep;
    const score = (scores[dim] || 0) / 10;
    const r = radius * score;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      dimension: dim,
    };
  });
}

export function generatePentagonPoints(
  centerX: number,
  centerY: number,
  radius: number
): string {
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;
  const points = Array.from({ length: 5 }, (_, i) => {
    const angle = startAngle + i * angleStep;
    return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
  });
  return points.join(" ");
}
