"use client";

import { Brain, ArrowRight } from "lucide-react";

interface InputScreenProps {
  inputWord: string;
  errorMsg: string;
  isLoading: boolean;
  suggestions: string[];
  onInputChange: (value: string) => void;
  onStart: () => void;
  onSuggestionClick: (word: string) => void;
}

export function InputScreen({
  inputWord,
  errorMsg,
  isLoading,
  suggestions,
  onInputChange,
  onStart,
  onSuggestionClick,
}: InputScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputWord.trim() && !isLoading) {
      onStart();
    }
  };

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-slate-50 p-6">
      <section className="max-h-full w-full max-w-md overflow-y-auto rounded-3xl border-b-8 border-blue-500 bg-white p-6 text-center shadow-xl sm:p-8">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4">
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-slate-800">
          Find It!
        </h1>
        <p className="mb-6 text-lg text-slate-500">
          Type a word for your child to find.
        </p>

        {/* Quick suggestions */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((word) => (
            <button
              key={word}
              onClick={() => onSuggestionClick(word)}
              disabled={isLoading}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 capitalize transition-all hover:bg-blue-100 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 disabled:opacity-50"
            >
              {word}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Or type your own..."
            aria-label="Enter a word for your child to find"
            aria-describedby={errorMsg ? "error-message" : undefined}
            className="w-full rounded-2xl border-4 border-slate-200 bg-slate-50 p-4 text-center text-2xl font-bold text-slate-800 placeholder-slate-300 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            autoFocus
            disabled={isLoading}
          />

          {errorMsg && (
            <div
              id="error-message"
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-500"
            >
              {errorMsg}
            </div>
          )}

          <button
            onClick={onStart}
            disabled={!inputWord.trim() || isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-5 text-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:translate-y-1 disabled:opacity-50 disabled:shadow-none"
          >
            Start Game
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </main>
  );
}
