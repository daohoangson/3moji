let cachedVoices: SpeechSynthesisVoice[] | null = null;
let initializationStarted = false;

/**
 * Check if speech synthesis is available in the browser
 */
export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function captureVoices(): SpeechSynthesisVoice[] {
  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    cachedVoices = voices;
  }

  return voices;
}

/**
 * Start loading browser voices once when the app mounts.
 */
export function initializeSpeech(): void {
  if (!isSpeechAvailable() || initializationStarted) return;

  initializationStarted = true;

  if (captureVoices().length === 0) {
    window.speechSynthesis.addEventListener("voiceschanged", captureVoices, {
      once: true,
    });
  }
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
  const voices = cachedVoices ?? captureVoices();
  const normalizedLang = lang.toLowerCase();
  const languageCode = normalizedLang.split("-")[0];
  const matchingVoice =
    voices.find((voice) => voice.lang.toLowerCase() === normalizedLang) ??
    voices.find(
      (voice) => voice.lang.toLowerCase().split("-")[0] === languageCode,
    );
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}
