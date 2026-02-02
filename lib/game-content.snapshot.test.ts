import { describe, it, expect, vi } from "vitest";

// Keep distractor order deterministic for snapshot review.
vi.mock("./shuffle", () => ({
  shuffle: <T>(items: T[]) => items,
}));

import { generateLocalContent } from "./game-content";

const COMMON_WORDS = [
  // Animals
  "dog",
  "cat",
  "cow",
  "horse",
  "lion",
  "elephant",
  "fish",
  "duck",
  "rabbit",
  "monkey",

  // Foods
  "pizza",
  "ice cream",
  "cake",
  "cookie",
  "bread",
  "cheese",
  "egg",

  // Fruits
  "apple",
  "banana",
  "orange",
  "grapes",
  "watermelon",
  "cherry",

  // Vehicles
  "car",
  "bus",
  "train",
  "truck",
  "plane",
  "boat",
  "bicycle",
  "helicopter",

  // Colors (English + translations)
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "rojo",
  "azul",
  "verde",

  // Shapes / symbols
  "circle",
  "square",
  "triangle",
  "star",
  "heart",
  "diamond",

  // Emotions
  "happy",
  "sad",
  "angry",
  "scared",
  "surprised",
  "sleepy",
  "love",
  "excited",
  "worried",
  "crying",

  // Flags / places
  "United States",
  "United Kingdom",
  "Japan",
  "Australia",

  // Misc
  "balloon",
  "gift",
  "party",
];

const summarize = (word: string) => {
  const content = generateLocalContent(word);
  if (!content) return `${word} -> null`;
  return `${word} -> ${content.type}:${content.targetValue} | ${content.distractors.join(", ")}`;
};

describe("generateLocalContent snapshot", () => {
  it("summarizes common words deterministically", () => {
    const summary = COMMON_WORDS.map((word) => summarize(word));
    expect(summary).toMatchSnapshot();
  });
});
