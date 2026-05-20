import { motion } from 'motion/react';
import { Dice5 } from 'lucide-react';

export default function FloatingDecoration() {
  const floatingDice = [
    { delay: 0, x: '10%', y: '20%', size: 40, rotate: 15 },
    { delay: 2, x: '85%', y: '15%', size: 60, rotate: -20 },
    { delay: 1, x: '5%', y: '75%', size: 50, rotate: 45 },
    { delay: 3, x: '90%', y: '80%', size: 35, rotate: -10 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {floatingDice.map((dice, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.5,
            y: [0, -20, 0],
            rotate: [dice.rotate, dice.rotate + 10, dice.rotate]
          }}
          transition={{ 
            opacity: { duration: 2 },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 7 + i, repeat: Infinity, ease: "easeInOut" },
            delay: dice.delay
          }}
          style={{
            position: 'absolute',
            left: dice.x,
            top: dice.y,
          }}
        >
          <Dice5 size={dice.size} className="text-mystic-gold" />
        </motion.div>
      ))}
    </div>
  );
}
