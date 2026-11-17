"use client";

import { useEffect, useId, useRef } from "react";
import { Check, X } from "lucide-react";
import { IconSelector } from "@/components/icon-selector";
import { DEFAULT_NAMES, displayName } from "@/lib/icons";
import type { Player, PlayerId } from "@/types/game";

type GameSettingsProps = {
  players: [Player, Player];
  onRename: (id: PlayerId, name: string) => void;
  onCommitName: (id: PlayerId) => void;
  onSelectIcon: (id: PlayerId, icon: string) => void;
  onClose: () => void;
};

export function GameSettings({
  players,
  onRename,
  onCommitName,
  onSelectIcon,
  onClose,
}: GameSettingsProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#080B16]/75 p-3 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-card p-5 shadow-2xl motion-safe:animate-rise sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="font-display text-2xl text-ink">
              Player identities
            </h2>
            <p className="mt-1 text-sm text-muted">
              Names and symbols update immediately. Scores stay intact, and each
              symbol can belong to only one player.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close player settings"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {players.map((player) => {
            const other =
              players.find((candidate) => candidate.id !== player.id) ??
              players[0];
            const inputId = `player-${player.id}-name`;
            return (
              <section
                key={player.id}
                className="rounded-2xl border border-line bg-surface p-4"
                aria-label={`Player ${player.id} settings`}
              >
                <h3
                  className={`font-display text-lg ${player.id === 1 ? "text-fire" : "text-ice"}`}
                >
                  {player.icon} {displayName(player.name, player.id)}
                </h3>
                <label
                  htmlFor={inputId}
                  className="mt-4 block text-sm font-medium text-ink"
                >
                  Display name
                </label>
                <input
                  id={inputId}
                  value={player.name}
                  maxLength={18}
                  autoComplete="off"
                  placeholder={DEFAULT_NAMES[player.id]}
                  onChange={(event) => onRename(player.id, event.target.value)}
                  onBlur={() => onCommitName(player.id)}
                  className="mt-2 h-11 w-full rounded-xl border border-line bg-card px-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
                />
                <div className="mt-4">
                  <IconSelector
                    label={`symbols-player-${player.id}`}
                    selected={player.icon}
                    taken={other.icon}
                    onSelect={(icon) => onSelectIcon(player.id, icon)}
                  />
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ice px-6 font-semibold text-[#080B16] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
          >
            <Check className="size-4" aria-hidden="true" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
