import { memo, useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { openingGradient } from "./theme";

export const openingPoster = {
  background: openingGradient,
  description: "Beyond the Atom. Team AtomIQ presents, Polytechnic University of the Philippines. Friday, October 30, 2026. Veranza KCC Mall, General Santos City. Featuring Michelle, Kent, and Ezekiel.",
} as const;

const media = "/media/chapter-01";
const partners = [
  { name: "Meralco", src: `${media}/meralco.png`, x: 132 },
  { name: "PUP", src: `${media}/edu_pup.webp`, x: 268 },
  { name: "Explicit", src: `${media}/optimized/explicit.webp`, x: 382 },
  { name: "AtomIQ", src: `${media}/optimized/atomiq.webp`, x: 496 },
] as const;
const team = [
  { name: "Michelle", src: `${media}/optimized/michelle.webp`, x: 1315, y: 315 },
  { name: "Kent", src: `${media}/optimized/kent.webp`, x: 1155, y: 605 },
  { name: "Ezekiel", src: `${media}/optimized/ezekiel.webp`, x: 1460, y: 605 },
] as const;

type Letter = { text: string; x: number; y: number; size: number; width: number; angle: number };
const beyond: readonly Letter[] = [
  { text: "B", x: 171, y: 526, size: 258, width: 198, angle: -16 },
  { text: "E", x: 325, y: 496, size: 201, width: 129, angle: -6 },
  { text: "Y", x: 453, y: 493, size: 210, width: 173, angle: -15 },
  { text: "O", x: 547, y: 498, size: 224, width: 151, angle: 12 },
  { text: "N", x: 683, y: 494, size: 239, width: 165, angle: -8 },
  { text: "D", x: 793, y: 499, size: 249, width: 162, angle: 9 },
];
const atom: readonly Letter[] = [
  { text: "A", x: 351, y: 684, size: 241, width: 165, angle: -9 },
  { text: "T", x: 488, y: 670, size: 237, width: 156, angle: -5 },
  { text: "O", x: 592, y: 669, size: 232, width: 163, angle: 8 },
  { text: "M", x: 765, y: 683, size: 241, width: 173, angle: 8 },
];

function DimensionalWord({ letters, face, depth }: { letters: readonly Letter[]; face: string; depth: string }) {
  return <g aria-hidden="true" fontFamily="'Event Display', sans-serif" fontWeight="400" strokeLinejoin="round" paintOrder="stroke fill">
    {[{ fill: "#0747a5", stroke: "#0747a5", width: 35, y: 8 }, { fill: depth, stroke: depth, width: 3, y: 7 }, { fill: face, stroke: "#fff9db", width: 2.5, y: 0 }].map((layer, index) => (
      <g key={index} transform={`translate(0 ${layer.y})`} fill={layer.fill} stroke={layer.stroke} strokeWidth={layer.width}>
        {letters.map((letter) => <text key={letter.text} x={letter.x} y={letter.y} fontSize={letter.size} textLength={letter.width} lengthAdjust="spacingAndGlyphs" transform={`rotate(${letter.angle} ${letter.x} ${letter.y})`}>{letter.text}</text>)}
      </g>
    ))}
  </g>;
}

// A native vector repeat inspired by the supplied fingerprint-and-chevron strip.
const PosterMarquee = memo(function PosterMarquee() {
  const id = `repeat-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return <div className="event-poster__marquee" data-testid="opening-marquee" aria-hidden="true">
    <div className="event-poster__marquee-track">
      <svg viewBox="0 0 3200 54" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <g id={`${id}-fingerprint`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10 10Q23 2 36 10M6 17Q23 5 40 17M5 24Q23 10 41 24M8 31Q23 17 38 31M12 37Q23 25 34 37M17 42Q23 35 29 42M22 46H24" />
          </g>
          <g id={`${id}-chevrons`} fill="#fff3c9">
            <path d="M4 8H11Q11 19 19 26Q11 34 11 46H4Q4 34 12 26Q4 19 4 8ZM17 8H24Q24 19 32 26Q24 34 24 46H17Q17 34 25 26Q17 19 17 8Z" />
          </g>
          <pattern id={id} width="160" height="54" patternUnits="userSpaceOnUse">
            <use href={`#${id}-fingerprint`} color="#ffdf44" />
            <use href={`#${id}-chevrons`} x="44" />
            <use href={`#${id}-fingerprint`} x="80" color="#ff49bd" />
            <use href={`#${id}-chevrons`} x="124" />
          </pattern>
        </defs>
        <rect width="3200" height="54" fill={`url(#${id})`} />
      </svg>
    </div>
  </div>;
});

const flares = [
  { x: 1470, y: 540, r: 45 }, { x: 1609, y: 738, r: 55 },
  { x: 650, y: 70, r: 40 }, { x: 1050, y: 185, r: 34 },
  { x: 1130, y: 850, r: 42 }, { x: 210, y: 675, r: 28 },
  { x: 78, y: 550, r: 35 }, { x: 1010, y: 470, r: 26 },
  { x: 1520, y: 880, r: 30 },
] as const;

// Portrait images float on small HTML surfaces, so the title SVG is never repainted.
const PosterSpeakers = memo(function PosterSpeakers() {
  const id = `speakers-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return <div className="event-poster__speakers" data-editable="team-portraits" aria-label="Team AtomIQ: Michelle, Kent, Ezekiel">
    {team.map((person, index) => <div key={person.name} data-presenter={person.name} className="event-poster__speaker" style={{ left: `${(person.x - 140) / 1672 * 100}%`, top: `${(person.y - 134) / 941 * 100}%`, animationDuration: `${6.8 + index * 0.8}s`, animationDelay: `${-1.7 - index * 1.3}s` }}>
      <svg viewBox="0 0 280 280" width="100%" height="100%" role="img" aria-label={person.name}>
        <defs><clipPath id={`${id}-${person.name}`}><circle cx="140" cy="134" r="122" /></clipPath></defs>
        <circle cx="143" cy="140" r="130" fill="#0747a5" />
        <circle cx="140" cy="134" r="127" fill="#fff9e0" />
        <image href={person.src} x="18" y="12" width="244" height="244" preserveAspectRatio="xMidYMin slice" clipPath={`url(#${id}-${person.name})`} />
      </svg>
    </div>)}
  </div>;
});

