"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import {
  GROWTH_DIMENSIONS,
  DIMENSION_COLORS,
  DIMENSION_ICONS,
  GrowthDimension,
  generatePentagonPoints,
  getGrowthTrend,
} from "@/lib/growth-score";
import { generateId } from "@/lib/utils";

export default function GrowthRadar() {
  const { growthAssessments, addGrowthAssessment } = useStore();
  const [showAssess, setShowAssess] = useState(false);
  const [scores, setScores] = useState<Record<GrowthDimension, number>>({
    Career: 5,
    Personal: 5,
    Health: 5,
    Relationships: 5,
    Finance: 5,
  });

  const latestAssessment = growthAssessments[growthAssessments.length - 1];
  const trends = getGrowthTrend(growthAssessments);
  const displayScores = latestAssessment?.scores || scores;

  const handleSubmit = () => {
    addGrowthAssessment(scores);
    setShowAssess(false);
  };

  const updateScore = (dim: GrowthDimension, value: number) => {
    setScores((prev) => ({ ...prev, [dim]: Math.min(10, Math.max(1, value)) }));
  };

  // SVG Radar Chart
  const cx = 150;
  const cy = 150;
  const maxR = 120;

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;

  const dataPoints = GROWTH_DIMENSIONS.map((dim, i) => {
    const angle = startAngle + i * angleStep;
    const score = (displayScores[dim] || 0) / 10;
    const r = maxR * score;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (maxR + 20) * Math.cos(angle),
      labelY: cy + (maxR + 20) * Math.sin(angle),
      dim,
    };
  });

  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-accent" />
            Growth Radar
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowAssess(!showAssess)}>
            {showAssess ? "Cancel" : latestAssessment ? "Update" : "Self-Assess"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAssess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-sm text-brand-text-muted">Rate yourself 1-10 in each dimension:</p>
            {GROWTH_DIMENSIONS.map((dim) => (
              <div key={dim} className="flex items-center gap-3">
                <span className="text-lg">{DIMENSION_ICONS[dim]}</span>
                <span className="text-sm text-brand-text w-28">{dim}</span>
                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => updateScore(dim, scores[dim] - 1)}
                    className="w-7 h-7 rounded-lg bg-brand-background hover:bg-brand-surface-light flex items-center justify-center text-brand-text-muted"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex-1 h-2 bg-brand-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: DIMENSION_COLORS[dim] }}
                      animate={{ width: `${scores[dim] * 10}%` }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
                    />
                  </div>
                  <button
                    onClick={() => updateScore(dim, scores[dim] + 1)}
                    className="w-7 h-7 rounded-lg bg-brand-background hover:bg-brand-surface-light flex items-center justify-center text-brand-text-muted"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold text-brand-text w-6 text-right">{scores[dim]}</span>
                </div>
              </div>
            ))}
            <Button onClick={handleSubmit} className="w-full">Save Assessment</Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* SVG Radar */}
            <div className="flex justify-center">
              <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                {/* Grid lines */}
                {gridLevels.map((scale) => (
                  <polygon
                    key={scale}
                    points={generatePentagonPoints(cx, cy, maxR * scale)}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="0.5"
                    opacity={0.4}
                  />
                ))}

                {/* Axis lines */}
                {GROWTH_DIMENSIONS.map((_, i) => {
                  const angle = startAngle + i * angleStep;
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={cx + maxR * Math.cos(angle)}
                      y2={cy + maxR * Math.sin(angle)}
                      stroke="#475569"
                      strokeWidth="0.5"
                      opacity={0.3}
                    />
                  );
                })}

                {/* Data area */}
                <motion.polygon
                  points={dataPath}
                  fill="rgba(168, 85, 247, 0.15)"
                  stroke="#A855F7"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
                />

                {/* Data points */}
                {dataPoints.map((p, i) => (
                  <motion.circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill={DIMENSION_COLORS[p.dim]}
                    stroke="white"
                    strokeWidth="1.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
                  />
                ))}

                {/* Labels */}
                {dataPoints.map((p, i) => (
                  <text
                    key={`label-${i}`}
                    x={p.labelX}
                    y={p.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[11px] fill-brand-text-muted font-medium"
                  >
                    {DIMENSION_ICONS[p.dim]} {p.dim}
                  </text>
                ))}
              </svg>
            </div>

            {/* Dimension scores */}
            <div className="grid grid-cols-5 gap-2">
              {GROWTH_DIMENSIONS.map((dim) => {
                const trend = trends.find((t) => t.dimension === dim);
                return (
                  <div key={dim} className="text-center">
                    <p className="text-lg font-bold text-brand-text">{displayScores[dim] || 0}</p>
                    <p className="text-[10px] text-brand-text-muted">{dim}</p>
                    {trend && trend.change !== 0 && (
                      <div className={`flex items-center justify-center gap-0.5 mt-0.5 ${trend.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {trend.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="text-[10px]">{Math.abs(trend.change)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall score */}
            {latestAssessment && (
              <div className="text-center pt-2 border-t border-brand-border">
                <p className="text-sm text-brand-text-muted">
                  Overall Growth Score: <span className="font-bold text-brand-accent-light">{latestAssessment.overallScore}/10</span>
                </p>
                <p className="text-[10px] text-brand-text-muted mt-0.5">
                  {growthAssessments.length} assessment{growthAssessments.length !== 1 ? "s" : ""} completed
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
