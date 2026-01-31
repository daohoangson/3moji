const SUGGESTIONS = [
  // Colors
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  // Animals
  "cat",
  "dog",
  "bird",
  "fish",
  "bear",
  "rabbit",
  "lion",
  "elephant",
  // Shapes
  "circle",
  "square",
  "triangle",
  "star",
  "heart",
  // Objects
  "apple",
  "banana",
  "car",
  "ball",
  "house",
  "tree",
  "flower",
  "sun",
  "moon",
];

/**
 * Returns n random unique suggestions
 */
export function getRandomSuggestions(count: number = 4): string[] {
  const shuffled = [...SUGGESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
