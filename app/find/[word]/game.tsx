"use client";

import { useState } from "react";
import { GameScreen, LoadingScreen, SuccessScreen } from "@/components";
import { playSuccessSound, playErrorSound } from "@/lib/audio";
import { shuffle } from "@/lib/shuffle";
import { useClientValue } from "@/lib/use-is-client";

type Screen = "game" | "success";
type ItemStatus = "normal" | "correct" | "wrong";

export interface GameItem {
  id: string;
  value: string;
  isCorrect: boolean;
}

interface GameItemWithStatus extends GameItem {
  status: ItemStatus;
}

interface GameClientProps {
  word: string;
  type: "color" | "emoji";
  targetValue: string;
  initialItems: GameItem[];
  suggestionPool: string[];
}

export default function GameClient({
  word,
  type,
  targetValue,
  initialItems,
  suggestionPool,
}: GameClientProps) {
  const [shuffledItems] = useClientValue(() => shuffle([...initialItems]));
  const [screen, setScreen] = useState<Screen>("game");
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>(
    {},
  );

  if (!shuffledItems) {
    return <LoadingScreen />;
  }

  // Derive display items from shuffled order + status map
  const items: GameItemWithStatus[] = shuffledItems.map((item) => ({
    ...item,
    status: itemStatuses[item.id] || "normal",
  }));

  const handleItemClick = (id: string) => {
    const hasCorrectAnswer = items.some((item) => item.status === "correct");
    if (hasCorrectAnswer) return;

    const clickedItem = items.find((item) => item.id === id);
    if (!clickedItem || clickedItem.status === "wrong") return;

    if (clickedItem.isCorrect) {
      playSuccessSound();
      setItemStatuses((prev) => ({ ...prev, [id]: "correct" }));
      setTimeout(() => setScreen("success"), 1500);
    } else {
      playErrorSound();
      setItemStatuses((prev) => ({ ...prev, [id]: "wrong" }));
    }
  };

  return (
    <div className="h-dvh w-screen overflow-hidden text-slate-900 select-none">
      {screen === "game" && (
        <GameScreen
          inputWord={word}
          items={items}
          type={type}
          onItemClick={handleItemClick}
        />
      )}
      {screen === "success" && (
        <SuccessScreen
          inputWord={word}
          targetValue={targetValue}
          type={type}
          suggestionPool={suggestionPool}
        />
      )}
    </div>
  );
}
