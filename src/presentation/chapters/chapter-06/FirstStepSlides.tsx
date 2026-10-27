import { Sequence, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, ramp } from "../chapter-01/motion";
import { KineticType } from "../shared/KineticType";
import { PromoQRCode } from "./PromoQRCode";
import { AtomIQShowcase } from "../chapter-03/Slide08Meet";
import { chapterTheme, chapterSixTiming } from "./theme";

const { dark, light } = chapterTheme.colors;

export function Slide19FirstStep({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter="06" frame={frame} background={light}>
    <div style={{ position: "absolute", inset: 96, display: "grid", placeItems: "center" }}>
      <KineticType lines={["Are you willing", "to take the first step?"]} settle={28} fontSize={164} reducedMotion={reducedMotion} />
    </div>
  </ChapterCanvas>;
}

export const closingLines = ["Start with what you know.", "Learn what you don't.", "Discover what's possible."] as const;

export function Slide20Closing(props: SlideProps) {
  const frame = useCurrentFrame();
  const timing = chapterSixTiming.closing;
  const brandVisible = frame >= timing.brandStart;
  const fade = ramp(frame, timing.brandStart, timing.brandStart + 12);
  const finished = frame >= timing.brandStart + 12;
  return <ChapterCanvas chapter="06" frame={frame} background={finished ? light : dark}>
    {!finished ? <div data-testid="closing-message" aria-hidden={brandVisible} style={{ position: "absolute", left: 128, right: 128, top: 282, textAlign: "center", opacity: 1 - fade }}>
      {closingLines.map((line, index) => frame > timing.lineStarts[index]! ? <div key={line} data-testid={`closing-line-${index + 1}`} style={{ marginBottom: 36 }}>
        <KineticType lines={[line]} start={timing.lineStarts[index]!} settle={timing.lineStarts[index]! + 20} fontSize={118} reducedMotion={props.reducedMotion} />
      </div> : null)}
    </div> : null}
    {brandVisible ? <Sequence from={timing.brandStart} name="Final AtomIQ reveal">
      <div data-testid="closing-brand" className="chapter-canvas--light" style={{ position: "absolute", inset: 0, background: light, opacity: fade }}><AtomIQShowcase {...props} /></div>
    </Sequence> : null}
  </ChapterCanvas>;
}

export function Slide22Discover(props: SlideProps) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter="06" frame={frame} background="#FFF7E8"><PromoQRCode {...props} /></ChapterCanvas>;
}
