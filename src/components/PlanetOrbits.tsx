import { motion } from 'motion/react';
import { PLANETS } from '../constants';

export default function PlanetOrbits() {
  // We exclude the sun as it will be the center star
  const orbitingBodies = PLANETS.filter(p => p.id !== 'sun');

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-mystic-gold/5 blur-[50px] rounded-full animate-pulse" />
      
      {/* Central Sun / Star */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
          boxShadow: [
            "0 0 20px #d4af37",
            "0 0 40px #d4af37",
            "0 0 20px #d4af37"
          ]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-6 h-6 bg-mystic-gold rounded-full border border-white/40 z-10 flex items-center justify-center text-[10px] text-mystic-black font-bold"
      >
        ☉
      </motion.div>

      {orbitingBodies.map((planet, index) => {
        // Distribute orbits evenly
        const orbitSize = 60 + (index * 20); // Starting from 60px, 20px apart
        const rotationDuration = 10 + (index * 5); // Each orbit slower than previous
        const isClockwise = index % 2 === 0;

        return (
          <motion.div 
            key={planet.id}
            animate={{ rotate: isClockwise ? 360 : -360 }}
            transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: orbitSize, 
              height: orbitSize,
            }}
            className="absolute border-[0.5px] border-white/5 rounded-full pointer-events-none"
          >
            <div 
              style={{ 
                backgroundColor: planet.color,
                boxShadow: `0 0 10px ${planet.color}80`
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full flex items-center justify-center border border-white/20"
            >
              <span className="text-[7px] text-white font-bold opacity-80">{planet.symbol}</span>
            </div>
          </motion.div>
        );
      })}
      
      {/* Vertical & Horizontal Axis Lines for better mystic look */}
      <div className="absolute h-full w-[0.5px] bg-gradient-to-b from-transparent via-mystic-gold/5 to-transparent pointer-events-none" />
      <div className="absolute w-full h-[0.5px] bg-gradient-to-r from-transparent via-mystic-gold/5 to-transparent pointer-events-none" />
    </div>
  );
}
