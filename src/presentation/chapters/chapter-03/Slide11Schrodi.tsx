import { memo } from "react";
import type { CSSProperties } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { Img, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, ramp } from "../chapter-01/motion";
import { chapterTheme, featureDemoFrame } from "./theme";
import "./schrodi.css";

export const schrodiConversation = [
  { role: "user", text: "What is an atom?", start: 72, top: 0, width: 390 },
  { role: "assistant", text: "An atom is a tiny building block of matter. It has a nucleus at its center, with electrons around it.", start: 127, wordsStart: 137, step: 3.2, top: 112, width: 800 },
  { role: "user", text: "So what is the nucleus?", start: 286, top: 324, width: 530 },
  { role: "assistant", text: "It's the small, dense center of an atom. It contains protons and, in most atoms, neutrons.", start: 343, wordsStart: 353, step: 3.4, top: 436, width: 800 },
] as const;

// Align the glasses, rather than the PNG edges: portrait and landscape poses share one face anchor.
const faceAnchor = { x: 343, y: 223, width: 260 };
const poseBlendFrames = 18;
const poses = [
  { name: "happy_2", label: "Schrödi waving hello", width: 804, height: 887, faceX: 390.5, faceY: 303.5, faceWidth: 361, segments: [[0, 82]] },
  { name: "thinking", label: "Schrödi thinking about your question", width: 804, height: 887, faceX: 363, faceY: 278.5, faceWidth: 356, segments: [[82, 128], [294, 344]] },
  { name: "explain", label: "Schrödi explaining an atom", width: 714, height: 594, faceX: 287, faceY: 221, faceWidth: 250, segments: [[128, 294]] },
  { name: "idea", label: "Schrödi with an idea", width: 804, height: 887, faceX: 373.5, faceY: 283, faceWidth: 349, segments: [[344, 600]] },
] as const;

function AccumulatingWords({ text, frame, start, step = 3, reducedMotion }: { text: string; frame: number; start: number; step?: number; reducedMotion: boolean }) {
  return <>{text.split(" ").map((word, index) => {
    const visible = frame >= start + index * step;
    return <b key={index} data-chat-word={index} data-visible={visible} aria-hidden={!visible} style={{ fontWeight: "inherit", display: "inline-block", visibility: visible ? "visible" : "hidden", opacity: reducedMotion ? Number(visible) : ramp(frame, start + index * step, start + index * step + 3) }}>{word}{"\u00a0"}</b>;
  })}</>;
}

const ChatHeader = memo(function ChatHeader() {
  return <div className="schrodi-chat__header"><div className="schrodi-chat__avatar"><Img src="/media/atomiq/navbar/ai.png" alt="Schrödi avatar" /></div><div><div className="schrodi-chat__name">Schrödi</div><div className="schrodi-chat__subtitle">Science Assistant</div></div><div className="schrodi-chat__sparkle" aria-hidden="true"><Sparkles size={30} /></div></div>;
});
const ChatBackdrop = memo(function ChatBackdrop() {
  return <div className="schrodi-demo__backdrop" aria-hidden="true"><i /><i /></div>;
});

