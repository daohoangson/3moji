import { describe, it, expect } from "vitest";
import { getAllTopics, getTopicById, getTopicsByLevel } from "./index";

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
        "celebrations",
        "sports",
        "professions",
      ]);
    });
  });
});
