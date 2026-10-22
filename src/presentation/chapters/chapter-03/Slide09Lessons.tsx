import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, ramp } from "../chapter-01/motion";
import { chapterTheme } from "./theme";
import "./lessons.css";
import { LessonAnswer, LessonMap, LessonQuestion, LessonQuizChrome } from "./LessonsUI";

const mapTravelEasing = Easing.bezier(...chapterTheme.easing.travel);

/** All demonstration state derives from the cue frame, so rewind and restart are exact. */
export function Slide09Lessons({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [55, 86], [0, 1], { easing: mapTravelEasing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursor = ramp(frame, 94, 108);
  const cursorOpacity = ramp(frame, 94, 100) * (1 - ramp(frame, 116, 128));
  const entry = ramp(frame, 0, 43);
  const dive = ramp(frame, 115, 136);
  const quiz = ramp(frame, 125, 150);
  const selected = frame >= 186;
  const checked = frame >= 234;
  const checkPress = ramp(frame, 218, 226) * (1 - ramp(frame, 226, 234));
  const choosePress = ramp(frame, 108, 112) * (1 - ramp(frame, 112, 118));
  return <ChapterCanvas chapter="03" frame={frame} background={chapterTheme.colors.light}>
    <div className="atomiq-lessons" data-testid="lessons-demo" data-lesson-stage={checked ? "checked" : selected ? "selected" : frame >= 125 ? "quiz" : frame >= 94 ? "opening-lesson" : frame >= 55 ? "map-zoom" : "map"}>
      <div className="atomiq-lessons__landscape" aria-hidden="true" style={{ opacity: entry * (1 - dive) }}><i /><i /></div>
      <h1 className="atomiq-lessons__heading" style={{ opacity: ramp(frame, 0, 18), top: reducedMotion && frame >= 55 ? 85 : undefined, fontSize: reducedMotion && frame >= 55 ? 96.28 : undefined, transformOrigin: "0 0", transform: reducedMotion ? undefined : `translate3d(0, ${-140 * Math.max(zoom, dive)}px, 0) scale(${1 - .42 * Math.max(zoom, dive)})` }}>Lessons.</h1>
      <div className="atomiq-lessons__copy" style={{ opacity: ramp(frame, 12, 40) * (1 - Math.max(zoom, dive)), transform: reducedMotion ? undefined : `translate3d(${-60 * dive}px, ${35 * (1 - entry)}px, 0)` }} aria-hidden={frame >= 136}>
        <div>Follow your<br />curiosity.</div>
        <div className="atomiq-lessons__course-label">Introduction to Nuclear Science</div>
      </div>
      <div className="atomiq-lessons__device" data-testid="lesson-map-device" aria-hidden={frame >= 136} style={{ opacity: entry * (1 - dive), transformOrigin: "50% 39%", transform: reducedMotion ? undefined : `translate3d(${-430 * zoom + 300 * dive}px, ${170 * (1 - entry) + 125 * zoom}px, 0) rotate(${-7 * (1 - entry)}deg) scale(${.95 + .05 * entry + 1.1 * zoom + .5 * dive})` }}>
        <div className="atomiq-lessons__screen"><LessonMap /></div>
        <div className="atomiq-lessons__node-press" aria-hidden="true" data-testid="lesson-node-tap" data-clicked={frame >= 112 && frame < 136} style={{ opacity: zoom * (1 - dive) * .65 + choosePress * .35, transform: reducedMotion ? undefined : `scale(${1 + choosePress * .3})` }} />
        <div className="atomiq-lessons__hand" data-testid="lesson-hand-cursor" aria-hidden={frame < 94 || frame >= 128} style={{ opacity: cursorOpacity, transform: reducedMotion ? undefined : `translate3d(${110 * (1 - cursor)}px, ${85 * (1 - cursor)}px, 0) rotate(${-14 * (1 - cursor)}deg) scale(${1 - .12 * choosePress})` }}>
          <svg viewBox="0 0 80 96" fill="white" stroke="#252b26" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M29 54V12a8 8 0 0 1 16 0v27a7 7 0 0 1 14 0v5a7 7 0 0 1 14 0v24c0 13-10 16-12 25H29c-1-9-4-13-11-20L7 60a8 8 0 0 1 12-11l10 10Z" /><path d="M45 39v17m14-12v14" fill="none" /></svg>
        </div>
      </div>
      <div className="lesson-quiz" aria-hidden={frame < 125} style={{ opacity: quiz }}>
        <LessonQuizChrome />
        <div className="lesson-quiz__progress"><div style={{ transform: `scaleX(${.57 + .43 * ramp(frame, 234, 250)})` }} /></div>
        <div className="lesson-quiz__question-wrap" style={{ opacity: ramp(frame, 125, 147), transform: reducedMotion ? undefined : `translate3d(0, ${42 * (1 - ramp(frame, 125, 154))}px, 0)` }}><LessonQuestion /></div>
        {Array.from({ length: 4 }, (_, index) => {
          const progress = ramp(frame, 134 + index * 3, 156 + index * 3);
          const answerPress = index === 3 ? ramp(frame, 177, 186) * (1 - ramp(frame, 186, 197)) : 0;
          return <div key={index} className={`lesson-quiz__answer-wrap lesson-quiz__answer-wrap--${index}`} style={{ opacity: progress, transform: reducedMotion ? undefined : `translate3d(0, ${54 * (1 - progress)}px, 0) scale(${1 - .035 * answerPress})` }}><LessonAnswer index={index} selected={index === 3 && selected} /></div>;
        })}
        <div className="lesson-quiz__check-wrap" style={{ opacity: ramp(frame, 147, 168), transform: reducedMotion ? undefined : `translate3d(0, ${8 * checkPress}px, 0)` }}>
          <div className={`lesson-quiz__check${checked ? " lesson-quiz__check--correct" : ""}`} data-testid="lesson-check" data-checked={checked}>{checked ? "CORRECT!" : "CHECK"}</div>
        </div>
        <div className="lesson-quiz__confirmation" data-testid="lesson-feedback" style={{ opacity: ramp(frame, 234, 250), transform: reducedMotion ? undefined : `translate3d(0, ${16 * (1 - ramp(frame, 234, 252))}px, 0)` }}>Rutherford · 1911</div>
      </div>
    </div>
  </ChapterCanvas>;
}
