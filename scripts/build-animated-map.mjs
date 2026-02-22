#!/usr/bin/env node
/**
 * Scan public/animated/**\/*.webp, match to emoji DB + topics,
 * delete unmatched files, and patch emoji-data.generated.ts with animated field.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ANIMATED_DIR = path.join(ROOT, "public", "animated");
const GENERATED_FILE = path.join(ROOT, "lib", "emoji-data.generated.ts");

// ---------------------------------------------------------------------------
// 1. Scan animated files and build codepoint → relative path map
// ---------------------------------------------------------------------------

/** Recursively find all .webp files */
function walkWebp(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkWebp(full));
    } else if (entry.name.endsWith(".webp")) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = walkWebp(ANIMATED_DIR);
console.log(`Found ${allFiles.length} animated .webp files`);

/**
 * Extract codepoint string from filename.
 * e.g. "grinning-face_1f600.webp" → "1f600"
 *      "polar-bear_1f43b-200d-2744-fe0f.webp" → "1f43b-200d-2744-fe0f"
 */
function extractCodepoints(filename) {
  const base = path.basename(filename, ".webp");
  const underscoreIdx = base.lastIndexOf("_");
  if (underscoreIdx === -1) return null;
  return base.slice(underscoreIdx + 1).toLowerCase();
}

// Map: normalized codepoint string → absolute file path
const codepointToFile = new Map();
for (const f of allFiles) {
  const cp = extractCodepoints(f);
  if (cp) codepointToFile.set(cp, f);
}

// ---------------------------------------------------------------------------
// 2. Collect all known emojis from DB + topics
// ---------------------------------------------------------------------------

/** Convert emoji string to codepoint key (lowercase hex, dash-separated) */
function emojiToCodepoint(emoji) {
  const cps = [];
  for (const ch of emoji) {
    cps.push(ch.codePointAt(0).toString(16));
  }
  return cps.join("-");
}

/** Strip variation selectors from codepoint string */
function stripVS(cpStr) {
  return cpStr
    .split("-")
    .filter((p) => p !== "fe0e" && p !== "fe0f")
    .join("-");
}

// Read the generated TS file
const generatedSource = fs.readFileSync(GENERATED_FILE, "utf-8");

// Extract all emoji literals from the EMOJI_DATABASE section
// Match emoji: "..." lines
const emojiLiteralRe = /emoji:\s*"([^"]+)"/g;
const dbEmojis = new Set();
let m;
while ((m = emojiLiteralRe.exec(generatedSource)) !== null) {
  dbEmojis.add(m[1]);
}

// Also read topics/data.ts for topic emojis
const topicsFile = path.join(ROOT, "lib", "topics", "data.ts");
const topicsSource = fs.readFileSync(topicsFile, "utf-8");
const topicEmojiRe = /emoji:\s*"([^"]+)"/g;
while ((m = topicEmojiRe.exec(topicsSource)) !== null) {
  dbEmojis.add(m[1]);
}
// Also get topic icons
const topicIconRe = /icon:\s*"([^"]+)"/g;
while ((m = topicIconRe.exec(topicsSource)) !== null) {
  dbEmojis.add(m[1]);
}

console.log(`Found ${dbEmojis.size} unique emojis in DB + topics`);

// ---------------------------------------------------------------------------
// 3. Match animated files to known emojis
// ---------------------------------------------------------------------------

// Build emoji → codepoint mappings (with and without VS)
// Map: codepoint string (with or without VS stripped) → emoji string
const cpToEmoji = new Map();
for (const emoji of dbEmojis) {
  const cp = emojiToCodepoint(emoji);
  cpToEmoji.set(cp, emoji);
  const stripped = stripVS(cp);
  if (stripped !== cp) {
    cpToEmoji.set(stripped, emoji);
  }
}

// Match: for each animated file, find the emoji
// Result: emoji string → relative path from public/
const matched = new Map(); // emoji → public-relative path
const unmatched = []; // absolute paths to delete