export function Slide11Schrodi({ reducedMotion, ambientMotion = false }: SlideProps) {
  const timelineFrame = useCurrentFrame();
  const frame = featureDemoFrame(timelineFrame, 48);
  const entry = ramp(frame, 0, 38);
  const thinking = (frame >= 84 && frame < 127) || (frame >= 296 && frame < 343);
  const pose = frame >= 344 ? "idea" : frame >= 294 ? "thinking" : frame >= 128 ? "explain" : frame >= 82 ? "thinking" : "happy_2";
  const stage = frame >= 343 ? "nucleus-answer" : frame >= 286 ? "nucleus-question" : frame >= 127 ? "atom-answer" : frame >= 72 ? "atom-question" : "introduction";
  const composing = frame >= 50 && frame < 72 ? 0 : frame >= 264 && frame < 286 ? 2 : null;
  const sendPress = ramp(frame, 68, 72) * (1 - ramp(frame, 72, 78)) + ramp(frame, 282, 286) * (1 - ramp(frame, 286, 292));
  const live = ambientMotion && !reducedMotion;
  return <ChapterCanvas chapter="03" frame={timelineFrame} background={chapterTheme.colors.light}>
    <div className="schrodi-demo" data-testid="schrodi-demo" data-chat-stage={stage} data-schrodi-idle={live ? "playing" : "still"}>
      <ChatBackdrop />
      <h1 style={{ opacity: ramp(frame, 0, 24), transform: reducedMotion ? undefined : `translate3d(0, ${24 * (1 - entry)}px, 0)` }}>Meet Schrödi.</h1>
      <div className="schrodi-demo__description" style={{ opacity: ramp(frame, 12, 38) }}>Science Assistant</div>
      <div className="schrodi-demo__shadow" aria-hidden="true" style={{ opacity: entry }} />
      <div className="schrodi-demo__hero" data-testid="schrodi-mascot" data-pose={pose} style={{ opacity: entry, transform: reducedMotion ? undefined : `translate3d(0, ${80 * (1 - entry)}px, 0) rotate(${-4 * (1 - entry)}deg) scale(${.96 + .04 * entry})` }}>
        <div className="schrodi-demo__idle">{poses.map(({ name, label, segments, width, height, faceX, faceY, faceWidth }) => {
          const opacity = segments.reduce((sum, [start, end]) => sum + ramp(frame, start, start + (start === 0 ? 20 : poseBlendFrames)) * (1 - ramp(frame, end, end + poseBlendFrames)), 0);
          const scale = faceAnchor.width / faceWidth;
          return <div className="schrodi-demo__pose" key={name} data-pose-art={name} aria-hidden={name !== pose} style={{ opacity }}><Img src={`/media/atomiq/mascot/${name}.png`} alt={label} style={{ left: faceAnchor.x - faceX * scale, top: faceAnchor.y - faceY * scale, width: width * scale, height: height * scale }} /></div>;
        })}</div>
      </div>
      <div className="schrodi-chat" role="group" aria-label="Demonstration conversation with Schrödi" style={{ opacity: ramp(frame, 6, 38), transform: reducedMotion ? undefined : `translate3d(${90 * (1 - entry)}px, 0, 0) scale(${.98 + .02 * entry})` }}>
        <ChatHeader />
        <div className="schrodi-chat__welcome" aria-hidden={frame >= 61} style={{ opacity: 1 - ramp(frame, 49, 61) }}><Img src="/media/atomiq/navbar/ai.png" alt="" /><div>What would you like<br />to discover?</div></div>
        <div className="schrodi-chat__messages" data-testid="schrodi-messages">
          {schrodiConversation.map((message, index) => {
            if (frame < message.start) return null;
            const progress = ramp(frame, message.start, message.start + 16);
            const style: CSSProperties = { top: message.top, width: message.width, opacity: progress, transformOrigin: message.role === "user" ? "100% 100%" : "0 100%", transform: reducedMotion ? undefined : `translate3d(0, ${18 * (1 - progress)}px, 0) scale(${.98 + .02 * progress})` };
            return <div key={index} className={`schrodi-chat__message schrodi-chat__message--${message.role}`} data-testid={`schrodi-message-${index}`} data-chat-role={message.role} aria-label={message.role === "user" ? "Your question" : "Schrödi's reply"} style={style}>{"wordsStart" in message ? <AccumulatingWords text={message.text} frame={frame} start={message.wordsStart} step={message.step} reducedMotion={reducedMotion} /> : message.text}</div>;
          })}
          {thinking ? <div className="schrodi-chat__typing" data-testid="schrodi-typing" role="status" aria-label="Schrödi is thinking" style={{ top: frame >= 296 ? 436 : 112 }}>{[0, 1, 2].map(index => <i key={index} style={{ animationDelay: `${index * .16}s` }} />)}</div> : null}
        </div>
        <div className="schrodi-chat__composer" data-testid="schrodi-composer" aria-label="Simulated message composer"><div>{composing !== null ? <AccumulatingWords text={schrodiConversation[composing].text} frame={frame} start={composing === 0 ? 50 : 264} step={composing === 0 ? 4 : 3} reducedMotion={reducedMotion} /> : <div className="schrodi-chat__placeholder">Ask Schrödi about science...</div>}</div><div className="schrodi-chat__send" aria-hidden="true" style={{ transform: reducedMotion ? undefined : `scale(${1 - .1 * sendPress})` }}><ArrowUp size={29} strokeWidth={2.6} /></div></div>
      </div>
    </div>
  </ChapterCanvas>;
}
