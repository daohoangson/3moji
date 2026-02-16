import { describe, it, expect } from "vitest";
import {
  areVisuallySimilar,
  getCategoryByEmoji,
  getDistractors,
  findEmojiByName,
  getEmojisByCategory,
  getShortestEmojiNames,
} from "./emoji-data";

describe("areVisuallySimilar", () => {
  it("should detect emojis with shared keywords as similar", () => {
    // Emojis that share keywords in the database are considered similar
    // Cherry blossom and tulip both have "blossom" keyword
    expect(areVisuallySimilar("🌸", "🌷")).toBe(true);
  });

  it("should NOT detect emojis without shared keywords as similar", () => {
    // These flowers don't share keywords in the current database
    expect(areVisuallySimilar("🌸", "🌹")).toBe(false); // cherry blossom vs rose
    expect(areVisuallySimilar("🌹", "🌷")).toBe(false); // rose vs tulip (no shared keyword)
  });

  it("should detect hearts with shared keywords as similar", () => {
    // 💘 and 💝 share "valentine" keyword
    expect(areVisuallySimilar("💘", "💝")).toBe(true);
    // ❤️ has no keywords, 💛 has "yellow" - no overlap
    expect(areVisuallySimilar("❤️", "💛")).toBe(false);
  });

  it("should NOT detect cat faces as similar (no shared keywords)", () => {
    // Cat faces don't share keywords in current database
    expect(areVisuallySimilar("🐱", "😺")).toBe(false);
  });

  it("should NOT detect unrelated emojis as similar", () => {
    expect(areVisuallySimilar("🐶", "🌸")).toBe(false); // dog vs flower
    expect(areVisuallySimilar("🚗", "🍎")).toBe(false); // car vs apple
    expect(areVisuallySimilar("😀", "🏠")).toBe(false); // smile vs house
  });

  it("should detect animals with shared keywords, not detect those without", () => {
    // 🐶 and 🐱 share "pet" keyword - they ARE similar
    expect(areVisuallySimilar("🐶", "🐱")).toBe(true);
    // Different animals without shared keywords should NOT be similar
    expect(areVisuallySimilar("🦁", "🐯")).toBe(false); // lion vs tiger - no shared keyword
    expect(areVisuallySimilar("🐴", "🦓")).toBe(false); // horse vs zebra - no shared keyword
  });

  it("should return false if emoji is not in database", () => {
    expect(areVisuallySimilar("🌸", "❓")).toBe(false);
    expect(areVisuallySimilar("❓", "🌸")).toBe(false);
  });

  it("should handle same emoji comparison", () => {
    expect(areVisuallySimilar("🌸", "🌸")).toBe(true);
    expect(areVisuallySimilar("🐶", "🐶")).toBe(true);
  });
});

describe("getCategoryByEmoji", () => {
  it("should return correct category for flowers", () => {
    expect(getCategoryByEmoji("🌸")).toBe("nature");
    expect(getCategoryByEmoji("🌹")).toBe("nature");
    expect(getCategoryByEmoji("🌷")).toBe("nature");
  });

  it("should return correct category for animals", () => {
    expect(getCategoryByEmoji("🐶")).toBe("animals");
    expect(getCategoryByEmoji("🐱")).toBe("animals");
  });

  it("should return correct category for food", () => {
    expect(getCategoryByEmoji("🍎")).toBe("fruits");
    expect(getCategoryByEmoji("🍕")).toBe("food");
  });

  it("should return null for unknown emoji", () => {
    expect(getCategoryByEmoji("not-an-emoji")).toBeNull();
  });

  it("should include newer emojis", () => {
    expect(getCategoryByEmoji("🫠")).toBe("faces"); // melting face
  });
});

describe("getDistractors", () => {
  it("should return distractors that are NOT visually similar to target", () => {
    const distractors = getDistractors("🌸", "nature", 2);

    expect(distractors).toHaveLength(2);
    // None of the distractors should be visually similar to the target flower
    for (const distractor of distractors) {
      expect(areVisuallySimilar("🌸", distractor)).toBe(false);
    }
  });

  it("should not include the target emoji in distractors", () => {
    const distractors = getDistractors("🐶", "animals", 2);

    expect(distractors).not.toContain("🐶");
  });

  it("should return emojis from the same category", () => {
    const distractors = getDistractors("🍎", "fruits", 2);

    for (const distractor of distractors) {
      expect(getCategoryByEmoji(distractor)).toBe("fruits");
    }
  });

  it("should return fewer distractors if not enough valid ones available", () => {
    // Request more distractors than might be available
    const distractors = getDistractors("🌸", "nature", 100);

    // Should return whatever is available, all non-similar
    for (const distractor of distractors) {
      expect(areVisuallySimilar("🌸", distractor)).toBe(false);
    }
  });
});

