"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

interface ProgressChartsProps {
  weeklyActivity: { day: string; sessions: number; insights: number }[];
  categoryDistribution: { name: string; value: number; color: string }[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-brand-text mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-brand-text-muted">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (!active || !payload || !payload[0]) return null;
  const data = payload[0];
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-brand-text">
        <span
          className="inline-block w-2 h-2 rounded-full mr-1.5"
          style={{ backgroundColor: data.payload.color }}
        />
        {data.name}: {data.value} sessions
      </p>
    </div>
  );
};

const CustomLegend = ({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>;
}) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[11px] text-brand-text-muted">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ProgressCharts({
  weeklyActivity,
  categoryDistribution,
}: ProgressChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Activity Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-accent" />
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyActivity}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(168, 85, 247, 0.05)" }}
                />
                <Bar
                  dataKey="sessions"
                  name="Sessions"
                  fill="#A855F7"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="insights"
                  name="Insights"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#A855F7]" />
              <span className="text-xs text-brand-text-muted">Sessions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
              <span className="text-xs text-brand-text-muted">Insights</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-brand-accent" />
            <CardTitle className="text-lg">Mentor Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
