import { z } from "zod";
import { getRandomItemsFromTopic, getTopicById } from "./index";
import { isColorItem, type ColorItem } from "./schema";
import { getCategoryByEmoji, getDistractors } from "../emoji-data";
import { shuffle } from "../shuffle";

export const SessionRoundSchema = z.object({
  word: z.string(),
  type: z.enum(["color", "emoji"]),
  targetValue: z.string(),
  distractors: z.tuple([z.string(), z.string()]),
});

export type SessionRound = z.infer<typeof SessionRoundSchema>;

export const SessionSchema = z.object({
  topicId: z.string(),
  rounds: z.array(SessionRoundSchema),
  currentRound: z.number(),
  correctCount: z.number(),
});

export type Session = z.infer<typeof SessionSchema>;

export interface RoundWithItems extends SessionRound {
  items: { id: string; value: string; isCorrect: boolean }[];
}

export const DEFAULT_SESSION_LENGTH = 10;

/**
 * Get color distractors from other color items in the topic
 */
function getColorDistractors(
  targetColor: string,
  allItems: ColorItem[],
  count: number,
): string[] {
  const otherColors = allItems
    .filter((item) => item.color !== targetColor)
    .map((item) => item.color);
  return shuffle([...otherColors]).slice(0, count);
}

export function generateTopicSession(
  topicId: string,
  sessionLength: number = DEFAULT_SESSION_LENGTH,
): RoundWithItems[] | null {
  const topic = getTopicById(topicId);
  if (!topic) {
    return null;
  }

  const topicItems = getRandomItemsFromTopic(topicId, sessionLength);
  if (topicItems.length === 0) {
    return null;
  }

  const rounds: RoundWithItems[] = [];

  for (const item of topicItems) {
    if (isColorItem(item)) {
      // Color mode
      const color = item.color;
      const colorItems = topic.items.filter(isColorItem);
      const distractors = getColorDistractors(color, colorItems, 2);
      if (distractors.length < 2) continue;

      rounds.push({
        word: item.color,
        type: "color",
        targetValue: color,
        distractors: distractors as [string, string],
        items: shuffle([
          { id: `${color}-target`, value: color, isCorrect: true },
          { id: `${color}-d1`, value: distractors[0], isCorrect: false },
          { id: `${color}-d2`, value: distractors[1], isCorrect: false },
        ]),
      });
    } else {
      // Emoji mode
      const { emoji, word } = item;
      const category = getCategoryByEmoji(emoji);
      if (!category) continue;

      const distractors = getDistractors(emoji, category, 2);
      if (distractors.length < 2) continue;

      rounds.push({
        word,
        type: "emoji",
        targetValue: emoji,
        distractors: distractors as [string, string],
        items: shuffle([
          { id: `${emoji}-target`, value: emoji, isCorrect: true },
          { id: `${emoji}-d1`, value: distractors[0], isCorrect: false },
          { id: `${emoji}-d2`, value: distractors[1], isCorrect: false },
        ]),
      });
    }
  }

  return rounds.length > 0 ? rounds : null;
}
