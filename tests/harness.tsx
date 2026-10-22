import { StrictMode, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Studio } from "../src/app/App";
import { PresentationEngine, usePresentation } from "../src/engine/PresentationEngine";
import { presentation } from "../src/presentation/config";
import type { PresentationConfig } from "../src/engine/types";
import "../src/styles/index.css";
import { loadPresentationFonts } from "../src/presentation/fonts";

function BrokenSlide(): never {
  throw new Error("Intentional test slide failure");
}

function RenderProbe() {
  usePresentation();
  const renders = useRef(0);
  renders.current += 1;
  return <output hidden data-testid="engine-renders" data-count={renders.current} />;
}

const recoveryConfig: PresentationConfig = {
  ...presentation,
  slides: [
    {
      ...presentation.slides[0],
      id: "broken",
      title: "Broken",
      component: BrokenSlide,
      transition: "none",
      transitionComponent: undefined,
    },
    {
      ...presentation.slides[1],
      transition: "fade",
      transitionComponent: undefined,
    },
    {
      ...presentation.slides[0],
      id: "no-transition",
      title: "No Transition",
      transition: "none",
      transitionComponent: undefined,
    },
  ],
};

const config: PresentationConfig = new URLSearchParams(
  window.location.search,
).has("playback")
  ? {
      ...presentation,
      slides: [
        {
          ...presentation.slides[0],
          fps: 10,
          durationInFrames: 120,
          checkpoints: [0, 2, 80, 119],
          checkpointLabels: ["Start", "Opening", "Resumed", "Final"],
        },
      ],
    }
  : recoveryConfig;

await loadPresentationFonts();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PresentationEngine config={config}>
      <Studio />
      <RenderProbe />
    </PresentationEngine>
  </StrictMode>,
);
