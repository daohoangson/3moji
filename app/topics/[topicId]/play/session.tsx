"use client";

import { useState } from "react";
import {
  GameScreen,
  LoadingScreen,
  SessionProgress,
  SessionSummary,
} from "@/components";
import { playSuccessSound, playErrorSound } from "@/lib/audio";
import { useClientValue } from "@/lib/use-is-client";
import type { TopicItem } from "@/lib/topics";
import { buildSession } from "@/lib/topics/build-session";

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

export default function TopicSession({
  topicId,
  topicName,
  topicIcon,
  topicItems,
}: TopicSessionProps) {
  const [rounds, resetRounds] = useClientValue(() => buildSession(topicItems));
  const [screen, setScreen] = useState<Screen>("game");
  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>(
    {},
  );

  if (!rounds) {
    return <LoadingScreen />;
  }

  const round = rounds[currentRound];
  const totalRounds = rounds.length;

  // Derive display items from round data + status map
  const items: ItemWithStatus[] = round.items.map((item) => ({
    ...item,
    status: itemStatuses[item.id] || "normal",
  }));

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
      setItemStatuses((prev) => ({ ...prev, [id]: "correct" }));

      // After delay, advance to next round or show summary
      setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound((prev) => prev + 1);
          setItemStatuses({});
        } else {
          setScreen("summary");
        }
      }, 1500);
    } else {
      playErrorSound();
      setItemStatuses((prev) => ({ ...prev, [id]: "wrong" }));
    }
  };

  const handleRestart = () => {
    resetRounds();
    setScreen("game");
    setCurrentRound(0);
    setCorrectCount(0);
    setItemStatuses({});
  };

  if (screen === "summary") {
    return (
      <SessionSummary
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
