import { getSuggestionPool } from "@/lib/suggestions";
import { getAllTopics } from "@/lib/topics";
import HomeClient from "./home-client";

export default function Home() {
  const suggestionPool = getSuggestionPool();
  const allTopics = getAllTopics();

  return <HomeClient suggestionPool={suggestionPool} allTopics={allTopics} />;
}
