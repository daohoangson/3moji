/**
 * Generate comprehensive coverage test combining:
 * 1. Existing matches (words that currently resolve correctly)
 * 2. Expected matches (words that SHOULD resolve but don't yet)
 */

import { NAME_TO_EMOJI, EMOJI_TO_CATEGORY } from "../lib/emoji-data.generated";
import { readFileSync } from "fs";
import { EXPECTED_EMOJI_MAPPINGS } from "./expected-emoji-mappings";

const normalizeEmoji = (emoji: string) => emoji.replace(/[\uFE0E\uFE0F]/g, "");

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

// Get all words from google-10000-english.txt
const content = readFileSync(
  ".cache/emoji-data/google-10000-english.txt",
  "utf-8",
);
const words = content.split("\n").filter(Boolean);

// Collect existing matches
const existingPairs: Array<[string, string]> = [];
for (const word of words) {
  const result = findEmojiByName(word);
  if (result) {
    existingPairs.push([word, result.emoji]);
  }
}

// Add expected mappings
const expectedPairsMap = new Map(
  EXPECTED_EMOJI_MAPPINGS.map(([word, emoji]) => [word, emoji]),
);

// Merge: existing + expected (dedupe by word, prefer existing if both exist)
const allPairsMap = new Map<string, string>();

// Add existing matches first
for (const [word, emoji] of existingPairs) {
  allPairsMap.set(word, emoji);
}

// Add expected matches that don't exist yet
for (const [word, emoji] of expectedPairsMap) {
  if (!allPairsMap.has(word)) {
    allPairsMap.set(word, emoji);
  }
}

// Convert to sorted array
const allPairs = Array.from(allPairsMap.entries()).sort((a, b) => {
  // Sort by word frequency (position in original list)
  const aIndex = words.indexOf(a[0]);
  const bIndex = words.indexOf(b[0]);
  return aIndex - bIndex;
});

// Generate test file content
const testContent = `
describe("google-10000-english coverage", () => {
  // Comprehensive coverage test combining:
  // 1. Current matches: ${existingPairs.length} words that resolve correctly
  // 2. Expected matches: ${expectedPairsMap.size} words that SHOULD resolve (improvement targets)
  // Total: ${allPairs.length} word→emoji pairs
  //
  // This test documents BOTH what works AND what should work.
  // Failed tests represent opportunities to improve the emoji generation pipeline.

  const WORD_EMOJI_PAIRS: Array<[string, string]> = [
${allPairs.map(([word, emoji]) => `    ["${word}", "${emoji}"],`).join("\n")}
  ];

  it("should match word→emoji pairs from google-10000-english (current + expected)", () => {
    let matched = 0;
    let failed = 0;
    const failures: Array<{ word: string; expected: string; actual: string | null }> = [];

    for (const [word, expectedEmoji] of WORD_EMOJI_PAIRS) {
      const result = findEmojiByName(word);
      if (result && result.emoji === expectedEmoji) {
        matched++;
      } else {
        failed++;
        failures.push({
          word,
          expected: expectedEmoji,
          actual: result?.emoji || null,
        });
      }
    }

    const total = WORD_EMOJI_PAIRS.length;
    const percentage = (matched / total) * 100;

    console.log("\\n" + "=".repeat(80));
    console.log("GOOGLE-10000-ENGLISH EMOJI COVERAGE REPORT");
    console.log("=".repeat(80));
    console.log(\`Total word→emoji pairs: \${total}\`);
    console.log(\`  Currently working: ${existingPairs.length} (from 10k list)\`);
    console.log(\`  Should work: ${expectedPairsMap.size} (improvement targets)\`);
    console.log(\`Matched: \${matched}\`);
    console.log(\`Failed: \${failed}\`);
    console.log(\`Coverage: \${percentage.toFixed(2)}%\`);
    console.log(\`Target: 100% (${allPairs.length}/${allPairs.length} pairs)\`);
    console.log("=".repeat(80));

    if (failures.length > 0) {
      const failureCount = Math.min(failures.length, 100);
      console.log(\`\\nFirst \${failureCount} failures (opportunities for improvement):\`);
      failures.slice(0, failureCount).forEach(({ word, expected, actual }) => {
        console.log(\`  \${word.padEnd(20)} → expected \${expected} got \${actual || "null"}\`);
      });
      if (failures.length > 100) {
        console.log(\`\\n...and \${failures.length - 100} more failures not shown.\`);
      }
    }
    console.log("=".repeat(80) + "\\n");

    // Assert current baseline (${existingPairs.length} existing matches)
    // As we improve the pipeline, this percentage will increase toward 100%
    const currentBaseline = ${existingPairs.length};
    expect(matched).toBeGreaterThanOrEqual(currentBaseline);
    expect(percentage).toBeGreaterThan(${((existingPairs.length / allPairs.length) * 100 - 1).toFixed(1)});
  });
});
`;

console.log(`Generated test with ${allPairs.length} total pairs:`);
console.log(`  - ${existingPairs.length} current matches`);
console.log(`  - ${expectedPairsMap.size} expected improvements`);
console.log(`  - ${allPairs.length - existingPairs.length} net new targets`);
console.log(testContent);
