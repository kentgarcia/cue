import { Img } from "remotion";
import { chapterTheme } from "./theme";

export const promotionalWebsite = "https://atomiq-pi.vercel.app/";

/** Keep the QR still and unobstructed so cameras can lock onto it from the audience. */
export function PromoQRCode() {
  return <div style={{ position: "absolute", inset: 0, color: chapterTheme.colors.ink }}>
    <div style={{ position: "absolute", left: 128, top: 205, width: 760 }}>
      <p style={{ margin: "0 0 34px", fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>SCAN &amp; DISCOVER</p>
      <h1 style={{ margin: 0, fontSize: 124, lineHeight: 1.05, fontWeight: 800, letterSpacing: -7 }}>Explore<br />AtomIQ.</h1>
      <p style={{ margin: "42px 0 0", fontSize: 42, lineHeight: 1.4 }}>Scan to visit our<br />promotional website.</p>
      <a href={promotionalWebsite} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 44, fontSize: 34, fontWeight: 600, color: "inherit", textUnderlineOffset: 8 }}>atomiq-pi.vercel.app</a>
      <p style={{ margin: "66px 0 0", fontSize: 32, color: "#555" }}>Thank you.</p>
    </div>
    <a href={promotionalWebsite} target="_blank" rel="noreferrer" aria-label="Visit the AtomIQ promotional website" style={{ position: "absolute", left: 972, top: 96, width: 820, height: 820, padding: 24, borderRadius: 36, background: chapterTheme.colors.dark }}>
      <Img data-testid="promotional-qr" src="/media/atomiq/promo-qr.svg" alt={`QR code for the AtomIQ promotional website: ${promotionalWebsite}`} width={772} height={772} style={{ display: "block", width: "100%", height: "100%" }} />
    </a>
    <p style={{ position: "absolute", left: 972, top: 950, width: 820, margin: 0, textAlign: "center", fontSize: 32, fontWeight: 600 }}>Point your camera here.</p>
  </div>;
}
