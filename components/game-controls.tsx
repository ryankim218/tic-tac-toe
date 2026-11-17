"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw, Swords } from "lucide-react";

type GameControlsProps = {
  ready: boolean;
  onNewGame: () => void;
  onResetScoreboard: () => void;
};

export function GameControls({
  ready,
  onNewGame,
  onResetScoreboard,
}: GameControlsProps) {
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!confirming) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirming(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [confirming]);

  return (
    <>
      <div className="flex w-full max-w-[440px] flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onNewGame}
          disabled={!ready}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-fire px-4 font-semibold text-[#1a0d05] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Swords className="size-4" aria-hidden="true" />
          New Game
        </button>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={!ready}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-card px-4 font-semibold text-ink transition hover:border-[#3d5278] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset Scoreboard
        </button>
      </div>

      {confirming ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#080B16]/75 p-4 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirming(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-3xl border border-line bg-card p-5 shadow-2xl motion-safe:animate-rise"
          >
            <h2 id={titleId} className="font-display text-2xl text-ink">
              Reset the scoreboard?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              This clears both players&apos; wins, the draw count, and games
              played. The next round starts fresh with Player 1. Names and
              symbols stay as they are.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line px-4 font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  onResetScoreboard();
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-fire px-4 font-semibold text-[#1a0d05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire"
              >
                Reset scores
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
