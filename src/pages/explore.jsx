import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Flame, Clock, CheckCircle2 } from "lucide-react";
import WishCard from "@/components/wishes/WishCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Explore() {
  const { data: wishes = [], isLoading } = useQuery({
    queryKey: ["wishes"],
    queryFn: () => base44.entities.Wish.list("-created_date"),
  });

  const activeWishes = wishes.filter((w) => w.status === "active");
  const completedWishes = wishes.filter((w) => w.status === "completed");
  const pausedWishes = wishes.filter((w) => w.status === "paused");

  // Sort by progress (highest first)
  const nearCompletion = [...activeWishes].sort((a, b) => (b.progress || 0) - (a.progress || 0));

  return (
    <div className="px-5 pt-14 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground">Explore</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all your wishes</p>
      </motion.div>

      <Tabs defaultValue="active">
        <TabsList className="w-full bg-muted/50 rounded-2xl p-1 h-auto">
          <TabsTrigger value="active" className="flex-1 rounded-xl data-[state=active]:bg-card gap-1.5 py-2.5">
            <Flame className="w-4 h-4" />
            Active ({activeWishes.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 rounded-xl data-[state=active]:bg-card gap-1.5 py-2.5">
            <Trophy className="w-4 h-4" />
            Done ({completedWishes.length})
          </TabsTrigger>
          <TabsTrigger value="paused" className="flex-1 rounded-xl data-[state=active]:bg-card gap-1.5 py-2.5">
            <Clock className="w-4 h-4" />
            Paused ({pausedWishes.length})
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="active" className="mt-6 space-y-3">
              {nearCompletion.length === 0 ? (
                <EmptyTab icon={Flame} text="No active wishes yet" />
              ) : (
                nearCompletion.map((wish, i) => (
                  <WishCard key={wish.id} wish={wish} index={i} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6 space-y-3">
              {completedWishes.length === 0 ? (
                <EmptyTab icon={Trophy} text="No completed wishes yet" />
              ) : (
                completedWishes.map((wish, i) => (
                  <WishCard key={wish.id} wish={wish} index={i} />
                ))
              )}
            </TabsContent>

            <TabsContent value="paused" className="mt-6 space-y-3">
              {pausedWishes.length === 0 ? (
                <EmptyTab icon={Clock} text="No paused wishes" />
              ) : (
                pausedWishes.map((wish, i) => (
                  <WishCard key={wish.id} wish={wish} index={i} />
                ))
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

function EmptyTab({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center py-16 text-muted-foreground">
      <Icon className="w-8 h-8 mb-3 opacity-40" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
