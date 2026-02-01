"use client";

import { useState } from "react";
import { GameScreen, SuccessScreen } from "@/components";
import { playSuccessSound, playErrorSound } from "@/lib/audio";

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
  suggestions: string[];
}

export default function GameClient({
  word,
  type,
  targetValue,
  initialItems,
  suggestions,
}: GameClientProps) {
  const [screen, setScreen] = useState<Screen>("game");

  // Add status to items (status is client-only state)
  const [items, setItems] = useState<GameItemWithStatus[]>(() =>
    initialItems.map((item) => ({ ...item, status: "normal" as ItemStatus })),
  );

  const handleItemClick = (id: string) => {
    const hasCorrectAnswer = items.some((item) => item.status === "correct");
    if (hasCorrectAnswer) return;

    const clickedItem = items.find((item) => item.id === id);
    if (!clickedItem || clickedItem.status === "wrong") return;

    if (clickedItem.isCorrect) {
      playSuccessSound();
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "correct" } : item,
        ),
      );
      setTimeout(() => setScreen("success"), 1500);
    } else {
      playErrorSound();
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "wrong" } : item,
        ),
      );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden text-slate-900 select-none">
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
          suggestions={suggestions}
        />
      )}
    </div>
  );
}
