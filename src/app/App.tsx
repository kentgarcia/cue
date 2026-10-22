import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Expand,
  Keyboard,
  Layers3,
  MessageSquare,
  MousePointer2,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import {
  PresentationEngine,
  usePresentation,
} from "../engine/PresentationEngine";
import { presentation } from "../presentation/config";
import { IconButton } from "../components/ui/IconButton";
import { SlideSidebar } from "../components/ui/SlideSidebar";
import { PresentationStage } from "../components/ui/PresentationStage";
import { ShortcutDialog } from "../components/ui/ShortcutDialog";
import { CueTimeline, FrameReadout } from "../components/ui/PlaybackTelemetry";

export function Studio() {
  const {
    config,
    state,
    controller,
    fullscreen,
    notice,
    dismissNotice,
    reducedMotion,
  } = usePresentation();
  const [sidebar, setSidebar] = useState(true);
  const closeSidebar = useCallback(() => setSidebar(false), []);
  const [shortcuts, setShortcuts] = useState(false);
  const [panel, setPanel] = useState<"notes" | "details">("notes");
  const [notesOpen, setNotesOpen] = useState(true);
  const slide = config.slides[state.slideIndex]!;
  const cueIndex = Math.max(
    0,
    slide.checkpoints.findLastIndex((frame) => frame <= state.frame),
  );
  const busy = state.phase === "transitioning";
  const complete =
    state.slideIndex === config.slides.length - 1 &&
    state.frame === slide.durationInFrames - 1;
  const cueLabel =
    state.phase === "transitioning"
      ? "Changing slide"
      : state.phase === "playing"
        ? "Animating"
        : complete
          ? "Presentation complete"
          : "Waiting for your cue";
  return (
    <div className="studio">
      <header className="topbar">
        <div className="brand" aria-label="Cue">
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          cue<span className="brand-period">.</span>
        </div>
        <span className="header-divider" />
        <div className="project-name">
          <span>{config.title}</span>
          <span className="demo-badge">
            {slide.chapter ? `CHAPTER ${slide.chapter.number}` : "PRESENTATION"}
          </span>
        </div>
        <div className="header-actions">
          <span className="local-status">
            <span /> Local workspace
          </span>
          <IconButton
            label="Keyboard shortcuts"
            onClick={() => setShortcuts(true)}
          >
            <Keyboard size={19} />
          </IconButton>
          <button className="present-button" onClick={fullscreen}>
            <Play size={15} fill="currentColor" /> Present <kbd>F</kbd>
          </button>
        </div>
      </header>
      <div className={`workspace ${sidebar ? "" : "sidebar-hidden"}`}>
        {sidebar ? (
          <SlideSidebar
            config={config}
            controller={controller}
            currentIndex={state.slideIndex}
            busy={busy}
            onClose={closeSidebar}
          />
        ) : null}
        <main className="main-workspace">
          <div className="workspace-topline">
            <div className="workspace-tabs">
              <button className="workspace-tab is-active" aria-current="page">
                <Presentation size={16} /> Preview
              </button>
              <span className="code-first">
                <Code2 size={15} /> Code-first. Story-driven.
              </span>
            </div>
            <div className="canvas-spec">
              <span className="spec-dot" /> 1920 × 1080 <span>16:9</span>
            </div>
          </div>
          <div className="workspace-content">
            <div className="slide-heading">
              <div className="slide-heading-left">
                {!sidebar ? (
                  <IconButton
                    label="Show slide sidebar"
                    onClick={() => setSidebar(true)}
                  >
                    <Layers3 size={20} />
                  </IconButton>
                ) : null}
                <div>
                  <div className="eyebrow">
                    {slide.chapter?.title.toUpperCase() ?? "PRESENTATION"} <span>/</span>{" "}
                    <span>{String(state.slideIndex + 1).padStart(2, "0")}</span>
                  </div>
                  <h1>
                    {slide.title}
                    <span className="heading-dot">.</span>
                  </h1>
                </div>
              </div>
              <span className="slide-type">
                <Sparkles size={13} /> Interactive slide
              </span>
            </div>
            <PresentationStage />
            <div className="canvas-caption">
              <span>
                <MousePointer2 size={13} /> Click the canvas or press{" "}
                <kbd>→</kbd> to advance
              </span>
              <button onClick={fullscreen}>
                <Expand size={13} /> Fit to screen
              </button>
            </div>
            <section className="playback-panel" aria-label="Playback controls">
              <CueTimeline />
              <div className="transport-row">
                <div className="transport-left">
                  <IconButton
                    label="Restart slide"
                    onClick={controller.restart}
                    disabled={busy}
                  >
                    <RotateCcw size={17} />
                  </IconButton>
                  <span className="transport-divider" />
                  <IconButton
                    label="Previous checkpoint or slide"
                    onClick={controller.previous}
                    disabled={
                      busy || (state.slideIndex === 0 && state.phase === "paused" && state.frame === 0)
                    }
                  >
                    <ArrowLeft size={20} />
                  </IconButton>
                  <IconButton
                    label={
                      state.phase === "playing"
                        ? "Pause animation"
                        : "Play next animation"
                    }
                    className="play-button"
                    onClick={controller.toggle}
                    disabled={busy || complete}
                  >
                    {state.phase === "playing" ? (
                      <Pause size={17} fill="currentColor" />
                    ) : (
                      <Play size={17} fill="currentColor" />
                    )}
                  </IconButton>
                  <IconButton
                    label="Next checkpoint or slide"
                    onClick={controller.next}
                    disabled={busy || complete}
                  >
                    <ArrowRight size={20} />
                  </IconButton>
                  <span className="transport-divider" />
                  <div className="playback-status">
                    <span
                      className={`status-dot ${state.phase === "paused" ? "is-paused" : ""}`}
                    />
                    {cueLabel}
                  </div>
                </div>
                <FrameReadout />
              </div>
            </section>
            <section
              className={`notes-panel ${notesOpen ? "" : "is-collapsed"}`}
              aria-label="Slide information"
            >
              <div className="notes-header">
                <div role="tablist" aria-label="Slide information">
                  <button
                    id="notes-tab"
                    role="tab"
                    aria-selected={panel === "notes"}
                    aria-controls="slide-info"
                    onClick={() => {
                      setPanel("notes");
                      setNotesOpen(true);
                    }}
                    className={panel === "notes" ? "is-active" : ""}
                  >
                    <MessageSquare size={15} /> Speaker notes
                  </button>
                  <button
                    id="details-tab"
                    role="tab"
                    aria-selected={panel === "details"}
                    aria-controls="slide-info"
                    onClick={() => {
                      setPanel("details");
                      setNotesOpen(true);
                    }}
                    className={panel === "details" ? "is-active" : ""}
                  >
                    <Settings2 size={15} /> Slide details
                  </button>
                </div>
                <IconButton
                  label={notesOpen ? "Collapse notes" : "Expand notes"}
                  aria-expanded={notesOpen}
                  onClick={() => setNotesOpen((value) => !value)}
                >
                  <ChevronDown
                    size={17}
                    style={{
                      transform: notesOpen ? "rotate(180deg)" : undefined,
                    }}
                  />
                </IconButton>
              </div>
              {notesOpen ? (
                <div
                  id="slide-info"
                  role="tabpanel"
                  aria-labelledby={
                    panel === "notes" ? "notes-tab" : "details-tab"
                  }
                  className="notes-content"
                >
                  {panel === "notes" ? (
                    <>
                      <span className="notes-number">
                        {String(state.slideIndex + 1).padStart(2, "0")}
                      </span>
                      <p>{slide.notes}</p>
                    </>
                  ) : (
                    <div className="slide-details">
                      <div>
                        <span>Component</span>
                        <code>{slide.component.name}.tsx</code>
                      </div>
                      <div>
                        <span>Transition</span>
                        <strong>{slide.transition}</strong>
                      </div>
                      <div>
                        <span>Duration</span>
                        <strong>
                          {(slide.durationInFrames / slide.fps).toFixed(1)}s of
                          motion
                        </strong>
                      </div>
                      <div>
                        <span>Motion preference</span>
                        <strong>
                          {reducedMotion ? "Reduced" : "Full motion"}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </section>
            <div className="workspace-footer">
              <span>
                <span className="remotion-mark">◩</span> Powered by Remotion{" "}
                <span className="footer-dot">·</span> Built for the way you
                present.
              </span>
              <button onClick={() => setShortcuts(true)}>
                <Keyboard size={13} /> Keyboard shortcuts{" "}
                <ArrowDownLeft size={12} />
              </button>
            </div>
          </div>
        </main>
      </div>
      {notice ? (
        <div className="notice" role="status">
          <Check size={16} />
          <span>{notice}</span>
          <IconButton label="Dismiss notice" onClick={dismissNotice}>
            <X size={16} />
          </IconButton>
        </div>
      ) : null}
      <div className="sr-only" aria-live="polite">
        {slide.title}.{" "}
        {state.phase === "paused"
          ? `${cueIndex} of ${slide.checkpoints.length - 1} cues. ${cueLabel}.`
          : ""}
      </div>
      {shortcuts ? (
        <ShortcutDialog onClose={() => setShortcuts(false)} />
      ) : null}
    </div>
  );
}

export function App() {
  return (
    <PresentationEngine config={presentation}>
      <Studio />
    </PresentationEngine>
  );
}
