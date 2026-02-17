import { describe, it, expect } from "vitest";
import { getCategoryByEmoji } from "../emoji-data";
import { getAllTopics, isEmojiItem } from "./index";
import { generateTopicSession, DEFAULT_SESSION_LENGTH } from "./session";

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

  it.each(topics.map((t) => [t.id, t]))(
    "topic %s has at least %i items for full session",
    (_, topic) => {
      expect(topic.items.length).toBeGreaterThanOrEqual(DEFAULT_SESSION_LENGTH);
    },
  );

  it.each(topics.map((t) => [t.id, t]))(
    "topic %s generates full session",
    (_, topic) => {
      const session = generateTopicSession(topic.id);
      expect(session).not.toBeNull();
      expect(session!.length).toBe(DEFAULT_SESSION_LENGTH);
    },
  );
});
