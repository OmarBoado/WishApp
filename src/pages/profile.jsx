import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LogOut, Star, Target, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryEmojis = {
  career: "💼", health: "💪", travel: "✈️", finance: "💰",
  personal: "🌟", education: "📚", relationships: "❤️", creativity: "🎨",
};

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: wishes = [] } = useQuery({
    queryKey: ["wishes"],
    queryFn: () => base44.entities.Wish.list("-created_date"),
  });

  const total = wishes.length;
  const completed = wishes.filter((w) => w.status === "completed").length;
  const active = wishes.filter((w) => w.status === "active").length;
  const avgProgress = total > 0
    ? Math.round(wishes.reduce((sum, w) => sum + (w.progress || 0), 0) / total)
    : 0;

  // Category breakdown
  const catBreakdown = {};
  wishes.forEach((w) => {
    catBreakdown[w.category] = (catBreakdown[w.category] || 0) + 1;
  });
  const sortedCats = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="px-5 pt-14 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground">Profile</h1>
      </motion.div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 border border-border/50 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">👋</span>
        </div>
        <h2 className="font-heading text-xl font-bold">
          {user?.full_name || "Dreamer"}
        </h2>
        <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Star, label: "Total Wishes", value: total, color: "text-primary" },
          { icon: Target, label: "Active", value: active, color: "text-accent" },
          { icon: Trophy, label: "Completed", value: completed, color: "text-secondary-foreground" },
          { icon: TrendingUp, label: "Avg Progress", value: `${avgProgress}%`, color: "text-primary" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-4 border border-border/50"
            >
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-heading font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Category Breakdown */}
      {sortedCats.length > 0 && (
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <h3 className="text-sm font-semibold mb-4">Wish Categories</h3>
          <div className="space-y-3">
            {sortedCats.map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{categoryEmojis[cat] || "✨"}</span>
                  <span className="text-sm font-medium capitalize">{cat}</span>
                </div>
 
