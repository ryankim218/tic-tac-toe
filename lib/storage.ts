import {
  createDefaultPlayers,
  DEFAULT_ICONS,
  DEFAULT_NAMES,
  isSymbol,
} from "@/lib/icons";
import type { MatchStats, Player, PlayerId } from "@/types/game";

export const STORAGE_KEY = "elemental-clash";

const MAX_NAME_LENGTH = 18;
const MAX_COUNT = 9999;

let lastWritten: string | null = null;

function readCount(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > MAX_COUNT
  ) {
    return 0;
  }
  return value;
}

function readName(value: unknown, id: PlayerId): string {
  if (typeof value !== "string") {
    return DEFAULT_NAMES[id];
  }
  const cleaned = value
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
  return cleaned || DEFAULT_NAMES[id];
}

function readIcon(
  value: unknown,
  fallback: string,
  taken: string | null,
): string {
  if (typeof value === "string" && isSymbol(value) && value !== taken) {
    return value;
  }
  if (fallback !== taken) {
    return fallback;
  }
  return DEFAULT_ICONS[1] === taken ? DEFAULT_ICONS[2] : DEFAULT_ICONS[1];
}

function readPlayer(
  value: unknown,
  id: PlayerId,
  takenIcon: string | null,
): Player {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return {
    id,
    name: readName(record.name, id),
    icon: readIcon(record.icon, DEFAULT_ICONS[id], takenIcon),
    score: readCount(record.score),
  };
}

export function parsePersisted(raw: string | null): MatchStats | null {
  if (!raw) {
    return null;
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (record.version !== 1 || !Array.isArray(record.players)) {
    return null;
  }

  const first = readPlayer(record.players[0], 1, null);
  const second = readPlayer(record.players[1], 2, first.icon);
  const draws = readCount(record.draws);
  const players: [Player, Player] = [first, second];

  return {
    players,
    draws,
    totalGames: first.score + second.score + draws,
  };
}

export function serializePersisted(stats: MatchStats): string {
  return JSON.stringify({
    version: 1,
    players: stats.players,
    draws: stats.draws,
    totalGames: stats.totalGames,
  });
}

export function createDefaultStats(): MatchStats {
  return {
    players: createDefaultPlayers(),
    draws: 0,
    totalGames: 0,
  };
}

export function loadPersisted(): MatchStats | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    lastWritten = raw;
    return parsePersisted(raw);
  } catch {
    return null;
  }
}

export function savePersisted(stats: MatchStats): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const serialized = serializePersisted(stats);
    if (serialized === lastWritten) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, serialized);
    lastWritten = serialized;
  } catch {
    // Private mode and full storage should not interrupt the match.
  }
}
