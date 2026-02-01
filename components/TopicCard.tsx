"use client";

import Link from "next/link";
import type { Topic } from "@/lib/topics";

type TopicCardVariant = "compact" | "full";

interface TopicCardProps {
  topic: Topic;
  variant?: TopicCardVariant;
}

export function TopicCard({ topic, variant = "full" }: TopicCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/topics/${topic.id}`}
        prefetch={true}
        className="group flex flex-col items-center gap-2 rounded-2xl border-b-4 border-slate-200 bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg focus:ring-2 focus:ring-sky-500 focus:outline-none active:translate-y-0"
      >
        <div className="text-3xl sm:text-4xl">{topic.icon}</div>
        <h3 className="text-center text-sm font-bold text-slate-800 group-hover:text-sky-600">
          {topic.name}
        </h3>
      </Link>
    );
  }

  return (
    <Link
      href={`/topics/${topic.id}`}
      prefetch={true}
      className="group rounded-2xl border-b-4 border-slate-200 bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg focus:ring-2 focus:ring-sky-500 focus:outline-none active:translate-y-0 sm:p-6"
    >
      <div className="mb-3 text-4xl sm:text-5xl">{topic.icon}</div>
      <h3 className="mb-1 font-bold text-slate-800 group-hover:text-sky-600 sm:text-lg">
        {topic.name}
      </h3>
      <p className="line-clamp-2 text-xs text-slate-500 sm:text-sm">
        {topic.description}
      </p>
    </Link>
  );
}
