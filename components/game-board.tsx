"use client";

import { GameCell } from "@/components/game-cell";
import type { GameState, PlayerId } from "@/types/game";

type GameBoardProps = {
  game: GameState;
  icons: Record<PlayerId, string>;
  ready: boolean;
  onSelect: (index: number) => void;
};

export function GameBoard({ game, icons, ready, onSelect }: GameBoardProps) {
  const winning = new Set(game.winningCombination ?? []);

  const moveFocus = (index: number, key: string) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    let next = index;

    if (key === "ArrowLeft" && column > 0) next = index - 1;
    if (key === "ArrowRight" && column < 2) next = index + 1;
    if (key === "ArrowUp" && row > 0) next = index - 3;
    if (key === "ArrowDown" && row < 2) next = index + 3;
    if (next === index) return;

    document.getElementById(`cell-${next}`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event.key.startsWith("Arrow")) return;
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.id.startsWith("cell-"))
      return;
    event.preventDefault();
    moveFocus(Number(target.id.replace("cell-", "")), event.key);
  };

  return (
    <div
      role="grid"
      aria-label="Tic-tac-toe board"
      aria-busy={!ready}
      className="grid aspect-square w-full max-w-[440px] grid-cols-3 gap-2.5 rounded-[28px] border border-line bg-card p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:gap-3 sm:p-3"
      onKeyDown={handleKeyDown}
    >
      {game.board.map((mark, index) => (
        <GameCell
          key={index}
          index={index}
          player={mark}
          icon={mark ? icons[mark] : null}
          isWinning={winning.has(index)}
          winner={game.winner}
          playable={ready && mark === null && !game.isGameOver}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
