import { describe, it, expect } from "vitest";
import { DEFAULT_SESSION_LENGTH } from "./session";

describe("session constants", () => {
  it("DEFAULT_SESSION_LENGTH is 10", () => {
    expect(DEFAULT_SESSION_LENGTH).toBe(10);
  });
});
