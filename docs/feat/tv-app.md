# Find It! - TV App

## High-Level Feature Specification

### Overview

Adapt Find It! for television screens (Android TV, Fire TV, Apple TV via browser, smart TVs). The game's simple 3-option mechanic maps naturally to a remote control. The main work is adding spatial navigation (arrow keys / D-pad), enhancing focus indicators for 10-foot viewing distance, and scaling up UI elements.

### Problem

The app is touch-first and mouse-friendly. It partially supports keyboard input (1/2/3 keys select options), but lacks the spatial navigation, focus management, and visual scaling needed for a comfortable TV experience. A parent cannot hand their child a TV remote and expect the app to work.

### Pain Points

- No arrow key or D-pad navigation — TV remotes cannot select game options or browse topics.
- Focus indicators are subtle (thin ring, 30% opacity) — invisible from a couch.
- Small UI elements (progress dots at 8px, navigation buttons) are unreadable at 10-foot distance.
- Topic cards rely on hover effects that don't exist on TV.
- No way to install the app on a TV home screen.

### Analysis Summary

- The existing keyboard support (1/2/3 for game cards, Escape for back) proves the interaction model works without touch. Arrow keys + Enter would complete the picture.
- The 3-card game layout is ideal for TV: left/right navigation with a clear selection.
- Most TV browsers support standard web APIs including focus management and keyboard events.
- A spatial navigation hook can be reused across all screens (game, topic list, summary).
- PWA manifest updates enable "Add to Home Screen" on Android TV and Fire TV.

### Approach Chosen

**Phase 1: Playable on TV**

- Build a reusable spatial navigation hook: arrow keys move focus, Enter/Space selects.
- Integrate into GameScreen: Left/Right navigates the 3 cards, Enter selects. Large bright focus ring (8px+, high contrast, glow effect).
- Integrate into topic list pages: arrow keys navigate the topic grid, Enter opens a topic.
- Add enhanced focus styles in global CSS for 10-foot visibility.

**Phase 2: Optimized for TV**

- Add TV breakpoint (min-width: 1920px) to scale up progress dots, text, and buttons.
- Update PWA manifest: `orientation: "any"`, `display: "fullscreen"`, education category.
- Optional: Gamepad API support for game controllers (map D-pad + A/B buttons).

### Non-Goals

- Native TV app (Android TV APK, tvOS app) — web-only for now.
- Voice control or Alexa/Google Assistant integration.
- Multi-player or second-screen companion features.
- TV-specific content or topics.

### Example TV Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                        🔊 Find: elephant                             │
│                                                                      │
│     ┌──────────────┐    ╔══════════════╗    ┌──────────────┐        │
│     │              │    ║              ║    │              │        │
│     │              │    ║   FOCUSED    ║    │              │        │
│     │     🦁       │    ║     🐘       ║    │     🐻       │        │
│     │              │    ║              ║    │              │        │
│     │              │    ║  ◄ bright    ║    │              │        │
│     │              │    ║    glow ►    ║    │              │        │
│     └──────────────┘    ╚══════════════╝    └──────────────┘        │
│                                                                      │
│                    ← D-pad →        [OK] Select                      │
│                                                                      │
│     ● ● ● ● ◉ ○ ○ ○ ○ ○    Round 5 of 10                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

Remote controls:
  ← →     Navigate between cards
  OK      Select the focused card
  Back    Return to previous screen
```

### Open Questions

1. Should we auto-detect TV mode (large screen + no touch + coarse pointer) or add a manual toggle?
2. Should the TV layout always be landscape, or support both orientations?
3. Is Gamepad API support (Xbox/PlayStation controllers) worth the effort for the initial release?
4. Which TV platforms should we prioritize for testing? Android TV and Fire TV are the most web-friendly.
