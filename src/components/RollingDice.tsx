import { motion } from 'motion/react';
import { PLANETS, SIGNS, HOUSES } from '../constants';
import { useEffect, useState } from 'react';

interface RollingDiceProps {
  planet: typeof PLANETS[0];
  sign: typeof SIGNS[0];
  house: typeof HOUSES[0];
  isFinished: boolean;
}

const DIE_VARIANTS = {
  rolling: {
    rotate: [0, 90, 180, 270, 360],
    scale: [1, 1.1, 1],
    transition: { duration: 0.5, repeat: Infinity, ease: "linear" }
  },
  finished: {
    rotate: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

export default function RollingDice({ planet, sign, house, isFinished }: RollingDiceProps) {
  const [displaySymbols, setDisplaySymbols] = useState({
    planet: planet.symbol,
    sign: sign.symbol,
    house: house.id
  });

  useEffect(() => {
    if (!isFinished) {
      const interval = setInterval(() => {
        setDisplaySymbols({
          planet: PLANETS[Math.floor(Math.random() * PLANETS.length)].symbol,
          sign: SIGNS[Math.floor(Math.random() * SIGNS.length)].symbol,
          house: HOUSES[Math.floor(Math.random() * HOUSES.length)].id
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplaySymbols({
        planet: planet.symbol,
        sign: sign.symbol,
        house: house.id
      });
    }
  }, [isFinished, planet, sign, house]);

  return (
    <div className="flex items-center justify-center gap-6 py-10">
      {/* Planet Die */}
      <motion.div
        variants={DIE_VARIANTS}
        animate={isFinished ? 'finished' : 'rolling'}
        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-mystic-indigo/20" />
        <span className="text-3xl md:text-4xl text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          {displaySymbols.planet}
        </span>
      </motion.div>

      {/* Sign Die */}
      <motion.div
        variants={DIE_VARIANTS}
        animate={isFinished ? 'finished' : 'rolling'}
        transition={{ delay: 0.1 }}
        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-mystic-gold/10 to-mystic-gold/5 border border-mystic-gold/30 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.2)] backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-mystic-gold/5" />
        <span className="text-3xl md:text-4xl text-mystic-gold relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
          {displaySymbols.sign}
        </span>
      </motion.div>

      {/* House Die */}
      <motion.div
        variants={DIE_VARIANTS}
        animate={isFinished ? 'finished' : 'rolling'}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-mystic-indigo/20" />
        <span className="text-2xl md:text-3xl font-mono text-white relative z-10 font-bold">
          {displaySymbols.house}
        </span>
      </motion.div>
    </div>
  );
}
