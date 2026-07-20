import { describe, it, expect } from "vitest";
import {
  getAllTopics,
  getTopicById,
  getTopicsByLevel,
  isEmojiItem,
} from "./index";

describe("topics utilities", () => {
  describe("getAllTopics", () => {
    it("returns all topics in expected order", () => {
      expect(getAllTopics().map((t) => t.id)).toEqual([
        // Level 1: Explorer (1-2 years)
        "animal-friends",
        "fruits",
        "vehicles",
        "clothing",
        "colors",
        "flags-easy",
        // Level 2: Discoverer (3-5 years)
        "wild-animals",
        "food",
        "nature",
        "emotions",
        "shapes",
        "telling-time",
        "12-con-giap",
        "flags-medium",
        // Level 3: Scholar (>5 years)
        "flags-hard",
        "world-cup-stars",
        "celebrations",
        "sports",
        "professions",
      ]);
    });
  });

  describe("getTopicById", () => {
    it("returns topic by id", () => {
      const topic = getTopicById("animal-friends");
      expect(topic).toBeDefined();
      expect(topic?.name).toBe("Animal Friends");
    });

    it("returns undefined for unknown id", () => {
      const topic = getTopicById("unknown-topic");
      expect(topic).toBeUndefined();
    });

    it("keeps a unique country flag for every World Cup star", () => {
      const topic = getTopicById("world-cup-stars")!;
      const flags = topic.items.filter(isEmojiItem).map((item) => item.emoji);

      expect(flags).toHaveLength(24);
      expect(new Set(flags).size).toBe(flags.length);
    });
  });

  describe("getTopicsByLevel", () => {
    it("returns level 1 topics", () => {
      expect(getTopicsByLevel(1).map((t) => t.id)).toEqual([
        "animal-friends",
        "fruits",
        "vehicles",
        "clothing",
        "colors",
        "flags-easy",
      ]);
    });

    it("returns level 2 topics", () => {
      expect(getTopicsByLevel(2).map((t) => t.id)).toEqual([
        "wild-animals",
        "food",
        "nature",
        "emotions",
        "shapes",
        "telling-time",
        "12-con-giap",
        "flags-medium",
      ]);
    });

    it("returns level 3 topics", () => {
      expect(getTopicsByLevel(3).map((t) => t.id)).toEqual([
        "flags-hard",
        "world-cup-stars",
        "celebrations",
        "sports",
        "professions",
      ]);
    });
  });
});
