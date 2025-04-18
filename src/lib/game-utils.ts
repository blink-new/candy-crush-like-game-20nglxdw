
import { CandyItem, CandyType } from '@/types/game';

// Generate a random candy type
export const getRandomCandyType = (): CandyType => {
  const candyTypes: CandyType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  return candyTypes[Math.floor(Math.random() * candyTypes.length)];
};

// Generate a unique ID for each candy
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a new candy item
export const createCandy = (type?: CandyType, isSpecial = false, specialType?: 'row' | 'column' | 'bomb'): CandyItem => {
  return {
    id: generateId(),
    type: type || getRandomCandyType(),
    isSpecial,
    specialType,
  };
};

// Initialize a new game board
export const createBoard = (rows: number, cols: number): CandyItem[][] => {
  const board: CandyItem[][] = [];
  
  for (let i = 0; i < rows; i++) {
    const row: CandyItem[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(createCandy());
    }
    board.push(row);
  }
  
  // Remove any initial matches
  let hasMatches = true;
  while (hasMatches) {
    hasMatches = false;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Check horizontal matches
        if (j > 1 && 
            board[i][j].type === board[i][j-1].type && 
            board[i][j].type === board[i][j-2].type) {
          board[i][j] = createCandy();
          hasMatches = true;
        }
        
        // Check vertical matches
        if (i > 1 && 
            board[i][j].type === board[i-1][j].type && 
            board[i][j].type === board[i-2][j].type) {
          board[i][j] = createCandy();
          hasMatches = true;
        }
      }
    }
  }
  
  return board;
};

// Check for matches in the board
export const findMatches = (board: CandyItem[][]): { matched: [number, number][]; specialCandy: { position: [number, number]; type: 'row' | 'column' | 'bomb' } | null } => {
  const rows = board.length;
  const cols = board[0].length;
  const matched: [number, number][] = [];
  let specialCandy: { position: [number, number]; type: 'row' | 'column' | 'bomb' } | null = null;
  
  // Check horizontal matches
  for (let i = 0; i < rows; i++) {
    let matchCount = 1;
    let currentType = board[i][0].type;
    
    for (let j = 1; j < cols; j++) {
      if (board[i][j].type === currentType) {
        matchCount++;
      } else {
        if (matchCount >= 3) {
          // Add all matched positions
          for (let k = j - matchCount; k < j; k++) {
            matched.push([i, k]);
          }
          
          // Create special candy for matches of 4 or 5
          if (matchCount === 4 && !specialCandy) {
            specialCandy = {
              position: [i, j - 2], // Middle of the match
              type: 'row'
            };
          } else if (matchCount >= 5 && !specialCandy) {
            specialCandy = {
              position: [i, j - 3], // Middle of the match
              type: 'bomb'
            };
          }
        }
        
        matchCount = 1;
        currentType = board[i][j].type;
      }
    }
    
    // Check for match at the end of row
    if (matchCount >= 3) {
      for (let k = cols - matchCount; k < cols; k++) {
        matched.push([i, k]);
      }
      
      // Create special candy for matches of 4 or 5
      if (matchCount === 4 && !specialCandy) {
        specialCandy = {
          position: [i, cols - 2], // Middle of the match
          type: 'row'
        };
      } else if (matchCount >= 5 && !specialCandy) {
        specialCandy = {
          position: [i, cols - 3], // Middle of the match
          type: 'bomb'
        };
      }
    }
  }
  
  // Check vertical matches
  for (let j = 0; j < cols; j++) {
    let matchCount = 1;
    let currentType = board[0][j].type;
    
    for (let i = 1; i < rows; i++) {
      if (board[i][j].type === currentType) {
        matchCount++;
      } else {
        if (matchCount >= 3) {
          // Add all matched positions
          for (let k = i - matchCount; k < i; k++) {
            matched.push([k, j]);
          }
          
          // Create special candy for matches of 4 or 5
          if (matchCount === 4 && !specialCandy) {
            specialCandy = {
              position: [i - 2, j], // Middle of the match
              type: 'column'
            };
          } else if (matchCount >= 5 && !specialCandy) {
            specialCandy = {
              position: [i - 3, j], // Middle of the match
              type: 'bomb'
            };
          }
        }
        
        matchCount = 1;
        currentType = board[i][j].type;
      }
    }
    
    // Check for match at the end of column
    if (matchCount >= 3) {
      for (let k = rows - matchCount; k < rows; k++) {
        matched.push([k, j]);
      }
      
      // Create special candy for matches of 4 or 5
      if (matchCount === 4 && !specialCandy) {
        specialCandy = {
          position: [rows - 2, j], // Middle of the match
          type: 'column'
        };
      } else if (matchCount >= 5 && !specialCandy) {
        specialCandy = {
          position: [rows - 3, j], // Middle of the match
          type: 'bomb'
        };
      }
    }
  }
  
  // Remove duplicates
  const uniqueMatched: [number, number][] = [];
  const matchedSet = new Set<string>();
  
  for (const [row, col] of matched) {
    const key = `${row},${col}`;
    if (!matchedSet.has(key)) {
      matchedSet.add(key);
      uniqueMatched.push([row, col]);
    }
  }
  
  return { matched: uniqueMatched, specialCandy };
};

