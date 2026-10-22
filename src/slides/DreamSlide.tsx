import { AnimatedShape, FadeIn, WordByWord } from "../components/animations";
import { SlideLayout } from "../components/layouts/SlideLayout";
import type { SlideProps } from "../engine/types";
import { theme } from "../presentation/theme";

export function DreamSlide(props: SlideProps) {
  return (
    <SlideLayout
      {...props}
      chapter="02 — The dream"
      number="02"
      background={theme.colors.violet}
    >
      <FadeIn startFrame={0}>
        <div
          style={{
            position: "absolute",
            left: 112,
            top: 235,
            fontSize: 26,
            letterSpacing: 4,
          }}
        >
          LET YOUR MIND WANDER.
        </div>
      </FadeIn>
      <h1
        style={{
          position: "absolute",
          left: 108,
          top: 310,
          width: 1310,
          fontSize: 158,
          lineHeight: 1.04,
          letterSpacing: -8,
          margin: 0,
          fontWeight: 700,
        }}
      >
        <WordByWord
          text="What do you want to become?"
          wordFrames={[0, 5, 10, 48, 53, 96]}
        />
      </h1>
      <AnimatedShape
        kind="circle"
        size={330}
        color={theme.colors.purple}
        startFrame={96}
        style={{ position: "absolute", right: -110, top: 250 }}
      />
      <AnimatedShape
        size={145}
        color={theme.colors.paper}
        startFrame={5}
        style={{ position: "absolute", right: 245, bottom: 200 }}
      />
      <FadeIn startFrame={100}>
        <p
          style={{ position: "absolute", left: 114, bottom: 186, fontSize: 32 }}
        >
          There’s no wrong answer. Only a starting point.
        </p>
      </FadeIn>
    </SlideLayout>
  );
}
