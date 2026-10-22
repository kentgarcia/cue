import { memo } from "react";
import { Img } from "remotion";
import { Award, BookOpen, Box, Check, Info, MoveLeft, Signal, Sparkles, Telescope, Volume2, Wifi, X, Zap } from "lucide-react";

export type LessonGlyph = "start" | "book" | "box";
export function LessonTile({ kind = "start", active = false }: { kind?: LessonGlyph; active?: boolean }) {
  const Icon = kind === "book" ? BookOpen : kind === "box" ? Box : Sparkles;
  return <div className={`lesson-tile${active ? " lesson-tile--active" : ""}`}><Icon size={66} fill="currentColor" strokeWidth={1.7} /></div>;
}

const nav = ["map", "community", "ai", "games", "profile"];
export const LessonMap = memo(function LessonMap() {
  return <div className="lesson-map" data-testid="lesson-map-ui" aria-label="Recreated AtomIQ lesson map">
    <div className="lesson-status"><b>3:24</b><div><Signal size={38} fill="currentColor" /><Wifi size={38} /><strong>93</strong></div></div>
    <div className="lesson-map__header">
      <div className="lesson-map__greeting"><Img src="/media/atomiq/profile.png" alt="Kent's profile" /><div><small>GOOD AFTERNOON</small><b>kent</b></div></div>
      <div className="lesson-map__energy"><Zap fill="currentColor" size={39} /><b>0</b></div>
      <div className="lesson-map__shortcut"><Award fill="#ff9600" color="#ff9600" size={42} /><i>1</i></div>
      <div className="lesson-map__shortcut"><BookOpen fill="#26c86d" color="#26c86d" size={42} /></div>
      <div className="lesson-map__course"><div><small>UNDERSTANDING THE ATOM AND ITS ENERGY</small><strong>Introduction to Nuclear Science</strong></div><Info size={46} color="#6871f7" /></div>
    </div>
    <div className="lesson-map__divider"><i /><b>INTRODUCTION TO NUCLEAR SCIENCE</b><i /></div>
    <svg className="lesson-map__path" viewBox="0 0 946 2048" aria-hidden="true"><path d="M474 789 C490 902 588 953 612 1086 S687 1290 667 1371 S590 1560 607 1654 S535 1860 474 1940" fill="none" stroke="#d6d3ce" strokeWidth="12" strokeLinecap="round" strokeDasharray="16 28" /></svg>
    <div className="lesson-map__node lesson-map__node--start"><div className="lesson-map__start">START</div><LessonTile active /></div>
    <div className="lesson-map__node lesson-map__node--book"><LessonTile kind="book" /></div>
    <div className="lesson-map__node lesson-map__node--box"><LessonTile kind="box" /></div>
    <div className="lesson-map__node lesson-map__node--star"><LessonTile /></div>
    <div className="lesson-map__node lesson-map__node--last"><LessonTile kind="book" /></div>
    <div className="lesson-map__bottom-fade" />
    <div className="lesson-map__nav">{nav.map((name, index) => <div key={name}><Img src={`/media/atomiq/navbar/${name}.png`} alt={`${name} navigation icon`} />{index === 0 ? <i /> : null}</div>)}</div>
  </div>;
});

export const LessonQuestion = memo(function LessonQuestion() {
  return <div className="lesson-question" data-testid="lesson-question">
    <div className="lesson-question__lab"><Telescope size={38} fill="currentColor" /> LAB</div>
    <Volume2 className="lesson-question__audio" size={44} fill="currentColor" />
    <Img src="/media/atomiq/experiment.png" alt="Schrödi conducting an experiment" />
    <div className="lesson-question__text">Who discovered the nucleus of the atom?</div>
  </div>;
});

export const lessonAnswers = ["Democritus (400 BCE)", "Dalton (1803)", "Thomson (1897)", "Rutherford (1911)"];
function AnswerSymbol({ index }: { index: number }) {
  if (index === 2) return <Zap size={62} fill="currentColor" strokeWidth={1.5} />;
  return <svg width="62" height="62" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    {index === 0 ? <><circle cx="17" cy="12" r="8" /><circle cx="47" cy="12" r="8" /><ellipse cx="14" cy="33" rx="9" ry="7" /><ellipse cx="50" cy="33" rx="9" ry="7" /><circle cx="32" cy="33" r="10" /><ellipse cx="32" cy="52" rx="12" ry="7" /></> : index === 1 ? <><rect x="4" y="4" width="24" height="24" rx="8" /><rect x="36" y="4" width="24" height="24" rx="8" /><rect x="4" y="36" width="24" height="24" rx="8" /><rect x="36" y="36" width="24" height="24" rx="8" /></> : <><rect x="12" y="7" width="40" height="50" rx="12" transform="rotate(17 32 32)" /><circle cx="32" cy="32" r="10" fill="white" /></>}
  </svg>;
}
export const LessonAnswer = memo(function LessonAnswer({ index, selected }: { index: number; selected: boolean }) {
  return <div className={`lesson-answer${selected ? " lesson-answer--selected" : ""}`} data-testid={`lesson-answer-${index}`} data-selected={selected}>
    <div className="lesson-answer__symbol"><AnswerSymbol index={index} /></div>
    <div>{lessonAnswers[index]}</div>
    <div className="lesson-answer__check" style={{ opacity: selected ? 1 : 0 }}><Check size={25} strokeWidth={4} /></div>
  </div>;
});

export const LessonQuizChrome = memo(function LessonQuizChrome() {
  return <><div className="lesson-quiz__close" aria-hidden="true"><X size={26} strokeWidth={3} /></div><div className="lesson-quiz__back" aria-hidden="true"><MoveLeft size={34} strokeWidth={3} /></div></>;
});