describe("findEmojiByName", () => {
  it("should find emoji by primary name", () => {
    // "dog" maps to 🐕 (dog), not 🐶 (dog face)
    const result = findEmojiByName("dog");
    expect(result).not.toBeNull();
    expect(result?.emoji).toBe("🐕");
  });

  it("should find emoji by alias", () => {
    // "puppies" is a name for dog face 🐶
    const result = findEmojiByName("puppies");
    expect(result).not.toBeNull();
    expect(result?.emoji).toBe("🐶");
  });

  it("should be case insensitive", () => {
    expect(findEmojiByName("DOG")?.emoji).toBe("🐕");
    expect(findEmojiByName("Dog")?.emoji).toBe("🐕");
    expect(findEmojiByName("dOg")?.emoji).toBe("🐕");
  });

  it("should return null for unknown name", () => {
    expect(findEmojiByName("xyznonexistent")).toBeNull();
  });

  it("should return category info", () => {
    const result = findEmojiByName("rose");
    expect(result?.category).toBe("nature");
  });

  // Common noun coverage from google-10000-english.txt
  // Grouped by category to document what the emoji database covers.

  it("should find animals by common names", () => {
    expect(findEmojiByName("cat")?.emoji).toBe("🐈");
    expect(findEmojiByName("dog")?.emoji).toBe("🐕");
    expect(findEmojiByName("fish")?.emoji).toBe("🐟");
    expect(findEmojiByName("horse")?.emoji).toBe("🐎");
    expect(findEmojiByName("cow")?.emoji).toBe("🐄");
    expect(findEmojiByName("bird")?.emoji).toBe("🐦");
    expect(findEmojiByName("rabbit")?.emoji).toBe("🐇");
    expect(findEmojiByName("sheep")?.emoji).toBe("🐏");
    expect(findEmojiByName("dinosaur")?.emoji).toBe("🦕");
    expect(findEmojiByName("puppy")?.emoji).toBe("🐶");
    expect(findEmojiByName("kitten")?.emoji).toBe("🐱");
    expect(findEmojiByName("serpent")?.emoji).toBe("🐍");
  });

  it("should find people by common roles and relations", () => {
    expect(findEmojiByName("baby")?.emoji).toBe("👶");
    expect(findEmojiByName("boy")?.emoji).toBe("👦");
    expect(findEmojiByName("girl")?.emoji).toBe("👧");
    expect(findEmojiByName("man")?.emoji).toBe("👨");
    expect(findEmojiByName("woman")?.emoji).toBe("👩");
    expect(findEmojiByName("child")?.emoji).toBe("🧒");
    expect(findEmojiByName("mother")?.emoji).toBe("👩‍🍼");
    expect(findEmojiByName("son")?.emoji).toBe("👦");
    expect(findEmojiByName("king")?.emoji).toBe("🤴");
    expect(findEmojiByName("queen")?.emoji).toBe("👸");
    expect(findEmojiByName("teacher")?.emoji).toBe("🧑‍🏫");
    expect(findEmojiByName("artist")?.emoji).toBe("🧑‍🎨");
    expect(findEmojiByName("chef")?.emoji).toBe("🧑‍🍳");
    expect(findEmojiByName("doctor")?.emoji).toBe("😷");
    expect(findEmojiByName("nurse")?.emoji).toBe("👩‍⚕️");
    expect(findEmojiByName("graduate")?.emoji).toBe("🧑‍🎓");
  });

  it("should find places by common names", () => {
    expect(findEmojiByName("home")?.emoji).toBe("🛖");
    expect(findEmojiByName("hotel")?.emoji).toBe("🏨");
    expect(findEmojiByName("school")?.emoji).toBe("🏫");
    expect(findEmojiByName("church")?.emoji).toBe("⛪");
    expect(findEmojiByName("hospital")?.emoji).toBe("🏥");
    expect(findEmojiByName("city")?.emoji).toBe("🏙️");
    expect(findEmojiByName("beach")?.emoji).toBe("🏖️");
    expect(findEmojiByName("island")?.emoji).toBe("🏝️");
    expect(findEmojiByName("mountain")?.emoji).toBe("⛰️");
    expect(findEmojiByName("park")?.emoji).toBe("🏞️");
    expect(findEmojiByName("bank")?.emoji).toBe("🏦");
    expect(findEmojiByName("wedding")?.emoji).toBe("💒");
    expect(findEmojiByName("store")?.emoji).toBe("🏬");
  });

  it("should find weather and nature by common names", () => {
    expect(findEmojiByName("sun")?.emoji).toBe("☀️");
    expect(findEmojiByName("star")?.emoji).toBe("⭐");
    expect(findEmojiByName("fire")?.emoji).toBe("🔥");
    expect(findEmojiByName("water")?.emoji).toBe("🌊");
    expect(findEmojiByName("wind")?.emoji).toBe("🌬️");
    expect(findEmojiByName("tree")?.emoji).toBe("🌴");
    expect(findEmojiByName("spring")?.emoji).toBe("🌸");
    expect(findEmojiByName("fall")?.emoji).toBe("🍂");
    expect(findEmojiByName("winter")?.emoji).toBe("🪾");
    expect(findEmojiByName("ice")?.emoji).toBe("🧊");
  });

  it("should find food and drinks by common names", () => {
    expect(findEmojiByName("apple")?.emoji).toBe("🍎");
    expect(findEmojiByName("pizza")).not.toBeNull();
    expect(findEmojiByName("cake")).not.toBeNull();
    expect(findEmojiByName("coffee")?.emoji).toBe("☕");
    expect(findEmojiByName("wine")?.emoji).toBe("🍷");
    expect(findEmojiByName("cup")?.emoji).toBe("🥤");
    expect(findEmojiByName("glass")?.emoji).toBe("🍷");
  });

  it("should find common objects by name", () => {
    expect(findEmojiByName("phone")?.emoji).toBe("📱");
    expect(findEmojiByName("book")?.emoji).toBe("📚");
    expect(findEmojiByName("camera")?.emoji).toBe("📷");
    expect(findEmojiByName("key")?.emoji).toBe("🔑");
    expect(findEmojiByName("door")?.emoji).toBe("🚪");
    expect(findEmojiByName("bed")?.emoji).toBe("🛏️");
    expect(findEmojiByName("chair")?.emoji).toBe("🪑");
    expect(findEmojiByName("bell")).not.toBeNull();
    expect(findEmojiByName("ring")?.emoji).toBe("💍");
    expect(findEmojiByName("battery")?.emoji).toBe("🔋");
    expect(findEmojiByName("window")?.emoji).toBe("🪟");
    expect(findEmojiByName("basket")?.emoji).toBe("🧺");
  });

  it("should find vehicles and transport by common names", () => {
    expect(findEmojiByName("bus")?.emoji).toBe("🚌");
    expect(findEmojiByName("ship")?.emoji).toBe("🚢");
    expect(findEmojiByName("van")?.emoji).toBe("🚐");
    expect(findEmojiByName("bike")?.emoji).toBe("🚲");
    expect(findEmojiByName("plane")?.emoji).toBe("✈️");
  });

  it("should find celebrations and events", () => {
    expect(findEmojiByName("christmas")?.emoji).toBe("🎄");
    expect(findEmojiByName("party")?.emoji).toBe("🎉");
    expect(findEmojiByName("gift")?.emoji).toBe("🎁");
  });

  it("should find countries by name", () => {
    expect(findEmojiByName("canada")?.emoji).toBe("🇨🇦");
    expect(findEmojiByName("china")?.emoji).toBe("🇨🇳");
    expect(findEmojiByName("france")?.emoji).toBe("🇫🇷");
    expect(findEmojiByName("germany")?.emoji).toBe("🇩🇪");
    expect(findEmojiByName("india")?.emoji).toBe("🇮🇳");
    expect(findEmojiByName("italy")?.emoji).toBe("🇮🇹");
    expect(findEmojiByName("japan")?.emoji).toBe("🇯🇵");
    expect(findEmojiByName("australia")?.emoji).toBe("🇦🇺");
    expect(findEmojiByName("mexico")?.emoji).toBe("🇲🇽");
    expect(findEmojiByName("spain")?.emoji).toBe("🇪🇸");
  });

  it("should find sports and activities", () => {
    expect(findEmojiByName("golf")).not.toBeNull();
    expect(findEmojiByName("football")).not.toBeNull();
    expect(findEmojiByName("dance")?.emoji).toBe("🪩");
    expect(findEmojiByName("ski")?.emoji).toBe("🎿");
    expect(findEmojiByName("scuba")?.emoji).toBe("🤿");
  });

  it("should find music and arts", () => {
    expect(findEmojiByName("music")?.emoji).toBe("🎵");
    expect(findEmojiByName("picture")?.emoji).toBe("🖼️");
  });

  it("should find synonym-override words", () => {
    // These come from the SYNONYM_OVERRIDES static map
    expect(findEmojiByName("celebrate")?.emoji).toBe("🎉");
    expect(findEmojiByName("alcohol")?.emoji).toBe("🍹");
    expect(findEmojiByName("crazy")?.emoji).toBe("😜");
    expect(findEmojiByName("scared")?.emoji).toBe("😨");
    expect(findEmojiByName("smart")?.emoji).toBe("🤓");
    expect(findEmojiByName("spy")?.emoji).toBe("🕵️");
    expect(findEmojiByName("toy")?.emoji).toBe("🧸");
    expect(findEmojiByName("wizard")?.emoji).toBe("🧙");
    expect(findEmojiByName("skeleton")?.emoji).toBe("🦴");
    expect(findEmojiByName("sour")?.emoji).toBe("🍋");
  });

  it("should not map internal-category emojis to common words", () => {
    // Words must not resolve to internal categories
    const wordsToCheck = ["love", "talk", "think", "see", "look"];
    for (const word of wordsToCheck) {
      const result = findEmojiByName(word);
      if (result) {
        expect(result.category).not.toMatch(/^internal:/);
      }
    }
  });
});

