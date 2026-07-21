"use client";

import { useEffect } from "react";
import { initializeSpeech } from "@/lib/speech";

export function SpeechInitializer() {
  useEffect(() => {
    initializeSpeech();
  }, []);

  return null;
}
