import { Img, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { entranceStyle, ramp } from "../chapter-01/motion";

export const promotionalWebsite = "https://atomiq-pi.vercel.app/";

/** Motion surrounds the scan target; the code settles once and then stays fixed. */
export function PromoQRCode({ reducedMotion, ambientMotion = false }: SlideProps) {
  const frame = useCurrentFrame();
  const entrance = (start: number, distance = 24) => entranceStyle({ frame, fps: 30, start, duration: 24, distance, reducedMotion });
  const idle = ambientMotion && !reducedMotion && frame >= 72;
  return <div className="promo-finale" data-testid="closing-qr" data-promo-idle={idle ? "playing" : "still"}>
    <div className="promo-finale__art" aria-hidden="true" style={{ opacity: ramp(frame, 0, 32) }}>
      <div className="promo-finale__sun" />
      <div className="promo-finale__orbit promo-finale__orbit--one" />
      <div className="promo-finale__orbit promo-finale__orbit--two" />
      <div className="promo-finale__spark promo-finale__spark--one">✦</div>
      <div className="promo-finale__spark promo-finale__spark--two">✦</div>
      <div className="promo-finale__spark promo-finale__spark--three">✦</div>
    </div>
    <div className="promo-finale__eyebrow" style={entrance(0, 16)}><span className="promo-finale__dot" /> ATOMIQ · YOUR NEXT CHAPTER</div>
    <div className="promo-finale__headline" style={entrance(4, 32)}>
      <h1 aria-label="Curiosity starts here.">Curiosity<br /><span>starts here.</span></h1>
    </div>
    <p className="promo-finale__copy" style={entrance(12)}>Explore the app.<br />Keep asking questions.</p>
    <a className="promo-finale__url" href={promotionalWebsite} target="_blank" rel="noreferrer" style={entrance(20, 18)}>atomiq-pi.vercel.app <span aria-hidden="true">↗</span></a>
    <div className="promo-finale__mascot-entrance" style={entrance(26, 36)}>
      <div className="promo-finale__mascot"><Img src="/media/atomiq/discover.svg" alt="Schrödi invites you to keep discovering" /></div>
    </div>
    <div className="promo-finale__card" style={entrance(10, 32)}>
      <div className="promo-finale__card-label">SCAN TO DISCOVER <span aria-hidden="true">↗</span></div>
      <a className="promo-finale__qr-link" href={promotionalWebsite} target="_blank" rel="noreferrer" aria-label="Visit the AtomIQ promotional website">
        <Img data-testid="promotional-qr" src="/media/atomiq/promo-qr.svg" alt={`QR code for the AtomIQ promotional website: ${promotionalWebsite}`} width={784} height={784} />
      </a>
      <p className="promo-finale__card-caption">Point your camera here. Your next step is one scan away.</p>
    </div>
    <p className="promo-finale__thanks" style={entrance(34, 12)}>Thank you for being curious.</p>
  </div>;
}
