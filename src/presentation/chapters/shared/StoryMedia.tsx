import { optimizedSrcSet } from "../../media";
import { useState } from "react";
import { Img } from "remotion";
import { chapterTheme } from "../chapter-01/theme";

export interface StoryAsset {
  label: string;
  src: string | null;
  kind: "logo" | "screenshot" | "photo";
  position?: string;
  fit?: "contain" | "cover";
}

export function StoryMedia({ asset, fullBleed = false }: { asset: StoryAsset; fullBleed?: boolean }) {
  return <MediaContent key={asset.src} asset={asset} fullBleed={fullBleed} />;
}

function MediaContent({ asset, fullBleed }: { asset: StoryAsset; fullBleed: boolean }) {
  const [failed, setFailed] = useState(false);
  const placeholder = !asset.src || failed;
  return (
    <div data-media={asset.label} data-placeholder={placeholder} style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: asset.kind === "logo" && !placeholder ? "transparent" : chapterTheme.colors.light, borderRadius: 0, outline: fullBleed ? undefined : "1px solid #1111111a" }}>
      {placeholder ? (
        <div role="img" aria-label={`Placeholder: ${asset.label}`} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 18, padding: 28, color: chapterTheme.colors.ink, textAlign: "center", border: "2px solid #d4d4d4", borderRadius: 0, outline: fullBleed ? undefined : "1px solid #1111111a" }}>
          <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4 }}>
            <rect x="7" y="10" width="50" height="44" rx="3" />
            <circle cx="23" cy="25" r="5" />
            <path d="m8 47 15-15 12 12 9-9 12 12" />
          </svg>
          <span style={{ fontSize: 26, lineHeight: 1.4, fontWeight: 600, maxWidth: 480 }}>{asset.label}</span>
          <span style={{ fontSize: 15, letterSpacing: 2, opacity: 0.65 }}>{asset.kind.toUpperCase()} PLACEHOLDER</span>
        </div>
      ) : (
        <Img srcSet={optimizedSrcSet(asset.src!)} src={asset.src!} alt={asset.label} onError={() => setFailed(true)} style={{ width: "100%", height: "100%", objectFit: asset.fit ?? "contain", objectPosition: asset.position ?? "center" }} />
      )}
    </div>
  );
}
