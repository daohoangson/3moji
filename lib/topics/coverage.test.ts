import { describe, it, expect } from "vitest";
import { getCategoryByEmoji } from "../emoji-data";
import { getAllTopics, isEmojiItem } from "./index";
import { DEFAULT_SESSION_LENGTH } from "./session";

describe("topic coverage", () => {
  const topics = getAllTopics();
  const emojiTopics = topics.filter((t) => t.items.some(isEmojiItem));

  it.each(emojiTopics.map((t) => [t.id, t]))(
    "emoji topic %s has all emojis in emoji database",
    (_, topic) => {
      const failed: string[] = [];
      for (const item of topic.items) {
        if (!isEmojiItem(item)) continue;
        const category = getCategoryByEmoji(item.emoji);
        if (!category) {
          failed.push(`${item.word} (${item.emoji})`);
        }
      }
      expect(failed, `Missing emojis: ${failed.join(", ")}`).toHaveLength(0);
    },
  );

  // buildSession needs DEFAULT_SESSION_LENGTH targets + 2 distractors that
  // haven't been shown as targets yet. At the last round, all prior targets
  // are excluded from the distractor pool, so minimum = session length + 2.
  const MIN_ITEMS = DEFAULT_SESSION_LENGTH + 2;

  it.each(topics.map((t) => [t.id, t]))(
    "topic %s has at least %i items for full session with distractor exclusion",
    (_, topic) => {
      expect(topic.items.length).toBeGreaterThanOrEqual(MIN_ITEMS);
    },
  );
});