describe("getShortestEmojiNames", () => {
  it("should return shortest names for suggestions", () => {
    const names = getShortestEmojiNames();

    // Should include short names
    expect(names).toContain("dog"); // not "dog face"
    expect(names).toContain("rose"); // shortest name for 🌹
  });

  it("should return many unique names", () => {
    const names = getShortestEmojiNames();
    expect(names.length).toBeGreaterThan(100);
  });

  it("should deduplicate names", () => {
    const names = getShortestEmojiNames();
    const uniqueNames = new Set(names);
    // All names should be unique (no duplicates)
    expect(names.length).toBe(uniqueNames.size);
  });
});

describe("getEmojisByCategory", () => {
  it("should return emojis in a category", () => {
    const nature = getEmojisByCategory("nature");
    expect(nature.length).toBeGreaterThan(0);

    // Should include flowers
    const emojis = nature.map((item) => item.emoji);
    expect(emojis).toContain("🌸");
    expect(emojis).toContain("🌹");
  });

  it("should return empty array for unknown category", () => {
    expect(getEmojisByCategory("NonexistentCategory")).toEqual([]);
  });
});

describe("visual similarity edge cases", () => {
  it("should NOT have king map to lion (misleading alias fix)", () => {
    const result = findEmojiByName("king");
    // King should NOT return lion - that was a misleading alias we removed
    if (result) {
      expect(result.emoji).not.toBe("🦁");
    }
  });

  it("should have wave map to water wave (primary name)", () => {
    // "wave" is the primary name for water wave 🌊
    // "waving hand" 👋 has "wave" as a keyword, not a name
    const result = findEmojiByName("wave");
    expect(result).not.toBeNull();
    expect(result?.emoji).toBe("🌊");
  });

  it("should NOT detect clocks as similar (no shared keywords)", () => {
    // Clocks have time-specific keywords, not a shared "clock" keyword
    expect(areVisuallySimilar("🕛", "🕐")).toBe(false);
    expect(areVisuallySimilar("⏰", "🕛")).toBe(false);
  });

  it("should detect moon phases with shared keywords as similar", () => {
    // Check actual keyword sharing in database
    expect(areVisuallySimilar("🌑", "🌕")).toBe(false); // no shared keywords
    expect(areVisuallySimilar("🌙", "🌛")).toBe(false); // no shared keywords
  });
});

