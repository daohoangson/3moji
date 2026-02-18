import "server-only";

import { getShortestEmojiNames } from "./emoji-data";
import { shuffle } from "./shuffle";

// CSS color names for suggestions
const COLOR_NAMES = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "black",
  "white",
  "gray",
];

/**
 * Returns a shuffled pool of single-word suggestions (mix of colors and emoji names).
 * The shuffle result gets cached — a different pool on each cache rebuild.
 * Clients pick from this pool on mount for fresh randomness every visit.
 */
export function getSuggestionPool(count: number = 50): string[] {
  const emojiNames = getShortestEmojiNames();
  const allSuggestions = [...COLOR_NAMES, ...emojiNames];

  // Filter to single words only (no spaces) for kid-friendliness
  const singleWords = allSuggestions.filter((word) => !word.includes(" "));

  // Shuffle and take count items
  const shuffled = shuffle([...singleWords]);
  return shuffled.slice(0, count);
}
