/**
 * Emoji database with categories for generating game content without LLM.
 * Only includes well-supported emojis (Unicode 6.0-11.0, ~2010-2018).
 */

export interface EmojiItem {
  names: string[]; // First name is primary, others are aliases
  emoji: string;
}

export interface EmojiCategory {
  category: string;
  items: EmojiItem[];
}

export const EMOJI_DATABASE: EmojiCategory[] = [
  {
    category: "animals",
    items: [
      { names: ["cat", "kitty"], emoji: "🐱" },
      { names: ["dog", "puppy", "doggy"], emoji: "🐶" },
      { names: ["mouse", "mice"], emoji: "🐭" },
      { names: ["hamster"], emoji: "🐹" },
      { names: ["rabbit", "bunny"], emoji: "🐰" },
      { names: ["fox"], emoji: "🦊" },
      { names: ["bear", "teddy"], emoji: "🐻" },
      { names: ["panda"], emoji: "🐼" },
      { names: ["koala"], emoji: "🐨" },
      { names: ["tiger"], emoji: "🐯" },
      { names: ["lion"], emoji: "🦁" },
      { names: ["cow"], emoji: "🐮" },
      { names: ["pig", "piggy"], emoji: "🐷" },
      { names: ["frog", "toad"], emoji: "🐸" },
      { names: ["monkey"], emoji: "🐵" },
      { names: ["chicken", "hen"], emoji: "🐔" },
      { names: ["penguin"], emoji: "🐧" },
      { names: ["bird", "chick"], emoji: "🐦" },
      { names: ["duck"], emoji: "🦆" },
      { names: ["eagle"], emoji: "🦅" },
      { names: ["owl"], emoji: "🦉" },
      { names: ["bat"], emoji: "🦇" },
      { names: ["wolf"], emoji: "🐺" },
      { names: ["horse", "pony"], emoji: "🐴" },
      { names: ["unicorn"], emoji: "🦄" },
      { names: ["bee"], emoji: "🐝" },
      { names: ["butterfly"], emoji: "🦋" },
      { names: ["snail"], emoji: "🐌" },
      { names: ["bug", "ladybug"], emoji: "🐞" },
      { names: ["ant"], emoji: "🐜" },
      { names: ["spider"], emoji: "🕷️" },
      { names: ["turtle"], emoji: "🐢" },
      { names: ["snake"], emoji: "🐍" },
      { names: ["lizard"], emoji: "🦎" },
      { names: ["dinosaur", "dino", "t-rex"], emoji: "🦖" },
      { names: ["dragon"], emoji: "🐉" },
      { names: ["whale"], emoji: "🐳" },
      { names: ["dolphin"], emoji: "🐬" },
      { names: ["fish"], emoji: "🐟" },
      { names: ["shark"], emoji: "🦈" },
      { names: ["octopus"], emoji: "🐙" },
      { names: ["crab"], emoji: "🦀" },
      { names: ["shrimp", "prawn"], emoji: "🦐" },
      { names: ["elephant"], emoji: "🐘" },
      { names: ["gorilla", "ape"], emoji: "🦍" },
      { names: ["zebra"], emoji: "🦓" },
      { names: ["giraffe"], emoji: "🦒" },
      { names: ["deer"], emoji: "🦌" },
      { names: ["rhinoceros", "rhino"], emoji: "🦏" },
      { names: ["crocodile", "alligator"], emoji: "🐊" },
      { names: ["camel"], emoji: "🐫" },
      { names: ["sheep", "lamb"], emoji: "🐑" },
      { names: ["goat"], emoji: "🐐" },
      { names: ["rooster", "cock"], emoji: "🐓" },
      { names: ["turkey"], emoji: "🦃" },
      { names: ["peacock"], emoji: "🦚" },
      { names: ["parrot"], emoji: "🦜" },
      { names: ["cat face"], emoji: "😺" },
    ],
  },
  {
    category: "fruits",
    items: [
      { names: ["apple", "red apple"], emoji: "🍎" },
      { names: ["green apple"], emoji: "🍏" },
      { names: ["pear"], emoji: "🍐" },
      { names: ["orange", "tangerine"], emoji: "🍊" },
      { names: ["lemon"], emoji: "🍋" },
      { names: ["banana"], emoji: "🍌" },
      { names: ["watermelon", "melon"], emoji: "🍉" },
      { names: ["grapes", "grape"], emoji: "🍇" },
      { names: ["strawberry"], emoji: "🍓" },
      { names: ["cherry", "cherries"], emoji: "🍒" },
      { names: ["peach"], emoji: "🍑" },
      { names: ["mango"], emoji: "🥭" },
      { names: ["pineapple"], emoji: "🍍" },
      { names: ["coconut"], emoji: "🥥" },
      { names: ["kiwi"], emoji: "🥝" },
      { names: ["tomato"], emoji: "🍅" },
      { names: ["avocado"], emoji: "🥑" },
    ],
  },
  {
    category: "vegetables",
    items: [
      { names: ["carrot"], emoji: "🥕" },
      { names: ["corn"], emoji: "🌽" },
      { names: ["pepper", "hot pepper", "chili"], emoji: "🌶️" },
      { names: ["cucumber", "pickle"], emoji: "🥒" },
      { names: ["broccoli"], emoji: "🥦" },
      { names: ["garlic"], emoji: "🧄" },
      { names: ["onion"], emoji: "🧅" },
      { names: ["mushroom"], emoji: "🍄" },
      { names: ["potato"], emoji: "🥔" },
      { names: ["sweet potato"], emoji: "🍠" },
      { names: ["eggplant", "aubergine"], emoji: "🍆" },
      { names: ["peanut", "peanuts"], emoji: "🥜" },
    ],
  },
  {
    category: "food",
    items: [
      { names: ["bread", "loaf"], emoji: "🍞" },
      { names: ["croissant"], emoji: "🥐" },
      { names: ["pretzel"], emoji: "🥨" },
      { names: ["cheese"], emoji: "🧀" },
      { names: ["egg", "fried egg"], emoji: "🍳" },
      { names: ["bacon"], emoji: "🥓" },
      { names: ["pancake", "pancakes"], emoji: "🥞" },
      { names: ["waffle"], emoji: "🧇" },
      { names: ["hamburger", "burger"], emoji: "🍔" },
      { names: ["fries", "french fries"], emoji: "🍟" },
      { names: ["pizza"], emoji: "🍕" },
      { names: ["hot dog", "hotdog"], emoji: "🌭" },
      { names: ["sandwich"], emoji: "🥪" },
      { names: ["taco"], emoji: "🌮" },
      { names: ["burrito"], emoji: "🌯" },
      { names: ["spaghetti", "pasta"], emoji: "🍝" },
      { names: ["ramen", "noodles"], emoji: "🍜" },
      { names: ["soup", "bowl"], emoji: "🍲" },
      { names: ["sushi"], emoji: "🍣" },
      { names: ["rice", "rice bowl"], emoji: "🍚" },
      { names: ["curry"], emoji: "🍛" },
      { names: ["dumpling"], emoji: "🥟" },
      { names: ["cookie"], emoji: "🍪" },
      { names: ["cake", "birthday cake"], emoji: "🎂" },
      { names: ["cupcake"], emoji: "🧁" },
      { names: ["pie"], emoji: "🥧" },
      { names: ["chocolate"], emoji: "🍫" },
      { names: ["candy"], emoji: "🍬" },
      { names: ["lollipop"], emoji: "🍭" },
      { names: ["donut", "doughnut"], emoji: "🍩" },
      { names: ["ice cream"], emoji: "🍨" },
      { names: ["popcorn"], emoji: "🍿" },
      { names: ["salt"], emoji: "🧂" },
    ],
  },
  {
    category: "drinks",
    items: [
      { names: ["water", "water bottle"], emoji: "💧" },
      { names: ["milk", "glass of milk"], emoji: "🥛" },
      { names: ["coffee"], emoji: "☕" },
      { names: ["tea", "teacup"], emoji: "🍵" },
      { names: ["juice", "juice box"], emoji: "🧃" },
      { names: ["soda", "cup"], emoji: "🥤" },
      { names: ["baby bottle", "bottle"], emoji: "🍼" },
    ],
  },
  {
    category: "nature",
    items: [
      { names: ["sun", "sunny"], emoji: "☀️" },
      { names: ["moon", "crescent moon"], emoji: "🌙" },
      { names: ["star", "stars"], emoji: "⭐" },
      { names: ["cloud", "cloudy"], emoji: "☁️" },
      { names: ["rain", "rainy", "rain cloud"], emoji: "🌧️" },
      { names: ["rainbow"], emoji: "🌈" },
      { names: ["snow", "snowflake"], emoji: "❄️" },
      { names: ["snowman"], emoji: "⛄" },
      { names: ["lightning", "thunder"], emoji: "⚡" },
      { names: ["fire", "flame"], emoji: "🔥" },
      { names: ["ocean", "wave", "water wave"], emoji: "🌊" },
      { names: ["flower", "blossom"], emoji: "🌸" },
      { names: ["rose"], emoji: "🌹" },
      { names: ["sunflower"], emoji: "🌻" },
      { names: ["tulip"], emoji: "🌷" },
      { names: ["tree", "evergreen"], emoji: "🌲" },
      { names: ["palm tree", "palm"], emoji: "🌴" },
      { names: ["cactus"], emoji: "🌵" },
      { names: ["leaf", "leaves"], emoji: "🍃" },
      { names: ["maple leaf"], emoji: "🍁" },
      { names: ["four leaf clover", "clover", "lucky"], emoji: "🍀" },
      { names: ["herb", "plant"], emoji: "🌿" },
      { names: ["earth", "globe", "world"], emoji: "🌍" },
      { names: ["mountain"], emoji: "⛰️" },
      { names: ["volcano"], emoji: "🌋" },
    ],
  },
  {
    category: "vehicles",
    items: [
      { names: ["car", "automobile"], emoji: "🚗" },
      { names: ["taxi", "cab"], emoji: "🚕" },
      { names: ["bus"], emoji: "🚌" },
      { names: ["ambulance"], emoji: "🚑" },
      { names: ["fire truck", "fire engine"], emoji: "🚒" },
      { names: ["police car"], emoji: "🚓" },
      { names: ["truck", "lorry"], emoji: "🚚" },
      { names: ["tractor"], emoji: "🚜" },
      { names: ["motorcycle", "motorbike"], emoji: "🏍️" },
      { names: ["bicycle", "bike"], emoji: "🚲" },
      { names: ["train"], emoji: "🚆" },
      { names: ["airplane", "plane"], emoji: "✈️" },
      { names: ["helicopter"], emoji: "🚁" },
      { names: ["rocket", "spaceship"], emoji: "🚀" },
      { names: ["boat", "ship"], emoji: "🚢" },
      { names: ["sailboat"], emoji: "⛵" },
    ],
  },
  {
    category: "objects",
    items: [
      { names: ["house", "home"], emoji: "🏠" },
      { names: ["school"], emoji: "🏫" },
      { names: ["hospital"], emoji: "🏥" },
      { names: ["church"], emoji: "⛪" },
      { names: ["castle"], emoji: "🏰" },
      { names: ["tent", "camping"], emoji: "⛺" },
      { names: ["phone", "telephone"], emoji: "📱" },
      { names: ["computer", "laptop"], emoji: "💻" },
      { names: ["tv", "television"], emoji: "📺" },
      { names: ["camera"], emoji: "📷" },
      { names: ["flashlight", "torch"], emoji: "🔦" },
      { names: ["book"], emoji: "📖" },
      { names: ["pencil"], emoji: "✏️" },
      { names: ["scissors"], emoji: "✂️" },
      { names: ["key"], emoji: "🔑" },
      { names: ["lock", "padlock"], emoji: "🔒" },
      { names: ["hammer"], emoji: "🔨" },
      { names: ["wrench"], emoji: "🔧" },
      { names: ["magnet"], emoji: "🧲" },
      { names: ["lightbulb", "light bulb", "idea"], emoji: "💡" },
      { names: ["battery"], emoji: "🔋" },
      { names: ["money", "dollar"], emoji: "💵" },
      { names: ["gift", "present"], emoji: "🎁" },
      { names: ["balloon"], emoji: "🎈" },
      { names: ["trophy", "award"], emoji: "🏆" },
      { names: ["medal"], emoji: "🏅" },
      { names: ["bell"], emoji: "🔔" },
      { names: ["clock", "time"], emoji: "🕐" },
      { names: ["hourglass"], emoji: "⏳" },
      { names: ["umbrella"], emoji: "☂️" },
      { names: ["backpack", "bag"], emoji: "🎒" },
      { names: ["glasses", "eyeglasses"], emoji: "👓" },
      { names: ["sunglasses"], emoji: "🕶️" },
      { names: ["hat", "top hat"], emoji: "🎩" },
      { names: ["crown"], emoji: "👑" },
      { names: ["ring"], emoji: "💍" },
      { names: ["gem", "diamond", "jewel"], emoji: "💎" },
    ],
  },
  {
    category: "sports",
    items: [
      { names: ["soccer", "soccer ball", "football"], emoji: "⚽" },
      { names: ["basketball"], emoji: "🏀" },
      { names: ["american football"], emoji: "🏈" },
      { names: ["baseball"], emoji: "⚾" },
      { names: ["tennis", "tennis ball"], emoji: "🎾" },
      { names: ["volleyball"], emoji: "🏐" },
      { names: ["rugby"], emoji: "🏉" },
      { names: ["bowling"], emoji: "🎳" },
      { names: ["golf"], emoji: "⛳" },
      { names: ["ping pong", "table tennis"], emoji: "🏓" },
      { names: ["badminton"], emoji: "🏸" },
      { names: ["hockey"], emoji: "🏒" },
      { names: ["ski", "skiing"], emoji: "🎿" },
      { names: ["swimming", "swim"], emoji: "🏊" },
      { names: ["fishing"], emoji: "🎣" },
    ],
  },
  {
    category: "music",
    items: [
      { names: ["music", "music note", "note"], emoji: "🎵" },
      { names: ["microphone", "mic"], emoji: "🎤" },
      { names: ["headphones"], emoji: "🎧" },
      { names: ["guitar"], emoji: "🎸" },
      { names: ["piano", "keyboard"], emoji: "🎹" },
      { names: ["drum"], emoji: "🥁" },
      { names: ["violin"], emoji: "🎻" },
      { names: ["trumpet"], emoji: "🎺" },
      { names: ["saxophone", "sax"], emoji: "🎷" },
    ],
  },
  {
    category: "shapes",
    items: [
      { names: ["heart", "love"], emoji: "❤️" },
      { names: ["orange heart"], emoji: "🧡" },
      { names: ["yellow heart"], emoji: "💛" },
      { names: ["green heart"], emoji: "💚" },
      { names: ["blue heart"], emoji: "💙" },
      { names: ["purple heart"], emoji: "💜" },
      { names: ["star", "yellow star"], emoji: "⭐" },
      { names: ["sparkle", "sparkles"], emoji: "✨" },
      { names: ["circle", "red circle"], emoji: "🔴" },
      { names: ["orange circle"], emoji: "🟠" },
      { names: ["yellow circle"], emoji: "🟡" },
      { names: ["green circle"], emoji: "🟢" },
      { names: ["blue circle"], emoji: "🔵" },
      { names: ["purple circle"], emoji: "🟣" },
      { names: ["square", "red square"], emoji: "🟥" },
      { names: ["orange square"], emoji: "🟧" },
      { names: ["yellow square"], emoji: "🟨" },
      { names: ["green square"], emoji: "🟩" },
      { names: ["blue square"], emoji: "🟦" },
      { names: ["purple square"], emoji: "🟪" },
      { names: ["triangle"], emoji: "🔺" },
      { names: ["diamond", "diamond shape"], emoji: "🔷" },
    ],
  },
  {
    category: "faces",
    items: [
      { names: ["smile", "smiley", "happy"], emoji: "😊" },
      { names: ["laugh", "laughing", "lol"], emoji: "😂" },
      { names: ["wink"], emoji: "😉" },
      { names: ["cool"], emoji: "😎" },
      { names: ["love eyes", "heart eyes"], emoji: "😍" },
      { names: ["kiss"], emoji: "😘" },
      { names: ["tongue", "silly"], emoji: "😜" },
      { names: ["thinking", "think"], emoji: "🤔" },
      { names: ["sleep", "sleepy", "zzz"], emoji: "😴" },
      { names: ["sick"], emoji: "🤒" },
      { names: ["angry", "mad"], emoji: "😠" },
      { names: ["cry", "crying", "sad"], emoji: "😢" },
      { names: ["scared", "fear"], emoji: "😨" },
      { names: ["surprised", "wow"], emoji: "😮" },
      { names: ["clown"], emoji: "🤡" },
      { names: ["ghost"], emoji: "👻" },
      { names: ["alien"], emoji: "👽" },
      { names: ["robot"], emoji: "🤖" },
      { names: ["poop", "poo"], emoji: "💩" },
      { names: ["skull", "skeleton"], emoji: "💀" },
    ],
  },
  {
    category: "people",
    items: [
      { names: ["baby"], emoji: "👶" },
      { names: ["boy"], emoji: "👦" },
      { names: ["girl"], emoji: "👧" },
      { names: ["man"], emoji: "👨" },
      { names: ["woman"], emoji: "👩" },
      { names: ["family"], emoji: "👨‍👩‍👧" },
      { names: ["hand", "wave", "hi", "hello"], emoji: "👋" },
      { names: ["thumbs up", "like", "yes"], emoji: "👍" },
      { names: ["thumbs down", "dislike", "no"], emoji: "👎" },
      { names: ["clap", "clapping"], emoji: "👏" },
      { names: ["muscle", "strong", "flex"], emoji: "💪" },
      { names: ["pray", "please", "hope"], emoji: "🙏" },
      { names: ["point", "pointing"], emoji: "👉" },
      { names: ["ok", "okay"], emoji: "👌" },
      { names: ["peace", "victory"], emoji: "✌️" },
      { names: ["fist", "punch"], emoji: "👊" },
      { names: ["eyes", "look"], emoji: "👀" },
      { names: ["brain", "smart"], emoji: "🧠" },
      { names: ["footprints", "feet"], emoji: "👣" },
    ],
  },
  {
    category: "fantasy",
    items: [
      { names: ["angel"], emoji: "👼" },
      { names: ["fairy"], emoji: "🧚" },
      { names: ["mermaid"], emoji: "🧜" },
      { names: ["wizard", "mage"], emoji: "🧙" },
      { names: ["vampire"], emoji: "🧛" },
      { names: ["zombie"], emoji: "🧟" },
      { names: ["genie"], emoji: "🧞" },
      { names: ["superhero", "hero"], emoji: "🦸" },
      { names: ["princess"], emoji: "👸" },
      { names: ["prince"], emoji: "🤴" },
      { names: ["santa", "santa claus"], emoji: "🎅" },
    ],
  },
  {
    category: "flags",
    items: [
      { names: ["flag", "white flag"], emoji: "🏳️" },
      { names: ["rainbow flag", "pride"], emoji: "🏳️‍🌈" },
      { names: ["checkered flag", "finish"], emoji: "🏁" },
      { names: ["pirate", "pirate flag"], emoji: "🏴‍☠️" },
    ],
  },
  {
    category: "celebration",
    items: [
      { names: ["party", "party popper", "celebrate"], emoji: "🎉" },
      { names: ["confetti"], emoji: "🎊" },
      { names: ["fireworks"], emoji: "🎆" },
      { names: ["sparkler"], emoji: "🎇" },
      { names: ["christmas tree", "xmas"], emoji: "🎄" },
      { names: ["jack o lantern", "pumpkin", "halloween"], emoji: "🎃" },
      { names: ["easter egg"], emoji: "🥚" },
    ],
  },
];

