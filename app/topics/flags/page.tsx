import type { Metadata } from "next";
import Link from "next/link";
import { Markdown } from "@/components";
import { getTopicById, getLevelInfo, isEmojiItem } from "@/lib/topics";

const FLAG_TOPIC_IDS = ["flags-easy", "flags-medium", "flags-hard"] as const;

const LEVEL_STYLES = {
  1: {
    accent: "bg-emerald-100 text-emerald-700",
    border: "ring-emerald-200",
    badge: "bg-emerald-500",
    difficulty: "Beginner",
  },
  2: {
    accent: "bg-amber-100 text-amber-700",
    border: "ring-amber-200",
    badge: "bg-amber-500",
    difficulty: "Intermediate",
  },
  3: {
    accent: "bg-rose-100 text-rose-700",
    border: "ring-rose-200",
    badge: "bg-rose-500",
    difficulty: "Advanced",
  },
} as const;

export const metadata: Metadata = {
  title: "Flag Challenge - Find It!",
  description:
    "Test your flag knowledge across 3 difficulty levels! From famous flags to expert-level challenges.",
  openGraph: {
    title: "Flag Challenge - Find It!",
    description:
      "Test your flag knowledge across 3 difficulty levels! From famous flags to expert-level challenges.",
    type: "website",
  },
};

export default function FlagsLandingPage() {
  const topics = FLAG_TOPIC_IDS.map((id) => getTopicById(id)!);

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-50 pb-12">
      {/* Background decoration */}
      <div className="fixed -top-20 -left-20 h-64 w-64 animate-pulse rounded-full bg-sky-300 opacity-20 blur-3xl" />
      <div
        className="fixed top-40 -right-20 h-80 w-80 animate-pulse rounded-full bg-emerald-300 opacity-20 blur-3xl"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-6 inline-block text-8xl sm:text-9xl">🏁</div>
          <h1 className="mb-3 text-4xl font-black text-slate-800 sm:text-5xl">
            Flag Challenge
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600">
            How well do you know the world&apos;s flags? Start with the most
            famous ones and work your way up to expert level!
          </p>
        </div>

        {/* Level Cards */}
        <div className="space-y-6">
          {topics.map((topic) => {
            const levelInfo = getLevelInfo(topic.level);
            const style = LEVEL_STYLES[topic.level];
            const sampleItems = topic.items.slice(0, 6);

            return (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                prefetch={true}
                className={`group block rounded-3xl bg-white/80 p-6 shadow-xl ring-2 ${style.border} backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-8`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  {/* Icon + Level badge */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2">
                    <span className="text-5xl">{topic.icon}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white uppercase ${style.badge}`}
                    >
                      Level {topic.level}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 sm:text-2xl">
                        {topic.name}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.accent}`}
                      >
                        {style.difficulty}
                      </span>
                    </div>
                    <Markdown className="mb-3 text-sm text-slate-600">
                      {topic.descriptionMarkdown}
                    </Markdown>
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                      <span>{topic.items.length} flags</span>
                      <span>·</span>
                      <span>
                        {levelInfo.name} ({levelInfo.ageRange})
                      </span>
                    </div>

                    {/* Sample flags */}
                    <div className="flex flex-wrap gap-2">
                      {sampleItems.map(
                        (item) =>
                          isEmojiItem(item) && (
                            <span
                              key={item.emoji}
                              className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 px-2 py-1 text-2xl shadow-sm transition-transform select-none group-hover:scale-110"
                            >
                              {item.emoji}
                            </span>
                          ),
                      )}
                      {topic.items.length > 6 && (
                        <span className="flex items-center rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-400">
                          +{topic.items.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/topics"
            className="text-sm font-semibold text-slate-400 transition-colors hover:text-sky-600"
          >
            &larr; Back to all topics
          </Link>
        </div>
      </div>
    </main>
  );
}
