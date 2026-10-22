import { optimizedSrcSet } from "../../media";
import { useState } from "react";
import { Img } from "remotion";
import type { SlideImageAsset } from "./assets";
import { chapterTheme } from "./theme";

export function SlideMedia({ asset }: { asset: SlideImageAsset }) {
  const [failed, setFailed] = useState(false);
  const placeholder = !asset.src || failed;
  return (
    <div
      data-media={asset.label}
      data-placeholder={placeholder}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        background: asset.background,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        color: chapterTheme.colors.ink,
      }}
    >
      {placeholder ? (
        <div
          role="img"
          aria-label={`Image placeholder: ${asset.label}`}
          style={{ textAlign: "center" }}
        >
          <svg
            aria-hidden="true"
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ opacity: 0.45 }}
          >
            <rect x="12" y="16" width="72" height="64" rx="2" />
            <circle cx="34" cy="36" r="7" />
            <path d="m13 69 22-22 17 16 13-13 18 19" />
          </svg>
          <div data-gradient-text style={{ fontSize: 18, fontWeight: 600, letterSpacing: 3, marginTop: 18 }}>
            IMAGE PLACEHOLDER
          </div>
        </div>
      ) : (
        <Img
          src={asset.src!}
          srcSet={optimizedSrcSet(asset.src!)}
          alt={asset.label}
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      )}
    </div>
  );
}
