import { useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, ramp } from "../chapter-01/motion";
import { KineticType } from "../shared/KineticType";
import { PromoQRCode } from "./PromoQRCode";
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
  const qrVisible = frame >= timing.qrStart;
  const fade = ramp(frame, timing.qrStart, timing.qrStart + 12);
  const finished = frame >= timing.qrStart + 12;
  return <ChapterCanvas chapter="06" frame={frame} background={finished ? light : dark}>
    {!finished ? <div data-testid="closing-message" aria-hidden={qrVisible} style={{ position: "absolute", left: 128, right: 128, top: 282, textAlign: "center", opacity: 1 - fade }}>
      {closingLines.map((line, index) => frame > timing.lineStarts[index]! ? <div key={line} data-testid={`closing-line-${index + 1}`} style={{ marginBottom: 36 }}>
        <KineticType lines={[line]} start={timing.lineStarts[index]!} settle={timing.lineStarts[index]! + 20} fontSize={118} reducedMotion={props.reducedMotion} />
      </div> : null)}
    </div> : null}
    {qrVisible ? <div data-testid="closing-qr" className="chapter-canvas--light" style={{ position: "absolute", inset: 0, background: light, opacity: fade }}>
      <PromoQRCode />
    </div> : null}
  </ChapterCanvas>;
}
