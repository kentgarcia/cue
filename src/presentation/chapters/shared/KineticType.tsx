import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { ramp } from "../chapter-01/motion";

interface KineticTypeProps {
  lines: readonly string[];
  start?: number;
  settle?: number;
  fontSize?: number;
  color?: string;
  reducedMotion: boolean;
  style?: CSSProperties;
  label?: string;
}

/** Words accumulate in their final positions; previously revealed words never move or disappear. */
export function KineticType({ lines, start = 0, settle = 22, fontSize = 140, color = "inherit", reducedMotion, style, label }: KineticTypeProps) {
  const frame = useCurrentFrame();
  const words = lines.map((line) => line.split(/\s+/).filter(Boolean));
  const total = words.reduce((count, line) => count + line.length, 0);
  const interval = Math.max(1, settle - start - 3) / Math.max(1, total);
  const wordOpacity = (index: number) => reducedMotion
    ? ramp(frame, start, Math.min(settle, start + 8))
    : ramp(frame, start + index * interval, start + index * interval + 3);
  const visibleWords = words.flat().filter((_, index) => wordOpacity(index) > 0);
  let offset = 0;
  return (
    <div data-kinetic-type="true" data-visible-words={visibleWords.length} style={{ position: "relative", width: "100%", color, textAlign: "center", ...style }}>
      <h1 aria-label={frame >= settle ? label ?? lines.join(" ") : visibleWords.join(" ")} aria-hidden={visibleWords.length === 0} style={{ margin: 0, fontSize, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.065em" }}>
        {words.map((line, lineIndex) => {
          const lineOffset = offset;
          offset += line.length;
          return <span key={lineIndex} style={{ display: "block" }}>
            {line.map((word, index) => {
              const wordIndex = lineOffset + index;
              const opacity = wordOpacity(wordIndex);
              return <span key={wordIndex} data-kinetic-word={wordIndex} data-visible={opacity > 0} aria-hidden={opacity === 0} style={{ opacity, visibility: opacity > 0 ? "visible" : "hidden" }}>{word}{index < line.length - 1 ? " " : ""}</span>;
            })}
          </span>;
        })}
      </h1>
    </div>
  );
}
