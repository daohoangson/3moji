"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputScreen } from "@/components";
import { unlockAudio } from "@/lib/audio";

interface HomeClientProps {
  suggestions: string[];
}

export default function HomeClient({ suggestions }: HomeClientProps) {
  const router = useRouter();
  const [inputWord, setInputWord] = useState("");

  const handleStart = async () => {
    if (!inputWord.trim()) return;

    // Unlock audio on user interaction (required for iOS/Chrome)
    await unlockAudio();

    // Navigate to the game page
    router.push(`/find/${encodeURIComponent(inputWord.trim())}`);
  };

  return (
    <div className="h-screen w-screen overflow-hidden text-slate-900 select-none">
      <InputScreen
        inputWord={inputWord}
        errorMsg=""
        isLoading={false}
        suggestions={suggestions}
        onInputChange={setInputWord}
        onStart={handleStart}
      />
    </div>
  );
}
