import type {
  GameAction,
  GameState,
  Mark,
  MatchStats,
  Player,
  PlayerId,
} from "@/types/game";

export const WINNING_COMBINATIONS: readonly (readonly [
  number,
  number,
  number,
])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createInitialGame(startingPlayer: PlayerId = 1): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: startingPlayer,
    winner: null,
    isDraw: false,
    winningCombination: null,
    isGameOver: false,
  };
}

export function oppositePlayer(player: PlayerId): PlayerId {
  return player === 1 ? 2 : 1;
}

export function findWinningCombination(
  board: readonly Mark[],
): number[] | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export function isBoardFull(board: readonly Mark[]): boolean {
  return board.every((cell) => cell !== null);
}

function isCellIndex(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < 9;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLACE": {
      if (
        state.isGameOver ||
        !isCellIndex(action.index) ||
        state.board[action.index] !== null
      ) {
        return state;
      }

      const board = [...state.board];
      board[action.index] = state.currentPlayer;
      const winningCombination = findWinningCombination(board);

      if (winningCombination) {
        return {
          board,
          currentPlayer: state.currentPlayer,
          winner: state.currentPlayer,
          isDraw: false,
          winningCombination,
          isGameOver: true,
        };
      }

      if (isBoardFull(board)) {
        return {
          board,
          currentPlayer: state.currentPlayer,
          winner: null,
          isDraw: true,
          winningCombination: null,
          isGameOver: true,
        };
      }

      return {
        board,
        currentPlayer: oppositePlayer(state.currentPlayer),
        winner: null,
        isDraw: false,
        winningCombination: null,
        isGameOver: false,
      };
    }
    case "NEW_ROUND":
      return createInitialGame(action.startingPlayer);
    default:
      return state;
  }
}

export function applyRoundResult(
  stats: MatchStats,
  game: GameState,
): MatchStats {
  if (!game.isGameOver) {
    return stats;
  }

  const [first, second] = stats.players;
  const players: [Player, Player] = [
    game.winner === 1 ? { ...first, score: first.score + 1 } : first,
    game.winner === 2 ? { ...second, score: second.score + 1 } : second,
  ];

  return {
    players,
    draws: stats.draws + (game.isDraw ? 1 : 0),
    totalGames: stats.totalGames + 1,
  };
}
