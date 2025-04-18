
import { motion } from 'framer-motion';
import { CandyItem } from '@/types/game';

interface CandyProps {
  candy: CandyItem;
}

export const Candy = ({ candy }: CandyProps) => {
  const candyColors = {
    red: 'bg-gradient-to-br from-red-400 to-red-600',
    blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
    green: 'bg-gradient-to-br from-green-400 to-green-600',
    yellow: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600',
  };

  const specialIndicators = {
    row: '⭐',
    column: '⭐',
    bomb: '💣',
  };

  return (
    <motion.div
      className={`${candyColors[candy.type]} flex h-full w-full items-center justify-center rounded-full shadow-md`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {candy.isSpecial && (
        <div className="absolute inset-0 flex items-center justify-center text-xl text-white">
          {specialIndicators[candy.specialType]}
        </div>
      )}
      <div className="absolute inset-0 rounded-full bg-white opacity-20" />
      <div className="absolute inset-1 rounded-full bg-white opacity-30" />
    </motion.div>
  );
};