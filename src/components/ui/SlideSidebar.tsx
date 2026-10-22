import { Thumbnail } from "@remotion/player";
import { Layers3, PanelLeftClose, Sparkles } from "lucide-react";
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PlaybackController } from "../../engine/PlaybackController";
import type { PresentationConfig, SlideDefinition } from "../../engine/types";
import { IconButton } from "./IconButton";

const SlideCard = memo(function SlideCard({ slide, index, current, busy, visible, config, controller }: {
  slide: SlideDefinition; index: number; current: boolean; busy: boolean; visible: boolean;
  config: PresentationConfig; controller: PlaybackController;
}) {
  const inputProps = useMemo(() => ({ reducedMotion: true, ambientMotion: false, slideCount: config.slides.length }), [config.slides.length]);
  return <button data-slide-index={index} className={`slide-card ${current ? "is-current" : ""}`}
    aria-label={`Go to slide ${index + 1}: ${slide.title}`} aria-current={current ? "step" : undefined}
    disabled={busy} onClick={() => controller.goToSlide(index)}>
    <div className="thumbnail-wrap" aria-hidden="true" style={{ background: slide.background }}>
      {visible ? <Thumbnail component={slide.component} inputProps={inputProps}
        frameToDisplay={slide.durationInFrames - 1} durationInFrames={slide.durationInFrames} fps={slide.fps}
        compositionWidth={config.width} compositionHeight={config.height}
        style={{ width: "100%", aspectRatio: "16/9" }} />
        : <div className="thumbnail-placeholder">{String(index + 1).padStart(2, "0")}</div>}
      <span className="thumbnail-cues">{slide.checkpoints.length - 1} cues</span>
    </div>
    <div className="slide-card-caption"><span className="slide-index">{String(index + 1).padStart(2, "0")}</span>
      <span>{slide.title}</span>{current ? <span className="current-dot" /> : null}
    </div>
  </button>;
});

export const SlideSidebar = memo(function SlideSidebar({
  config,
  controller,
  currentIndex,
  busy,
  onClose,
}: {
  config: PresentationConfig;
  controller: PlaybackController;
  currentIndex: number;
  busy: boolean;
  onClose: () => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [visibleSlides, setVisibleSlides] = useState<ReadonlySet<number>>(() => new Set([0, 1, 2]));

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(entries => {
      setVisibleSlides(previous => {
        const next = new Set(previous);
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.slideIndex);
          if (entry.isIntersecting) next.add(index); else next.delete(index);
        }
        return next.size === previous.size && [...next].every(index => previous.has(index)) ? previous : next;
      });
    }, { root, rootMargin: "200px", threshold: 0 });
    for (const card of root.children) observer.observe(card);
    return () => observer.disconnect();
  }, [config.slides]);

  useLayoutEffect(() => {
    const list = listRef.current;
    const card = list?.querySelector<HTMLElement>(`[data-slide-index="${currentIndex}"]`);
    if (!list || !card) return;
    const viewport = list.getBoundingClientRect();
    const bounds = card.getBoundingClientRect();
    // Scroll only this panel, preserving the canvas and document position.
    if (getComputedStyle(list).flexDirection === "row") {
      if (bounds.left < viewport.left) list.scrollLeft -= viewport.left - bounds.left;
      else if (bounds.right > viewport.right) list.scrollLeft += bounds.right - viewport.right;
    } else {
      if (bounds.top < viewport.top) list.scrollTop -= viewport.top - bounds.top;
      else if (bounds.bottom > viewport.bottom) list.scrollTop += bounds.bottom - viewport.bottom;
    }
  }, [currentIndex]);

  return (
    <aside className="slide-sidebar" aria-label="Slide navigation">
      <div className="sidebar-heading">
        <span>
          <Layers3 size={16} /> Slides{" "}
          <span className="count-badge">
            {config.slides.length.toString().padStart(2, "0")}
          </span>
        </span>
        <IconButton label="Hide slide sidebar" onClick={onClose}>
          <PanelLeftClose size={16} />
        </IconButton>
      </div>
      <div className="slide-list" ref={listRef} tabIndex={0} role="region" aria-label="Slides">
        {config.slides.map((slide, index) => <SlideCard key={slide.id} slide={slide} index={index}
          current={index === currentIndex} busy={busy} visible={visibleSlides.has(index)} config={config} controller={controller} />)}
      </div>
      <div className="sidebar-bottom">
        <Sparkles size={17} />
        <div>
          <strong>Made for your moment.</strong>
          <p>You set the pace.</p>
        </div>
      </div>
    </aside>
  );
});
