import { Suspense } from "react";
import Link from "next/link";
import { LoadingScreen } from "@/components";
import { generateGameContent } from "@/lib/game-content";
import { validateWordInput } from "@/lib/schema";
import { getSuggestionPool } from "@/lib/suggestions";
import GameClient, { type GameItem } from "./game";

interface PageProps {
  params: Promise<{ word: string }>;
}

export default async function FindPage({ params }: PageProps) {
  const { word: encodedWord } = await params;
  const word = decodeURIComponent(encodedWord);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <GameContent word={word} />
    </Suspense>
  );
}

async function GameContent({ word }: { word: string }) {
  const validation = validateWordInput(word);
  if (!validation.success) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-b from-sky-200 to-sky-100 text-slate-900 select-none">
        <p className="text-xl">Could not find game for &quot;{word}&quot;</p>
        <Link
          href="/"
          className="rounded-full bg-sky-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-sky-600"
        >
          Try Another Word
        </Link>
      </div>
    );
  }

  const data = await generateGameContent(validation.data);

  if (!data) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-b from-sky-200 to-sky-100 text-slate-900 select-none">
        <p className="text-xl">Could not find game for &quot;{word}&quot;</p>
        <Link
          href="/"
          className="rounded-full bg-sky-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-sky-600"
        >
          Try Another Word
        </Link>
      </div>
    );
  }

  // Pass items in fixed order (target first) — client shuffles on mount
  const items: GameItem[] = [
    {
      id: "target",
      value: data.targetValue,
      isCorrect: true,
    },
    {
      id: "d1",
      value: data.distractors[0],
      isCorrect: false,
    },
    {
      id: "d2",
      value: data.distractors[1],
      isCorrect: false,
    },
  ];

  // Pass suggestion pool — client picks on mount
  const suggestionPool = getSuggestionPool();

  return (
    <GameClient
      word={word}
      type={data.type}
      targetValue={data.targetValue}
      initialItems={items}
      suggestionPool={suggestionPool}
    />
  );
}
