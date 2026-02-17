import { describe, it, expect } from "vitest";
import {
  getAllTopics,
  getTopicById,
  getTopicsByLevel,
  getRandomItemsFromTopic,
  TOPICS,
} from "./index";

describe("topics utilities", () => {
  describe("getAllTopics", () => {
    it("returns all topics", () => {
      const topics = getAllTopics();
      expect(topics).toEqual(TOPICS);
      expect(topics.length).toBeGreaterThan(0);
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
      const topics = getTopicsByLevel(1);
      expect(topics.length).toBeGreaterThan(0);
      topics.forEach((topic) => {
        expect(topic.level).toBe(1);
      });
    });

    it("returns level 2 topics", () => {
      const topics = getTopicsByLevel(2);
      expect(topics.length).toBeGreaterThan(0);
      topics.forEach((topic) => {
        expect(topic.level).toBe(2);
      });
    });

    it("returns level 3 topics", () => {
      const topics = getTopicsByLevel(3);
      expect(topics.length).toBeGreaterThan(0);
      topics.forEach((topic) => {
        expect(topic.level).toBe(3);
      });
    });
  });

  describe("getRandomItemsFromTopic", () => {
    it("returns requested number of items", () => {
      const items = getRandomItemsFromTopic("animal-friends", 5);
      expect(items.length).toBe(5);
    });

    it("returns all items if count exceeds available", () => {
      const topic = getTopicById("animal-friends");
      const items = getRandomItemsFromTopic("animal-friends", 100);
      expect(items.length).toBe(topic?.items.length);
    });

    it("returns empty array for unknown topic", () => {
      const items = getRandomItemsFromTopic("unknown", 5);
      expect(items).toEqual([]);
    });

    it("returns items from the topic items list", () => {
      const topic = getTopicById("animal-friends")!;
      const items = getRandomItemsFromTopic("animal-friends", 3);
      items.forEach((item) => {
        const itemKey = "emoji" in item ? item.emoji : item.color;
        const topicKeys = topic.items.map((i) =>
          "emoji" in i ? i.emoji : i.color,
        );
        expect(topicKeys).toContain(itemKey);
      });
    });
  });
});