for (const [cpStr, absPath] of codepointToFile) {
  const relPath =
    "/animated/" +
    path.relative(ANIMATED_DIR, absPath).split(path.sep).join("/");

  // Try exact codepoint match
  let emoji = cpToEmoji.get(cpStr);

  // Try stripping VS from filename codepoints
  if (!emoji) {
    emoji = cpToEmoji.get(stripVS(cpStr));
  }

  // Try adding fe0f to single codepoints (some emojis have VS in DB but not file)
  if (!emoji && !cpStr.includes("-")) {
    emoji = cpToEmoji.get(cpStr + "-fe0f");
  }

  if (emoji) {
    matched.set(emoji, relPath);
  } else {
    unmatched.push(absPath);
  }
}

console.log(`Matched: ${matched.size}, Unmatched: ${unmatched.length}`);

// ---------------------------------------------------------------------------
// 4. Delete unmatched files
// ---------------------------------------------------------------------------

for (const f of unmatched) {
  fs.unlinkSync(f);
}
console.log(`Deleted ${unmatched.length} unmatched files`);

// Clean up empty directories
function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      removeEmptyDirs(path.join(dir, entry.name));
    }
  }
  if (fs.readdirSync(dir).length === 0 && dir !== ANIMATED_DIR) {
    fs.rmdirSync(dir);
  }
}
removeEmptyDirs(ANIMATED_DIR);

// ---------------------------------------------------------------------------
// 5. Patch emoji-data.generated.ts
// ---------------------------------------------------------------------------

let patched = generatedSource;

// 5a. Add animated?: string to EmojiItem interface
patched = patched.replace(
  /export interface EmojiItem \{([^}]+)\}/,
  (match, body) => {
    if (body.includes("animated")) return match; // already patched
    // Insert before closing brace
    const trimmed = body.trimEnd();
    return `export interface EmojiItem {${trimmed}\n  animated?: string;\n}`;
  },
);

// 5b. For each matched emoji, insert animated field into EMOJI_DATABASE entries
// Line-by-line approach: find `emoji: "X"`, then find its `keywords: [...]` line,
// and insert `animated: "..."` on the next line with matching indentation.
{
  const lines = patched.split("\n");
  const output = [];
  let i = 0;
  while (i < lines.length) {
    output.push(lines[i]);

    // Check if this line has an emoji: "..." that matches
    const emojiMatch = lines[i].match(/^(\s*)emoji:\s*"([^"]+)"/);
    if (emojiMatch) {
      const emojiVal = emojiMatch[2];
      const relPath = matched.get(emojiVal);
      if (relPath) {
        // Scan forward to find the keywords line (may span multiple lines)
        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^\s*keywords:\s*\[/)) {
          j++;
        }
        if (j < lines.length) {
          // keywords may span multiple lines — find the closing ],
          let k = j;
          while (k < lines.length && !lines[k].includes("],")) {
            k++;
          }
          // k is now the line with the closing ],
          // Push lines from i+1 to k
          for (let n = i + 1; n <= k; n++) {
            output.push(lines[n]);
          }
          // Check if next line already has animated:
          const nextLine = lines[k + 1] || "";
          if (!nextLine.includes("animated:")) {
            const indent = emojiMatch[1]; // same indent as emoji:
            output.push(`${indent}animated: "${relPath}",`);
          }
          i = k + 1;
          continue;
        }
      }
    }
    i++;
  }
  patched = output.join("\n");
}

fs.writeFileSync(GENERATED_FILE, patched);
console.log("Patched emoji-data.generated.ts");

// Print some stats
console.log("\nSummary:");
console.log(`  Animated files remaining: ${matched.size}`);
console.log(`  Files deleted: ${unmatched.length}`);
console.log(
  `  Emoji entries with animated field: ${matched.size}`,
);
