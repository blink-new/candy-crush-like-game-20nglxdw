
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-5xl font-bold text-white">Candy Crush</h1>
        <p className="text-lg text-white text-opacity-90">Match candies to score points!</p>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12 grid grid-cols-3 gap-4"
      >
        {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map((color, index) => (
          <motion.div
            key={color}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: 'loop', 
              duration: 2, 
              delay: index * 0.2,
              ease: 'easeInOut'
            }}
            className={`h-16 w-16 rounded-full bg-gradient-to-br shadow-lg
              ${color === 'red' ? 'from-red-400 to-red-600' : ''}
              ${color === 'blue' ? 'from-blue-400 to-blue-600' : ''}
              ${color === 'green' ? 'from-green-400 to-green-600' : ''}
              ${color === 'yellow' ? 'from-yellow-300 to-yellow-500' : ''}
              ${color === 'purple' ? 'from-purple-400 to-purple-600' : ''}
              ${color === 'orange' ? 'from-orange-400 to-orange-600' : ''}
            `}
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-20" />
            <div className="absolute inset-1 rounded-full bg-white opacity-30" />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={onStart}
          className="bg-white px-8 py-6 text-lg font-bold text-purple-600 hover:bg-white hover:text-purple-700"
        >
          <Play className="mr-2 h-5 w-5" />
          Start Game
        </Button>
      </motion.div>
    </motion.div>
  );
};