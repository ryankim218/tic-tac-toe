import type { Player, PlayerId } from "@/types/game";

export type SymbolOption = {
  id: string;
  name: string;
  emoji: string;
};

export const SYMBOLS: readonly SymbolOption[] = [
  { id: "fire", name: "Fire", emoji: "🔥" },
  { id: "ice", name: "Ice", emoji: "❄️" },
  { id: "lightning", name: "Lightning", emoji: "⚡" },
  { id: "water", name: "Water", emoji: "💧" },
  { id: "earth", name: "Earth", emoji: "🌍" },
  { id: "nature", name: "Nature", emoji: "🌿" },
  { id: "sun", name: "Sun", emoji: "☀️" },
  { id: "moon", name: "Moon", emoji: "🌙" },
  { id: "star", name: "Star", emoji: "⭐" },
  { id: "ghost", name: "Ghost", emoji: "👻" },
  { id: "alien", name: "Alien", emoji: "👽" },
  { id: "crown", name: "Crown", emoji: "👑" },
  { id: "dragon", name: "Dragon", emoji: "🐉" },
  { id: "crystal", name: "Crystal", emoji: "💎" },
  { id: "skull", name: "Skull", emoji: "💀" },
  { id: "heart", name: "Heart", emoji: "❤️" },
];

export const DEFAULT_NAMES: Record<PlayerId, string> = {
  1: "Player 1",
  2: "Player 2",
};

export const DEFAULT_ICONS: Record<PlayerId, string> = {
  1: "🔥",
  2: "❄️",
};

const SYMBOL_SET = new Set(SYMBOLS.map((symbol) => symbol.emoji));

export function isSymbol(value: string): boolean {
  return SYMBOL_SET.has(value);
}

export function createDefaultPlayers(): [Player, Player] {
  return [
    { id: 1, name: DEFAULT_NAMES[1], icon: DEFAULT_ICONS[1], score: 0 },
    { id: 2, name: DEFAULT_NAMES[2], icon: DEFAULT_ICONS[2], score: 0 },
  ];
}

export function displayName(name: string, id: PlayerId): string {
  const trimmed = name.trim();
  return trimmed || DEFAULT_NAMES[id];
}
