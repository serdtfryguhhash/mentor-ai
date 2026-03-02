"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, ChevronDown, ChevronUp, Check, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/store/useStore";
import { mentors } from "@/data/mentors";
import { getInitials, generateId, formatDate } from "@/lib/utils";
import { GoalCategory, GoalMilestone } from "@/types";

const GOAL_CATEGORIES: GoalCategory[] = [
  "Career",
  "Personal Growth",
  "Health",
  "Learning",
  "Relationships",
];

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  Career: "from-purple-500 to-violet-600",
  "Personal Growth": "from-blue-500 to-cyan-600",
  Health: "from-emerald-500 to-green-600",
  Learning: "from-amber-500 to-orange-600",
  Relationships: "from-pink-500 to-rose-600",
};

export default function MentorGoals() {
  const { mentorGoals, addMentorGoal, updateGoalProgress, toggleGoalMilestone, completeGoal, removeGoal } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategory>("Career");
  const [mentorId, setMentorId] = useState(mentors[0]?.id || "");
  const [milestoneInputs, setMilestoneInputs] = useState<string[]>([""]);

  const activeGoals = mentorGoals.filter((g) => !g.completed);
  const completedGoals = mentorGoals.filter((g) => g.completed);

  const handleAdd = () => {
    if (!title.trim()) return;
    const milestones: GoalMilestone[] = milestoneInputs
      .filter((m) => m.trim())
      .map((m) => ({ id: generateId(), title: m.trim(), completed: false }));

    addMentorGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      mentorId,
      progress: 0,
      milestones,
    });

    setTitle("");
    setDescription("");
    setCategory("Career");
    setMilestoneInputs([""]);
    setShowAdd(false);
  };

  const addMilestoneInput = () => {
    setMilestoneInputs((prev) => [...prev, ""]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-accent" />
            Goal Accountability
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{activeGoals.length} active</Badge>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
              <Plus className="w-4 h-4 mr-1" /> New Goal
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Goal Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-4 space-y-3"
            >
              <Input
                placeholder="Goal title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
              <div className="flex flex-wrap gap-1.5">
                {GOAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      category === cat
                        ? "bg-brand-accent/20 text-brand-accent-light"
                        : "bg-brand-background text-brand-text-muted hover:text-brand-text"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs text-brand-text-muted mb-1 block">Link to mentor</label>
                <select
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text"
                >
                  {mentors.slice(0, 30).map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-brand-text-muted mb-1 block">Milestones (optional)</label>
                {milestoneInputs.map((val, i) => (
                  <Input
                    key={i}
                    placeholder={`Milestone ${i + 1}...`}
                    value={val}
                    onChange={(e) => {
                      const copy = [...milestoneInputs];
                      copy[i] = e.target.value;
                      setMilestoneInputs(copy);
                    }}
                    className="mb-1.5"
                  />
                ))}
                <button onClick={addMilestoneInput} className="text-xs text-brand-accent hover:underline">
                  + Add milestone
                </button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd} disabled={!title.trim()}>Create Goal</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Goals */}
        {activeGoals.length === 0 && !showAdd ? (
          <div className="text-center py-8">
            <Target className="w-8 h-8 text-brand-text-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm text-brand-text-muted">No active goals. Set one to track your growth!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeGoals.map((goal, i) => {
              const mentor = mentors.find((m) => m.id === goal.mentorId);
              const isExpanded = expandedGoal === goal.id;
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ease: [0.4, 0, 0.2, 1] as const }}
                  className="rounded-xl border border-brand-border bg-brand-background p-4"
                >
                  <div className="flex items-start gap-3">
                    {mentor && (
                      <Avatar size="sm" className="shrink-0 mt-0.5">
                        <AvatarFallback
                          className="text-[9px]"
                          style={{ background: `linear-gradient(135deg, ${mentor.accentColor}, ${mentor.accentColor}88)` }}
                        >
                          {getInitials(mentor.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-brand-text">{goal.title}</p>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] bg-gradient-to-r ${CATEGORY_COLORS[goal.category]} text-white border-0`}
                          >
                            {goal.category}
                          </Badge>
                          <button
                            onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                            className="p-1 text-brand-text-muted hover:text-brand-text"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-brand-surface rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-brand-accent to-purple-600"
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-brand-text">{goal.progress}%</span>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-2"
                          >
                            {goal.description && (
                              <p className="text-xs text-brand-text-muted">{goal.description}</p>
                            )}

                            {/* Progress slider */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-brand-text-muted">Progress:</span>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={goal.progress}
                                onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                                className="flex-1 accent-brand-accent h-1"
                              />
                            </div>

                            {/* Milestones */}
                            {goal.milestones.length > 0 && (
                              <div className="space-y-1">
                                {goal.milestones.map((m) => (
                                  <button
                                    key={m.id}
                                    onClick={() => toggleGoalMilestone(goal.id, m.id)}
                                    className="flex items-center gap-2 w-full text-left"
                                  >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                      m.completed
                                        ? "bg-brand-accent border-brand-accent"
                                        : "border-brand-border"
                                    }`}>
                                      {m.completed && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <span className={`text-xs ${m.completed ? "text-brand-text-muted line-through" : "text-brand-text"}`}>
                                      {m.title}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => completeGoal(goal.id)}
                              >
                                <Check className="w-3 h-3 mr-1" /> Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeGoal(goal.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3 mr-1" /> Remove
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="pt-2 border-t border-brand-border">
            <p className="text-xs text-brand-text-muted mb-2">Completed ({completedGoals.length})</p>
            <div className="space-y-1.5">
              {completedGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex items-center gap-2 text-brand-text-muted">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs line-through">{goal.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
