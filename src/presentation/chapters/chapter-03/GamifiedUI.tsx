import { memo } from "react";
import { Img } from "remotion";
import { ArrowRight, Award, BarChart3, BookOpen, Check, ChevronDown, ChevronRight, Crown, Gavel, Pencil, Settings, Share2, Signal, Sparkles, Sun, Telescope, Trophy, Wifi, Zap } from "lucide-react";

export const minigameChoices = [
  { name: "Myth Buster", color: "#6932b2", tint: "#f4edff", Icon: Gavel },
  { name: "Atom Maze", color: "#009b9f", tint: "#defbfc", Icon: null },
  { name: "Lab Experiment", color: "#409d22", tint: "#effce8", Icon: Telescope },
  { name: "Encyclopedia", color: "#bd0904", tint: "#ffe5df", Icon: BookOpen },
] as const;

export const ProductStatus = memo(function ProductStatus() {
  return <div className="gamified-status"><b>3:24</b><div><Signal size={38} fill="currentColor" /><Wifi size={38} /><strong>93</strong></div></div>;
});
export const ProductNav = memo(function ProductNav({ active }: { active: "games" | "profile" }) {
  return <div className="gamified-nav">{["map", "community", "ai", "games", "profile"].map(name => <div key={name}><Img src={`/media/atomiq/navbar/${name}.png`} alt={`${name} navigation icon`} />{name === active ? <i /> : null}</div>)}</div>;
});
export const ProductHand = memo(function ProductHand() {
  return <svg viewBox="0 0 80 96" fill="white" stroke="#252b26" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M29 54V12a8 8 0 0 1 16 0v27a7 7 0 0 1 14 0v5a7 7 0 0 1 14 0v24c0 13-10 16-12 25H29c-1-9-4-13-11-20L7 60a8 8 0 0 1 12-11l10 10Z" /><path d="M45 39v17m14-12v14" fill="none" /></svg>;
});
export const GameChoice = memo(function GameChoice({ index, expanded = false }: { index: number; expanded?: boolean }) {
  const { name, color, tint, Icon } = minigameChoices[index]!;
  return <div className={`gamified-choice${expanded ? " gamified-choice--expanded" : ""}`} data-game-choice={name}>
    <div className="gamified-choice__symbol" style={{ color, background: tint }}>{Icon ? <Icon size={86} fill="currentColor" strokeWidth={1.5} /> : <svg viewBox="0 0 80 80" width="86" height="86" fill="currentColor" aria-hidden="true"><path d="M34 5H24C9 5 3 13 3 29v23c0 16 7 23 22 23h9ZM42 5h13c15 0 22 8 22 24v23c0 16-7 23-22 23H42Z" /></svg>}</div>
    <div className="gamified-choice__name">{name}</div>
  </div>;
});
export const GamePicker = memo(function GamePicker() {
  return <div className="gamified-screen game-picker" data-testid="game-picker-ui" aria-label="Recreated AtomIQ game picker">
    <ProductStatus />
    <div className="game-picker__question">?</div>
    <div className="game-picker__pick">Pick</div><div className="game-picker__a">a</div><div className="game-picker__game">Game</div>
    <ArrowRight className="game-picker__arrow" size={140} strokeWidth={1.8} />
    {minigameChoices.map((game, index) => <div className="game-picker__choice" key={game.name} style={{ top: 648 + index * 265 }}><GameChoice index={index} /></div>)}
    <div className="gamified-bottom-fade" />
    <div className="gamified-screen__nav"><ProductNav active="games" /></div>
  </div>;
});

export const ProfileIdentity = memo(function ProfileIdentity() {
  return <div className="gamified-identity" data-testid="profile-identity">
    <div className="gamified-identity__rank"><Crown size={34} fill="currentColor" />Atomic Novice<ChevronDown size={25} fill="currentColor" /></div>
    <div className="gamified-identity__stats"><BarChart3 size={43} strokeWidth={4} /></div>
    <div className="gamified-identity__card"><div className="gamified-identity__avatar"><Img src="/media/atomiq/profile.png" alt="Kent's profile avatar" /><b>1</b></div>
      <div className="gamified-identity__name">kent</div><div className="gamified-identity__level">Level 1</div><div className="gamified-identity__xp">0 XP</div><div className="gamified-identity__bar" /><div className="gamified-identity__next">100 XP until Level 2</div>
    </div>
  </div>;
});
export const ProfileStreak = memo(function ProfileStreak() {
  return <div className="gamified-streak" data-testid="profile-streak"><div className="gamified-streak__sun"><Sun size={73} fill="currentColor" strokeWidth={2} /></div><div className="gamified-streak__text"><b>0 day streak</b><small>Longest: 1 day</small></div><div className="gamified-panel-arrow"><ChevronRight size={36} fill="currentColor" strokeWidth={4} /></div></div>;
});
const awards = [
  { name: "First Steps", Icon: Award }, { name: "Myth Buster", Icon: Check }, { name: "On Fire", Icon: Zap }, { name: "XP Master", Icon: Sparkles }, { name: "Dedicated", Icon: Crown },
];
export const ProfileAwards = memo(function ProfileAwards() {
  return <div className="gamified-awards" data-testid="profile-awards"><div className="gamified-panel-title">Awards</div><div className="gamified-panel-chip">0/5 unlocked</div><div className="gamified-awards__row">{awards.map(({ name, Icon }) => <div className="gamified-awards__item" key={name} data-award-state="locked"><div><Icon size={55} fill={name === "Myth Buster" ? "none" : "currentColor"} strokeWidth={name === "Myth Buster" ? 5 : 1.7} /></div><b>{name}</b></div>)}</div></div>;
});
export const ProfileLeaderboard = memo(function ProfileLeaderboard({ compact = false }: { compact?: boolean }) {
  return <div className={`gamified-leaderboard${compact ? " gamified-leaderboard--compact" : ""}`} data-testid="profile-leaderboard"><div className="gamified-panel-title">Game Leaderboard</div><div className="gamified-panel-chip"><Trophy size={25} fill="currentColor" />Personal bests</div><div className="gamified-leaderboard__ranking"><div className="gamified-leaderboard__trophy"><Trophy size={47} fill="currentColor" /></div><div><b>Ranking</b><small>Rank #11 of 11 • Tap to view</small></div><div className="gamified-panel-arrow"><ChevronRight size={36} fill="currentColor" strokeWidth={4} /></div></div>{!compact ? <div className="gamified-leaderboard__unplayed"><b>2</b><div className="gamified-leaderboard__maze" /><div><strong>Atom Maze</strong><small>Not played yet</small></div><i>—</i></div> : null}</div>;
});
export type ProfileFocus = "overview" | "streak" | "awards" | "leaderboard";
export const GamifiedProfile = memo(function GamifiedProfile({ focus }: { focus: ProfileFocus }) {
  return <div className="gamified-screen gamified-profile" data-testid="gamified-profile-ui" data-profile-focus={focus} aria-label="Recreated AtomIQ profile">
    <ProductStatus />
    <div className="gamified-profile__tools"><div><Share2 size={42} fill="currentColor" /></div><div><Pencil size={43} fill="currentColor" /></div><div><Settings size={43} fill="currentColor" /></div></div>
    <div className="gamified-profile__identity"><ProfileIdentity /></div>
    <div className="gamified-profile__streak"><ProfileStreak /></div>
    <div className="gamified-profile__awards"><ProfileAwards /></div>
    <div className="gamified-profile__leaderboard"><ProfileLeaderboard /></div>
    <div className="gamified-bottom-fade" />
    <div className="gamified-screen__nav"><ProductNav active="profile" /></div>
  </div>;
});
