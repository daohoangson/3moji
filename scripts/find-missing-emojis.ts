import { EMOJI_DATABASE } from "../lib/emoji-data.generated";
import { readFileSync } from "fs";

const normalizeEmoji = (emoji: string) => emoji.replace(/[\uFE0E\uFE0F]/g, "");

// Derive lookup maps from EMOJI_DATABASE
const NAME_TO_EMOJI: Record<string, string> = {};
const EMOJI_TO_CATEGORY: Record<string, string> = {};
for (const cat of EMOJI_DATABASE) {
  for (const item of cat.items) {
    EMOJI_TO_CATEGORY[normalizeEmoji(item.emoji)] = cat.category;
    if (!cat.category.startsWith("internal:")) {
      for (const name of item.names) {
        const lower = name.toLowerCase();
        if (!(lower in NAME_TO_EMOJI)) NAME_TO_EMOJI[lower] = item.emoji;
      }
    }
  }
}

function findEmojiByName(name: string) {
  const normalized = name.toLowerCase().trim();
  const emoji = NAME_TO_EMOJI[normalized];
  if (emoji) {
    const category = EMOJI_TO_CATEGORY[normalizeEmoji(emoji)];
    if (category) {
      return { emoji, category };
    }
  }
  return null;
}

const content = readFileSync(
  ".cache/emoji-data/google-10000-english.txt",
  "utf-8",
);
const words = content.split("\n").filter(Boolean);

const misses: string[] = [];

for (const word of words) {
  const result = findEmojiByName(word);
  if (result === null) {
    misses.push(word);
  }
}

console.log("First 400 words without emoji mappings:");
console.log(misses.slice(0, 400).join(", "));
console.error(
  `\nTotal: ${misses.length} words without emojis out of ${words.length}`,
);
