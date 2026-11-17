"use client";

import { useCallback, useState } from "react";
import { Settings, Users } from "lucide-react";
import { GameBoard } from "@/components/game-board";
import { GameControls } from "@/components/game-controls";
import { GameSettings } from "@/components/game-settings";
import { GameStatus } from "@/components/game-status";
import { PlayerCard } from "@/components/player-card";
import { Scoreboard } from "@/components/scoreboard";
import { useGame } from "@/hooks/use-game";
import type { Player, PlayerId } from "@/types/game";

function phaseFor(
  player: Player,
  currentPlayer: PlayerId,
  winner: PlayerId | null,
  isGameOver: boolean,
) {
  if (winner === player.id) return "winner" as const;
  if (!isGameOver && currentPlayer === player.id) return "turn" as const;
  return "waiting" as const;
}

export function GameScreen() {
  const {
    game,
    stats,
    nextStarter,
    hydrated,
    placeMark,
    newGame,
    resetScoreboard,
    renamePlayer,
    commitPlayerName,
    selectIcon,
  } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const icons = { 1: stats.players[0].icon, 2: stats.players[1].icon } as const;

  if (!hydrated) {
    return (
      <div
        className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-12 text-sm text-muted"
        aria-busy="true"
      >
        Loading match…
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-5 sm:py-8">
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-64 bg-[radial-gradient(circle_at_left,rgba(255,138,61,0.16),transparent_42%),radial-gradient(circle_at_right,rgba(85,199,255,0.16),transparent_40%)]" />
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid size-12 place-items-center rounded-2xl border border-line bg-card text-2xl"
            aria-hidden="true"
          >
            ⚔️
          </span>
          <div>
            <h1 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
              Elemental Clash
            </h1>
            <p className="text-sm text-muted">A midnight duel for two</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-2 text-xs text-muted">
            <Users className="size-3.5" aria-hidden="true" />
            Local · two players
          </p>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 text-sm font-medium text-ink transition hover:border-[#3d5278] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
          >
            <Settings className="size-4" aria-hidden="true" />
            Customize
          </button>
        </div>
      </header>

      <section
        aria-label="Current match"
        className="grid grid-cols-2 items-stretch gap-3 lg:grid-cols-[minmax(0,240px)_minmax(280px,1fr)_minmax(0,240px)] lg:items-center lg:gap-6"
      >
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <PlayerCard
            player={stats.players[0]}
            phase={phaseFor(
              stats.players[0],
              game.currentPlayer,
              game.winner,
              game.isGameOver,
            )}
            onCustomize={() => setSettingsOpen(true)}
          />
        </div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-1">
          <PlayerCard
            player={stats.players[1]}
            phase={phaseFor(
              stats.players[1],
              game.currentPlayer,
              game.winner,
              game.isGameOver,
            )}
            onCustomize={() => setSettingsOpen(true)}
          />
        </div>
        <div className="col-span-2 flex min-w-0 flex-col items-center gap-4 lg:col-span-1 lg:col-start-2 lg:row-start-1">
          <GameStatus
            players={stats.players}
            currentPlayer={game.currentPlayer}
            winner={game.winner}
            isDraw={game.isDraw}
            nextStarter={nextStarter}
            isGameOver={game.isGameOver}
          />
          <GameBoard
            game={game}
            icons={icons}
            ready={hydrated}
            onSelect={placeMark}
          />
          <GameControls
            ready={hydrated}
            onNewGame={newGame}
            onResetScoreboard={resetScoreboard}
          />
        </div>
      </section>

      <Scoreboard
        players={stats.players}
        draws={stats.draws}
        totalGames={stats.totalGames}
      />

      {settingsOpen ? (
        <GameSettings
          players={stats.players}
          onRename={renamePlayer}
          onCommitName={commitPlayerName}
          onSelectIcon={selectIcon}
          onClose={closeSettings}
        />
      ) : null}
    </div>
  );
}
