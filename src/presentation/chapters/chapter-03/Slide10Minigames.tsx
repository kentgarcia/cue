import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, ramp } from "../chapter-01/motion";
import { chapterTheme, featureDemoFrame } from "./theme";
import { GameChoice, GamePicker, GamifiedProfile, ProductHand, ProductNav, ProfileAwards, ProfileLeaderboard, ProfileStreak } from "./GamifiedUI";
import type { ProfileFocus } from "./GamifiedUI";
import "./minigames.css";

const travelEasing = Easing.bezier(...chapterTheme.easing.travel);
const captions = [
  { start: 14, end: 55, lines: <>Pick your<br />next challenge.</> },
  { start: 55, end: 139, lines: <>Four ways<br />to explore.</> },
  { start: 139, end: 175, lines: <>Your progress.<br />All in one place.</> },
  { start: 175, end: 229, lines: <>Keep your<br />streak.</> },
  { start: 229, end: 283, lines: <>Milestones<br />worth earning.</> },
  { start: 283, end: 400, lines: <>See where<br />you stand.</> },
];

function extractionStyle(frame: number, start: number, end: number, top: number, sourceTop: number, reducedMotion: boolean): CSSProperties {
  const progress = interpolate(frame, [start, start + 38], [0, 1], { easing: travelEasing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { top, opacity: ramp(frame, start, start + 12) * (1 - ramp(frame, end, end + 12)), transformOrigin: "0 0", transform: reducedMotion ? "scale(1.1)" : `translate3d(${1148 * (1 - progress)}px, ${(sourceTop - top) * (1 - progress)}px, 0) scale(${.47146 + (1.1 - .47146) * progress})` };
}

/** A cue-driven product film: picker → game choices → profile → three enlarged progress panels. */
export function Slide10Minigames({ reducedMotion }: SlideProps) {
  const timelineFrame = useCurrentFrame();
  const frame = featureDemoFrame(timelineFrame, 54);
  const entry = ramp(frame, 0, 43);
  const spread = ramp(frame, 55, 88);
  const leaveGames = ramp(frame, 134, 157);
  const profile = ramp(frame, 139, 171);
  const hand = ramp(frame, 112, 126);
  const press = ramp(frame, 126, 130) * (1 - ramp(frame, 130, 137));
  const focus: ProfileFocus = frame >= 283 ? "leaderboard" : frame >= 229 ? "awards" : frame >= 175 ? "streak" : "overview";
  const compactHeading = reducedMotion && frame >= 55;
  const stage = frame >= 283 ? "leaderboard" : frame >= 229 ? "awards" : frame >= 175 ? "streak" : frame >= 139 ? "profile" : frame >= 112 ? "opening-profile" : frame >= 55 ? "games" : "picker";
  return <ChapterCanvas chapter="03" frame={timelineFrame} background={chapterTheme.colors.light}>
    <div className="minigames-demo" data-testid="minigames-demo" data-games-stage={stage}>
      <div className="minigames-demo__landscape" aria-hidden="true"><i /><i /></div>
      <h1 className="minigames-demo__heading" style={{ opacity: ramp(frame, 0, 20), top: compactHeading ? 85 : undefined, fontSize: compactHeading ? 86 : undefined, transformOrigin: "0 0", transform: reducedMotion ? undefined : `translate3d(0, ${-140 * spread}px, 0) scale(${1 - .42 * spread})` }}>Minigames.</h1>
      {captions.map(({ start, end, lines }) => <div key={start} className="minigames-demo__copy" aria-hidden={frame <= start || frame >= end + 12} style={{ top: start >= 175 ? 300 : undefined, opacity: ramp(frame, start, start + 24) * (1 - ramp(frame, end, end + 12)), transform: reducedMotion ? undefined : `translate3d(0, ${24 * (1 - ramp(frame, start, start + 24))}px, 0)` }}>{lines}</div>)}
      <div className="minigames-demo__device" data-testid="minigames-picker-device" aria-hidden={frame >= 88} style={{ opacity: entry * (1 - spread), transform: reducedMotion ? undefined : `translate3d(${240 * spread}px, ${130 * (1 - entry)}px, 0) rotate(${-6 * (1 - entry) + 5 * spread}deg) scale(${.95 + .05 * entry})` }}><div className="minigames-demo__screen"><GamePicker /></div></div>
      <div className="minigames-demo__choices" aria-hidden={frame < 55 || frame >= 157} style={{ opacity: 1 - leaveGames }}>
        {[0, 1, 2, 3].map(index => {
          const p = ramp(frame, 60 + index * 3, 94 + index * 3);
          return <div className={`minigames-demo__choice minigames-demo__choice--${index}`} key={index} style={{ opacity: p, transform: reducedMotion ? undefined : `translate3d(0, ${170 * (1 - p)}px, 0) rotate(${(index % 2 === 0 ? -3 : 3) + 8 * (1 - p)}deg) scale(${.95 + .05 * p})` }}><GameChoice index={index} expanded /></div>;
        })}
      </div>
      <div className="minigames-demo__dock" aria-hidden={frame < 78 || frame >= 157} style={{ opacity: ramp(frame, 78, 104) * (1 - leaveGames), transform: `scale(.9)${reducedMotion ? "" : ` translate3d(0, ${40 * (1 - ramp(frame, 78, 104))}px, 0)`}` }}>
        <ProductNav active={frame >= 130 ? "profile" : "games"} />
        <div className="minigames-demo__tap" data-testid="profile-nav-tap" data-clicked={frame >= 130 && frame < 157} style={{ opacity: press, transform: reducedMotion ? undefined : `scale(${1 + .2 * press})` }} />
        <div className="minigames-demo__hand" data-testid="profile-hand-cursor" style={{ opacity: ramp(frame, 112, 118) * (1 - ramp(frame, 134, 146)), transform: reducedMotion ? undefined : `translate3d(${90 * (1 - hand)}px, ${54 * (1 - hand)}px, 0) rotate(${-10 * (1 - hand)}deg) scale(${1 - .1 * press})` }}><ProductHand /></div>
      </div>
      <div className="minigames-demo__device" data-testid="minigames-profile-device" aria-hidden={frame < 139} style={{ opacity: profile, transform: reducedMotion ? undefined : `translate3d(0, ${100 * (1 - profile)}px, 0) rotate(${4 * (1 - profile)}deg) scale(${.97 + .03 * profile})` }}><div className="minigames-demo__screen"><GamifiedProfile focus={focus} /></div></div>
      <div className="minigames-demo__extraction" data-testid="streak-feature" aria-hidden={frame <= 175 || frame >= 241} style={extractionStyle(frame, 175, 229, 600, 437, reducedMotion)}><ProfileStreak /></div>
      <div className="minigames-demo__extraction" data-testid="awards-feature" aria-hidden={frame <= 229 || frame >= 295} style={extractionStyle(frame, 229, 283, 555, 560, reducedMotion)}><ProfileAwards /></div>
      <div className="minigames-demo__extraction" data-testid="leaderboard-feature" aria-hidden={frame <= 283} style={extractionStyle(frame, 283, 400, 555, 744, reducedMotion)}><ProfileLeaderboard compact /></div>
    </div>
  </ChapterCanvas>;
}
