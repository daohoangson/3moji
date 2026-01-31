import { findEmojiByName, getDistractors } from "./emoji-data";
import type { GameContent } from "./schema";

// CSS color names that we can handle locally
const CSS_COLORS: Record<string, string> = {
  red: "red",
  blue: "blue",
  green: "green",
  yellow: "yellow",
  orange: "orange",
  purple: "purple",
  pink: "pink",
  brown: "brown",
  black: "black",
  white: "white",
  gray: "gray",
  grey: "gray",
  cyan: "cyan",
  magenta: "magenta",
  lime: "lime",
  navy: "navy",
  teal: "teal",
  maroon: "maroon",
  olive: "olive",
  aqua: "aqua",
  gold: "gold",
  silver: "silver",
  // Common color words in other languages
  rojo: "red", // Spanish
  azul: "blue",
  verde: "green",
  amarillo: "yellow",
  naranja: "orange",
  morado: "purple",
  rosa: "pink",
  rouge: "red", // French
  bleu: "blue",
  vert: "green",
  jaune: "yellow",
  rot: "red", // German
  blau: "blue",
  grün: "green",
  gelb: "yellow",
};

// Color distractors grouped by visual similarity
const COLOR_GROUPS = [
  ["red", "orange", "pink", "maroon"],
  ["blue", "cyan", "navy", "teal"],
  ["green", "lime", "olive", "teal"],
  ["yellow", "gold", "orange", "lime"],
  ["purple", "magenta", "pink", "navy"],
  ["brown", "maroon", "orange", "olive"],
  ["black", "gray", "navy", "brown"],
  ["white", "silver", "gray", "cyan"],
];

function getColorDistractors(targetColor: string, count: number = 2): string[] {
  // Find which group the color belongs to
  const group = COLOR_GROUPS.find((g) => g.includes(targetColor));

  // Get colors NOT in the same group for better visual distinction
  const otherColors = Object.values(CSS_COLORS).filter(
    (c) => c !== targetColor && (!group || !group.includes(c)),
  );

  // Shuffle and pick
  const shuffled = [...new Set(otherColors)].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Try to generate game content locally without LLM.
 * Returns null if we can't match the word locally.
 */
export function generateLocalContent(word: string): GameContent | null {
  const normalizedWord = word.toLowerCase().trim();

  // Check if it's a color
  const cssColor = CSS_COLORS[normalizedWord];
  if (cssColor) {
    return {
      type: "color",
      targetValue: cssColor,
      distractors: getColorDistractors(cssColor) as [string, string],
    };
  }

  // Check if it's an emoji name
  const emojiMatch = findEmojiByName(normalizedWord);
  if (emojiMatch) {
    const distractors = getDistractors(
      emojiMatch.emoji,
      emojiMatch.category,
      2,
    );

    // If we don't have enough distractors in the same category, return null
    // (let LLM handle it)
    if (distractors.length < 2) {
      return null;
    }

    return {
      type: "emoji",
      targetValue: emojiMatch.emoji,
      distractors: distractors as [string, string],
    };
  }

  // No local match found
  return null;
}
