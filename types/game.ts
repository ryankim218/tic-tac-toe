export type PlayerId = 1 | 2;

export type Mark = PlayerId | null;

export type Player = {
  id: PlayerId;
  name: string;
  icon: string;
  score: number;
};

export type GameState = {
  board: Mark[];
  currentPlayer: PlayerId;
  winner: PlayerId | null;
  isDraw: boolean;
  winningCombination: number[] | null;
  isGameOver: boolean;
};

export type MatchStats = {
  players: [Player, Player];
  draws: number;
  totalGames: number;
};

export type GameAction =
  | { type: "PLACE"; index: number }
  | { type: "NEW_ROUND"; startingPlayer: PlayerId };
