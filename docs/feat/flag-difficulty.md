# Find It! - Flag Difficulty Indicators

## High-Level Feature Specification

### Overview

Make flag topic difficulty intentional rather than random. Easy rounds should pair visually distinct flags (France vs Vietnam). Hard rounds should pair confusingly similar flags (France vs Netherlands). Add visual similarity metadata to flags and use it to select smarter distractors.

### Problem

The three flag topics (easy, medium, hard) differ only in which countries are included — not in how the game plays. Distractor selection is purely random, so an "easy" round might accidentally pair two similar tricolor flags, while a "hard" round might pair two completely different flags. The difficulty label doesn't match the actual challenge.

### Pain Points

- A child playing flags-easy can face a hard round by chance (e.g., France 🇫🇷 vs Italy 🇮🇹).
- A child playing flags-hard can face a trivial round by chance (e.g., Nepal 🇳🇵 vs Bahrain 🇧🇭).
- Parents cannot trust the difficulty label to match their child's ability.
- The flags landing page says "distinguish similar-looking flags" for hard mode, but the game doesn't actually do this.

### Analysis Summary

- The codebase already has similarity-aware distractor selection for emojis (`areVisuallySimilar()` in `lib/emoji-data.ts`) and colors (`COLOR_GROUPS` in `lib/game-content.ts`). The pattern is proven.
- Flags can be tagged by visual characteristics: pattern (tricolor, bicolor, canton, cross, complex), dominant colors, and presence of an emblem.
- A similarity score between two flags can drive distractor selection: low similarity for easy, high similarity for hard.
- This requires a new metadata file (~100 flag entries) but no schema changes.

### Approach Chosen

- Create a flag similarity metadata file tagging each flag with visual characteristics (pattern type, dominant colors, emblem).
- Implement a similarity scoring function that compares two flags based on shared traits.
- Modify `buildSession` to use similarity when selecting distractors for flag topics:
  - **flags-easy**: Pick distractors with low similarity (very different flags).
  - **flags-medium**: Random selection (current behavior).
  - **flags-hard**: Prefer distractors with high similarity (confusingly similar flags).
- Update the flags landing page to show example difficulty comparisons.

### Non-Goals

- Changing which countries belong to which flag topic.
- Adding per-round difficulty adaptation (always same difficulty within a topic).
- Computer vision or automated flag analysis — tags are manually curated.

### Example Difficulty Comparisons

```
Easy (flags-easy):
  Target: 🇫🇷 France    Distractors: 🇯🇵 Japan, 🇧🇷 Brazil
  → Tricolor vs circle-on-white vs diamond-on-green. Visually obvious.

Hard (flags-hard):
  Target: 🇫🇷 France    Distractors: 🇳🇱 Netherlands, 🇷🇺 Russia
  → All three are red-white-blue tricolors. Requires knowing stripe order.

Medium (flags-medium):
  Target: 🇻🇳 Vietnam   Distractors: 🇹🇭 Thailand, 🇮🇩 Indonesia
  → Some color overlap but different patterns. Moderate challenge.
```

### Open Questions

1. Should flags-medium also use similarity-aware selection (moderate similarity), or keep random for simplicity?
2. How many visual tags per flag are sufficient? Proposal: pattern, 2-3 dominant colors, has-emblem boolean.
3. Should the difficulty comparison examples on the flags page be static or pulled dynamically from actual game data?
