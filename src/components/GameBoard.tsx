
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CandyItem } from '@/types/game';
import { Candy } from './Candy';
import useSound from 'use-sound';

interface GameBoardProps {
  board: CandyItem[][];
  onSwap: (row1: number, col1: number, row2: number, col2: number) => void;
  isInteractive: boolean;
}

export const GameBoard = ({ board, onSwap, isInteractive }: GameBoardProps) => {
  const [selectedCandy, setSelectedCandy] = useState<{ row: number; col: number } | null>(null);
  const [playSwapSound] = useSound('/sounds/swap.mp3', { volume: 0.5 });
  const [playInvalidSound] = useSound('/sounds/invalid.mp3', { volume: 0.3 });

  const handleCandyClick = (row: number, col: number) => {
    if (!isInteractive) return;
    
    if (selectedCandy) {
      // Check if the clicked candy is adjacent to the selected one
      const isAdjacent = 
        (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) || 
        (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row);
      
      if (isAdjacent) {
        playSwapSound();
        onSwap(selectedCandy.row, selectedCandy.col, row, col);
      } else {
        playInvalidSound();
      }
      
      setSelectedCandy(null);
    } else {
      setSelectedCandy({ row, col });
    }
  };

  return (
    <div className="relative mx-auto rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 p-4 shadow-xl">
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${board.length}, minmax(0, 1fr))`
        }}
      >
        <AnimatePresence>
          {board.map((row, rowIndex) => 
            row.map((candy, colIndex) => (
              <motion.div
                key={candy.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative aspect-square ${
                  selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex
                    ? 'ring-4 ring-white ring-opacity-70'
                    : ''
                }`}
                onClick={() => handleCandyClick(rowIndex, colIndex)}
              >
                <Candy candy={candy} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};