"use client";

import { displayName } from "@/lib/icons";
import type { Player, PlayerId } from "@/types/game";

type GameStatusProps = {
  players: [Player, Player];
  currentPlayer: PlayerId;
  winner: PlayerId | null;
  isDraw: boolean;
  nextStarter: PlayerId;
  isGameOver: boolean;
};

export function GameStatus({
  players,
  currentPlayer,
  winner,
  isDraw,
  nextStarter,
  isGameOver,
}: GameStatusProps) {
  const actor =
    players.find((player) => player.id === (winner ?? currentPlayer)) ??
    players[0];
  const name = displayName(actor.name, actor.id);
  const opener =
    players.find((player) => player.id === nextStarter) ?? players[0];

  let message = `${actor.icon} ${name}'s turn!`;
  let tone =
    actor.id === 1 ? "border-fire/40 bg-fire/10" : "border-ice/40 bg-ice/10";

  if (winner) {
    message = `${actor.icon} ${name} wins!`;
  } else if (isDraw) {
    message = "🤝 It's a draw!";
    tone = "border-success/40 bg-success/10";
  }

  return (
    <div
      className="flex w-full max-w-[440px] flex-col items-center gap-2 text-center"
      aria-live="polite"
    >
      <p
        className={`w-full rounded-2xl border px-4 py-3 font-display text-xl text-ink sm:text-2xl ${tone}`}
      >
        {message}
      </p>
      {isGameOver ? (
        <p className="text-sm text-muted">
          Next round opens with {opener.icon}{" "}
          {displayName(opener.name, opener.id)}.
        </p>
      ) : (
        <p className="text-sm text-muted">
          Take an empty cell. Three in a row wins the round.
        </p>
      )}
    </div>
  );
}
