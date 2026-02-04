import { TOPICS } from "./data";
import { shuffle } from "../shuffle";
import type { Topic, TopicLevel, TopicItem } from "./schema";

export { TOPICS } from "./data";
export { LEVELS, getLevelInfo } from "./levels";
export { isEmojiItem, isColorItem } from "./schema";
export type {
  Topic,
  TopicLevel,
  TopicItem,
  EmojiItem,
  ColorItem,
} from "./schema";
export type { LevelInfo } from "./levels";

export function getAllTopics(): Topic[] {
  return TOPICS;
}

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find((topic) => topic.id === id);
}

export function getTopicsByLevel(level: TopicLevel): Topic[] {
  return TOPICS.filter((topic) => topic.level === level);
}

export function getRandomItemsFromTopic(
  topicId: string,
  count: number,
): TopicItem[] {
  const topic = getTopicById(topicId);
  if (!topic) {
    return [];
  }
  const shuffled = shuffle([...topic.items]);
  return shuffled.slice(0, Math.min(count, topic.items.length));
}
