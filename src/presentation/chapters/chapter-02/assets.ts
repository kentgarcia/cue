export interface SlideImageAsset {
  label: string;
  src: string | null;
  background: string;
}

export const characterAssets = [
  { id: "turtles", label: "Teenage Mutant Ninja Turtles", src: "/media/slide-5/mutantninjaturtles.jpg", background: "#17251b", position: "center", start: 0 },
  { id: "hulk", label: "Hulk", src: "/media/slide-5/hulk.jpg", background: "#263c2c", position: "64% center", start: 30 },
  { id: "gagamboy", label: "Gagamboy", src: "/media/slide-5/gagamboy.jpg", background: "#b76624", position: "center", start: 60 },
  { id: "powerpuff", label: "The Powerpuff Girls", src: "/media/slide-5/powerpuff.jpg", background: "#f7b8dc", position: "left center", start: 90 },
] as const satisfies readonly (SlideImageAsset & { id: string; position: string; start: number })[];

export const competitionAsset: SlideImageAsset = {
  label: "Myth Smashers competition announcement",
  src: "/media/slide-6/poster.png",
  background: "#f0f0f0",
};

export const competitionSource = "https://nucleng.snu.ac.kr/community/notice?bbsidx=23622&md=v";
