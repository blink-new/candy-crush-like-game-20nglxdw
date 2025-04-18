
export type CandyType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface CandyItem {
  id: string;
  type: CandyType;
  isSpecial?: boolean;
  specialType?: 'row' | 'column' | 'bomb';
}

export interface GameState {
  board: CandyItem[][];
  score: number;
  level: number;
  moves: number;
  targetScore: number;
  maxMoves: number;
  gameStatus: 'idle' | 'playing' | 'levelComplete' | 'gameOver';
}