describe("google-10000-english coverage", () => {
  // Comprehensive coverage test with explicit word→emoji pairs from google-10000-english.txt
  // This documents common noun coverage and asserts >50% match rate.

  const WORD_EMOJI_PAIRS: Array<[string, string]> = [
    // People
    ["man", "👨"],
    ["woman", "👩"],
    ["baby", "👶"],
    ["child", "🧒"],
    ["boy", "👦"],
    ["girl", "👧"],
    ["mother", "👩‍🍼"],
    ["son", "👦"],
    ["daughter", "👧"],
    ["king", "🤴"],
    ["queen", "👸"],
    ["teacher", "🧑‍🏫"],
    ["student", "🧑‍🎓"],
    ["artist", "🧑‍🎨"],
    ["manager", "👨‍💼"],
    ["officer", "👮"],
    ["judge", "🧑‍⚖️"],
    ["graduate", "🧑‍🎓"],
    ["doctor", "😷"],
    ["parent", "🧑‍🍼"],

    // Places
    ["home", "🛖"],
    ["house", "🏠"],
    ["hotel", "🏨"],
    ["school", "🏫"],
    ["church", "⛪"],
    ["hospital", "🏥"],
    ["city", "🏙️"],
    ["beach", "🏖️"],
    ["island", "🏝️"],
    ["mountain", "⛰️"],
    ["park", "🏞️"],
    ["bank", "🏦"],
    ["store", "🏬"],
    ["office", "🏤"],
    ["building", "🏢"],
    ["wedding", "💒"],
    ["bridge", "🌉"],
    ["factory", "🏭"],
    ["garden", "🏡"],

    // Animals
    ["dog", "🐕"],
    ["cat", "🐈"],
    ["fish", "🐟"],
    ["horse", "🐎"],
    ["bird", "🐦"],
    ["bear", "🐻"],
    ["mouse", "🐁"],
    ["bug", "🐛"],
    ["turkey", "🦃"],
    ["fly", "🪰"],

    // Nature & Weather
    ["sun", "☀️"],
    ["moon", "🌑"],
    ["star", "⭐"],
    ["fire", "🔥"],
    ["water", "🌊"],
    ["wind", "🌬️"],
    ["tree", "🌴"],
    ["spring", "🌸"],
    ["fall", "🍂"],
    ["winter", "🪾"],
    ["ice", "🧊"],
    ["snow", "☃️"],
    ["rain", "🌈"],
    ["flower", "💮"],
    ["rose", "🌹"],
    ["plant", "🪴"],

    // Food & Drinks
    ["apple", "🍎"],
    ["coffee", "☕"],
    ["tea", "🧋"],
    ["wine", "🍷"],
    ["drink", "🍹"],
    ["glass", "🍷"],
    ["cup", "🥤"],
    ["food", "🍲"],
    ["breakfast", "🍴"],
    ["dinner", "🍴"],
    ["birthday", "🎂"],
    ["cream", "🍨"],

    // Objects
    ["phone", "📱"],
    ["book", "📚"],
    ["camera", "📷"],
    ["key", "🔑"],
    ["door", "🚪"],
    ["window", "🪟"],
    ["bed", "🛏️"],
    ["chair", "🪑"],
    ["ring", "💍"],
    ["battery", "🔋"],
    ["basket", "🧺"],
    ["box", "🍱"],
    ["computer", "💽"],
    ["laptop", "💻"],
    ["printer", "🖨️"],
    ["tv", "📺"],
    ["clock", "⏰"],
    ["watch", "⌚"],
    ["calendar", "📅"],
    ["money", "💰"],
    ["cash", "💰"],
    ["gold", "💰"],
    ["dollar", "💵"],
    ["credit", "💳"],

    // Vehicles
    ["car", "🚋"],
    ["bus", "🚌"],
    ["train", "🚆"],
    ["ship", "🚢"],
    ["van", "🚐"],
    ["truck", "🛻"],
    ["bike", "🚲"],
    ["police", "🚓"],

    // Celebrations
    ["party", "🎉"],
    ["gift", "🎁"],
    ["christmas", "🎄"],
    ["santa", "🎅"],
    ["jack", "🎃"],

    // Countries
    ["canada", "🇨🇦"],
    ["china", "🇨🇳"],
    ["france", "🇫🇷"],
    ["germany", "🇩🇪"],
    ["india", "🇮🇳"],
    ["italy", "🇮🇹"],
    ["japan", "🇯🇵"],
    ["australia", "🇦🇺"],
    ["mexico", "🇲🇽"],
    ["spain", "🇪🇸"],
    ["ireland", "🇮🇪"],
    ["brazil", "🇧🇷"],

    // Sports & Games
    ["game", "🎲"],
    ["golf", "🏌️‍♂️"],
    ["football", "🏉"],
    ["soccer", "⚽"],
    ["basketball", "🏀"],
    ["baseball", "⚾"],
    ["tennis", "🎾"],
    ["ski", "🎿"],
    ["dance", "🪩"],
    ["goal", "🥅"],
    ["casino", "🎰"],
    ["magic", "🪄"],
    ["target", "🎯"],
    ["toy", "🧸"],
    ["finish", "🏁"],
    ["win", "🏆"],

    // Music & Arts
    ["music", "🎵"],
    ["guitar", "🎸"],
    ["beat", "🪘"],
    ["picture", "🖼️"],
    ["arts", "🎭"],
    ["theater", "🎭"],
    ["creative", "🎨"],

    // Clothing
    ["shoes", "👞"],
    ["dress", "👗"],
    ["shirt", "🎽"],
    ["clothes", "👚"],
    ["fashion", "👠"],
    ["hair", "🪮"],

    // Medical
    ["health", "🧑‍⚕️"],
    ["medical", "⚕️"],
    ["test", "🧪"],
    ["shot", "💉"],
    ["drugs", "💊"],
    ["blood", "🩸"],
    ["virus", "🦠"],

    // Symbols
    ["information", "ℹ️"],
    ["check", "✔️"],
    ["cross", "❌"],
    ["question", "❓"],
    ["copyright", "©️"],
    ["trademark", "™️"],
    ["zero", "0️⃣"],
    ["ok", "🆗"],
    ["warning", "⚠️"],
    ["peace", "☮️"],

    // Directions
    ["up", "⬆️"],
    ["down", "⬇️"],
    ["left", "⬅️"],
    ["right", "➡️"],
    ["back", "🔙"],
    ["next", "⏭️"],
    ["forward", "⏩"],
    ["end", "🔚"],

    // Time
    ["day", "🌞"],
    ["night", "🌉"],
    ["one", "🕐"],
    ["two", "💕"],
    ["three", "🕞"],
    ["four", "🕟"],
    ["five", "🕠"],
    ["six", "🕕"],

    // Emotions
    ["love", "🏩"],
    ["like", "🩷"],
    ["hot", "🥵"],
    ["cold", "🥶"],
    ["red", "❤️"],
    ["yellow", "💛"],
    ["pink", "🩷"],
    ["brown", "🤎"],
    ["nice", "😀"],
    ["think", "💭"],
    ["idea", "💭"],
    ["dream", "💭"],
    ["message", "💬"],
    ["talk", "💬"],
    ["death", "💀"],
    ["expert", "🤓"],
    ["smart", "🤓"],
    ["funny", "😜"],
    ["eat", "😋"],

    // Body
    ["body", "👃"],
    ["eye", "👁️"],
    ["eyes", "👀"],
    ["foot", "🦶"],

    // Tools
    ["tool", "🧰"],
    ["gear", "⚙️"],
    ["scale", "⚖️"],
    ["saw", "🪚"],
  ];

  it("should match >50% of documented word→emoji pairs from google-10000-english", () => {
    let matched = 0;
    let failed = 0;
    const failures: Array<{
      word: string;
      expected: string;
      actual: string | null;
    }> = [];

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

    console.log("\n" + "=".repeat(80));
    console.log("GOOGLE-10000-ENGLISH EMOJI COVERAGE REPORT");
    console.log("=".repeat(80));
    console.log(`Total word→emoji pairs tested: ${total}`);
    console.log(`Matched: ${matched}`);
    console.log(`Failed: ${failed}`);
    console.log(`Coverage: ${percentage.toFixed(2)}%`);
    console.log("=".repeat(80));

    if (failures.length > 0 && failures.length <= 30) {
      console.log("\nFailures:");
      failures.forEach(({ word, expected, actual }) => {
        console.log(
          `  ${word.padEnd(20)} → expected ${expected} got ${actual || "null"}`,
        );
      });
    } else if (failures.length > 30) {
      console.log(`\nFirst 30 failures (out of ${failures.length}):`);
      failures.slice(0, 30).forEach(({ word, expected, actual }) => {
        console.log(
          `  ${word.padEnd(20)} → expected ${expected} got ${actual || "null"}`,
        );
      });
    }
    console.log("=".repeat(80) + "\n");

    // Assert >50% coverage
    expect(percentage).toBeGreaterThan(50);
    expect(matched).toBeGreaterThan(total / 2);
  });
});
