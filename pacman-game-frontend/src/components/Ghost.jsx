import React from 'react';

const Ghost = ({ position, powerMode, powerEnding, eaten, frozen }) => {
  const left = position.pixel ? position.pixel.x : position.x * 20;
  const top = position.pixel ? position.pixel.y : position.y * 20;

  if (eaten) {
    return (
      <div
        className="ghost eyes-only"
        style={{ left: `${left}px`, top: `${top}px` }}
        aria-hidden="true"
      >
        <span className="ghost-eye" />
        <span className="ghost-eye" />
      </div>
    );
  }

  const scared = powerMode;
  const className = [
    'ghost',
    scared ? 'scared' : '',
    scared && powerEnding ? 'scared-ending' : '',
    frozen ? 'frozen' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        backgroundColor: scared ? undefined : position.color,
      }}
      aria-label={position.name || 'ghost'}
    >
      <span className="ghost-eye" />
      <span className="ghost-eye" />
      <span className="ghost-skirt" />
    </div>
  );
};

export default Ghost;
