import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmojiPicker from "@/components/wishes/EmojiPicker";

const categories = [
  { value: "career", label: "Career 💼" },
  { value: "health", label: "Health 💪" },
  { value: "travel", label: "Travel ✈️" },
  { value: "finance", label: "Finance 💰" },
  { value: "personal", label: "Personal 🌟" },
  { value: "education", label: "Education 📚" },
  { value: "relationships", label: "Relationships ❤️" },
  { value: "creativity", label: "Creativity 🎨" },
];

export default function AddWish() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "important",
    emoji: "✨",
    target_date: "",
    status: "active",
    progress: 0,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Wish.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-5 pt-14 pb-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-2xl font-bold">Make a Wish</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emoji */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Choose an icon</Label>
            <EmojiPicker selected={form.emoji} onSelect={(v) => updateField("emoji", v)} />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">What's your wish?</Label>
            <Input
              id="title"
              placeholder="e.g., Learn to play guitar"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="rounded-xl h-12 text-base"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="desc" className="text-sm font-medium mb-2 block">Description</Label>
            <Textarea
              id="desc"
              placeholder="Why is this important to you?"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="rounded-xl min-h-[100px] text-base resize-none"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Category</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)} required>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder="Pick one" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => updateField("priority", v)}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dream">🌙 Dream</SelectItem>
                  <SelectItem value="important">⭐ Important</SelectItem>
                  <SelectItem value="essential">🔥 Essential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <Label htmlFor="date" className="text-sm font-medium mb-2 block">Target date</Label>
            <Input
              id="date"
              type="date"
              value={form.target_date}
              onChange={(e) => updateField("target_date", e.target.value)}
              className="rounded-xl h-12"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={createMutation.isPending || !form.title || !form.category}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {createMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              "✨ Make This Wish"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
