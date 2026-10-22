import { useContext } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  AnimatedShape,
  FadeIn,
  ReducedMotionContext,
  useProgress,
} from "../components/animations";
import { SlideLayout } from "../components/layouts/SlideLayout";
import type { SlideProps } from "../engine/types";
import { theme } from "../presentation/theme";

function ChallengeContent() {
  const frame = useCurrentFrame();
  const progress = useProgress(48, 30);
  const reduced = useContext(ReducedMotionContext);
  const smallOpacity = interpolate(frame, [48, 67], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <FadeIn>
        <p
          style={{
            position: "absolute",
            top: 430,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 50,
            opacity: smallOpacity,
            transform: reduced ? undefined : `translateY(${-progress * 60}px)`,
          }}
        >
          Every big dream begins with one thing.
        </p>
      </FadeIn>
      <div
        style={{
          position: "absolute",
          inset: "300px 80px auto",
          textAlign: "center",
          opacity: progress,
          transform: reduced ? undefined : `scale(${0.9 + progress * 0.1})`,
        }}
      >
        <h1
          style={{
            fontSize: 204,
            margin: 0,
            lineHeight: 0.98,
            fontWeight: 700,
            letterSpacing: -12,
          }}
        >
          THE COURAGE
          <br />
          TO <span style={{ color: theme.colors.yellow }}>BEGIN.</span>
        </h1>
      </div>
      <AnimatedShape
        size={120}
        startFrame={90}
        color={theme.colors.paper}
        style={{ position: "absolute", right: 235, top: 225 }}
      />
      <FadeIn startFrame={96}>
        <p
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 180,
            textAlign: "center",
            fontSize: 32,
          }}
        >
          You don’t need every answer. Just your first step.
        </p>
      </FadeIn>
    </>
  );
}

export function ChallengeSlide(props: SlideProps) {
  return (
    <SlideLayout
      {...props}
      chapter="04 — The challenge"
      number="04"
      background={theme.colors.purple}
      color={theme.colors.paper}
    >
      <ChallengeContent />
    </SlideLayout>
  );
}
