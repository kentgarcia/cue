import { Img, useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, MotionLine, ramp } from "../chapter-01/motion";
import { characterAssets } from "./assets";
import { chapterTheme } from "./theme";

// Shared edges make a seamless four-way comic split. The image surfaces move
// inside static polygon masks, keeping the angled boundaries steady during cues.
export const comicPanels = [
  { left: 0, right: 600, topLeft: 0, topRight: 360, bottomLeft: 0, bottomRight: 600 },
  { left: 360, right: 1060, topLeft: 360, topRight: 1060, bottomLeft: 600, bottomRight: 860 },
  { left: 860, right: 1560, topLeft: 1060, topRight: 1320, bottomLeft: 860, bottomRight: 1560 },
  { left: 1320, right: 1920, topLeft: 1320, topRight: 1920, bottomLeft: 1560, bottomRight: 1920 },
] as const;

export function Slide05Fiction({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter="02" frame={frame} background={chapterTheme.colors.light}>
    {characterAssets.map((asset, index) => {
      const panel = comicPanels[index]!;
      const width = panel.right - panel.left;
      const x = (point: number) => `${(point - panel.left) / width * 100}%`;
      return <div key={asset.id} data-comic-panel={asset.id} style={{ position: "absolute", top: 0, bottom: 0, left: `${panel.left / 1920 * 100}%`, width: `${width / 1920 * 100}%`, clipPath: `polygon(${x(panel.topLeft)} 0, ${x(panel.topRight)} 0, ${x(panel.bottomRight)} 100%, ${x(panel.bottomLeft)} 100%)`, overflow: "hidden" }}>
        <MotionLine testId={`fiction-${asset.id}`} startFrame={asset.start} duration={11} distance={0} offsetX={index % 2 === 0 ? -80 : 80} reducedMotion={reducedMotion} style={{ position: "absolute", inset: 0, background: asset.background, willChange: frame > asset.start && frame < asset.start + 11 ? (reducedMotion ? "opacity" : "transform, opacity") : undefined }}>
          <Img src={asset.src} alt={asset.label} style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", objectPosition: asset.position }} />
        </MotionLine>
      </div>;
    })}
    <svg data-testid="comic-dividers" aria-hidden="true" viewBox="0 0 1920 1080" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {comicPanels.slice(0, 3).map((panel, index) => <line key={index} x1={panel.topRight} y1="0" x2={panel.bottomRight} y2="1080" stroke="#101014" strokeWidth="16" opacity={ramp(frame, characterAssets[index]!.start, characterAssets[index]!.start + 11)} />)}
    </svg>
  </ChapterCanvas>;
}
