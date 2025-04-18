
import { useState, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { ScorePanel } from '@/components/ScorePanel';
import { GameOverModal } from '@/components/GameOverModal';
import { StartScreen } from '@/components/StartScreen';
import { GameState } from '@/types/game';
import { 
  createBoard, 
  findMatches, 
  isValidMove, 
  swapCandies, 
  removeMatches, 
  activateSpecialCandy,
  calculateScore,
  getLevelData
} from '@/lib/game-utils';
import useSound from 'use-sound';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    score: 0,
    level: 1,
    moves: 0,
    targetScore: 0,
    maxMoves: 0,
    gameStatus: 'idle'
  });
  
  const [playMatchSound] = useSound('/sounds/match.mp3', { volume: 0.5 });
  const [playLevelUpSound] = useSound('/sounds/level-up.mp3', { volume: 0.7 });
  const [playGameOverSound] = useSound('/sounds/game-over.mp3', { volume: 0.7 });
  const [playSpecialSound] = useSound('/sounds/special.mp3', { volume: 0.6 });

  // Initialize game
  const initGame = (level: number) => {
    const { targetScore, maxMoves, rows, cols } = getLevelData(level);
    
    setGameState({
      board: createBoard(rows, cols),
      score: 0,
      level,
      moves: 0,
      targetScore,
      maxMoves,
      gameStatus: 'playing'
    });
  };

  // Start game
  const handleStartGame = () => {
    initGame(1);
  };

  // Restart current level
  const handleRestartLevel = () => {
    initGame(gameState.level);
  };

  // Proceed to next level
  const handleNextLevel = () => {
    initGame(gameState.level + 1);
    playLevelUpSound();
  };

  // Handle candy swap
  const handleSwap = async (row1: number, col1: number, row2: number, col2: number) => {
    // Check if the move is valid
    if (!isValidMove(gameState.board, row1, col1, row2, col2)) {
      // Swap back immediately if invalid
      return;
    }
    
    // Update moves count
    const newMoves = gameState.moves + 1;
    
    // Swap candies
    const newBoard = swapCandies(gameState.board, row1, col1, row2, col2);
    
    // Update board with swapped candies
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      moves: newMoves
    }));
    
    // Process matches after a short delay
    setTimeout(() => {
      processMatches(newBoard, newMoves);
    }, 300);
  };

  // Process matches after a move
  const processMatches = (board: typeof gameState.board, moves: number) => {
    // Find matches
    const { matched, specialCandy } = findMatches(board);
    
    if (matched.length > 0) {
      playMatchSound();
      
      // Calculate score
      const matchScore = calculateScore(matched.length, false);
      const newScore = gameState.score + matchScore;
      
      // Remove matches and update board
      const updatedBoard = removeMatches(board, matched, specialCandy);
      
      // Update game state
      setGameState(prev => ({
        ...prev,
        board: updatedBoard,
        score: newScore,
        moves
      }));
      
      // Check for cascading matches after a short delay
      setTimeout(() => {
        checkForCascadingMatches(updatedBoard, moves);
      }, 500);
    } else {
      // Check if game is over
      checkGameStatus(moves);
    }
  };

  // Check for cascading matches
  const checkForCascadingMatches = (board: typeof gameState.board, moves: number) => {
    const { matched } = findMatches(board);
    
    if (matched.length > 0) {
      // Process cascading matches
      processMatches(board, moves);
    } else {
      // Check if game is over
      checkGameStatus(moves);
    }
  };

  // Handle special candy activation
  const activateSpecial = (row: number, col: number) => {
    const candy = gameState.board[row][col];
    
    if (candy && candy.isSpecial) {
      playSpecialSound();
      
      const { newBoard, affected } = activateSpecialCandy(gameState.board, row, col);
      
      // Calculate score
      const specialScore = calculateScore(affected.length, true);
      const newScore = gameState.score + specialScore;
      
      // Update game state
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        score: newScore
      }));
      
      // Check for cascading matches after a short delay
      setTimeout(() => {
        checkForCascadingMatches(newBoard, gameState.moves);
      }, 500);
    }
  };

  // Check if game is over or level is complete
  const checkGameStatus = (moves: number) => {
    if (gameState.score >= gameState.targetScore) {
      // Level complete
      setGameState(prev => ({
        ...prev,
        gameStatus: 'levelComplete'
      }));
      playLevelUpSound();
    } else if (moves >= gameState.maxMoves) {
      // Game over
      setGameState(prev => ({
        ...prev,
        gameStatus: 'gameOver'
      }));
      playGameOverSound();
    }
  };

  // Render different screens based on game status
  if (gameState.gameStatus === 'idle') {
    return <StartScreen onStart={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4 pt-8">
      <div className="mx-auto max-w-md">
        <ScorePanel 
          score={gameState.score}
          targetScore={gameState.targetScore}
          level={gameState.level}
          moves={gameState.moves}
          maxMoves={gameState.maxMoves}
          onRestart={handleRestartLevel}
        />
        
        <GameBoard 
          board={gameState.board}
          onSwap={handleSwap}
          isInteractive={gameState.gameStatus === 'playing'}
        />
        
        {(gameState.gameStatus === 'levelComplete' || gameState.gameStatus === 'gameOver') && (
          <GameOverModal 
            isSuccess={gameState.gameStatus === 'levelComplete'}
            score={gameState.score}
            targetScore={gameState.targetScore}
            onRestart={handleRestartLevel}
            onNextLevel={handleNextLevel}
          />
        )}
      </div>
    </div>
  );
}

export default App;