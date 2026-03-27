import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Trash2, Check, Pause, Play } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import confetti from "canvas-confetti";

const categoryLabels = {
  career: "Career", health: "Health", travel: "Travel",
  finance: "Finance", personal: "Personal", education: "Education",
  relationships: "Relationships", creativity: "Creativity",
};

export default function WishDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const wishId = window.location.pathname.split("/wish/")[1];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newProgress, setNewProgress] = useState(null);
  const [notes, setNotes] = useState("");

  const { data: wish, isLoading } = useQuery({
    queryKey: ["wish", wishId],
    queryFn: async () => {
      const wishes = await base44.entities.Wish.filter({ id: wishId });
      return wishes[0];
    },
    enabled: !!wishId,
    onSuccess: (data) => {
      if (data) {
        setNotes(data.notes || "");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Wish.update(wishId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wish", wishId] });
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Wish.delete(wishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      navigate("/");
    },
  });

  const handleComplete = () => {
    updateMutation.mutate({ status: "completed", progress: 100 });
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#a855f7", "#f59e0b", "#ec4899"],
    });
  };

  const handleTogglePause = () => {
    updateMutation.mutate({
      status: wish.status === "paused" ? "active" : "paused",
    });
  };

  const handleProgressSave = () => {
    const val = newProgress !== null ? newProgress : (wish?.progress || 0);
    if (val === 100) {
      handleComplete();
    } else {
      updateMutation.mutate({ progress: val, notes });
    }
    setNewProgress(null);
  };

  if (isLoading) {
    return (
 
