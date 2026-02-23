import { describe, it, expect } from "vitest";
import {
  getCategoryByEmoji,
  getDistractors,
  getEmojisByCategory,
} from "../emoji-data";
import { getTopicById, isEmojiItem } from "./index";

const EMOJI_TOPIC_IDS = [
  "animal-friends",
  "fruits",
  "vehicles",
  "clothing",
  "flags-easy",
  "wild-animals",
  "food",
  "nature",
  "emotions",
  "shapes",
  "telling-time",
  "12-con-giap",
  "flags-medium",
  "flags-hard",
  "celebrations",
  "sports",
  "professions",
];

describe("all emoji topics have valid distractors", () => {
  it.each(EMOJI_TOPIC_IDS)(
    "topic %s has all emojis with 2+ valid distractors",
    (id) => {
      const topic = getTopicById(id)!;
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
