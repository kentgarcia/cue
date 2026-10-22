import type { StoryAsset } from "../shared/StoryMedia";

export const japanAssets = {
  arrival: { label: "Team AtomIQ · In Japan", src: "/media/journey/japan.png", kind: "photo", fit: "cover" },
  museum: { label: "Japan · Science museum", src: "/media/journey/museum.jpg", kind: "photo", fit: "cover" },
  monitoring: { label: "Japan · Monitoring equipment", src: "/media/journey/equipment.jpg", kind: "photo", fit: "cover", position: "20% center" },
  facility: { label: "Japan · Nuclear facility visit", src: "/media/journey/facility.jpg", kind: "photo", fit: "cover", position: "right center" },
  interviewOne: { label: "Fukushima residents · Interview 1", src: "/media/journey/interview-1.jpg", kind: "photo", fit: "cover", position: "60% center" },
  interviewTwo: { label: "Fukushima residents · Interview 2", src: "/media/journey/interview-2.jpg", kind: "photo", fit: "cover", position: "65% center" },
} satisfies Record<string, StoryAsset>;
