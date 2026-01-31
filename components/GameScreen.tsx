"use client";

import { ArrowRight } from "lucide-react";

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
  onBack: () => void;
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
        className="h-full w-full rounded-xl shadow-inner"
        style={{ backgroundColor: item.value }}
      />
    );
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center leading-none select-none"
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
  onBack,
}: GameScreenProps) {
  const hasCorrectAnswer = items.some((item) => item.status === "correct");

  return (
    <div className="fixed inset-0 flex flex-col items-center overflow-hidden bg-slate-100">
      {/* Header */}
      <div className="z-20 flex h-16 w-full shrink-0 items-center justify-between px-4 py-2 sm:h-20">
        <button
          onClick={onBack}
          className="rounded-xl bg-white p-2 text-slate-400 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-600 sm:p-3"
        >
          <ArrowRight className="h-5 w-5 rotate-180 sm:h-6 sm:w-6" />
        </button>
        <div className="mx-4 max-w-[60%] truncate rounded-full border-b-4 border-slate-200 bg-white px-6 py-2 shadow-sm">
          <h2 className="truncate text-xl font-black tracking-tight text-slate-800 sm:text-2xl">
            Find: <span className="text-blue-600 capitalize">{inputWord}</span>
          </h2>
        </div>
        <div className="w-10 sm:w-12" />
      </div>

      {/* Game Area */}
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col items-stretch justify-center gap-3 p-2 sm:gap-6 sm:p-4 landscape:flex-row">
        {items.map((item) => {
          const isWrong = item.status === "wrong";
          const isCorrect = item.status === "correct";

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              disabled={isWrong || hasCorrectAnswer}
              className={`relative min-h-0 min-w-0 flex-1 transform overflow-hidden rounded-2xl border-b-[6px] border-slate-200 bg-white shadow-xl transition-all duration-300 sm:rounded-3xl sm:border-b-8 ${!isWrong && !hasCorrectAnswer ? "hover:scale-[1.02] active:scale-95 active:border-b-0" : ""} ${isWrong ? "scale-95 cursor-not-allowed border-none bg-slate-200 opacity-40 shadow-inner grayscale" : ""} ${isCorrect ? "z-10 ring-4 ring-green-400 sm:ring-8" : ""} `}
            >
              <div className="pointer-events-none absolute inset-2 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:inset-4 sm:rounded-2xl">
                {isCorrect && (
                  <div className="absolute inset-0 z-10 animate-pulse bg-green-400/20" />
                )}
                <CardContent item={item} type={type} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
