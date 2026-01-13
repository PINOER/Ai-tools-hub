import React from 'react';

interface OptionDotsProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const OptionDots: React.FC<OptionDotsProps> = ({ width = 15, height = 5, color = '#CCCCCC' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 13 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="1.5" cy="1.5" r="1.5" fill={color} />
    <circle cx="6.5" cy="1.5" r="1.5" fill={color} />
    <circle cx="11.5" cy="1.5" r="1.5" fill={color} />
  </svg>
);

export default OptionDots; 