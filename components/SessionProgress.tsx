"use client";

interface SessionProgressProps {
  currentRound: number;
  totalRounds: number;
}

export function SessionProgress({
  currentRound,
  totalRounds,
}: SessionProgressProps) {
  return (
    <>
      {/* Progress dots */}
      <div
        className="absolute bottom-0 left-1/2 z-30 mb-4 flex -translate-x-1/2 gap-2"
        role="progressbar"
        aria-valuenow={currentRound + 1}
        aria-valuemin={1}
        aria-valuemax={totalRounds}
        aria-label={`Round ${currentRound + 1} of ${totalRounds}`}
      >
        {Array.from({ length: totalRounds }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index < currentRound
                ? "bg-green-500"
                : index === currentRound
                  ? "h-3 w-3 bg-sky-500"
                  : "bg-slate-300"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </>
  );
}
