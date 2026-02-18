"use client";

import { useState } from "react";
import {
  GameScreen,
  LoadingScreen,
  SessionProgress,
  SessionSummary,
} from "@/components";
import { playSuccessSound, playErrorSound } from "@/lib/audio";
import { shuffle } from "@/lib/shuffle";
import { isColorItem, isEmojiItem } from "@/lib/topics";
import type { TopicItem } from "@/lib/topics";
import type { RoundWithItems } from "@/lib/topics/session";
import { DEFAULT_SESSION_LENGTH } from "@/lib/topics/session";

type ItemStatus = "normal" | "correct" | "wrong";
type Screen = "game" | "summary";

interface ItemWithStatus {
  id: string;
  value: string;
  isCorrect: boolean;
  status: ItemStatus;
}

interface TopicSessionProps {
  topicId: string;
  topicName: string;
  topicIcon: string;
  topicItems: TopicItem[];
}

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

export default function TopicSession({
  topicId,
  topicName,
  topicIcon,
  topicItems,
}: TopicSessionProps) {
  const [rounds, setRounds] = useState<RoundWithItems[] | null>(() => {
    if (typeof window === "undefined") return null;
    return buildSession(topicItems);
  });
  const [screen, setScreen] = useState<Screen>("game");
  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [items, setItems] = useState<ItemWithStatus[]>(() => {
    if (typeof window === "undefined" || !rounds) return [];
    return rounds[0].items.map((item) => ({
      ...item,
      status: "normal" as ItemStatus,
    }));
  });

  if (!rounds) {
    return <LoadingScreen />;
  }

  const round = rounds[currentRound];
  const totalRounds = rounds.length;

  const handleItemClick = (id: string) => {
    const hasCorrectAnswer = items.some((item) => item.status === "correct");
    if (hasCorrectAnswer) return;

    const clickedItem = items.find((item) => item.id === id);
    if (!clickedItem || clickedItem.status === "wrong") return;

    // Only count as correct if this is the first click (no wrong attempts yet)
    const hasWrongAttempt = items.some((item) => item.status === "wrong");

    if (clickedItem.isCorrect) {
      playSuccessSound();
      if (!hasWrongAttempt) {
        setCorrectCount((prev) => prev + 1);
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "correct" } : item,
        ),
      );

      // After delay, advance to next round or show summary
      setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound((prev) => prev + 1);
          setItems(
            rounds[currentRound + 1].items.map((item) => ({
              ...item,
              status: "normal" as ItemStatus,
            })),
          );
        } else {
          setScreen("summary");
        }
      }, 1500);
    } else {
      playErrorSound();
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "wrong" } : item,
        ),
      );
    }
  };

  const handleRestart = () => {
    const newRounds = buildSession(topicItems);
    if (newRounds) {
      setRounds(newRounds);
      setScreen("game");
      setCurrentRound(0);
      setCorrectCount(0);
      setItems(
        newRounds[0].items.map((item) => ({
          ...item,
          status: "normal" as ItemStatus,
        })),
      );
    }
  };

  if (screen === "summary") {
    return (
      <SessionSummary
        topicId={topicId}
        topicName={topicName}
        topicIcon={topicIcon}
        correctCount={correctCount}
        totalRounds={totalRounds}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="h-dvh w-screen overflow-hidden text-slate-900 select-none">
      <SessionProgress currentRound={currentRound} totalRounds={totalRounds} />

      <GameScreen
        inputWord={round.word}
        items={items}
        type={round.type}
        onItemClick={handleItemClick}
        backHref={`/topics/${topicId}`}
      />
    </div>
  );
}
