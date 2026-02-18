import { notFound } from "next/navigation";
import { getAllTopics, getTopicById } from "@/lib/topics";
import type { TopicItem } from "@/lib/topics";
import TopicSession from "./session";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    topicId: topic.id,
  }));
}

export default async function TopicPlayPage({ params }: PageProps) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <TopicSession
      topicId={topicId}
      topicName={topic.name}
      topicIcon={topic.icon}
      topicItems={topic.items}
    />
  );
}

export type { TopicItem };