// Build lookup maps for fast access
const emojiByName = new Map<string, { emoji: string; category: string }>();
const emojisByCategory = new Map<string, EmojiItem[]>();

EMOJI_DATABASE.forEach((cat) => {
  emojisByCategory.set(cat.category, cat.items);
  cat.items.forEach((item) => {
    item.names.forEach((name) => {
      emojiByName.set(name.toLowerCase(), {
        emoji: item.emoji,
        category: cat.category,
      });
    });
  });
});

/**
 * Look up an emoji by name (case-insensitive)
 */
export function findEmojiByName(
  name: string,
): { emoji: string; category: string } | null {
  return emojiByName.get(name.toLowerCase().trim()) || null;
}

/**
 * Get all emojis in a category
 */
export function getEmojisByCategory(category: string): EmojiItem[] {
  return emojisByCategory.get(category) || [];
}

/**
 * Get random distractors from the same category (excluding the target)
 */
export function getDistractors(
  targetEmoji: string,
  category: string,
  count: number = 2,
): string[] {
  const categoryItems = getEmojisByCategory(category);
  const others = categoryItems.filter((item) => item.emoji !== targetEmoji);

  // Shuffle and take count items
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((item) => item.emoji);
}

/**
 * Get all available emoji names for suggestions
 */
export function getAllEmojiNames(): string[] {
  const names: string[] = [];
  EMOJI_DATABASE.forEach((cat) => {
    cat.items.forEach((item) => {
      // Only add primary name (first in array)
      names.push(item.names[0]);
    });
  });
  return names;
}