// Check if a move is valid (adjacent and results in a match)
export const isValidMove = (board: CandyItem[][], row1: number, col1: number, row2: number, col2: number): boolean => {
  // Check if positions are adjacent
  const isAdjacent = 
    (Math.abs(row1 - row2) === 1 && col1 === col2) || 
    (Math.abs(col1 - col2) === 1 && row1 === row2);
  
  if (!isAdjacent) return false;
  
  // Make a copy of the board
  const newBoard = JSON.parse(JSON.stringify(board));
  
  // Swap candies
  [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
  
  // Check if the swap creates a match
  const { matched } = findMatches(newBoard);
  
  return matched.length > 0;
};

// Swap two candies on the board
export const swapCandies = (board: CandyItem[][], row1: number, col1: number, row2: number, col2: number): CandyItem[][] => {
  const newBoard = JSON.parse(JSON.stringify(board));
  [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
  return newBoard;
};

// Remove matched candies and update the board
export const removeMatches = (board: CandyItem[][], matched: [number, number][], specialCandy: { position: [number, number]; type: 'row' | 'column' | 'bomb' } | null): CandyItem[][] => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
  
  // Remove matched candies
  for (const [row, col] of matched) {
    newBoard[row][col] = null;
  }
  
  // Create special candy if needed
  if (specialCandy) {
    const [row, col] = specialCandy.position;
    if (newBoard[row] && newBoard[row][col] === null) {
      newBoard[row][col] = createCandy(getRandomCandyType(), true, specialCandy.type);
    }
  }
  
  // Move candies down to fill empty spaces
  for (let j = 0; j < cols; j++) {
    let emptySpaces = 0;
    
    for (let i = rows - 1; i >= 0; i--) {
      if (newBoard[i][j] === null) {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        newBoard[i + emptySpaces][j] = newBoard[i][j];
        newBoard[i][j] = null;
      }
    }
    
    // Fill the top with new candies
    for (let i = 0; i < rows; i++) {
      if (newBoard[i][j] === null) {
        newBoard[i][j] = createCandy();
      }
    }
  }
  
  return newBoard;
};

// Activate special candy effects
export const activateSpecialCandy = (board: CandyItem[][], row: number, col: number): { newBoard: CandyItem[][], affected: [number, number][] } => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
  const affected: [number, number][] = [];
  
  const candy = newBoard[row][col];
  
  if (!candy || !candy.isSpecial) return { newBoard, affected: [] };
  
  switch (candy.specialType) {
    case 'row':
      // Clear entire row
      for (let j = 0; j < cols; j++) {
        if (newBoard[row][j]) {
          affected.push([row, j]);
          newBoard[row][j] = null;
        }
      }
      break;
      
    case 'column':
      // Clear entire column
      for (let i = 0; i < rows; i++) {
        if (newBoard[i][col]) {
          affected.push([i, col]);
          newBoard[i][col] = null;
        }
      }
      break;
      
    case 'bomb':
      // Clear 3x3 area around the candy
      for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
          if (newBoard[i][j]) {
            affected.push([i, j]);
            newBoard[i][j] = null;
          }
        }
      }
      break;
  }
  
  return { newBoard, affected };
};

// Calculate score based on matches
export const calculateScore = (matches: number, specialCandyUsed: boolean): number => {
  let baseScore = matches * 10;
  
  if (specialCandyUsed) {
    baseScore *= 2;
  }
  
  return baseScore;
};

// Get level data based on level number
export const getLevelData = (level: number): { targetScore: number; maxMoves: number; rows: number; cols: number } => {
  // Increase difficulty with each level
  const baseTargetScore = 1000;
  const baseMaxMoves = 15;
  
  return {
    targetScore: baseTargetScore + (level - 1) * 500,
    maxMoves: baseMaxMoves + Math.floor(level / 3),
    rows: Math.min(8, 6 + Math.floor(level / 5)),
    cols: Math.min(8, 6 + Math.floor(level / 5))
  };
};