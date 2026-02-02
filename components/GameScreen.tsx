"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2 } from "lucide-react";
import { isSpeechAvailable, speakWord } from "@/lib/speech";
import { playPopSound } from "@/lib/audio";

export interface GameItem {
  id: string;
  value: string;
  isCorrect: boolean;
  status: "normal" | "wrong" | "correct";
}

interface GameScreenProps {
  inputWord: string;
  items: GameItem[];
  type: "color" | "emoji";
  onItemClick: (id: string) => void;
}

function CardContent({
  item,
  type,
}: {
  item: GameItem;
  type: "color" | "emoji";
}) {
  if (type === "color") {
    return (
      <div
        className="h-full w-full rounded-2xl border-2 border-black/5 shadow-inner sm:rounded-3xl"
        style={{ backgroundColor: item.value }}
      />
    );
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center leading-none drop-shadow-sm filter select-none"
      style={{ fontSize: "min(20vh, 20vw)" }}
    >
      {item.value}
    </div>
  );
}

export function GameScreen({
  inputWord,
  items,
  type,
  onItemClick,
}: GameScreenProps) {
  const hasCorrectAnswer = items.some((item) => item.status === "correct");

  // Check speech availability only on client to avoid hydration mismatch
  const [speechAvailable, setSpeechAvailable] = useState(false);

  useEffect(() => {
    setSpeechAvailable(isSpeechAvailable());
  }, []);

  // Announce the word when the game screen loads
  useEffect(() => {
    if (speechAvailable) {
      // Small delay to let the screen render first
      const timer = setTimeout(() => {
        speakWord(inputWord);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputWord, speechAvailable]);

  const handleSpeakClick = () => {
    playPopSound();
    speakWord(inputWord);
  };

  return (
    <main className="fixed inset-0 flex flex-col items-center overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="z-20 flex w-full shrink-0 items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          prefetch={true}
          onClick={() => playPopSound()}
          aria-label="Go back"
          className="rounded-full bg-white/80 p-3 text-slate-400 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-sky-600 hover:shadow-md focus:ring-2 focus:ring-sky-500 focus:outline-none active:scale-95"
        >
          <ArrowLeft className="h-6 w-6 stroke-[3px]" />
        </Link>
        <div className="relative mx-4 flex max-w-[70%] items-center justify-center truncate rounded-full border-b-4 border-sky-100 bg-white/90 py-3 pl-10 pr-10 shadow-lg backdrop-blur-md transition-all duration-500 ease-out sm:px-12">
          <h2 className="truncate text-xl font-black tracking-tight text-slate-800 sm:text-3xl">
            Find: <span className="text-sky-600 capitalize">{inputWord}</span>
          </h2>
          <button
            onClick={handleSpeakClick}
            disabled={!speechAvailable}
            aria-label={`Listen to ${inputWord}`}
            className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-sky-400 transition-opacity duration-500 focus:ring-2 focus:ring-sky-500 focus:outline-none ${
              speechAvailable
                ? "opacity-100 hover:bg-sky-50 hover:text-sky-600 active:scale-90"
                : "pointer-events-none opacity-0"
            }`}
          >
            <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      {/* Game Area */}
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col items-stretch justify-center gap-4 p-4 sm:gap-8 sm:p-8 landscape:flex-row">
        {items.map((item, index) => {
          const isWrong = item.status === "wrong";
          const isCorrect = item.status === "correct";

          return (
            <button
              key={`${item.id}-${item.status}`}
              onClick={() => onItemClick(item.id)}
              disabled={isWrong || hasCorrectAnswer}
              aria-label={`Option: ${item.value}`}
              style={{
                animationDelay:
                  item.status === "normal" ? `${index * 150}ms` : "0ms",
              }}
              className={`relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-3xl border-b-[8px] touch-manipulation focus:outline-none sm:rounded-[2.5rem] sm:border-b-[12px] ${
                isWrong
                  ? "cursor-not-allowed border-transparent bg-slate-100 opacity-50 shadow-none grayscale"
                  : "transform transition-all duration-300"
              } ${
                !isWrong && !isCorrect
                  ? "animate-pop-in border-slate-200 bg-white shadow-xl"
                  : ""
              } ${
                !isWrong && !isCorrect && !hasCorrectAnswer
                  ? "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl focus:ring-4 focus:ring-sky-500/30 active:translate-y-0 active:scale-[0.98] active:border-b-4"
                  : ""
              } ${
                !isWrong && !isCorrect && hasCorrectAnswer
                  ? "cursor-default opacity-50 grayscale"
                  : ""
              } ${
                isCorrect
                  ? "z-10 scale-105 border-green-500 bg-green-50 ring-4 shadow-green-200 ring-green-400 ring-offset-4 ring-offset-transparent"
                  : ""
              } `}
            >
              <div
                className={`pointer-events-none absolute inset-3 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50/50 sm:inset-5 sm:rounded-3xl ${
                  isWrong ? "animate-shake" : ""
                }`}
              >
                {isCorrect && (
                  <div className="absolute inset-0 z-10 animate-pulse bg-green-400/20" />
                )}
                <CardContent item={item} type={type} />
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}
