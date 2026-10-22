import type { CSSProperties, ReactNode } from "react";
import { Img } from "remotion";
import type { SlideProps } from "../../engine/types";
import { SlideLayout } from "./SlideLayout";
import {
  AnimatedNumber,
  AnimatedText,
  FadeIn,
  ProgressiveReveal,
} from "../animations";
import { theme } from "../../presentation/theme";

interface TemplateProps extends SlideProps {
  title: string;
  chapter?: string;
  number?: string;
  children?: ReactNode;
}
const headline: CSSProperties = {
  fontSize: theme.type.headline,
  fontWeight: 700,
  lineHeight: 1.02,
  letterSpacing: -7,
  margin: 0,
};

export function TitleSlide({
  title,
  children,
  chapter = "Introduction",
  number = "01",
  ...props
}: TemplateProps) {
  return (
    <SlideLayout {...props} chapter={chapter} number={number}>
      <div style={{ position: "absolute", left: 108, right: 108, top: 300 }}>
        <h1 style={headline}>
          <AnimatedText text={title} />
        </h1>
        {children}
      </div>
    </SlideLayout>
  );
}

export function StatementSlide(props: TemplateProps) {
  return <TitleSlide {...props} />;
}
export function QuestionSlide(props: TemplateProps) {
  return <TitleSlide {...props} chapter={props.chapter ?? "A question"} />;
}
export function ClosingSlideTemplate(props: TemplateProps) {
  return <TitleSlide {...props} chapter="Your next chapter" />;
}

export function ComparisonSlide({
  title,
  left,
  right,
  ...props
}: TemplateProps & { left: ReactNode; right: ReactNode }) {
  return (
    <TitleSlide {...props} title={title}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          marginTop: 70,
          fontSize: 48,
        }}
      >
        <FadeIn>{left}</FadeIn>
        <FadeIn startFrame={48}>{right}</FadeIn>
      </div>
    </TitleSlide>
  );
}

export function ImageSlide({
  title,
  image,
  alt,
  ...props
}: TemplateProps & { image: string; alt: string }) {
  return (
    <TitleSlide {...props} title={title}>
      <FadeIn startFrame={36}>
        <Img
          pauseWhenLoading
          src={image}
          alt={alt}
          style={{
            marginTop: 36,
            width: "100%",
            height: 380,
            objectFit: "cover",
            borderRadius: 24,
          }}
        />
      </FadeIn>
    </TitleSlide>
  );
}

export function StatisticSlide({
  title,
  value,
  suffix,
  ...props
}: TemplateProps & { value: number; suffix?: string }) {
  return (
    <TitleSlide {...props} title={title}>
      <div style={{ fontSize: 220, color: theme.colors.purple }}>
        <AnimatedNumber value={value} suffix={suffix} startFrame={36} />
      </div>
    </TitleSlide>
  );
}

export function TimelineSlide({
  title,
  events,
  ...props
}: TemplateProps & { events: readonly { label: string; atFrame: number }[] }) {
  return (
    <TitleSlide {...props} title={title}>
      <div style={{ display: "flex", gap: 48, marginTop: 100, fontSize: 40 }}>
        {events.map((event, index) => (
          <ProgressiveReveal key={event.label} atFrame={event.atFrame}>
            <div
              style={{
                borderTop: `6px solid ${theme.colors.purple}`,
                paddingTop: 30,
              }}
            >
              {index + 1}. {event.label}
            </div>
          </ProgressiveReveal>
        ))}
      </div>
    </TitleSlide>
  );
}
