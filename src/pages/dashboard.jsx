import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import StatsHeader from "@/components/wishes/StatsHeader";
import CategoryFilter from "@/components/wishes/CategoryFilter";
import WishCard from "@/components/wishes/WishCard";
import EmptyState from "@/components/wishes/EmptyState";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: wishes = [], isLoading } = useQuery({
    queryKey: ["wishes"],
    queryFn: () => base44.entities.Wish.list("-created_date"),
  });

  const filtered = activeCategory === "all"
    ? wishes
    : wishes.filter((w) => w.category === activeCategory);

  return (
    <div className="px-5 pt-14 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-muted-foreground font-medium">Welcome back</p>
        <h1 className="font-heading text-3xl font-bold text-foreground mt-1">
          My Wishes
        </h1>
      </motion.div>

      {/* Stats */}
      {!isLoading && wishes.length > 0 && <StatsHeader wishes={wishes} />}

      {/* Category Filter */}
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      {/* Wish List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((wish, i) => (
            <WishCard key={wish.id} wish={wish} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
