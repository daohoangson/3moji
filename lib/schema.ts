import { z } from "zod";

export const GameContentSchema = z.object({
  type: z.enum(["color", "emoji"]),
  targetValue: z.string(),
  distractors: z
    .array(z.string())
    .min(2)
    .transform((array) => array.slice(0, 2)),
});

export type GameContent = z.infer<typeof GameContentSchema>;

export const WordInputSchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .regex(/\p{L}/u) // must contain at least one letter
  .regex(/^[\p{L}\p{N}\s'.\-:]+$/u); // allowed characters only

export function validateWordInput(input: string) {
  return WordInputSchema.safeParse(input);
}
