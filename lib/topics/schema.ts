import { z } from "zod";

export const TopicLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
export type TopicLevel = z.infer<typeof TopicLevelSchema>;

export const EmojiItemSchema = z.object({
  word: z.string(),
  emoji: z.string(),
});
export type EmojiItem = z.infer<typeof EmojiItemSchema>;

export const ColorItemSchema = z.object({
  color: z.string(),
});
export type ColorItem = z.infer<typeof ColorItemSchema>;

export const TopicItemSchema = z.union([EmojiItemSchema, ColorItemSchema]);
export type TopicItem = z.infer<typeof TopicItemSchema>;

// Type guards
export function isEmojiItem(item: TopicItem): item is EmojiItem {
  return "emoji" in item;
}

export function isColorItem(item: TopicItem): item is ColorItem {
  return "color" in item;
}

export const TopicSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  learningGoals: z.array(z.string()),
  icon: z.string(),
  level: TopicLevelSchema,
  items: z.array(TopicItemSchema),
});

export type Topic = z.infer<typeof TopicSchema>;
