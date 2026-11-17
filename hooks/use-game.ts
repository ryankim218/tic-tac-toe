"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  applyRoundResult,
  createInitialGame,
  gameReducer,
  oppositePlayer,
} from "@/lib/game-logic";
import { DEFAULT_NAMES, isSymbol } from "@/lib/icons";
import {
  createDefaultStats,
  loadPersisted,
  savePersisted,
} from "@/lib/storage";
import type { GameState, MatchStats, PlayerId } from "@/types/game";

const NAME_LIMIT = 18;

function subscribeToHydration() {
  return () => {};
}

function getClientSnapshot() {
  return typeof window !== "undefined";
}

function getServerSnapshot() {
  return false;
}

export function useGame() {
  const [game, dispatch] = useReducer(gameReducer, 1, createInitialGame);
  const [stats, setStats] = useState<MatchStats>(
    () => loadPersisted() ?? createDefaultStats(),
  );
  const [nextStarter, setNextStarter] = useState<PlayerId>(2);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );

  const gameRef = useRef<GameState>(game);
  const nextStarterRef = useRef<PlayerId>(2);
  const scoredRef = useRef(false);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    savePersisted(stats);
  }, [hydrated, stats]);

  const placeMark = useCallback(
    (index: number) => {
      if (!hydrated) {
        return;
      }

      const current = gameRef.current;
      const next = gameReducer(current, { type: "PLACE", index });
      if (next === current) {
        return;
      }

      gameRef.current = next;
      dispatch({ type: "PLACE", index });

      if (next.isGameOver && !scoredRef.current) {
        scoredRef.current = true;
        setStats((currentStats) => applyRoundResult(currentStats, next));
      }
    },
    [hydrated],
  );

  const startRound = useCallback(
    (startingPlayer: PlayerId, followingPlayer: PlayerId) => {
      scoredRef.current = false;
      nextStarterRef.current = followingPlayer;
      setNextStarter(followingPlayer);
      gameRef.current = createInitialGame(startingPlayer);
      dispatch({ type: "NEW_ROUND", startingPlayer });
    },
    [],
  );

  const newGame = useCallback(() => {
    if (!hydrated) {
      return;
    }
    const startingPlayer = nextStarterRef.current;
    startRound(startingPlayer, oppositePlayer(startingPlayer));
  }, [hydrated, startRound]);

  const resetScoreboard = useCallback(() => {
    if (!hydrated) {
      return;
    }
    setStats((current) => ({
      players: [
        { ...current.players[0], score: 0 },
        { ...current.players[1], score: 0 },
      ],
      draws: 0,
      totalGames: 0,
    }));
    startRound(1, 2);
  }, [hydrated, startRound]);

  const renamePlayer = useCallback((id: PlayerId, name: string) => {
    const nextName = name.replace(/[\r\n\t]+/g, " ").slice(0, NAME_LIMIT);
    setStats((current) => {
      const players = [...current.players] as MatchStats["players"];
      const index = id === 1 ? 0 : 1;
      players[index] = { ...players[index], name: nextName };
      return { ...current, players };
    });
  }, []);

  const commitPlayerName = useCallback((id: PlayerId) => {
    setStats((current) => {
      const players = [...current.players] as MatchStats["players"];
      const index = id === 1 ? 0 : 1;
      const trimmed = players[index].name.trim().slice(0, NAME_LIMIT);
      players[index] = {
        ...players[index],
        name: trimmed || DEFAULT_NAMES[id],
      };
      return { ...current, players };
    });
  }, []);

  const selectIcon = useCallback((id: PlayerId, icon: string) => {
    if (!isSymbol(icon)) {
      return;
    }
    setStats((current) => {
      const otherIcon =
        id === 1 ? current.players[1].icon : current.players[0].icon;
      if (icon === otherIcon) {
        return current;
      }
      const players = [...current.players] as MatchStats["players"];
      const index = id === 1 ? 0 : 1;
      players[index] = { ...players[index], icon };
      return { ...current, players };
    });
  }, []);

  return {
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
  };
}
