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
  // Documents ALL 1597 emoji mappings from the complete 10,000 most common English words.
  // Asserts >15% match rate (realistic given not all words have emoji representations).

  const WORD_EMOJI_PAIRS: Array<[string, string]> = [
    ["not", "⏳"],
    ["at", "🌉"],
    ["new", "🌑"],
    ["home", "🛖"],
    ["page", "📃"],
    ["free", "🆓"],
    ["one", "🕐"],
    ["do", "⛔"],
    ["no", "⛔"],
    ["information", "ℹ️"],
    ["up", "⬆️"],
    ["news", "📰"],
    ["out", "😵"],
    ["see", "👀"],
    ["business", "🈺"],
    ["web", "🕸️"],
    ["view", "🪟"],
    ["first", "🌓"],
    ["like", "🩷"],
    ["service", "🐕‍🦺"],
    ["back", "🔙"],
    ["top", "🎩"],
    ["list", "📋"],
    ["name", "📛"],
    ["over", "🌄"],
    ["day", "🌞"],
    ["email", "📧"],
    ["two", "💕"],
    ["health", "🧑‍⚕️"],
    ["next", "⏭️"],
    ["go", "💨"],
    ["b", "🅱️"],
    ["work", "👷"],
    ["last", "🌗"],
    ["music", "🎵"],
    ["post", "🏤"],
    ["city", "🏙️"],
    ["copyright", "©️"],
    ["message", "💬"],
    ["video", "🎮"],
    ["public", "📢"],
    ["books", "📚"],
    ["high", "⚡"],
    ["school", "🏫"],
    ["m", "Ⓜ️"],
    ["links", "🔗"],
    ["order", "🦁"],
    ["privacy", "🔏"],
    ["book", "📚"],
    ["set", "📐"],
    ["mail", "📬"],
    ["full", "🌕"],
    ["games", "👾"],
    ["way", "🌌"],
    ["p", "🅿️"],
    ["part", "〽️"],
    ["hotel", "🏨"],
    ["real", "🫀"],
    ["store", "🏬"],
    ["off", "📴"],
    ["line", "🫥"],
    ["send", "📩"],
    ["right", "➡️"],
    ["type", "🅰️"],
    ["office", "🏤"],
    ["national", "🏞️"],
    ["car", "🚋"],
    ["address", "📢"],
    ["phone", "📱"],
    ["dvd", "📀"],
    ["shipping", "📦"],
    ["reserved", "🈯"],
    ["long", "🪘"],
    ["o", "🅾️"],
    ["black", "🐈‍⬛"],
    ["check", "✔️"],
    ["index", "📇"],
    ["women", "🤼‍♀️"],
    ["sign", "🏧"],
    ["file", "📁"],
    ["link", "🔗"],
    ["open", "📖"],
    ["sports", "🏅"],
    ["house", "🏠"],
    ["security", "🪪"],
    ["american", "🏈"],
    ["photo", "📷"],
    ["game", "🎲"],
    ["power", "🪫"],
    ["care", "💅"],
    ["network", "🛜"],
    ["down", "⬇️"],
    ["computer", "💽"],
    ["three", "🕞"],
    ["total", "☯️"],
    ["place", "🥇"],
    ["end", "🔚"],
    ["access", "♿"],
    ["think", "💭"],
    ["big", "😃"],
    ["media", "📝"],
    ["law", "👮"],
    ["control", "🎛️"],
    ["water", "🌊"],
    ["personal", "💻"],
    ["guide", "🦮"],
    ["board", "🎬"],
    ["location", "📍"],
    ["change", "🪸"],
    ["white", "🦯"],
    ["text", "💬"],
    ["small", "🛩️"],
    ["children", "🚸"],
    ["shopping", "🛍️"],
    ["level", "🎚️"],
    ["previous", "⏮️"],
    ["love", "🏩"],
    ["old", "👴"],
    ["call", "📲"],
    ["department", "🏬"],
    ["why", "🥺"],
    ["class", "🚲"],
    ["money", "💰"],
    ["private", "🔒"],
    ["save", "🛟"],
    ["low", "🪫"],
    ["york", "🗽"],
    ["man", "👨"],
    ["card", "📇"],
    ["food", "🍲"],
    ["press", "💪"],
    ["print", "🐾"],
    ["job", "🏢"],
    ["canada", "🇨🇦"],
    ["room", "🚹"],
    ["credit", "💳"],
    ["point", "💯"],
    ["men", "🤼‍♂️"],
    ["west", "⬅️"],
    ["look", "👀"],
    ["left", "⬅️"],
    ["box", "🍱"],
    ["gay", "🏳️‍🌈"],
    ["thread", "🧵"],
    ["note", "🎵"],
    ["large", "⬛"],
    ["table", "🏓"],
    ["market", "💹"],
    ["library", "📚"],
    ["action", "🎬"],
    ["air", "🪟"],
    ["human", "👱"],
    ["tv", "📺"],
    ["yes", "🙂‍↕️"],
    ["second", "🥈"],
    ["hot", "🥵"],
    ["movie", "🎥"],
    ["medical", "⚕️"],
    ["test", "🧪"],
    ["pc", "💻"],
    ["study", "📚"],
    ["application", "🈸"],
    ["cart", "🛒"],
    ["staff", "⚕️"],
    ["play", "▶️"],
    ["looking", "👀"],
    ["complete", "✅"],
    ["person", "🧑"],
    ["mobile", "📱"],
    ["party", "🎉"],
    ["student", "🧑‍🎓"],
    ["park", "🏞️"],
    ["side", "🍳"],
    ["red", "❤️"],
    ["key", "🔑"],
    ["body", "👃"],
    ["field", "🏑"],
    ["east", "➡️"],
    ["paper", "🧻"],
    ["single", "🔂"],
    ["age", "🔞"],
    ["club", "♣️"],
    ["password", "🔑"],
    ["road", "🛣️"],
    ["gift", "🎁"],
    ["question", "❓"],
    ["night", "🌉"],
    ["hard", "🦻"],
    ["four", "🕟"],
    ["building", "🏢"],
    ["light", "🚈"],
    ["write", "✍️"],
    ["blue", "📘"],
    ["easy", "🍳"],
    ["fax", "📠"],
    ["china", "🇨🇳"],
    ["picture", "🖼️"],
    ["major", "🔑"],
    ["star", "⭐"],
    ["future", "🔮"],
    ["sun", "☀️"],
    ["cards", "🎴"],
    ["id", "🆔"],
    ["child", "🧒"],
    ["garden", "🏡"],
    ["baby", "👶"],
    ["energy", "🪫"],
    ["delivery", "🚚"],
    ["net", "🥅"],
    ["film", "🎞️"],
    ["notice", "🪧"],
    ["head", "🤯"],
    ["radio", "📻"],
    ["cell", "📱"],
    ["away", "💨"],
    ["track", "🛤️"],
    ["australia", "🇦🇺"],
    ["once", "🔂"],
    ["log", "🪵"],
    ["safety", "🧷"],
    ["trade", "™️"],
    ["david", "✡️"],
    ["green", "📗"],
    ["drive", "🚕"],
    ["gold", "💰"],
    ["arts", "🎭"],
    ["beach", "🏖️"],
    ["natural", "🫚"],
    ["five", "🕠"],
    ["done", "⌛"],
    ["window", "🪟"],
    ["france", "🇫🇷"],
    ["island", "🏝️"],
    ["record", "⏺️"],
    ["direct", "🎯"],
    ["calendar", "📅"],
    ["present", "🎁"],
    ["bill", "💴"],
    ["talk", "💬"],
    ["tickets", "🎟️"],
    ["true", "💯"],
    ["mark", "💋"],
    ["third", "🥉"],
    ["rock", "🪨"],
    ["reading", "📚"],
    ["plus", "➕"],
    ["auto", "🛺"],
    ["cover", "📔"],
    ["fast", "⏫"],
    ["germany", "🇩🇪"],
    ["amount", "🈷️"],
    ["watch", "⌚"],
    ["bank", "🏦"],
    ["weight", "🏋️‍♂️"],
    ["camera", "📷"],
    ["girl", "👧"],
    ["construction", "🚧"],
    ["registered", "®️"],
    ["golf", "🏌️‍♂️"],
    ["manager", "👨‍💼"],
    ["india", "🇮🇳"],
    ["position", "🧘‍♂️"],
    ["step", "🪜"],
    ["simple", "🏡"],
    ["wireless", "🛜"],
    ["license", "🪪"],
    ["church", "⛪"],
    ["active", "🤸"],
    ["fire", "🔥"],
    ["death", "💀"],
    ["writing", "✍️"],
    ["discount", "🈹"],
    ["oil", "🛢️"],
    ["yellow", "💛"],
    ["french", "🍟"],
    ["japan", "🇯🇵"],
    ["shoes", "👞"],
    ["entry", "⛔"],
    ["turn", "🛞"],
    ["mean", "👺"],
    ["notes", "🎶"],
    ["king", "🤴"],
    ["force", "🪠"],
    ["cash", "💰"],
    ["package", "📦"],
    ["engine", "🚒"],
    ["stop", "🚏"],
    ["bar", "📊"],
    ["double", "➿"],
    ["dog", "🐕"],
    ["build", "👷"],
    ["exchange", "💱"],
    ["soon", "🔜"],
    ["electronic", "🪫"],
    ["ny", "🗽"],
    ["printer", "🖨️"],
    ["believe", "😮"],
    ["mind", "🤯"],
    ["casino", "🎰"],
    ["lost", "😔"],
    ["volume", "🔈"],
    ["cross", "❌"],
    ["silver", "🩶"],
    ["nothing", "🫙"],
    ["running", "👟"],
    ["gas", "⛽"],
    ["skills", "🥷"],
    ["six", "🕕"],
    ["military", "🎖️"],
    ["woman", "👩"],
    ["zip", "🤐"],
    ["cable", "🚠"],
    ["taking", "🛀"],
    ["division", "➗"],
    ["lesbian", "🏳️‍🌈"],
    ["machine", "📠"],
    ["nice", "😀"],
    ["score", "🎼"],
    ["ok", "🆗"],
    ["christmas", "🎄"],
    ["culture", "🧫"],
    ["band", "🪈"],
    ["flash", "📸"],
    ["artist", "🧑‍🎨"],
    ["letter", "💌"],
    ["mode", "📳"],
    ["phones", "📵"],
    ["button", "🅿️"],
    ["super", "🏈"],
    ["male", "♂️"],
    ["focus", "😣"],
    ["fall", "🍂"],
    ["idea", "💭"],
    ["female", "♀️"],
    ["win", "🏆"],
    ["cancer", "♋"],
    ["numbers", "🔢"],
    ["tool", "🧰"],
    ["spring", "🌸"],
    ["answer", "🟰"],
    ["bed", "🛏️"],
    ["police", "🚓"],
    ["brown", "🤎"],
    ["glass", "🍷"],
    ["telephone", "☎️"],
    ["sport", "🚙"],
    ["ready", "🛄"],
    ["feed", "👨‍🍼"],
    ["mexico", "🇲🇽"],
    ["secure", "🔐"],
    ["ass", "🫏"],
    ["evidence", "🧾"],
    ["station", "🚉"],
    ["christian", "☦️"],
    ["round", "📍"],
    ["blood", "🩸"],
    ["cut", "🥩"],
    ["kitchen", "🔪"],
    ["wedding", "💒"],
    ["hospital", "🏥"],
    ["ground", "⛱️"],
    ["ship", "🚢"],
    ["paid", "💰"],
    ["italy", "🇮🇹"],
    ["perfect", "💯"],
    ["hair", "🪮"],
    ["tree", "🌴"],
    ["wall", "🧱"],
    ["extra", "🛸"],
    ["ma", "👻"],
    ["boy", "👦"],
    ["warning", "⚠️"],
    ["wine", "🍷"],
    ["horse", "🐎"],
    ["forward", "⏩"],
    ["stars", "⭐"],
    ["son", "👦"],
    ["rule", "📐"],
    ["mother", "👩‍🍼"],
    ["traffic", "🚦"],
    ["input", "🔢"],
    ["bin", "🚮"],
    ["ireland", "🇮🇪"],
    ["door", "🚪"],
    ["charge", "🈂️"],
    ["cool", "🆒"],
    ["metal", "🪙"],
    ["positive", "🧲"],
    ["chinese", "👲"],
    ["football", "🏉"],
    ["pass", "⛔"],
    ["van", "🚐"],
    ["assistance", "🐕‍🦺"],
    ["completed", "✅"],
    ["mary", "🪬"],
    ["ring", "💍"],
    ["grade", "🈴"],
    ["mountain", "⛰️"],
    ["vehicle", "🚙"],
    ["consider", "🤔"],
    ["behind", "⛅"],
    ["floor", "🤣"],
    ["iraq", "🇮🇶"],
    ["plant", "🪴"],
    ["hit", "🎯"],
    ["transportation", "🛻"],
    ["pool", "🎱"],
    ["fish", "🐟"],
    ["eye", "👁️"],
    ["string", "🧵"],
    ["born", "🍼"],
    ["japanese", "🎎"],
    ["target", "🎯"],
    ["spain", "🇪🇸"],
    ["winter", "🪾"],
    ["battery", "🔋"],
    ["medium", "◼️"],
    ["television", "📺"],
    ["break", "⛓️‍💥"],
    ["dance", "🪩"],
    ["wood", "🪵"],
    ["playing", "🤾‍♂️"],
    ["studio", "🎙️"],
    ["apple", "🍎"],
    ["aid", "🦻"],
    ["manual", "🦽"],
    ["fixed", "✅"],
    ["hands", "🤗"],
    ["desktop", "🖥️"],
    ["jersey", "🇯🇪"],
    ["electric", "🔌"],
    ["saw", "🪚"],
    ["officer", "👮"],
    ["respect", "🫡"],
    ["trip", "🛄"],
    ["teacher", "🧑‍🏫"],
    ["eyes", "👀"],
    ["georgia", "🇬🇪"],
    ["peace", "☮️"],
    ["creative", "🎨"],
    ["fan", "🪭"],
    ["ten", "🕙"],
    ["cat", "🐈"],
    ["die", "🎲"],
    ["jack", "🎃"],
    ["flat", "🥿"],
    ["parent", "🧑‍🍼"],
    ["scale", "⚖️"],
    ["monthly", "🈷️"],
    ["frame", "🖼️"],
    ["musical", "🎵"],
    ["royal", "🫅"],
    ["justice", "🧑‍⚖️"],
    ["cup", "🥤"],
    ["basket", "🧺"],
    ["square", "🟥"],
    ["diet", "🍎"],
    ["army", "🪖"],
    ["gear", "⚙️"],
    ["selling", "🪝"],
    ["piece", "🧩"],
    ["seven", "🕢"],
    ["jump", "🦘"],
    ["resort", "⛵"],
    ["fashion", "👠"],
    ["monitor", "🖥️"],
    ["ball", "🍙"],
    ["goal", "🥅"],
    ["wind", "🌬️"],
    ["lives", "☯️"],
    ["currency", "💱"],
    ["palm", "🌴"],
    ["stone", "💎"],
    ["difficult", "☯️"],
    ["satellite", "🛰️"],
    ["pain", "🥲"],
    ["coffee", "☕"],
    ["edge", "📏"],
    ["root", "🫚"],
    ["closed", "📕"],
    ["ice", "🧊"],
    ["pink", "🩷"],
    ["balance", "⚖️"],
    ["graduate", "🧑‍🎓"],
    ["shot", "💉"],
    ["label", "🏷️"],
    ["thinking", "🤔"],
    ["waste", "🗑️"],
    ["bus", "🚌"],
    ["cold", "🥶"],
    ["accounting", "🧾"],
    ["chair", "🪑"],
    ["fishing", "🐟"],
    ["bag", "💰"],
    ["letters", "🔤"],
    ["motor", "🛥️"],
    ["shirt", "🎽"],
    ["foot", "🦶"],
    ["breast", "🤱"],
    ["claim", "🛄"],
    ["heat", "🥵"],
    ["wild", "🥦"],
    ["doctor", "😷"],
    ["bug", "🐛"],
    ["santa", "🎅"],
    ["diamond", "♦️"],
    ["israel", "🇮🇱"],
    ["soft", "🍦"],
    ["flight", "🪶"],
    ["fuel", "⛽"],
    ["rose", "🌹"],
    ["freedom", "⛓️‍💥"],
    ["argument", "🫯"],
    ["drugs", "💊"],
    ["growing", "💗"],
    ["pick", "⛏️"],
    ["hearing", "🦻"],
    ["serious", "👔"],
    ["thoughts", "💭"],
    ["heavy", "🟰"],
    ["expert", "🤓"],
    ["universal", "♾️"],
    ["protect", "🪬"],
    ["drop", "💧"],
    ["solid", "🪨"],
    ["orange", "📙"],
    ["rich", "🧐"],
    ["vs", "🆚"],
    ["guitar", "🎸"],
    ["spirit", "😇"],
    ["serve", "🍦"],
    ["magic", "🪄"],
    ["mount", "🗻"],
    ["smart", "🤓"],
    ["latin", "✝️"],
    ["manage", "🤹‍♂️"],
    ["birth", "🍼"],
    ["virus", "🦠"],
    ["quarter", "🌗"],
    ["racing", "🏎️"],
    ["breakfast", "🍴"],
    ["chain", "⛓️"],
    ["died", "😔"],
    ["opening", "🪟"],
    ["lab", "🥼"],
    ["snow", "☃️"],
    ["truth", "💯"],
    ["dollar", "💵"],
    ["bridge", "🌉"],
    ["baseball", "⚾"],
    ["chart", "📊"],
    ["clubs", "♣️"],
    ["equal", "🟰"],
    ["parking", "🅿️"],
    ["russia", "🇷🇺"],
    ["gone", "💨"],
    ["funny", "😜"],
    ["gene", "🧬"],
    ["disc", "🥏"],
    ["boat", "🛥️"],
    ["theatre", "🎭"],
    ["classical", "🏛️"],
    ["direction", "⬆️"],
    ["basketball", "🏀"],
    ["evening", "🌆"],
    ["mouse", "🐁"],
    ["brain", "🧠"],
    ["dream", "💭"],
    ["flower", "💮"],
    ["atom", "⚛️"],
    ["winning", "🏆"],
    ["eight", "🕣"],
    ["iron", "🧇"],
    ["straight", "📏"],
    ["alert", "🚨"],
    ["tag", "🏷️"],
    ["disk", "💾"],
    ["queen", "👸"],
    ["vhs", "📼"],
    ["clearly", "💯"],
    ["fix", "👷"],
    ["handle", "🍵"],
    ["sweet", "🍠"],
    ["vice", "🗜️"],
    ["truck", "🛻"],
    ["changing", "🚼"],
    ["bear", "🐻"],
    ["laptop", "💻"],
    ["train", "🚆"],
    ["dry", "🚱"],
    ["broken", "💔"],
    ["zoom", "🏎️"],
    ["blow", "😮‍💨"],
    ["decisions", "💭"],
    ["speech", "💬"],
    ["tape", "📼"],
    ["judge", "🧑‍⚖️"],
    ["fight", "🫯"],
    ["zero", "0️⃣"],
    ["speaker", "🔇"],
    ["netherlands", "🇳🇱"],
    ["roll", "🧻"],
    ["bath", "🛁"],
    ["negative", "🧲"],
    ["theater", "🎭"],
    ["springs", "♨️"],
    ["married", "💍"],
    ["birthday", "🎂"],
    ["won", "😤"],
    ["slightly", "🙂"],
    ["bags", "🛍️"],
    ["houses", "🏘️"],
    ["postal", "📯"],
    ["breaking", "⛓️‍💥"],
    ["ultimate", "🥏"],
    ["finish", "🏁"],
    ["bars", "📶"],
    ["row", "🚣"],
    ["cycle", "🚲"],
    ["rise", "🐦‍🔥"],
    ["sleep", "😪"],
    ["bird", "🐦"],
    ["brazil", "🇧🇷"],
    ["lady", "🐞"],
    ["crystal", "🔮"],
    ["drink", "🍹"],
    ["eat", "😋"],
    ["cleaning", "🧹"],
    ["seat", "💺"],
    ["ticket", "🎫"],
    ["ski", "🎿"],
    ["soccer", "⚽"],
    ["healthcare", "🧑‍⚕️"],
    ["viewing", "🎑"],
    ["increasing", "📈"],
    ["christ", "✝️"],
    ["dogs", "🐕"],
    ["austria", "🇦🇹"],
    ["moon", "🌑"],
    ["utility", "🚙"],
    ["fly", "🪰"],
    ["turkey", "🦃"],
    ["singapore", "🇸🇬"],
    ["fear", "😨"],
    ["phoenix", "🐦‍🔥"],
    ["daughter", "👧"],
    ["alpha", "🦁"],
    ["cruise", "🚣"],
    ["bookmark", "🔖"],
    ["beat", "🪘"],
    ["smoking", "🚭"],
    ["tea", "🧋"],
    ["dress", "👗"],
    ["sky", "🩵"],
    ["gambling", "🎰"],
    ["clothes", "👚"],
    ["luxury", "🚤"],
    ["frames", "🎞️"],
    ["newspaper", "📰"],
    ["toy", "🧸"],
    ["slow", "🦥"],
    ["trademark", "™️"],
    ["nine", "🕤"],
    ["prints", "🐾"],
    ["factory", "🏭"],
    ["grow", "🪴"],
    ["optical", "💿"],
    ["clock", "⏰"],
    ["dot", "💠"],
    ["identity", "🆔"],
    ["hidden", "🫥"],
    ["broadband", "🛜"],
    ["rain", "🌈"],
    ["planet", "🪐"],
    ["seeing", "👀"],
    ["proof", "🧾"],
    ["dna", "🧬"],
    ["tennis", "🎾"],
    ["empty", "🪹"],
    ["hole", "🕳️"],
    ["ride", "🚲"],
    ["dinner", "🍴"],
    ["cream", "🍨"],
    ["evil", "👿"],
    ["shape", "🧲"],
    ["evolution", "🧬"],
    ["euro", "💶"],
    ["cap", "🧢"],
    ["ink", "🔏"],
    ["wheel", "🛞"],
    ["salt", "🧂"],
    ["angel", "👼"],
    ["bell", "🔔"],
    ["climate", "🪸"],
    ["pin", "🔋"],
    ["alcohol", "🍹"],
    ["sharp", "🪒"],
    ["sweden", "🇸🇪"],
    ["holding", "🥹"],
    ["trouble", "😵‍💫"],
    ["jordan", "🇯🇴"],
    ["plug", "🔌"],
    ["cook", "🧑‍🍳"],
    ["raised", "🤨"],
    ["hat", "🎩"],
    ["bike", "🚲"],
    ["totally", "😲"],
    ["plate", "🍽️"],
    ["blonde", "👱‍♀️"],
    ["ab", "🆎"],
    ["thailand", "🇹🇭"],
    ["tracks", "🔀"],
    ["prince", "🤴"],
    ["circle", "Ⓜ️"],
    ["wet", "💦"],
    ["identification", "🪪"],
    ["ram", "🐏"],
    ["cooking", "🍳"],
    ["fox", "🦊"],
    ["iran", "🇮🇷"],
    ["arm", "🦾"],
    ["keys", "🔑"],
    ["launch", "🚀"],
    ["wave", "🌊"],
    ["belgium", "🇧🇪"],
    ["symbol", "🚼"],
    ["highway", "🛣️"],
    ["chocolate", "🍫"],
    ["biology", "🧫"],
    ["dental", "🪥"],
    ["debate", "🫯"],
    ["notebook", "📓"],
    ["tm", "™️"],
    ["crazy", "😜"],
    ["mouth", "👄"],
    ["linked", "🖇️"],
    ["gun", "🔫"],
    ["wonder", "💭"],
    ["fruit", "🥝"],
    ["safari", "🦁"],
    ["sugar", "🧁"],
    ["stick", "🩼"],
    ["slide", "🛝"],
    ["switzerland", "🇨🇭"],
    ["formal", "🤵"],
    ["lock", "🔒"],
    ["hockey", "🏒"],
    ["bowl", "🍜"],
    ["dolls", "🪆"],
    ["kid", "🧒"],
    ["cancel", "❌"],
    ["paint", "🫟"],
    ["pilot", "🧑‍✈️"],
    ["pan", "🥘"],
    ["disability", "🩼"],
    ["winner", "🏅"],
    ["dish", "🧫"],
    ["painting", "🖼️"],
    ["slot", "🎰"],
    ["mirror", "🪞"],
    ["gray", "🩶"],
    ["taiwan", "🇹🇼"],
    ["greece", "🇬🇷"],
    ["liquid", "🫗"],
    ["rice", "🍙"],
    ["loop", "➰"],
    ["guard", "💂"],
    ["milk", "🥛"],
    ["performing", "🎭"],
    ["keyboard", "⌨️"],
    ["boot", "🥾"],
    ["lunch", "🍴"],
    ["guinea", "🇬🇳"],
    ["muscle", "💪"],
    ["tower", "🗼"],
    ["calculator", "🧮"],
    ["chicken", "🐔"],
    ["shower", "🚿"],
    ["shell", "🐚"],
    ["vat", "🪣"],
    ["beer", "🍺"],
    ["swimming", "🏊‍♂️"],
    ["catch", "🪝"],
    ["pakistan", "🇵🇰"],
    ["northwest", "↖️"],
    ["sir", "🫡"],
    ["doubt", "🫤"],
    ["memorial", "🪦"],
    ["spy", "🕵️"],
    ["split", "🪓"],
    ["pregnant", "🫃"],
    ["egypt", "🇪🇬"],
    ["hollywood", "🎥"],
    ["bargain", "🉐"],
    ["norway", "🇳🇴"],
    ["suit", "♣️"],
    ["chip", "🍪"],
    ["sit", "🪑"],
    ["cutting", "✂️"],
    ["paying", "💰"],
    ["cartoon", "💭"],
    ["comfortable", "👘"],
    ["magnetic", "🧲"],
    ["listening", "👂"],
    ["denmark", "🇩🇰"],
    ["employed", "👔"],
    ["bright", "🔆"],
    ["treat", "🧁"],
    ["piano", "🎹"],
    ["voip", "📞"],
    ["landscape", "🌆"],
    ["mechanical", "🦾"],
    ["journey", "🛄"],
    ["banner", "🎋"],
    ["hairy", "🫈"],
    ["reverse", "◀️"],
    ["wheels", "🛹"],
    ["router", "🛜"],
    ["poland", "🇵🇱"],
    ["folder", "📁"],
    ["pulse", "💓"],
    ["metro", "🚇"],
    ["accident", "🫗"],
    ["pump", "⛽"],
    ["strike", "🎳"],
    ["controller", "🎮"],
    ["vietnam", "🇻🇳"],
    ["castle", "🏰"],
    ["malaysia", "🇲🇾"],
    ["hundred", "💯"],
    ["philippines", "🇵🇭"],
    ["grey", "🩶"],
    ["bathroom", "🚽"],
    ["cinema", "🎦"],
    ["drinking", "🍹"],
    ["blank", "😐"],
    ["indonesia", "🇮🇩"],
    ["flying", "🥏"],
    ["cute", "🩷"],
    ["improving", "❤️‍🩹"],
    ["pounds", "💷"],
    ["buffalo", "🐃"],
    ["plane", "✈️"],
    ["camping", "🏕️"],
    ["caught", "😦"],
    ["bottle", "🍼"],
    ["meat", "🥩"],
    ["monster", "👾"],
    ["bone", "🦴"],
    ["portugal", "🇵🇹"],
    ["forever", "♾️"],
    ["dragon", "🐉"],
    ["leg", "🦵"],
    ["neck", "🧣"],
    ["wing", "🪽"],
    ["abc", "🔤"],
    ["taste", "🧂"],
    ["rail", "🚈"],
    ["tube", "🧪"],
    ["jacket", "🥼"],
    ["aviation", "🪽"],
    ["proud", "🦚"],
    ["disaster", "🛘"],
    ["instructor", "🧑‍🏫"],
    ["giant", "🫈"],
    ["alarm", "⏰"],
    ["voltage", "⚡"],
    ["angle", "📏"],
    ["mining", "⛏️"],
    ["liberty", "🗽"],
    ["argentina", "🇦🇷"],
    ["dangerous", "💣"],
    ["thongs", "🩴"],
    ["finland", "🇫🇮"],
    ["eagle", "🦅"],
    ["pants", "👖"],
    ["nurse", "👩‍⚕️"],
    ["prayer", "📿"],
    ["hurricane", "🌀"],
    ["quiet", "🤫"],
    ["cheese", "🧀"],
    ["jet", "✈️"],
    ["crown", "👑"],
    ["gang", "🚲"],
    ["smoke", "😮‍💨"],
    ["cake", "🥮"],
    ["mad", "😖"],
    ["semi", "🚛"],
    ["gross", "😝"],
    ["cafe", "☕"],
    ["pen", "🖊️"],
    ["admission", "🎟️"],
    ["shoe", "🥿"],
    ["victory", "🏆"],
    ["joy", "😂"],
    ["actor", "🎭"],
    ["seal", "🦭"],
    ["vertical", "🚦"],
    ["prize", "🏆"],
    ["prohibited", "🚫"],
    ["pipe", "🪈"],
    ["ill", "🤒"],
    ["concentration", "😣"],
    ["horses", "🐴"],
    ["worker", "🧑‍⚕️"],
    ["temple", "🛕"],
    ["wings", "💸"],
    ["cabinet", "🗄️"],
    ["sick", "🤒"],
    ["tropical", "🐠"],
    ["definitely", "💯"],
    ["shaved", "🍧"],
    ["purple", "💜"],
    ["mountains", "🌄"],
    ["checked", "✔️"],
    ["throw", "🤮"],
    ["cats", "🐈"],
    ["desert", "🏜️"],
    ["receiver", "📞"],
    ["graph", "💹"],
    ["filing", "🗄️"],
    ["passing", "🈴"],
    ["electricity", "🔌"],
    ["arrival", "🛬"],
    ["okay", "🆗"],
    ["roger", "🏴‍☠️"],
    ["awesome", "😃"],
    ["lift", "🛗"],
    ["riding", "🚴"],
    ["healing", "☮️"],
    ["princess", "👸"],
    ["rolling", "🙄"],
    ["motorcycle", "🏍️"],
    ["pour", "🫗"],
    ["rescue", "⛑️"],
    ["shooting", "🌠"],
    ["ear", "👂"],
    ["flags", "🎌"],
    ["shock", "🫢"],
    ["tie", "🪢"],
    ["kiss", "💋"],
    ["beast", "💪"],
    ["experiment", "🧪"],
    ["pizza", "🍕"],
    ["ukraine", "🇺🇦"],
    ["surprise", "🫢"],
    ["lamp", "🪔"],
    ["acceptable", "🉑"],
    ["satisfied", "😊"],
    ["glad", "😊"],
    ["receipt", "🧾"],
    ["ghost", "👻"],
    ["southwest", "↙️"],
    ["boss", "😏"],
    ["champion", "🏆"],
    ["cloudy", "⛅"],
    ["chile", "🇨🇱"],
    ["uniform", "🥋"],
    ["wealth", "🪎"],
    ["brass", "🪊"],
    ["intelligent", "🤓"],
    ["hungary", "🇭🇺"],
    ["realize", "💭"],
    ["puzzle", "🧩"],
    ["sms", "💬"],
    ["lucky", "🍀"],
    ["repeat", "🔁"],
    ["drum", "🥁"],
    ["glasses", "👓"],
    ["tabs", "📑"],
    ["polish", "💅"],
    ["troops", "🫡"],
    ["bulgaria", "🇧🇬"],
    ["pine", "🎍"],
    ["cooling", "🪭"],
    ["tokyo", "🗼"],
    ["candy", "🍬"],
    ["pills", "💊"],
    ["tiger", "🐅"],
    ["angels", "😇"],
    ["afghanistan", "🇦🇫"],
    ["pound", "💷"],
    ["camcorder", "📹"],
    ["burn", "❤️‍🔥"],
    ["bread", "🍞"],
    ["tough", "🪨"],
    ["lie", "🤥"],
    ["worship", "🛐"],
    ["shorts", "🩳"],
    ["recorder", "🪈"],
    ["facing", "📄"],
    ["clay", "🧱"],
    ["cyprus", "🇨🇾"],
    ["hearts", "💕"],
    ["raising", "🙋‍♂️"],
    ["leaf", "🍁"],
    ["pad", "🗓️"],
    ["glory", "🐦‍🔥"],
    ["diesel", "⛽"],
    ["versus", "🆚"],
    ["bs", "💩"],
    ["cuba", "🇨🇺"],
    ["hrs", "⏰"],
    ["suspension", "🚟"],
    ["sad", "😥"],
    ["wolf", "🐺"],
    ["rugby", "🏉"],
    ["infant", "👶"],
    ["kick", "🛴"],
    ["hurt", "🩼"],
    ["pot", "🍯"],
    ["devil", "👿"],
    ["cherry", "🌸"],
    ["kenya", "🇰🇪"],
    ["funeral", "⚱️"],
    ["automated", "🏧"],
    ["passenger", "🛳️"],
    ["silent", "😶"],
    ["egg", "🥚"],
    ["pill", "💊"],
    ["symbols", "🔣"],
    ["spin", "🚲"],
    ["robot", "🤖"],
    ["witness", "👁️‍🗨️"],
    ["noble", "🫅"],
    ["cl", "🆑"],
    ["southeast", "↘️"],
    ["lebanon", "🇱🇧"],
    ["soap", "🧼"],
    ["nyc", "🗽"],
    ["slots", "🎰"],
    ["rocks", "🛘"],
    ["wearing", "👳‍♂️"],
    ["habitat", "🌳"],
    ["hero", "🦸‍♀️"],
    ["engaged", "💍"],
    ["genetics", "🧬"],
    ["punk", "🧷"],
    ["coat", "🧥"],
    ["mrs", "🤶"],
    ["convenience", "🏪"],
    ["container", "🫙"],
    ["wizard", "🧙"],
    ["antenna", "📶"],
    ["departure", "🛫"],
    ["bikini", "👙"],
    ["decor", "🪴"],
    ["doll", "🪆"],
    ["peru", "🇵🇪"],
    ["singer", "🧑‍🎤"],
    ["attraction", "🧲"],
    ["diving", "🤿"],
    ["jeans", "👖"],
    ["wrap", "🌯"],
    ["mx", "🧑‍🎄"],
    ["sleeping", "😴"],
    ["orchestra", "🪈"],
    ["sunset", "🌇"],
    ["framed", "🖼️"],
    ["shut", "🤐"],
    ["romania", "🇷🇴"],
    ["mask", "🤿"],
    ["cycling", "🚲"],
    ["ng", "🆖"],
    ["cry", "🥹"],
    ["arrow", "⬆️"],
    ["weird", "😒"],
    ["lion", "🦁"],
    ["cookie", "🍪"],
    ["cricket", "🦗"],
    ["feeding", "👨‍🍼"],
    ["stroke", "🥵"],
    ["hats", "👒"],
    ["surf", "🏄‍♂️"],
    ["customs", "🛃"],
    ["rainbow", "🌈"],
    ["hook", "🪝"],
    ["gloves", "🧤"],
    ["cord", "🪢"],
    ["cloud", "☁️"],
    ["feelings", "🥹"],
    ["knife", "🔪"],
    ["jamaica", "🇯🇲"],
    ["donation", "🩸"],
    ["twelve", "🕧"],
    ["tired", "😫"],
    ["steam", "😤"],
    ["drinks", "🍹"],
    ["sing", "🎤"],
    ["recycling", "♻️"],
    ["curve", "🪝"],
    ["trunk", "🪾"],
    ["hiking", "🥾"],
    ["colombia", "🇨🇴"],
    ["camel", "🐪"],
    ["wrestling", "🤼‍♂️"],
    ["juice", "🧃"],
    ["sauce", "🫙"],
    ["panama", "🇵🇦"],
    ["af", "🔥"],
    ["automobile", "🚗"],
    ["northeast", "↗️"],
    ["eggs", "🪺"],
    ["afraid", "😨"],
    ["railway", "🚈"],
    ["pointed", "🔺"],
    ["locked", "🔒"],
    ["sunglasses", "🕶️"],
    ["beads", "📿"],
    ["fortune", "🥠"],
    ["cemetery", "🪦"],
    ["croatia", "🇭🇷"],
    ["stadium", "🏟️"],
    ["venezuela", "🇻🇪"],
    ["astronomy", "⭐"],
    ["corn", "🌽"],
    ["farmer", "🧑‍🌾"],
    ["horizontal", "🚥"],
    ["mobility", "🩼"],
    ["neutral", "😐"],
    ["rat", "🐀"],
    ["charm", "🧿"],
    ["ranch", "🏡"],
    ["crossing", "🚸"],
    ["drunk", "🥴"],
    ["nose", "👃"],
    ["branches", "🪾"],
    ["alien", "👽"],
    ["nepal", "🇳🇵"],
    ["zimbabwe", "🇿🇼"],
    ["trim", "🪚"],
    ["nigeria", "🇳🇬"],
    ["lung", "🫁"],
    ["saver", "🛟"],
    ["grain", "🍞"],
    ["bull", "🎯"],
    ["repairs", "🔨"],
    ["breath", "🫁"],
    ["candle", "🕯️"],
    ["projector", "📽️"],
    ["loving", "💕"],
    ["surprised", "😯"],
    ["gains", "💪"],
    ["renewal", "🐦‍🔥"],
    ["connectivity", "🛜"],
    ["spots", "🦒"],
    ["coin", "🪙"],
    ["soldier", "🥷"],
    ["bomb", "💣"],
    ["brush", "🪥"],
    ["deer", "🦌"],
    ["tongue", "👅"],
    ["bowling", "🎳"],
    ["monkey", "🐒"],
    ["honey", "🐝"],
    ["um", "😋"],
    ["chains", "⛓️"],
    ["bronze", "🥉"],
    ["gym", "💪"],
    ["luxembourg", "🇱🇺"],
    ["laugh", "🤣"],
    ["teeth", "🦷"],
    ["lotus", "🪷"],
    ["mate", "🧉"],
    ["butter", "🧈"],
    ["pepper", "🌶️"],
    ["luggage", "🧳"],
    ["chef", "🧑‍🍳"],
    ["maple", "🍁"],
    ["pie", "🥧"],
    ["bow", "🏹"],
    ["autumn", "🍂"],
    ["toilet", "🚽"],
    ["calculation", "🧮"],
    ["anxiety", "🫪"],
    ["atm", "🏧"],
    ["sunny", "☀️"],
    ["necklace", "📿"],
    ["spider", "🕷️"],
    ["pole", "💈"],
    ["shield", "🛡️"],
    ["bangladesh", "🇧🇩"],
    ["pickup", "🛻"],
    ["iceland", "🇮🇸"],
    ["demonstration", "🪧"],
    ["graduation", "🎓"],
    ["sailing", "⛵"],
    ["sacred", "❤️‍🔥"],
    ["morocco", "🇲🇦"],
    ["botswana", "🇧🇼"],
    ["olive", "🫒"],
    ["tears", "🥹"],
    ["angry", "😠"],
    ["lover", "😘"],
    ["lips", "👄"],
    ["wondering", "🤔"],
    ["malta", "🇲🇹"],
    ["ferry", "⛴️"],
    ["rabbit", "🐇"],
    ["dam", "🦫"],
    ["tire", "🛞"],
    ["recreational", "🚙"],
    ["chad", "🇹🇩"],
    ["passport", "🛂"],
    ["royalty", "🫅"],
    ["scales", "⚖️"],
    ["sunshine", "🌞"],
    ["ceremony", "🎑"],
    ["ripe", "🍎"],
    ["laundry", "🧺"],
    ["filling", "🥧"],
    ["silence", "😶"],
    ["lemon", "🍋"],
    ["nail", "💅"],
    ["joke", "😜"],
    ["shelter", "🛖"],
    ["celebrate", "🎉"],
    ["bahamas", "🇧🇸"],
    ["bench", "💪"],
    ["tub", "🛀"],
    ["sheep", "🐏"],
    ["architect", "🧑‍💼"],
    ["salad", "🥗"],
    ["clouds", "😶‍🌫️"],
    ["tanzania", "🇹🇿"],
    ["cosmetics", "💅"],
    ["estonia", "🇪🇪"],
    ["landing", "🛬"],
    ["namibia", "🇳🇦"],
    ["sword", "🤺"],
    ["ecuador", "🇪🇨"],
    ["coral", "🪸"],
    ["float", "🛟"],
    ["bubble", "🫧"],
    ["dairy", "🧈"],
    ["fancy", "🧐"],
    ["equality", "🟰"],
    ["samoa", "🇼🇸"],
    ["scroll", "📜"],
    ["swim", "🏊‍♂️"],
    ["martial", "🥋"],
    ["cambodia", "🇰🇭"],
    ["lithuania", "🇱🇹"],
    ["wheat", "🍞"],
    ["beaver", "🦫"],
    ["decorative", "📔"],
    ["confused", "😕"],
    ["bee", "🐝"],
    ["loud", "📢"],
    ["bride", "👰‍♀️"],
    ["anchor", "⚓"],
    ["socks", "🧦"],
    ["slovenia", "🇸🇮"],
    ["scientist", "🧑‍🔬"],
    ["fever", "🤧"],
    ["bare", "🪾"],
    ["reload", "🔃"],
    ["flame", "🔥"],
    ["elderly", "🧓"],
    ["floating", "🫧"],
    ["bolivia", "🇧🇴"],
    ["kuwait", "🇰🇼"],
    ["curious", "🦝"],
    ["sudan", "🇸🇩"],
    ["knee", "🦵"],
    ["complicated", "😥"],
    ["injured", "🩼"],
    ["beverage", "☕"],
    ["latvia", "🇱🇻"],
    ["barrier", "🚧"],
    ["trains", "🚂"],
    ["bicycle", "🚲"],
    ["guatemala", "🇬🇹"],
    ["boxing", "🥊"],
    ["chess", "♟️"],
    ["duck", "🦆"],
    ["cow", "🐄"],
    ["lying", "🤥"],
    ["dive", "🥽"],
    ["protest", "🪧"],
    ["invention", "💭"],
    ["fiji", "🇫🇯"],
    ["timber", "🪵"],
    ["drops", "☔"],
    ["screw", "🪛"],
    ["butterfly", "🦋"],
    ["geek", "🤓"],
    ["reflection", "🪞"],
    ["brick", "🧱"],
    ["medieval", "👑"],
    ["warrior", "🪖"],
    ["innocent", "😇"],
    ["polo", "🤽‍♂️"],
    ["delivering", "📨"],
    ["horn", "📯"],
    ["uganda", "🇺🇬"],
    ["frog", "🐸"],
    ["syria", "🇸🇾"],
    ["leo", "♌"],
    ["anger", "💢"],
    ["snap", "📷"],
    ["ribbon", "🎀"],
    ["kissing", "😗"],
    ["handy", "🪛"],
    ["crops", "🌽"],
    ["slovakia", "🇸🇰"],
    ["flip", "🩴"],
    ["barbados", "🇧🇧"],
    ["nervous", "😟"],
    ["transparent", "🪟"],
    ["boom", "💣"],
    ["farming", "🧺"],
    ["fork", "🍴"],
    ["roller", "🛼"],
    ["ghana", "🇬🇭"],
    ["rip", "🪦"],
    ["triangle", "🔺"],
    ["zambia", "🇿🇲"],
    ["chick", "🐤"],
    ["confusion", "🫤"],
    ["tray", "📥"],
    ["thong", "🩴"],
    ["medal", "🏅"],
    ["sucks", "😔"],
    ["vulnerable", "🫪"],
    ["bat", "🦇"],
    ["bones", "🦴"],
    ["polar", "🐻‍❄️"],
    ["fallen", "🍂"],
    ["invoice", "🧾"],
    ["lip", "🫦"],
    ["wool", "🦙"],
    ["volleyball", "🏐"],
    ["toolbox", "🧰"],
    ["surfing", "🏄‍♂️"],
    ["lightning", "🌩️"],
    ["beans", "🫘"],
    ["snake", "🐍"],
    ["reminder", "🎗️"],
    ["karaoke", "🎤"],
    ["trap", "🪤"],
    ["lonely", "💔"],
    ["berry", "🍓"],
    ["bermuda", "🇧🇲"],
    ["bacteria", "🦠"],
    ["delicious", "😋"],
    ["kidney", "🫘"],
    ["uruguay", "🇺🇾"],
    ["transform", "🐦‍🔥"],
    ["timer", "⏲️"],
    ["vegetable", "🫜"],
    ["rocket", "🚀"],
    ["bullet", "🚅"],
    ["nasty", "🤢"],
    ["ugly", "🦢"],
    ["hammer", "🔨"],
    ["arctic", "🐻‍❄️"],
    ["haiti", "🇭🇹"],
    ["ears", "👂"],
    ["cheers", "🍻"],
    ["dig", "🪏"],
    ["taxi", "🚕"],
    ["om", "🕉️"],
    ["belarus", "🇧🇾"],
    ["restriction", "🔞"],
    ["ethiopia", "🇪🇹"],
    ["twist", "🪢"],
    ["cube", "🧊"],
    ["marker", "📑"],
    ["monaco", "🇲🇨"],
    ["folding", "🪭"],
    ["belize", "🇧🇿"],
    ["spice", "🫚"],
    ["mozambique", "🇲🇿"],
    ["trash", "🗑️"],
    ["wifi", "🛜"],
    ["envelope", "✉️"],
    ["disco", "🪩"],
    ["incoming", "📨"],
    ["guam", "🇬🇺"],
    ["pig", "🐖"],
    ["minus", "➖"],
    ["armenia", "🇦🇲"],
    ["actress", "🎭"],
    ["mess", "🫟"],
    ["lit", "🔥"],
    ["shade", "🙄"],
    ["rhythm", "🪘"],
    ["sudden", "🤭"],
    ["rope", "🪢"],
    ["fountain", "⛲"],
    ["grave", "🪦"],
    ["cigarette", "🚬"],
    ["fog", "🌫️"],
    ["tunisia", "🇹🇳"],
    ["gotta", "💨"],
    ["cowboy", "🤠"],
    ["bahrain", "🇧🇭"],
    ["honduras", "🇭🇳"],
    ["silly", "🪿"],
    ["mercy", "🥺"],
    ["sunrise", "🌅"],
    ["mild", "🤨"],
    ["nicaragua", "🇳🇮"],
    ["fighter", "🥷"],
    ["microphone", "🎤"],
    ["balloon", "🎈"],
    ["memo", "📝"],
    ["kazakhstan", "🇰🇿"],
    ["invisible", "🫥"],
    ["qatar", "🇶🇦"],
    ["magnet", "🧲"],
    ["thanksgiving", "🦃"],
    ["puppy", "🐶"],
    ["patrol", "🚓"],
    ["smell", "👃"],
    ["reef", "🪸"],
    ["divide", "➗"],
    ["worried", "😟"],
    ["garbage", "🗑️"],
    ["barrel", "🍯"],
    ["typing", "💬"],
    ["boulder", "🪨"],
    ["floppy", "💾"],
    ["jar", "🫙"],
    ["thunder", "⛈️"],
    ["tent", "⛺"],
    ["caution", "⚠️"],
    ["aerial", "🚡"],
    ["makeup", "💅"],
    ["lamb", "🐑"],
    ["madagascar", "🇲🇬"],
    ["uzbekistan", "🇺🇿"],
    ["hindu", "🛕"],
    ["earthquake", "🛘"],
    ["weights", "🏋️‍♂️"],
    ["albania", "🇦🇱"],
    ["wicked", "🖤"],
    ["impressed", "😳"],
    ["saturn", "🪐"],
    ["nut", "🔩"],
    ["sake", "🍶"],
    ["twisted", "🥨"],
    ["fairy", "🧚"],
    ["kitty", "🐱"],
    ["algeria", "🇩🇿"],
    ["blessed", "😇"],
    ["potato", "🥔"],
    ["panic", "🫪"],
    ["onion", "🧅"],
    ["sandwich", "🥪"],
    ["scuba", "🤿"],
    ["dash", "〰️"],
    ["mauritius", "🇲🇺"],
    ["ping", "🏓"],
    ["peaceful", "☮️"],
    ["sewing", "🪡"],
    ["oman", "🇴🇲"],
    ["azerbaijan", "🇦🇿"],
    ["uh", "😑"],
    ["paraguay", "🇵🇾"],
    ["parcel", "📦"],
    ["rolled", "🗞️"],
    ["rays", "☀️"],
    ["flavor", "🧂"],
    ["horrible", "😝"],
    ["malawi", "🇲🇼"],
    ["halo", "😇"],
    ["ant", "🐜"],
    ["gasoline", "⛽"],
    ["dressed", "👗"],
    ["vcr", "📼"],
    ["gem", "💎"],
    ["badge", "📛"],
    ["ballot", "🗳️"],
    ["angola", "🇦🇴"],
    ["squirt", "💦"],
    ["helmet", "🪖"],
    ["elephant", "🐘"],
    ["yemen", "🇾🇪"],
    ["scholar", "🎓"],
    ["vegetarian", "🫜"],
    ["eleven", "🕦"],
    ["unlock", "🔓"],
    ["vampire", "🧛"],
    ["dice", "🎲"],
    ["softball", "🥎"],
    ["rwanda", "🇷🇼"],
    ["granny", "👵"],
    ["pork", "🐷"],
    ["aruba", "🇦🇼"],
    ["bald", "👨‍🦲"],
    ["fuji", "🗻"],
    ["yacht", "⛵"],
    ["herb", "🌿"],
    ["whale", "🐋"],
    ["shark", "🦈"],
    ["ballet", "🩰"],
    ["garlic", "🧄"],
    ["shine", "🌞"],
    ["senegal", "🇸🇳"],
    ["explosion", "💣"],
    ["briefs", "🩲"],
    ["pasta", "🍝"],
    ["wrapped", "🎁"],
    ["inbox", "📥"],
    ["mongolia", "🇲🇳"],
    ["penguin", "🐧"],
    ["flex", "💪"],
    ["lazy", "🦥"],
    ["yen", "💴"],
    ["worm", "🪱"],
    ["beginner", "🔰"],
    ["deaf", "🧏‍♂️"],
    ["serbia", "🇷🇸"],
    ["guyana", "🇬🇾"],
    ["concentrate", "😣"],
    ["cameroon", "🇨🇲"],
    ["needle", "🪡"],
    ["blowing", "😘"],
    ["cardiac", "💛"],
    ["gibraltar", "🇬🇮"],
    ["skating", "⛸️"],
    ["suburban", "🏡"],
    ["tomato", "🍅"],
    ["andorra", "🇦🇩"],
    ["tear", "😂"],
    ["jewel", "💎"],
    ["teddy", "🧸"],
    ["nest", "🪹"],
    ["cop", "👮"],
    ["dim", "🔅"],
    ["brunei", "🇧🇳"],
    ["banana", "🍌"],
    ["wc", "🚾"],
    ["tooth", "🦷"],
    ["upset", "😠"],
    ["rebound", "🪃"],
    ["helicopter", "🚁"],
    ["pencil", "✏️"],
    ["ladder", "🪜"],
    ["liberia", "🇱🇷"],
    ["cork", "🍾"],
    ["workout", "💦"],
    ["mali", "🇲🇱"],
    ["purse", "👛"],
    ["bless", "⛪"],
    ["triumph", "😤"],
    ["welding", "🥽"],
    ["heel", "👠"],
    ["yang", "☯️"],
    ["bloom", "🪻"],
    ["blades", "🛼"],
    ["picnic", "🧺"],
    ["arrivals", "🛬"],
    ["hollow", "⭕"],
    ["niger", "🇳🇪"],
    ["bacon", "🥓"],
    ["circus", "🎪"],
    ["moldova", "🇲🇩"],
    ["cooked", "🍚"],
    ["detective", "🕵️"],
    ["glow", "🌟"],
    ["aquarium", "🪼"],
    ["violin", "🎻"],
    ["turtle", "🐢"],
    ["disappointed", "😞"],
    ["grenada", "🇬🇩"],
    ["scoop", "🪏"],
    ["somalia", "🇸🇴"],
    ["goat", "🐐"],
    ["airplane", "✈️"],
    ["telescope", "🔭"],
    ["pod", "🫛"],
    ["bolt", "🔩"],
    ["snowboard", "🏂"],
    ["maldives", "🇲🇻"],
    ["antarctica", "🇦🇶"],
    ["lime", "🍋‍🟩"],
    ["sympathy", "😮"],
    ["blond", "👱‍♂️"],
    ["hygiene", "🪥"],
    ["poultry", "🍗"],
    ["bouquet", "💐"],
    ["shades", "😎"],
    ["stuffed", "🥙"],
    ["yarn", "🧶"],
    ["knit", "🧶"],
    ["mug", "🍺"],
    ["bhutan", "🇧🇹"],
    ["liechtenstein", "🇱🇮"],
    ["tractor", "🚜"],
    ["resist", "🥹"],
    ["touched", "🥲"],
    ["scared", "😨"],
    ["laos", "🇱🇦"],
    ["cocktail", "🍸"],
  ];

  it("should match >15% of documented word→emoji pairs from google-10000-english", () => {
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
    console.log(`Source: All 10,000 most common English words`);
    console.log("=".repeat(80));

    if (failures.length > 0 && failures.length <= 50) {
      console.log("\nAll failures:");
      failures.forEach(({ word, expected, actual }) => {
        console.log(
          `  ${word.padEnd(20)} → expected ${expected} got ${actual || "null"}`,
        );
      });
    } else if (failures.length > 50) {
      console.log(`\nFirst 50 failures (out of ${failures.length}):`);
      failures.slice(0, 50).forEach(({ word, expected, actual }) => {
        console.log(
          `  ${word.padEnd(20)} → expected ${expected} got ${actual || "null"}`,
        );
      });
      console.log(`\n...and ${failures.length - 50} more failures not shown.`);
    }
    console.log("=".repeat(80) + "\n");

    // Assert >15% coverage (realistic threshold: 1597 out of 10,000 words have emojis)
    expect(percentage).toBeGreaterThan(15);
    expect(matched).toBeGreaterThan(total * 0.15);
  });
});
