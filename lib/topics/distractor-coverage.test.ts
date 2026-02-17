import { describe, it, expect } from "vitest";
import {
  getCategoryByEmoji,
  getDistractors,
  getEmojisByCategory,
} from "../emoji-data";
import { getAllTopics, isEmojiItem } from "./index";

describe("all emoji topics have valid distractors", () => {
  const topics = getAllTopics();
  const emojiTopics = topics.filter((t) => t.items.some(isEmojiItem));

  it.each(emojiTopics.map((t) => [t.id, t]))(
    "topic %s has all emojis with 2+ valid distractors",
    (_, topic) => {
      const problematic: string[] = [];

      for (const item of topic.items) {
        if (!isEmojiItem(item)) continue;

        const category = getCategoryByEmoji(item.emoji);
        if (!category) {
          problematic.push(`${item.word} (${item.emoji}): NO CATEGORY`);
          continue;
        }

        const categoryItems = getEmojisByCategory(category);
        const distractors = getDistractors(item.emoji, category, 2);

        if (distractors.length < 2) {
          problematic.push(
            `${item.word} (${item.emoji}): category="${category}" (${categoryItems.length} items), only ${distractors.length} distractors`,
          );
        }
      }

      expect(
        problematic,
        `Problematic emojis: ${problematic.join(", ")}`,
      ).toEqual([]);
    },
  );
});
