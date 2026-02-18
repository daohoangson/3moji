/**
 * Enrich EMOJI_DATABASE with all name data from NAME_TO_EMOJI,
 * then write a new generated file with ONLY EMOJI_DATABASE (+ types).
 *
 * Usage: npx tsx scripts/enrich-emoji-database.ts
 */
import * as fs from "fs";
import * as path from "path";
import {
  EMOJI_DATABASE,
  NAME_TO_EMOJI,
  EMOJI_TO_CATEGORY,
  type EmojiCategory,
  type EmojiItem,
} from "../lib/emoji-data.generated";

const normalizeEmoji = (emoji: string) => emoji.replace(/[\uFE0E\uFE0F]/g, "");

const isVietnamese = (s: string) =>
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
    s,
  );

// ─── Step 1: Index existing EMOJI_DATABASE ───────────────────────────────────

const emojiLocation = new Map<
  string,
  { catIndex: number; itemIndex: number }
>();
const categoryIndex = new Map<string, number>();

for (let ci = 0; ci < EMOJI_DATABASE.length; ci++) {
  const cat = EMOJI_DATABASE[ci];
  categoryIndex.set(cat.category, ci);
  for (let ii = 0; ii < cat.items.length; ii++) {
    const key = normalizeEmoji(cat.items[ii].emoji);
    if (!emojiLocation.has(key)) {
      emojiLocation.set(key, { catIndex: ci, itemIndex: ii });
    }
  }
}

// Deep-clone EMOJI_DATABASE so we can mutate
const enriched: EmojiCategory[] = JSON.parse(JSON.stringify(EMOJI_DATABASE));

// ─── Step 2: Collect existing names and find orphaned entries ────────────────

const existingNames = new Set<string>();
for (const cat of EMOJI_DATABASE) {
  for (const item of cat.items) {
    for (const name of item.names) {
      existingNames.add(name.toLowerCase());
    }
  }
}

// Orphaned: in NAME_TO_EMOJI but not in any EMOJI_DATABASE item's names
const extraByEmoji = new Map<string, string[]>();
for (const [name, emoji] of Object.entries(NAME_TO_EMOJI)) {
  if (existingNames.has(name.toLowerCase())) continue;
  if (isVietnamese(name)) continue;
  if (!extraByEmoji.has(emoji)) extraByEmoji.set(emoji, []);
  extraByEmoji.get(emoji)!.push(name);
}

// ─── Step 3: Merge extra names into existing items & add missing emojis ──────

let mergedCount = 0;
let addedEmojiCount = 0;

for (const [emoji, extraNames] of extraByEmoji) {
  const key = normalizeEmoji(emoji);
  const loc = emojiLocation.get(key);

  if (loc) {
    const item = enriched[loc.catIndex].items[loc.itemIndex];
    item.names.push(...extraNames);
    mergedCount++;
  } else {
    const category = EMOJI_TO_CATEGORY[key];
    if (!category) {
      console.warn(`⚠ No category for ${emoji}, skipping`);
      continue;
    }

    let catIdx = categoryIndex.get(category);
    if (catIdx === undefined) {
      catIdx = enriched.length;
      enriched.push({ category, items: [] });
      categoryIndex.set(category, catIdx);
    }

    const newItem: EmojiItem = {
      emoji,
      names: extraNames,
      keywords: [],
    };
    enriched[catIdx].items.push(newItem);
    emojiLocation.set(key, {
      catIndex: catIdx,
      itemIndex: enriched[catIdx].items.length - 1,
    });
    addedEmojiCount++;
  }
}

console.log(`Merged extra names into ${mergedCount} existing emojis`);
console.log(`Added ${addedEmojiCount} new emojis to EMOJI_DATABASE`);

// ─── Step 4: Fix name→emoji priority conflicts ──────────────────────────────
//
// The original NAME_TO_EMOJI contained intentional overrides: cases where a name
// was mapped to a different emoji than what iterating EMOJI_DATABASE would give.
// We need to move those names from the "wrong" item to the "right" item so that
// "first definition wins" during derivation produces the original mapping.

