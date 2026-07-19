/**
 * Check if speech synthesis is available in the browser
 */
export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Speak a word using the Web Speech API
 */
export function speakWord(word: string, lang = "en-US"): void {
  if (!isSpeechAvailable()) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = lang;
  utterance.rate = 0.8; // Slightly slower for kids
  utterance.pitch = 1.1; // Slightly higher pitch
  utterance.volume = 1;

  // Prefer an installed voice matching the topic language when available
  const voices = window.speechSynthesis.getVoices();
  const languageCode = lang.split("-")[0].toLowerCase();
  const matchingVoice = voices.find(
    (voice) => voice.lang.toLowerCase().split("-")[0] === languageCode,
  );
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}
