import manifest from "./media-manifest.json";

/** Preserve editable original URLs while browsers fetch the compressed, fingerprinted image. */
export function optimizedSrcSet(src: string): string | undefined {
  const optimized = (manifest as Record<string, string>)[src];
  return optimized ? `${optimized} 1x` : undefined;
}
