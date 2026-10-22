import { ArrowUpRight } from "lucide-react";
import { AnimatedShape, FadeIn, StaggeredText } from "../components/animations";
import { SlideLayout } from "../components/layouts/SlideLayout";
import type { SlideProps } from "../engine/types";
import { theme } from "../presentation/theme";

export function ClosingSlide(props: SlideProps) {
  return (
    <SlideLayout
      {...props}
      chapter="05 — Your next chapter"
      number="05"
      background={theme.colors.orange}
    >
      <h1
        style={{
          position: "absolute",
          left: 108,
          top: 240,
          right: 100,
          fontSize: 183,
          letterSpacing: -10,
          fontWeight: 700,
          lineHeight: 0.98,
          margin: 0,
        }}
      >
        <StaggeredText text="YOUR FUTURE" startFrame={0} stagger={5} />
        <br />
        <StaggeredText text="STARTS NOW." startFrame={48} stagger={7} />
      </h1>
      <AnimatedShape
        kind="circle"
        color={theme.colors.paper}
        size={185}
        startFrame={95}
        style={{ position: "absolute", right: 194, bottom: 215 }}
      />
      <FadeIn
        startFrame={100}
        style={{ position: "absolute", right: 226, bottom: 247 }}
      >
        <ArrowUpRight size={120} strokeWidth={2} />
      </FadeIn>
      <FadeIn startFrame={98}>
        <p
          style={{ position: "absolute", left: 115, bottom: 200, fontSize: 36 }}
        >
          Go make your someday, today.
        </p>
      </FadeIn>
    </SlideLayout>
  );
}
