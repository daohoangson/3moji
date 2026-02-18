import "server-only";

/**
 * Emoji database API for generating game content without LLM.
 *
 * Derived lookup maps are computed once at module load from EMOJI_DATABASE.
 */
import { shuffle } from "./shuffle";
import {
  EMOJI_DATABASE,
  type EmojiItem,
  type EmojiCategory,
} from "./emoji-data.generated";

export type { EmojiItem, EmojiCategory };

// =============================================================================
// Helpers
// =============================================================================

const normalizeEmoji = (emoji: string) => emoji.replace(/[\uFE0E\uFE0F]/g, "");
const normalizeName = (name: string) => name.toLowerCase().trim();

const isInternalCategory = (category: string | null | undefined): boolean =>
  Boolean(category && category.startsWith("internal:"));

// =============================================================================
// Derived lookup maps (computed once at module load)
// =============================================================================

const NAME_TO_EMOJI: Record<string, string> = {};
const EMOJI_TO_KEYWORDS: Record<string, string[]> = {};
const EMOJI_TO_CATEGORY: Record<string, string> = {};
const SHORTEST_EMOJI_NAMES: string[] = [];

for (const cat of EMOJI_DATABASE) {
  for (const item of cat.items) {
    const key = normalizeEmoji(item.emoji);
    EMOJI_TO_KEYWORDS[key] = item.keywords;
    EMOJI_TO_CATEGORY[key] = cat.category;

    if (!isInternalCategory(cat.category)) {
      for (const name of item.names) {
        const lower = name.toLowerCase();
        // First definition wins (matches original behavior)
        if (!(lower in NAME_TO_EMOJI)) {
          NAME_TO_EMOJI[lower] = item.emoji;
        }
      }

      // Track shortest name per emoji for suggestions
      let shortest = item.names[0];
      for (const name of item.names) {
        if (name.length < shortest.length) shortest = name;
      }
      SHORTEST_EMOJI_NAMES.push(shortest);
    }
  }
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Look up an emoji by name (case-insensitive)
 * Returns the FIRST emoji that matches (by definition order)
 *
 * The NAME_TO_EMOJI map includes:
 * - Direct emoji names
 * - Keyword promotions (via moby synonym matching at generation time)
 * - Common word expansions (via moby dominant-category at generation time)
 */
export function findEmojiByName(
  name: string,
): { emoji: string; category: string } | null {
  const normalized = normalizeName(name);

  const emoji = NAME_TO_EMOJI[normalized];
  if (emoji) {
    const category = EMOJI_TO_CATEGORY[normalizeEmoji(emoji)];
    if (category) {
      return { emoji, category };
    }
  }

  return null;
}

/**
 * Get all emojis in a category
 */
export function getEmojisByCategory(category: string): EmojiItem[] {
  if (isInternalCategory(category)) return [];
  const cat = EMOJI_DATABASE.find((c) => c.category === category);
  return cat?.items || [];
}

/**
 * Get the category for an emoji
 */
export function getCategoryByEmoji(emoji: string): string | null {
  return EMOJI_TO_CATEGORY[normalizeEmoji(emoji)] || null;
}

/**
 * Check if two emojis are visually similar (share any keyword)
 */
export function areVisuallySimilar(emoji1: string, emoji2: string): boolean {
  const keywords1 = EMOJI_TO_KEYWORDS[normalizeEmoji(emoji1)];
  const keywords2 = EMOJI_TO_KEYWORDS[normalizeEmoji(emoji2)];
  if (!keywords1 || !keywords2) return false;

  const lower1 = new Set(keywords1.map((k) => k.toLowerCase()));
  return keywords2.some((k) => lower1.has(k.toLowerCase()));
}

/**
 * Get random distractors from the same category (excluding visually similar)
 */
export function getDistractors(
  targetEmoji: string,
  category: string,
  count: number = 2,
): string[] {
  const categoryItems = getEmojisByCategory(category);
  const targetKey = normalizeEmoji(targetEmoji);

  // Filter out the target and any visually similar emojis
  const validDistractors = categoryItems.filter((item) => {
    const itemKey = normalizeEmoji(item.emoji);
    return (
      itemKey !== targetKey && !areVisuallySimilar(targetEmoji, item.emoji)
    );
  });

  // Shuffle and take count items
  const shuffled = shuffle([...validDistractors]);
  return shuffled.slice(0, count).map((item) => item.emoji);
}

/**
 * Get unique shortest names from all emojis for suggestions.
 */
export function getShortestEmojiNames(): string[] {
  return SHORTEST_EMOJI_NAMES;
}
