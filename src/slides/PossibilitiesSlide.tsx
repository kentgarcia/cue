import { Atom, HeartPulse, Lightbulb, Wrench } from "lucide-react";
import { FadeIn, ProgressiveReveal } from "../components/animations";
import { SlideLayout } from "../components/layouts/SlideLayout";
import type { SlideProps } from "../engine/types";
import { theme } from "../presentation/theme";

const aspirations = [
  {
    title: "Engineer",
    caption: "Build what’s next.",
    icon: Wrench,
    color: theme.colors.violet,
    frame: 42,
  },
  {
    title: "Scientist",
    caption: "Ask a bigger question.",
    icon: Atom,
    color: theme.colors.green,
    frame: 84,
  },
  {
    title: "Doctor",
    caption: "Make a difference.",
    icon: HeartPulse,
    color: theme.colors.orange,
    frame: 126,
  },
  {
    title: "Innovator",
    caption: "Imagine another way.",
    icon: Lightbulb,
    color: theme.colors.yellow,
    frame: 168,
  },
];

export function PossibilitiesSlide(props: SlideProps) {
  return (
    <SlideLayout {...props} chapter="03 — Possibilities" number="03">
      <FadeIn>
        <h1
          style={{
            position: "absolute",
            left: 108,
            top: 212,
            fontSize: 119,
            lineHeight: 1.05,
            letterSpacing: -6,
            margin: 0,
          }}
        >
          One you.
          <br />
          <span style={{ color: theme.colors.purple }}>
            Endless possibilities.
          </span>
        </h1>
      </FadeIn>
      <div
        style={{
          position: "absolute",
          left: 108,
          right: 108,
          bottom: 195,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 25,
        }}
      >
        {aspirations.map(({ title, caption, icon: Icon, color, frame }) => (
          <ProgressiveReveal key={title} atFrame={frame}>
            <div
              style={{
                borderRadius: 32,
                background: color,
                padding: "44px 32px",
                height: 320,
              }}
            >
              <Icon size={76} strokeWidth={1.8} />
              <h2
                style={{
                  fontSize: 43,
                  margin: "38px 0 10px",
                  letterSpacing: -1.5,
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  fontSize: 22,
                  margin: 0,
                  fontFamily: theme.fonts.body,
                }}
              >
                {caption}
              </p>
            </div>
          </ProgressiveReveal>
        ))}
      </div>
    </SlideLayout>
  );
}
