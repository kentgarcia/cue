import { optimizedSrcSet } from "../../media";
import { memo } from "react";
import { Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, ramp } from "../chapter-01/motion";
import { ideaAssets, officialTagline } from "./assets";
import { chapterTheme } from "./theme";

const travelEasing = Easing.bezier(...chapterTheme.easing.travel);
const MeetBackground = memo(function MeetBackground() {
  return <div className="atomiq-meet__background" aria-hidden="true">
    <div className="atomiq-meet__wave atomiq-meet__wave--left" />
    <div className="atomiq-meet__wave atomiq-meet__wave--cream" />
    <div className="atomiq-meet__wave atomiq-meet__wave--right" />
  </div>;
});

/** One continuous launch sequence; CSS takes over only for the held slide's idle motion. */
export function Slide08Meet({ chapter = "03", ...props }: SlideProps & { chapter?: string }) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter={chapter} frame={frame} background={chapterTheme.colors.light}><AtomIQShowcase {...props} /></ChapterCanvas>;
}

export function AtomIQShowcase({ reducedMotion, ambientMotion = false }: SlideProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const travel = interpolate(frame, [16, 43], [0, 1], { easing: travelEasing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phone = frame >= 76 ? 1 : spring({ frame: Math.max(0, frame - 26), fps, config: chapterTheme.spring });
  const mascot = frame >= 90 ? 1 : spring({ frame: Math.max(0, frame - 58), fps, config: chapterTheme.spring });
  const title = ramp(frame, 39, 62);
  const tagline = ramp(frame, 49, 71);
  const landscape = ramp(frame, 22, 62);
  const animated = ambientMotion && !reducedMotion && frame >= 90;
  return <div className="atomiq-meet" data-atomiq-idle={animated ? "playing" : "still"} data-atomiq-entrance={frame < 90 ? "revealing" : "settled"}>
      <div style={{ position: "absolute", inset: 0, opacity: landscape, transform: reducedMotion ? undefined : `translate3d(0, ${230 * (1 - landscape)}px, 0)` }}>
        <MeetBackground />
      </div>
      {!reducedMotion && <div className="atomiq-meet__launch" aria-hidden="true" style={{ opacity: ramp(frame, 0, 10) * (1 - ramp(frame, 18, 32)), transform: `rotate(${-28 + frame * 1.6}deg) scale(${.94 + ramp(frame, 0, 30) * .18})` }}>
        <i /><i />
      </div>}
      <div className="atomiq-meet__logo" style={{ opacity: ramp(frame, 0, 12), transform: reducedMotion ? undefined : `translate3d(${507 * (1 - travel)}px, ${177 * (1 - travel)}px, 0) scale(${1 + .35 * (1 - travel)})` }}>
        <Img data-testid="atomiq-logo" src={ideaAssets.logo.src} srcSet={optimizedSrcSet(ideaAssets.logo.src)} alt={ideaAssets.logo.label} />
      </div>
      <div className="atomiq-meet__title-mask">
        <h1 style={{ opacity: title, transform: reducedMotion ? undefined : `translate3d(0, ${(1 - title) * 110}%, 0)` }}>AtomIQ</h1>
      </div>
      <p className="atomiq-meet__tagline" data-testid="atomiq-tagline" style={{ opacity: tagline, transform: reducedMotion ? undefined : `translate3d(0, ${(1 - tagline) * 22}px, 0)` }}>{officialTagline}</p>
      <div className="atomiq-meet__phone" style={{ opacity: ramp(frame, 26, 39), transformOrigin: "55% 80%", transform: reducedMotion ? undefined : `translate3d(${210 * (1 - phone)}px, ${650 * (1 - phone)}px, 0) rotate(${12 * (1 - phone)}deg) scale(${.94 + .06 * phone})` }}>
        <Img data-testid="atomiq-phone" src="/media/atomiq/phone.png" srcSet={optimizedSrcSet("/media/atomiq/phone.png")} alt="AtomIQ app on a phone" />
      </div>
      <div className="atomiq-meet__mascot-entrance" style={{ opacity: ramp(frame, 58, 69), transformOrigin: "60% 90%", transform: reducedMotion ? undefined : `translate3d(${90 * (1 - mascot)}px, ${460 * (1 - mascot)}px, 0) rotate(${-14 * (1 - mascot)}deg)` }}>
        <div className="atomiq-meet__mascot" data-testid="atomiq-mascot">
          <Img src="/media/atomiq/discover.svg" alt="Schrödi, the AtomIQ mascot, with a magnifying glass" />
        </div>
      </div>
    </div>;
}
