import { z } from "zod";

export const SessionRoundSchema = z.object({
  word: z.string(),
  type: z.enum(["color", "emoji"]),
  targetValue: z.string(),
  distractors: z.tuple([z.string(), z.string()]),
});

export type SessionRound = z.infer<typeof SessionRoundSchema>;

export const SessionSchema = z.object({
  topicId: z.string(),
  rounds: z.array(SessionRoundSchema),
  currentRound: z.number(),
  correctCount: z.number(),
});

export type Session = z.infer<typeof SessionSchema>;

export interface RoundWithItems extends SessionRound {
  items: { id: string; value: string; isCorrect: boolean }[];
}

export const DEFAULT_SESSION_LENGTH = 10;
