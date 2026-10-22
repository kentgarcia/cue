import { ArrowUpRight } from "lucide-react";
import {
  AnimatedShape,
  FadeIn,
  SlideIn,
  TextReveal,
} from "../components/animations";
import { SlideLayout } from "../components/layouts/SlideLayout";
import type { SlideProps } from "../engine/types";
import { theme } from "../presentation/theme";

export function IntroductionSlide(props: SlideProps) {
  return (
    <SlideLayout {...props} chapter="01 — Introduction" number="01">
      <div style={{ position: "absolute", left: 108, top: 242, zIndex: 2 }}>
        <h1
          style={{
            fontSize: 254,
            lineHeight: 0.9,
            letterSpacing: -17,
            fontWeight: 700,
            margin: 0,
            color: theme.colors.purple,
          }}
        >
          <SlideIn startFrame={0}>DREAM</SlideIn>
          <SlideIn startFrame={7}>
            BIG<span style={{ color: theme.colors.orange }}>.</span>
          </SlideIn>
        </h1>
        <FadeIn startFrame={50} durationInFrames={24}>
          <p style={{ fontSize: 34, margin: "42px 0 0", letterSpacing: -0.7 }}>
            Your future is a blank canvas.
            <br />
            Make it something extraordinary.
          </p>
        </FadeIn>
      </div>
      <AnimatedShape
        kind="circle"
        size={530}
        color={theme.colors.violet}
        startFrame={4}
        style={{ position: "absolute", right: -170, bottom: -110 }}
      />
      <AnimatedShape
        size={530}
        color={theme.colors.orange}
        startFrame={9}
        style={{ position: "absolute", right: 170, top: 212 }}
      />
      <SlideIn
        startFrame={10}
        style={{ position: "absolute", right: 341, top: 373 }}
      >
        <ArrowUpRight size={174} strokeWidth={2.4} color={theme.colors.ink} />
      </SlideIn>
      <TextReveal
        startFrame={82}
        style={{
          position: "absolute",
          right: 160,
          bottom: 217,
          fontSize: 25,
          letterSpacing: 4,
          fontWeight: 600,
        }}
      >
        SMALL STEPS. BIG POSSIBILITIES.
      </TextReveal>
    </SlideLayout>
  );
}
