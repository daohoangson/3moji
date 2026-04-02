# Find It! - Non-English Topics for Language Learning

## High-Level Feature Specification

### Overview

Extend the topic system with a `language` field so topics can teach vocabulary in any language. The emoji provides the visual "translation" — the child sees a foreign word, hears it pronounced in that language, and taps the matching emoji. This turns Find It! into a language learning tool without changing the core gameplay.

### Problem

All 19 topics currently assume English vocabulary. The 12-con-giap topic already uses Vietnamese words but has no language metadata, so the speech system mispronounces them in English. There is no way for parents to use the app to introduce their child to a second language.

### Pain Points

- Parents who want bilingual exposure have no structured option.
- The speech system is hardcoded to English voices, making non-English topics sound wrong.
- The 12-con-giap topic works visually but fails audibly — "Tí" is spoken with English phonetics.
- No visual indicator tells parents which language a topic teaches.

### Analysis Summary

- The topic schema is minimal (`word` + `emoji`) and easy to extend with an optional `language` field.
- Browser speech synthesis supports 40+ languages on most devices — no external TTS service needed.
- The existing immersive design (emoji = meaning, word = label) naturally supports foreign vocabulary without requiring bilingual UI.
- Non-English topics create new indexable pages targeting language-learning keywords (e.g., "learn French animals for kids").

### Navigation & Discoverability

- `/topics` remains English-only — no language mixing.
- Each language gets a dedicated landing page: `/learn/french`, `/learn/vietnamese`, etc.
- Language pages mirror the topics page structure (grouped by level) but scoped to that language, linking to standard `/topics/[topicId]` routes.
- Each language page includes SEO-friendly content describing the language learning value.
- Home page links to available languages (e.g., a "Learn a Language" section or cards).
- Play uses existing routes — language topics are regular topics with IDs like `animals-fr`, so `/topics/animals-fr/play` just works.

### Approach Chosen

- Add an optional `language` field (BCP 47 code) to the Topic schema. When absent, English is assumed.
- Make the speech system language-aware: select a voice matching the topic's language.
- Thread the language code from topic data through the play session to the GameScreen component.
- Annotate the existing 12-con-giap topic with `language: "vi"`.
- Add 2–3 initial non-English topics (e.g., French animals, Vietnamese fruits) as regular topics with language-suffixed IDs.
- Create `/learn/[language]` route as a browse/landing page that filters and links to language topics.

### Non-Goals

- Full bilingual mode (showing both English and foreign words simultaneously).
- UI internationalization (menus, buttons, instructions remain in English).
- Custom pronunciation audio files — rely on browser speech synthesis.
- Language-specific keyboard input or text entry.

### Example User Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Home Page                                                   │
│                                                              │
│  Featured Topics          Learn a Language                   │
│  ┌──────────┐  ┌──────┐  ┌──────────┐  ┌──────────┐       │
│  │ 🐾       │  │ 🍎   │  │ 🇫🇷        │  │ 🇻🇳        │       │
│  │ Animals  │  │Fruits│  │ French   │  │Vietnamese│       │
│  └──────────┘  └──────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────┘

                    ↓ tap "French"

┌─────────────────────────────────────────────────────────────┐
│  /learn/french                                               │
│                                                              │
│  🇫🇷 Learn French                                             │
│                                                              │
│  Level 1 - Explorer                                          │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ 🐾 Animaux   │  │ 🍎 Fruits    │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘

                    ↓ tap "Animaux"

┌─────────────────────────────────────────────────────────────┐
│  /topics/animals-fr/play  (reuses existing play route)       │
│                                                              │
│           🔊 Trouve : chat                                   │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │     🐶     │  │     🐱     │  │     🐰     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  Speech: "chat" spoken with French voice                     │
└─────────────────────────────────────────────────────────────┘
```

### Open Questions

1. What initial languages should we support? Candidates: French, Vietnamese, Spanish, Japanese.
2. Should the "Find:" label also be translated (e.g., "Trouve :" in French) or stay in English for parent readability?
