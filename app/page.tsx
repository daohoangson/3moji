import { getRandomSuggestions } from "@/lib/suggestions";
import HomeClient from "./home-client";

export default function Home() {
  const suggestions = getRandomSuggestions(4);

  return <HomeClient suggestions={suggestions} />;
}
