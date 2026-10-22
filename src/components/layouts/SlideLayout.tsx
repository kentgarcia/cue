import type { PropsWithChildren } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ReducedMotionContext } from "../animations";
import { theme } from "../../presentation/theme";
import type { SlideProps } from "../../engine/types";

export function SlideLayout({
  children,
  reducedMotion,
  slideCount,
  background = theme.colors.paper,
  color = theme.colors.ink,
  chapter,
  number,
}: PropsWithChildren<
  SlideProps & {
    background?: string;
    color?: string;
    chapter: string;
    number: string;
  }
>) {
  const frame = useCurrentFrame();
  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      <AbsoluteFill
        data-slide-frame={frame}
        style={{
          background,
          color,
          fontFamily: theme.fonts.display,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "72px 108px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: theme.fonts.body,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 3,
          }}
        >
          <span>THE NEXT CHAPTER ↗</span>
          <span>{chapter.toUpperCase()}</span>
        </div>
        {children}
        <div
          style={{
            position: "absolute",
            inset: "auto 108px 66px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: theme.fonts.body,
            fontSize: 21,
            opacity: 0.65,
          }}
        >
          <span>A little curiosity. A world of possibility.</span>
          <span>
            {number} / {String(slideCount).padStart(2, "0")}
          </span>
        </div>
      </AbsoluteFill>
    </ReducedMotionContext.Provider>
  );
}
