import type { StoryAsset } from "../shared/StoryMedia";

// Team-supplied AtomIQ brand assets; remaining content slots await their media.
export const officialTagline = "When facts are clear, there’s nothing to fear.";
export const ideaAssets = {
  logo: { label: "Official AtomIQ logo", src: "/media/atomiq/icon.png", kind: "logo" },
  lessons: { label: "AtomIQ · Lessons", src: "/media/atomiq/phone.png", kind: "screenshot" },
  games: { label: "AtomIQ · Learning games", src: null, kind: "screenshot" },
  schrodi: { label: "AtomIQ · Schrödi", src: null, kind: "screenshot" },
  award: { label: "Team AtomIQ · Champion photograph", src: "/media/journey/champion.png", kind: "photo", fit: "cover" },
} satisfies Record<string, StoryAsset>;

export const radiationSource = "https://www.epa.gov/radtown/natural-radioactivity-food";
