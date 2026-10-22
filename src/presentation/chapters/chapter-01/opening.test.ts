import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Slide01Opening, openingPoster } from "./Slide01Opening";

vi.mock("remotion", async (original) => ({
  ...await original<typeof import("remotion")>(),
  useCurrentFrame: () => 30,
}));

describe("Event poster opening", () => {
  it("uses editable text and vectors and keeps previews static by default", () => {
    const markup = renderToStaticMarkup(createElement(Slide01Opening, { reducedMotion: false, slideCount: 20 }));
    expect(markup).toContain(openingPoster.description);
    expect(markup).not.toContain("<img");
    expect(markup.match(/<image /g)).toHaveLength(7);
    expect(markup).toContain('data-poster-idle="still"');
    expect(markup).toContain('data-editable="event-title"');
  });
  it("opts the live stage into ambient motion without changing the cue frame", () => {
    const markup = renderToStaticMarkup(createElement(Slide01Opening, { reducedMotion: false, ambientMotion: true, slideCount: 20 }));
    expect(markup).toContain('data-poster-idle="playing"');
    expect(markup).toContain('data-slide-frame="30"');
    expect(markup).toContain('data-testid="opening-ambient"');
    expect(markup).toContain("event-poster__speaker");
    expect(markup).toContain("event-poster__marquee-track");
  });
  it("keeps the recreated background static when reduced motion is enabled", () => {
    const markup = renderToStaticMarkup(createElement(Slide01Opening, { reducedMotion: true, ambientMotion: true, slideCount: 20 }));
    expect(markup).toContain('data-poster-idle="still"');
    expect(markup).toContain('data-editable="event-title"');
    expect(markup).toContain(openingPoster.description);
    expect(markup).not.toContain("<img");
    expect(markup.match(/<image /g)).toHaveLength(7);
  });
});
