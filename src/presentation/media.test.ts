import { statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "./media-manifest.json";

describe("production image assets", () => {
  it("ships smaller, fingerprinted derivatives for every optimized source", () => {
    for (const [source, output] of Object.entries(manifest)) {
      expect(output).toMatch(/^\/media\/optimized\/[\w-]+\.[a-f0-9]{12}\.webp$/);
      expect(statSync(resolve("public" + output)).size, source).toBeLessThan(statSync(resolve("public" + source)).size);
    }
  });
});
