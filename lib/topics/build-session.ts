import { shuffle } from "../shuffle";
import { isColorItem } from "./schema";
import type { TopicItem } from "./schema";
import type { RoundWithItems } from "./session";
import { DEFAULT_SESSION_LENGTH } from "./session";

function getItemValue(item: TopicItem): string {
  return isColorItem(item) ? item.color : item.emoji;
}

function getItemWord(item: TopicItem): string {
  return isColorItem(item) ? item.color : item.word;
}

function getItemType(item: TopicItem): "color" | "emoji" {
  return isColorItem(item) ? "color" : "emoji";
}

export function buildSession(
  topicItems: TopicItem[],
  sessionLength: number = DEFAULT_SESSION_LENGTH,
): RoundWithItems[] | null {
  const shuffled = shuffle([...topicItems]);
  const targets = shuffled.slice(0, Math.min(sessionLength, shuffled.length));

  const rounds: RoundWithItems[] = [];

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const targetValue = getItemValue(target);

    // Collect "known" set = target values from rounds 0..i-1
    const knownValues = new Set(targets.slice(0, i).map(getItemValue));

    // Distractor pool = all items excluding: current target + items whose value is in the known set
    const pool = topicItems.filter((item) => {
      const value = getItemValue(item);
      return value !== targetValue && !knownValues.has(value);
    });

    const shuffledPool = shuffle([...pool]);
    const distractorItems = shuffledPool.slice(0, 2);
    if (distractorItems.length < 2) continue;

    const d1Value = getItemValue(distractorItems[0]);
    const d2Value = getItemValue(distractorItems[1]);

    const items = shuffle([
      { id: `${targetValue}-target`, value: targetValue, isCorrect: true },
      { id: `${targetValue}-d1`, value: d1Value, isCorrect: false },
      { id: `${targetValue}-d2`, value: d2Value, isCorrect: false },
    ]);

    rounds.push({
      word: getItemWord(target),
      type: getItemType(target),
      targetValue,
      distractors: [d1Value, d2Value],
      items,
    });
  }

  return rounds.length > 0 ? rounds : null;
}
