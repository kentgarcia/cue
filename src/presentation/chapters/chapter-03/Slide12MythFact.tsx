import { memo } from "react";
import { ArrowLeft, ArrowRight, Banana, Check, Gavel, Volume2 } from "lucide-react";
import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, ramp } from "../chapter-01/motion";
import { chapterTheme, chapterThreeTiming } from "./theme";
import "./lessons.css";
import "./myth-fact.css";

const StatementCard = memo(function StatementCard() {
  return <div className="lesson-question myth-fact__card">
    <div className="lesson-question__lab"><Gavel size={32} fill="currentColor" /> MYTH BUSTER</div>
    <div className="lesson-question__audio" aria-hidden="true"><Volume2 size={38} fill="currentColor" /></div>
    <div className="myth-fact__banana" aria-hidden="true"><Banana size={148} strokeWidth={1.6} fill="#ffe16a" /></div>
    <div className="myth-fact__statement">Bananas are<br />radioactive.</div>
  </div>;
});

export function Slide12MythFact({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  const { answerStart, correctStart, explanationStart } = chapterThreeTiming.quiz;
  const entry = ramp(frame, 0, 24);
  const windup = ramp(frame, answerStart, answerStart + 7) * (1 - ramp(frame, answerStart + 7, answerStart + 13));
  const swipe = interpolate(frame, [answerStart + 7, answerStart + 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...chapterTheme.easing.travel),
  });
  const correct = ramp(frame, correctStart, correctStart + 22);
  const explanation = ramp(frame, explanationStart, explanationStart + 24);
  const voting = 1 - ramp(frame, correctStart, correctStart + 16);
  const cardOpacity = entry * (1 - ramp(frame, answerStart + 28, answerStart + 39));
  const answered = frame >= correctStart;

  return <ChapterCanvas chapter="03" frame={frame} background={chapterTheme.colors.light}>
    <div className="myth-fact" data-testid="myth-fact" data-game-stage={frame >= explanationStart ? "explanation" : answered ? "correct" : frame > answerStart ? "swiping" : "vote"}>
      <div className="myth-fact__green" data-testid="quiz-correct-background" aria-hidden="true" style={{ opacity: correct }} />
      <div className="myth-fact__vote" aria-hidden={voting === 0} style={{ opacity: voting }}>
        <h1 style={{ opacity: entry, transform: reducedMotion ? undefined : `translate3d(0, ${20 * (1 - entry)}px, 0)` }}>MYTH OR FACT?</h1>
        <div className="myth-fact__choice myth-fact__choice--myth" style={{ opacity: entry }}><ArrowLeft size={62} strokeWidth={2.5} /><div>MYTH</div><small>Swipe left</small></div>
        <div className="myth-fact__choice myth-fact__choice--fact" style={{ opacity: entry }}><ArrowRight size={62} strokeWidth={2.5} /><div>FACT</div><small>Swipe right</small></div>
        <div className="myth-fact__instruction" style={{ opacity: entry }}>Which way would you swipe?</div>
      </div>
      <div className="myth-fact__card-wrap" data-testid="quiz-statement-card" aria-hidden={cardOpacity === 0} style={{ opacity: cardOpacity, transform: reducedMotion ? undefined : `translate3d(${1390 * swipe - 30 * windup}px, ${24 * (1 - entry) - 55 * swipe}px, 0) rotate(${18 * swipe - 3 * windup}deg) scale(${.97 + .03 * entry})` }}>
        <StatementCard />
        {frame > answerStart ? <div className="myth-fact__stamp" aria-hidden="true" style={{ opacity: ramp(frame, answerStart + 10, answerStart + 22) }}>FACT <Check size={36} strokeWidth={3} /></div> : null}
      </div>
      {answered ? <div className="myth-fact__result" data-testid="quiz-answer" style={{ opacity: correct }}>
        <div className="myth-fact__correct-label"><Check size={32} strokeWidth={3} /> Correct swipe!</div>
        <h2>FACT.</h2>
        <div className="myth-fact__result-statement">Bananas are radioactive.</div>
        {frame >= explanationStart ? <div className="myth-fact__explanation" data-testid="quiz-explanation" style={{ opacity: explanation }}>
          <div className="myth-fact__schrodi" style={{ transform: reducedMotion ? undefined : `translate3d(${-35 * (1 - explanation)}px, ${24 * (1 - explanation)}px, 0) scale(${.97 + .03 * explanation})` }}><Img src="/media/atomiq/mascot/radiation.png" alt="Schrödi explaining natural radioactivity with a radiation meter" /></div>
          <div className="myth-fact__bubble" style={{ transform: reducedMotion ? undefined : `translate3d(0, ${24 * (1 - explanation)}px, 0)` }}>
            <div className="myth-fact__speaker">Schrödi <small>Science Assistant</small></div>
            <div className="myth-fact__reply">You chose <b>FACT</b>. That’s right!</div>
            <div className="myth-fact__reason">Bananas contain potassium, including a tiny amount of naturally radioactive <b>potassium-40</b>.</div>
          </div>
          <div className="myth-fact__source">Source: U.S. EPA · Natural Radioactivity in Food</div>
        </div> : null}
      </div> : null}
    </div>
  </ChapterCanvas>;
}
