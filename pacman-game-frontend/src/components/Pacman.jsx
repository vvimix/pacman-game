import React, { useState, useEffect } from 'react';

const Pacman = ({ position, direction, powerMode, powerEnding, hidden, dying, color, playerLabel }) => {
  const [mouthOpen, setMouthOpen] = useState(true);

  useEffect(() => {
    if (dying) return undefined;
    const mouthInterval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 160);
    return () => clearInterval(mouthInterval);
  }, [dying]);

  if (hidden) return null;

  let rotation = 0;
  switch (direction) {
    case 'up':
      rotation = -90;
      break;
    case 'down':
      rotation = 90;
      break;
    case 'left':
      rotation = 180;
      break;
    default:
      rotation = 0;
  }

  const className = [
    'pacman',
    dying || mouthOpen ? 'mouth-open' : 'mouth-closed',
    powerMode && !dying ? 'powered' : '',
    powerEnding && !dying ? 'power-flash' : '',
    dying ? 'dying' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      title={playerLabel}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: dying ? undefined : `rotate(${rotation}deg)`,
        backgroundColor: color,
      }}
    />
  );
};

export default Pacman;
