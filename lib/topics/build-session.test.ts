import { describe, it, expect } from "vitest";
import { buildSession } from "./build-session";
import { getAllTopics } from "./index";
import { DEFAULT_SESSION_LENGTH } from "./session";
import type { TopicItem } from "./schema";

describe("buildSession", () => {
  const colorItems: TopicItem[] = [
    { color: "red" },
    { color: "blue" },
    { color: "green" },
    { color: "yellow" },
    { color: "orange" },
    { color: "purple" },
    { color: "pink" },
    { color: "brown" },
    { color: "black" },
    { color: "white" },
    { color: "gray" },
    { color: "cyan" },
  ];

  const emojiItems: TopicItem[] = [
    { word: "cat", emoji: "🐱" },
    { word: "dog", emoji: "🐶" },
    { word: "fish", emoji: "🐟" },
    { word: "bird", emoji: "🐦" },
    { word: "mouse", emoji: "🐭" },
    { word: "rabbit", emoji: "🐰" },
    { word: "bear", emoji: "🐻" },
    { word: "pig", emoji: "🐷" },
    { word: "cow", emoji: "🐮" },
    { word: "horse", emoji: "🐴" },
    { word: "sheep", emoji: "🐑" },
    { word: "monkey", emoji: "🐵" },
  ];

  it("returns correct number of rounds", () => {
    const rounds = buildSession(colorItems, 5);
    expect(rounds).not.toBeNull();
    expect(rounds!.length).toBe(5);
  });

  it("uses DEFAULT_SESSION_LENGTH when not specified", () => {
    const rounds = buildSession(colorItems);
    expect(rounds).not.toBeNull();
    expect(rounds!.length).toBe(DEFAULT_SESSION_LENGTH);
  });

  it("each round has 3 items with exactly one correct", () => {
    const rounds = buildSession(colorItems, 5);
    expect(rounds).not.toBeNull();

    for (const round of rounds!) {
      expect(round.items).toHaveLength(3);
      const correct = round.items.filter((item) => item.isCorrect);
      expect(correct).toHaveLength(1);
      expect(correct[0].value).toBe(round.targetValue);
    }
  });

  it("distractors never include already-played target values", () => {
    // Run multiple times to catch randomness-related issues
    for (let attempt = 0; attempt < 10; attempt++) {
      const rounds = buildSession(colorItems, 8);
      expect(rounds).not.toBeNull();

      const playedTargets = new Set<string>();
      for (const round of rounds!) {
        // Distractors should not include any previously played target
        for (const distractor of round.distractors) {
          expect(playedTargets.has(distractor)).toBe(false);
        }
        playedTargets.add(round.targetValue);
      }
    }
  });

  it("works with emoji items", () => {
    const rounds = buildSession(emojiItems, 5);
    expect(rounds).not.toBeNull();

    for (const round of rounds!) {
      expect(round.type).toBe("emoji");
      expect(round.word).toBeTruthy();
      expect(round.targetValue).toBeTruthy();
      expect(round.distractors).toHaveLength(2);
      expect(round.items).toHaveLength(3);
    }
  });

  it("returns null when items array is empty", () => {
    const rounds = buildSession([], 5);
    expect(rounds).toBeNull();
  });

  it("caps rounds to available items", () => {
    const fewItems: TopicItem[] = [
      { color: "red" },
      { color: "blue" },
      { color: "green" },
      { color: "yellow" },
    ];
    const rounds = buildSession(fewItems, 10);
    expect(rounds).not.toBeNull();
    // With 4 items, can't make more than ~2 rounds (need 3 items per round: 1 target + 2 distractors from non-known pool)
    expect(rounds!.length).toBeLessThanOrEqual(4);
    expect(rounds!.length).toBeGreaterThan(0);
  });

  it("each round has 2 unique distractors", () => {
    const rounds = buildSession(colorItems, 5);
    expect(rounds).not.toBeNull();

    for (const round of rounds!) {
      expect(round.distractors).toHaveLength(2);
      expect(new Set(round.distractors).size).toBe(2);
    }
  });

  it("items array contains target and both distractors", () => {
    const rounds = buildSession(colorItems, 5);
    expect(rounds).not.toBeNull();

    for (const round of rounds!) {
      const itemValues = round.items.map((item) => item.value);
      expect(itemValues).toContain(round.targetValue);
      for (const distractor of round.distractors) {
        expect(itemValues).toContain(distractor);
      }
    }
  });

  it("target is not repeated as a distractor in the same round", () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      const rounds = buildSession(colorItems, 8);
      expect(rounds).not.toBeNull();

      for (const round of rounds!) {
        expect(round.distractors).not.toContain(round.targetValue);
      }
    }
  });

  it("sets correct type for color items", () => {
    const rounds = buildSession(colorItems, 3);
    expect(rounds).not.toBeNull();

    for (const round of rounds!) {
      expect(round.type).toBe("color");
    }
  });

  describe("with real topic data", () => {
    const topics = getAllTopics();

    it.each(topics.map((t) => [t.id, t]))(
      "builds a session for topic %s",
      (_, topic) => {
        const rounds = buildSession(topic.items);
        expect(rounds).not.toBeNull();
        expect(rounds!.length).toBe(DEFAULT_SESSION_LENGTH);
      },
    );
  });
});
