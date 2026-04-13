import React from 'react';

export function BrandLogo() {
  return (
    <div className="k2c-brand-logo">
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x={3}  y={3}  width={7} height={7} rx={1.5} />
        <rect x={14} y={3}  width={7} height={4} rx={1.5} />
        <rect x={14} y={10} width={7} height={7} rx={1.5} />
        <rect x={3}  y={13} width={7} height={7} rx={1.5} />
      </svg>
    </div>
  );
}
