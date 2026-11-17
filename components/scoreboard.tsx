"use client";

import { displayName } from "@/lib/icons";
import type { Player } from "@/types/game";

type ScoreboardProps = {
  players: [Player, Player];
  draws: number;
  totalGames: number;
};

const tiles = [
  { key: "p1", label: "Player 1 wins" },
  { key: "p2", label: "Player 2 wins" },
  { key: "draws", label: "Draws" },
  { key: "games", label: "Games played" },
] as const;

export function Scoreboard({ players, draws, totalGames }: ScoreboardProps) {
  const values = {
    p1: players[0].score,
    p2: players[1].score,
    draws,
    games: totalGames,
  };

  return (
    <section
      aria-label="Scoreboard"
      className="rounded-3xl border border-line bg-card p-4"
    >
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-display text-lg text-ink">Scoreboard</h2>
        <p className="text-xs text-muted">Saved on this device</p>
      </div>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className="rounded-2xl border border-line bg-surface px-3 py-3"
          >
            <dt className="text-xs text-muted">
              {tile.key === "p1"
                ? `${displayName(players[0].name, 1)} wins`
                : tile.key === "p2"
                  ? `${displayName(players[1].name, 2)} wins`
                  : tile.label}
            </dt>
            <dd className="mt-1 font-display text-2xl text-ink">
              {values[tile.key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
