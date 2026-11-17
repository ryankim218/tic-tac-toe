"use client";

import { displayName } from "@/lib/icons";
import type { Player } from "@/types/game";

type PlayerCardProps = {
  player: Player;
  phase: "turn" | "winner" | "waiting";
  onCustomize: () => void;
};

export function PlayerCard({ player, phase, onCustomize }: PlayerCardProps) {
  const accent = player.id === 1 ? "fire" : "ice";
  const active = phase === "turn" || phase === "winner";
  const name = displayName(player.name, player.id);

  const frame =
    accent === "fire"
      ? "border-fire/80 shadow-[0_0_32px_rgba(255,138,61,0.16)]"
      : "border-ice/80 shadow-[0_0_32px_rgba(85,199,255,0.16)]";

  const badge =
    accent === "fire" ? "bg-fire/15 text-fire" : "bg-ice/15 text-ice";

  return (
    <article
      aria-current={phase === "turn" ? "true" : undefined}
      className={`flex h-full flex-col gap-3 rounded-3xl border bg-card p-4 transition ${active ? frame : "border-line"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid size-14 place-items-center rounded-2xl border border-line bg-surface text-3xl ${active ? frame : ""}`}
          aria-hidden="true"
        >
          {player.icon}
        </span>
        <p
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? badge : "bg-surface text-muted"}`}
        >
          {phase === "turn"
            ? "Your turn"
            : phase === "winner"
              ? "Winner"
              : "Waiting"}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Player {player.id}
        </p>
        <h2 className="truncate font-display text-xl text-ink">{name}</h2>
      </div>
      <p className="text-sm text-muted">
        <span className="font-display text-2xl text-ink">{player.score}</span>{" "}
        {player.score === 1 ? "win" : "wins"}
      </p>
      <button
        type="button"
        onClick={onCustomize}
        aria-label={`Edit ${name}'s identity`}
        className="mt-auto inline-flex h-10 items-center justify-center rounded-xl border border-line bg-surface text-sm font-medium text-ink transition hover:border-[#3d5278] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
      >
        Edit identity
      </button>
    </article>
  );
}
