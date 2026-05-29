import React, { useEffect, useState } from 'react';
import './Sakura.css';

const Sakura = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    let currentCount = -1;

    const handleResize = () => {
      const width = window.innerWidth;
      // Progressive reduction based on screen width
      let petalCount = 20;
      if (width <= 480) petalCount = 4;
      else if (width <= 768) petalCount = 8;
      else if (width <= 1024) petalCount = 12;

      // Only update if count changed to avoid unnecessary re-renders
      if (currentCount !== petalCount) {
        currentCount = petalCount;
        const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 5,
          animationDuration: 10 + Math.random() * 10,
          swayDuration: 3 + Math.random() * 4, /* Unique sway duration 3s to 7s */
          size: Math.random() * 0.5 + 0.5,
          shapeClass: `sakura-shape-${Math.floor(Math.random() * 4) + 1}`
        }));
        setPetals(newPetals);
      }
    };

    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="sakura-container">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`sakura-petal ${petal.shapeClass}`}
          style={{
            left: `${petal.left}vw`,
            animationDelay: `${petal.animationDelay}s, ${petal.animationDelay}s`, /* delay for both fall and sway */
            animationDuration: `${petal.animationDuration}s, ${petal.swayDuration}s`, /* fall duration, sway duration */
            transform: `scale(${petal.size})`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Sakura;
