
import { motion } from 'framer-motion';
import { Star, Target, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScorePanelProps {
  score: number;
  targetScore: number;
  level: number;
  moves: number;
  maxMoves: number;
  onRestart: () => void;
}

export const ScorePanel = ({ score, targetScore, level, moves, maxMoves, onRestart }: ScorePanelProps) => {
  const progressPercentage = Math.min(100, (score / targetScore) * 100);

  return (
    <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-bold">Level {level}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRestart}
          className="text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restart</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-purple-100 p-3">
          <div className="text-sm text-purple-700">Score</div>
          <div className="text-2xl font-bold text-purple-900">{score}</div>
        </div>
        <div className="rounded-lg bg-blue-100 p-3">
          <div className="text-sm text-blue-700">Moves</div>
          <div className="text-2xl font-bold text-blue-900">{moves}/{maxMoves}</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>Target: {targetScore}</span>
          </div>
          <div className="text-sm font-medium">{Math.round(progressPercentage)}%</div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};