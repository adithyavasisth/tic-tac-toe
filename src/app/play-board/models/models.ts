export interface Player {
  name?: string;
  tiles: number[];
}

export interface Tile {
  color: string;
  tileNum: number;
  tileClass: string[];
}

export enum PlayerChance {
  ONE = 1,
  TWO = 2,
}

export enum GameResults {
  ONE = 1,
  TWO = 2,
  TIED = 'tied',
}

export const WinPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