// Animate HTML surfaces, not groups inside the title SVG: the compositor can
// reuse these painted layers while the editable artwork remains completely still.
const PosterBackground = memo(function PosterBackground() {
  const id = `ambient-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const url = (name: string) => `url(#${id}-${name})`;
  return <div data-testid="opening-background" className="event-poster__background" aria-hidden="true">
    <div className="event-poster__base" style={{ background: openingGradient }} />
    <div className="event-poster__fluid event-poster__fluid--ember" />
    <div className="event-poster__fluid event-poster__fluid--gold" />
    <div className="event-poster__flow" data-testid="opening-ambient">
      <svg viewBox="0 0 1672 941" width="100%" height="100%">
        <defs><linearGradient id={`${id}-ribbon`} x2="0.7" y2="1"><stop stopColor="#ffdf55" /><stop offset="0.6" stopColor="#ffc134" /><stop offset="1" stopColor="#ffae21" /></linearGradient></defs>
        <path d="M-100 305C75 170 196 195 350-50L-100-50Z" fill={url("ribbon")} opacity="0.65" />
        <path d="M1760 144C1500 148 1410 274 1360 451 1513 374 1585 259 1760 268Z" fill={url("ribbon")} opacity="0.78" />
        <ellipse cx="-36" cy="917" rx="237" ry="224" fill={url("ribbon")} />
        <path d="M815 1010C809 886 934 826 1038 827 1072 778 1165 770 1224 851 1267 908 1275 962 1268 1010Z" fill={url("ribbon")} opacity="0.9" />
        <ellipse cx="1660" cy="962" rx="288" ry="213" fill={url("ribbon")} opacity="0.85" />
      </svg>
    </div>

    {flares.map((flare, index) => <div key={index} className={`event-poster__flare${index === 0 ? " event-poster__flare--one" : ""}`} style={{ left: `${(flare.x - flare.r) / 1672 * 100}%`, top: `${(flare.y - flare.r) / 941 * 100}%`, width: `${flare.r * 2 / 1672 * 100}%`, height: `${flare.r * 2 / 941 * 100}%`, animationDuration: `${7.2 + index * 0.65}s`, animationDelay: `${-2.4 - index * 0.9}s` }} />)}
  </div>;
});

export function Slide01Opening({ reducedMotion, ambientMotion = false }: SlideProps) {
  const frame = useCurrentFrame();
  const animate = ambientMotion && !reducedMotion;
  return <AbsoluteFill data-slide-frame={frame} data-chapter="01" data-poster-idle={animate ? "playing" : "still"} className="event-poster" style={{ background: openingPoster.background, overflow: "hidden", isolation: "isolate" }}>
    <PosterBackground />
    <PosterArtwork />
    <PosterSpeakers />
    <PosterMarquee />
  </AbsoluteFill>;
}

const PosterArtwork = memo(function PosterArtwork() {
  const id = `event-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const url = (name: string) => `url(#${id}-${name})`;
  return <svg data-testid="opening-poster" viewBox="0 0 1672 941" width="100%" height="100%" role="img" aria-label={openingPoster.description} className="event-poster__artwork">
      <defs>
        <linearGradient id={`${id}-cream`} x2="0.4" y2="1"><stop stopColor="#fffdef" /><stop offset="1" stopColor="#fbf1d4" /></linearGradient>
        <linearGradient id={`${id}-yellow`} x2="0.3" y2="1"><stop stopColor="#fff047" /><stop offset="1" stopColor="#ffcb24" /></linearGradient>
        {partners.map(partner => <clipPath key={partner.name} id={`${id}-logo-${partner.name}`}><circle cx={partner.x + 44} cy="135" r="44" /></clipPath>)}
      </defs>
      <g data-testid="opening-foreground" fontFamily="'Event Sans', sans-serif" fill="#fff9e9">
        <g data-editable="partner-logos" transform="translate(33 22) scale(.75)" aria-label="Meralco, PUP, Explicit, AtomIQ">
          {partners.map(partner => <g key={partner.name} data-partner={partner.name}>
            <circle cx={partner.x + 44} cy="135" r="45" fill="#fff9e0" />
            <image href={partner.src} x={partner.x} y="91" width="88" height="88" preserveAspectRatio="xMidYMid meet" clipPath={url(`logo-${partner.name}`)} role="img" aria-label={`${partner.name} logo`} />
          </g>)}
          <path data-testid="partner-divider" d="M244 101V170" stroke="#fff8df" strokeWidth="3" />
        </g>
        <g data-editable="intro-copy" transform="translate(33 44) scale(.75)">
        <g data-editable="presenter" transform="rotate(-4 328 253)"><ellipse cx="328" cy="253" rx="182" ry="49" stroke="#fff9e9" strokeWidth="2.5" fill="none" /><path d="M185 224Q300 192 468 220M286 309 431 296" stroke="#fff9e9" strokeWidth="2" fill="none" /><text x="205" y="255" fontSize="36" fontFamily="'Event Hand', cursive" fontWeight="700" letterSpacing="1">TEAM ATOMIQ</text><text x="268" y="283" fontSize="27" fontFamily="'Event Hand', cursive" fontWeight="700" letterSpacing="1">PRESENTS</text></g>
        <path d="M545 201V287" stroke="#fff9e9" strokeWidth="3" />
        <text data-editable="university" x="584" y="234" fontSize="31" fontWeight="600"><tspan x="584">Polytechnic University</tspan><tspan x="584" dy="35">of the Philippines</tspan></text>
        </g>
        <g data-editable="event-title" role="heading" aria-level={1} aria-label="Beyond the Atom">
          <ellipse aria-hidden="true" cx="531" cy="565" rx="454" ry="66" transform="rotate(-10 531 565)" stroke="#ff9f97" strokeWidth="13" fill="none" />
          <DimensionalWord letters={beyond} face={url("cream")} depth="#7cb8f9" />
          <DimensionalWord letters={[{ text: "THE", x: 160, y: 647, size: 96, width: 209, angle: -15 }]} face={url("cream")} depth="#7cb8f9" />
          <DimensionalWord letters={atom} face={url("yellow")} depth="#f8a02c" />
          <g aria-hidden="true"><ellipse cx="682" cy="592" rx="105" ry="26" transform="rotate(-49 682 592)" fill="none" stroke="#fffbea" strokeWidth="6" /><circle cx="694" cy="606" r="20" fill="#ff456b" /><circle cx="690" cy="600" r="11" fill="#ff6d87" opacity="0.7" /></g>
        </g>
        <g data-editable="speaker-names">
          {team.map(person => <text key={person.name} x={person.x} y={person.y + 165} textAnchor="middle" fontSize="29" fontWeight="600">{person.name}</text>)}
        </g>
        <g data-editable="event-details" transform="translate(35 160) scale(.78)">
        <g data-editable="event-date"><circle cx="205" cy="775" r="45" fill="#fff9df" /><text x="205" y="794" textAnchor="middle" fontSize="54" fontWeight="700" fill="#142db0">30</text><text x="271" y="748" fontSize="25" fontWeight="500">2026</text><text x="271" y="788" fontSize="40" fontWeight="700">October</text><text x="271" y="817" fontSize="25" fontWeight="500">Friday</text></g>
        <path d="M466 737V817" stroke="#fff9e9" strokeWidth="3" />
        <g data-editable="event-location"><circle cx="535" cy="777" r="40" fill="#fff9df" /><path d="M535 805C530 796 517 781 517 768A18 18 0 0 1 553 768C553 781 540 796 535 805Z" fill="#173ac5" /><circle cx="535" cy="768" r="7" fill="#fff9df" /><text x="592" y="769" fontSize="29" fontWeight="500"><tspan x="592">Veranza KCC Mall,</tspan><tspan x="592" dy="33">General Santos City</tspan></text></g>
        </g>
      </g>
    </svg>;
});