// Iterate conflict fixes until stable (a fix can reveal new conflicts)
let totalFixed = 0;
for (let pass = 0; pass < 10; pass++) {
  // Simulate derivation
  const derivedNameToEmoji: Record<string, string> = {};
  for (const cat of enriched) {
    if (cat.category.startsWith("internal:")) continue;
    for (const item of cat.items) {
      for (const name of item.names) {
        const lower = name.toLowerCase();
        if (!(lower in derivedNameToEmoji)) {
          derivedNameToEmoji[lower] = item.emoji;
        }
      }
    }
  }

  let fixedThisPass = 0;
  for (const [name, originalEmoji] of Object.entries(NAME_TO_EMOJI)) {
    if (isVietnamese(name)) continue;
    const lower = name.toLowerCase();
    const derivedEmoji = derivedNameToEmoji[lower];
    if (!derivedEmoji || derivedEmoji === originalEmoji) continue;

    // Remove `name` from the wrong emoji
    const derivedKey = normalizeEmoji(derivedEmoji);
    const derivedLoc = emojiLocation.get(derivedKey);
    if (!derivedLoc) continue;

    const derivedItem =
      enriched[derivedLoc.catIndex].items[derivedLoc.itemIndex];
    const idx = derivedItem.names.findIndex((n) => n.toLowerCase() === lower);
    if (idx !== -1) {
      derivedItem.names.splice(idx, 1);
    }

    // Add `name` to the correct emoji (create entry if needed)
    const origKey = normalizeEmoji(originalEmoji);
    let origLoc = emojiLocation.get(origKey);

    if (!origLoc) {
      const category = EMOJI_TO_CATEGORY[origKey];
      if (category) {
        let catIdx = categoryIndex.get(category);
        if (catIdx === undefined) {
          catIdx = enriched.length;
          enriched.push({ category, items: [] });
          categoryIndex.set(category, catIdx);
        }
        const newItem: EmojiItem = {
          emoji: originalEmoji,
          names: [],
          keywords: [],
        };
        enriched[catIdx].items.push(newItem);
        origLoc = {
          catIndex: catIdx,
          itemIndex: enriched[catIdx].items.length - 1,
        };
        emojiLocation.set(origKey, origLoc);
      }
    }

    if (origLoc) {
      const origItem = enriched[origLoc.catIndex].items[origLoc.itemIndex];
      if (!origItem.names.some((n) => n.toLowerCase() === lower)) {
        origItem.names.push(name);
      }
    }

    fixedThisPass++;
  }

  totalFixed += fixedThisPass;
  if (fixedThisPass === 0) {
    console.log(
      `Fixed ${totalFixed} name→emoji priority conflicts (${pass + 1} pass${pass > 0 ? "es" : ""})`,
    );
    break;
  }
}

// ─── Step 5: Count skipped Vietnamese-only emojis ────────────────────────────

let skippedViOnly = 0;
for (const [key] of Object.entries(EMOJI_TO_CATEGORY)) {
  if (!emojiLocation.has(key)) skippedViOnly++;
}
if (skippedViOnly > 0) {
  console.log(`Skipped ${skippedViOnly} emojis that only had Vietnamese names`);
}

// Filter out empty categories
const filtered = enriched.filter((cat) => cat.items.length > 0);

// ─── Step 6: Write the new generated file ────────────────────────────────────

function formatItem(item: EmojiItem, indent: string): string {
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  emoji: ${JSON.stringify(item.emoji)},`);
  lines.push(`${indent}  names: ${JSON.stringify(item.names)},`);
  lines.push(`${indent}  keywords: ${JSON.stringify(item.keywords)},`);
  if (item.emoji_alias && item.emoji_alias.length > 0) {
    lines.push(`${indent}  emoji_alias: ${JSON.stringify(item.emoji_alias)},`);
  }
  lines.push(`${indent}},`);
  return lines.join("\n");
}

const outputLines: string[] = [];
outputLines.push(`/**`);
outputLines.push(` * Emoji database — single source of truth.`);
outputLines.push(
  ` * Derived lookup maps are computed at runtime in emoji-data.ts.`,
);
outputLines.push(` */`);
outputLines.push(``);
outputLines.push(`export interface EmojiItem {`);
outputLines.push(`  emoji: string;`);
outputLines.push(`  names: string[];`);
outputLines.push(`  keywords: string[];`);
outputLines.push(`  emoji_alias?: string[];`);
outputLines.push(`}`);
outputLines.push(``);
outputLines.push(`export interface EmojiCategory {`);
outputLines.push(`  category: string;`);
outputLines.push(`  items: EmojiItem[];`);
outputLines.push(`}`);
outputLines.push(``);
outputLines.push(`/** Categorized emoji database */`);
outputLines.push(`export const EMOJI_DATABASE: EmojiCategory[] = [`);

for (const cat of filtered) {
  outputLines.push(`  {`);
  outputLines.push(`    category: ${JSON.stringify(cat.category)},`);
  outputLines.push(`    items: [`);
  for (const item of cat.items) {
    outputLines.push(formatItem(item, "      "));
  }
  outputLines.push(`    ],`);
  outputLines.push(`  },`);
}

outputLines.push(`];`);
outputLines.push(``);

const outPath = path.join(__dirname, "..", "lib", "emoji-data.generated.ts");
fs.writeFileSync(outPath, outputLines.join("\n"));
console.log(`\nWrote ${outPath}`);
