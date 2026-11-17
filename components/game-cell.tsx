"use client";

import type { PlayerId } from "@/types/game";

type GameCellProps = {
  index: number;
  icon: string | null;
  player: PlayerId | null;
  isWinning: boolean;
  winner: PlayerId | null;
  playable: boolean;
  onSelect: (index: number) => void;
};

function cellLabel(index: number, player: PlayerId | null): string {
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  const occupant = player ? `Occupied by player ${player}` : "Empty";
  return `Row ${row}, column ${column}. ${occupant}`;
}

export function GameCell({
  index,
  icon,
  player,
  isWinning,
  winner,
  playable,
  onSelect,
}: GameCellProps) {
  const winTone =
    isWinning && winner === 1
      ? "border-fire bg-fire/15 text-fire shadow-[0_0_28px_rgba(255,138,61,0.28)] motion-safe:animate-win"
      : isWinning && winner === 2
        ? "border-ice bg-ice/15 text-ice shadow-[0_0_28px_rgba(85,199,255,0.28)] motion-safe:animate-win"
        : "border-line bg-surface text-ink";

  return (
    <button
      id={`cell-${index}`}
      type="button"
      role="gridcell"
      aria-label={cellLabel(index, player)}
      aria-disabled={!playable}
      onClick={() => {
        if (playable) onSelect(index);
      }}
      className={`flex aspect-square items-center justify-center rounded-2xl border text-4xl shadow-inner transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice sm:text-5xl ${winTone} ${
        playable
          ? "cursor-pointer hover:border-[#3d5278] hover:bg-[#1a2742] active:scale-[0.98] motion-safe:hover:-translate-y-0.5"
          : "cursor-default"
      } ${icon ? "motion-safe:animate-place" : ""}`}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
