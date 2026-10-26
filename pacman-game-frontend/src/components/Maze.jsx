import React from 'react';

const Maze = ({ layout }) => {
  return (
    <div className="maze">
      {layout.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell, x) => {
            let cellClass = 'empty';
            if (cell === 1) cellClass = 'wall';
            else if (cell === 2) cellClass = 'dot-cell';
            else if (cell === 3) cellClass = 'power-dot-cell';

            return (
              <div key={`${x}-${y}`} className={`cell ${cellClass}`}>
                {cell === 2 && <div className="dot" />}
                {cell === 3 && <div className="power-dot" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Maze;
