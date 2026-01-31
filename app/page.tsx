"use client";

import { useState, useEffect } from "react";
import {
  InputScreen,
  LoadingScreen,
  GameScreen,
  SuccessScreen,
  type GameItem,
} from "@/components";
import { unlockAudio, playSuccessSound, playErrorSound } from "@/lib/audio";
import { shuffle } from "@/lib/shuffle";
import { getRandomSuggestions } from "@/lib/suggestions";

type Screen = "input" | "loading" | "game" | "success";

interface GameData {
  type: "color" | "emoji";
  targetValue: string;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("input");
  const [inputWord, setInputWord] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [items, setItems] = useState<GameItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generate suggestions on mount and after each game
  useEffect(() => {
    setSuggestions(getRandomSuggestions(4));
  }, []);

  const resetGame = () => {
    setScreen("input");
    setInputWord("");
    setErrorMsg("");
    setGameData(null);
    setItems([]);
    setSuggestions(getRandomSuggestions(4));
  };

  const startGame = async (word: string) => {
    if (!word.trim()) return;

    // Unlock audio on user interaction (required for iOS/Chrome)
    await unlockAudio();

    setInputWord(word);
    setScreen("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error("API Error");
      }

      const data = await response.json();

      const newItems: GameItem[] = [
        {
          id: "target",
          value: data.targetValue,
          isCorrect: true,
          status: "normal",
        },
        {
          id: "d1",
          value: data.distractors[0],
          isCorrect: false,
          status: "normal",
        },
        {
          id: "d2",
          value: data.distractors[1],
          isCorrect: false,
          status: "normal",
        },
      ];

      shuffle(newItems);

      setGameData({ type: data.type, targetValue: data.targetValue });
      setItems(newItems);
      setScreen("game");
      // Refresh suggestions for next round
      setSuggestions(getRandomSuggestions(4));
    } catch {
      setErrorMsg("Try a different word.");
      setScreen("input");
    }
  };

  const handleStart = () => startGame(inputWord);

  const handleSuggestionClick = (word: string) => startGame(word);

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
      {screen === "input" && (
        <InputScreen
          inputWord={inputWord}
          errorMsg={errorMsg}
          isLoading={false}
          suggestions={suggestions}
          onInputChange={setInputWord}
          onStart={handleStart}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
      {screen === "loading" && <LoadingScreen />}
      {screen === "game" && gameData && (
        <GameScreen
          inputWord={inputWord}
          items={items}
          type={gameData.type}
          onItemClick={handleItemClick}
          onBack={resetGame}
        />
      )}
      {screen === "success" && gameData && (
        <SuccessScreen
          inputWord={inputWord}
          targetValue={gameData.targetValue}
          type={gameData.type}
          suggestions={suggestions}
          onPlayAgain={resetGame}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
}
