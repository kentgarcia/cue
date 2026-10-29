import { Img, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { entranceStyle } from "../chapter-01/motion";

export const promotionalWebsite = "https://atomiq-pi.vercel.app/";
export const facebookPage = "https://www.facebook.com/share/1bd1LduxTg/?mibextid=wwXIfr";

const destinations = [
  { title: "Facebook", caption: "Follow us on Facebook", href: facebookPage, src: "/media/atomiq/facebook-qr.svg", testId: "facebook-qr", accent: "#1877f2" },
  { title: "Website", caption: "atomiq-pi.vercel.app", href: promotionalWebsite, src: "/media/atomiq/promo-qr.svg", testId: "promotional-qr", accent: "#ed7c25" },
] as const;

/** Two equal scan targets; both stay fixed after their brief entrance. */
export function PromoQRCode({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return <div className="promo-finale" data-testid="closing-qr">
    {destinations.map((destination, index) => <section className="promo-finale__card" key={destination.title} style={{ left: index === 0 ? 104 : 1016, borderTopColor: destination.accent, ...entranceStyle({ frame, fps: 30, start: index * 4, duration: 24, distance: 24, reducedMotion }) }}>
      <h1 className="promo-finale__card-label" style={{ color: destination.accent }}>{destination.title}</h1>
      <a className="promo-finale__qr-link" href={destination.href} target="_blank" rel="noreferrer" aria-label={`Visit AtomIQ ${destination.title === "Facebook" ? "on Facebook" : "on the web"}`}>
        <Img data-testid={destination.testId} src={destination.src} alt={`QR code for AtomIQ ${destination.title}: ${destination.href}`} width={736} height={736} />
      </a>
      <a className="promo-finale__card-caption" href={destination.href} target="_blank" rel="noreferrer">{destination.caption} <span aria-hidden="true">↗</span></a>
    </section>)}
  </div>;
}
