
import { motion } from 'framer-motion';
import { Trophy, Frown, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

interface GameOverModalProps {
  isSuccess: boolean;
  score: number;
  targetScore: number;
  onRestart: () => void;
  onNextLevel: () => void;
}

export const GameOverModal = ({ isSuccess, score, targetScore, onRestart, onNextLevel }: GameOverModalProps) => {
  const { width, height } = useWindowSize();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      {isSuccess && <ReactConfetti width={width} height={height} recycle={false} />}
      
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex justify-center">
          {isSuccess ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Trophy className="h-10 w-10 text-green-500" />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <Frown className="h-10 w-10 text-red-500" />
            </div>
          )}
        </div>
        
        <h2 className="mb-2 text-center text-2xl font-bold">
          {isSuccess ? 'Level Complete!' : 'Game Over'}
        </h2>
        
        <p className="mb-4 text-center text-gray-600">
          {isSuccess 
            ? 'Congratulations! You reached the target score.' 
            : 'You ran out of moves before reaching the target score.'}
        </p>
        
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-purple-100 p-3 text-center">
            <div className="text-sm text-purple-700">Your Score</div>
            <div className="text-xl font-bold text-purple-900">{score}</div>
          </div>
          <div className="rounded-lg bg-blue-100 p-3 text-center">
            <div className="text-sm text-blue-700">Target</div>
            <div className="text-xl font-bold text-blue-900">{targetScore}</div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onRestart}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          {isSuccess && (
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={onNextLevel}
            >
              Next Level
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};