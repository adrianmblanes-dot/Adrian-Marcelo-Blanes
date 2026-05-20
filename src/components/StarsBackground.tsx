import { useEffect, useState } from 'react';

export default function StarsBackground() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const starCount = 180;
    const newStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3,
      isGold: Math.random() > 0.85
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_70%)]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.isGold ? '#d4af37' : 'white',
            boxShadow: star.isGold ? '0 0 4px #d4af37' : 'none',
            opacity: star.opacity,
            // @ts-ignore
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
