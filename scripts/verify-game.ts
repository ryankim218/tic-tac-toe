import assert from "node:assert/strict";
import {
  applyRoundResult,
  createInitialGame,
  findWinningCombination,
  gameReducer,
  isBoardFull,
  WINNING_COMBINATIONS,
} from "../lib/game-logic";
import { createDefaultPlayers } from "../lib/icons";
import { parsePersisted, serializePersisted } from "../lib/storage";
import type { GameState, MatchStats, PlayerId } from "../types/game";

function play(startingPlayer: PlayerId, moves: number[]): GameState {
  return moves.reduce(
    (state, index) => gameReducer(state, { type: "PLACE", index }),
    createInitialGame(startingPlayer),
  );
}

const emptyStats = (): MatchStats => ({
  players: createDefaultPlayers(),
  draws: 0,
  totalGames: 0,
});

assert.equal(WINNING_COMBINATIONS.length, 8);

function combinations<T>(items: T[], size: number): T[][] {
  if (size === 0) {
    return [[]];
  }

  const result: T[][] = [];
  for (let index = 0; index <= items.length - size; index += 1) {
    for (const tail of combinations(items.slice(index + 1), size - 1)) {
      result.push([items[index], ...tail]);
    }
  }
  return result;
}

function findPlayerTwoWinSequence(
  combination: readonly [number, number, number],
): number[] {
  const others = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
    (index) => !combination.includes(index),
  );

  for (const firstThree of combinations(others, 3)) {
    const moves = [
      firstThree[0],
      combination[0],
      firstThree[1],
      combination[1],
      firstThree[2],
      combination[2],
    ];
    const result = play(1, moves);
    if (
      result.winner === 2 &&
      result.winningCombination &&
      result.winningCombination.length === 3
    ) {
      return moves;
    }
  }

  throw new Error(
    `Unable to construct a valid Player 2 win for ${JSON.stringify(combination)}`,
  );
}

for (const combination of WINNING_COMBINATIONS) {
  const others = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
    (index) => !combination.includes(index),
  );
  const playerOneWin = play(1, [
    combination[0],
    others[0],
    combination[1],
    others[1],
    combination[2],
  ]);
  assert.equal(playerOneWin.winner, 1);
  assert.deepEqual(playerOneWin.winningCombination, [...combination]);
  assert.equal(playerOneWin.isDraw, false);
  assert.equal(playerOneWin.isGameOver, true);

  const playerTwoWin = play(1, findPlayerTwoWinSequence(combination));
  assert.equal(playerTwoWin.winner, 2);
  assert.deepEqual(playerTwoWin.winningCombination, [...combination]);
}

const draw = play(1, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
assert.equal(draw.isDraw, true);
assert.equal(draw.winner, null);
assert.equal(draw.isGameOver, true);
assert.equal(isBoardFull(draw.board), true);
assert.equal(findWinningCombination(draw.board), null);

const occupied = play(1, [0]);
assert.equal(gameReducer(occupied, { type: "PLACE", index: 0 }), occupied);
assert.equal(gameReducer(draw, { type: "PLACE", index: 8 }), draw);
assert.equal(gameReducer(occupied, { type: "PLACE", index: -1 }), occupied);
assert.equal(gameReducer(occupied, { type: "PLACE", index: 1.5 }), occupied);

const continued = gameReducer(occupied, { type: "PLACE", index: 4 });
assert.equal(continued.currentPlayer, 1);
assert.equal(continued.board[4], 2);

const scored = applyRoundResult(emptyStats(), playerOneSample());
assert.equal(scored.players[0].score, 1);
assert.equal(scored.players[1].score, 0);
assert.equal(scored.draws, 0);
assert.equal(scored.totalGames, 1);
assert.equal(applyRoundResult(scored, createInitialGame()), scored);

const drawn = applyRoundResult(emptyStats(), draw);
assert.equal(drawn.draws, 1);
assert.equal(drawn.totalGames, 1);
assert.equal(drawn.players[0].score, 0);

const fresh = gameReducer(draw, { type: "NEW_ROUND", startingPlayer: 2 });
assert.equal(fresh.currentPlayer, 2);
assert.equal(fresh.isGameOver, false);
assert.ok(fresh.board.every((cell) => cell === null));

const saved = serializePersisted({
  players: [
    { id: 1, name: "  Ember  ", icon: "🐉", score: 2 },
    { id: 2, name: "Glacier", icon: "💎", score: 1 },
  ],
  draws: 3,
  totalGames: 9,
});
const loaded = parsePersisted(saved);
assert.ok(loaded);
assert.equal(loaded.players[0].name, "Ember");
assert.equal(loaded.players[0].icon, "🐉");
assert.equal(loaded.players[1].score, 1);
assert.equal(loaded.draws, 3);
assert.equal(loaded.totalGames, 6);

assert.equal(parsePersisted("not-json"), null);
assert.equal(parsePersisted(null), null);

const duplicate = parsePersisted(
  JSON.stringify({
    version: 1,
    players: [
      { id: 1, name: "", icon: "🔥", score: -4 },
      { id: 2, name: "Ice", icon: "🔥", score: 1 },
    ],
    draws: 2,
    totalGames: 100,
  }),
);
assert.ok(duplicate);
assert.equal(duplicate.players[0].name, "Player 1");
assert.equal(duplicate.players[0].icon, "🔥");
assert.equal(duplicate.players[1].icon, "❄️");
assert.equal(duplicate.players[0].score, 0);
assert.equal(duplicate.totalGames, 3);

function playerOneSample(): GameState {
  return play(1, [0, 3, 1, 4, 2]);
}

console.log("Game rules and storage checks passed.");
