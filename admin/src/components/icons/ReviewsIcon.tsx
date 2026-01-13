import React from 'react';

interface ReviewsIconProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}

const ReviewsIcon: React.FC<ReviewsIconProps> = ({ 
  width = 18, 
  height = 16, 
  color = "#CCCCCC",
  className = ""
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 18 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M3.86457 15.3545C3.5165 15.1105 3.44244 14.7062 3.6424 14.1556L5.16796 9.89647L1.28 7.26853C0.776418 6.93394 0.56906 6.56449 0.709767 6.17413C0.850474 5.79074 1.23557 5.60254 1.85023 5.60951L6.61946 5.63739L8.07096 1.35739C8.26351 0.799739 8.56714 0.5 8.99667 0.5C9.4336 0.5 9.73723 0.799739 9.92237 1.35739L11.3739 5.63739L16.1431 5.60951C16.7578 5.60254 17.1503 5.79074 17.291 6.17413C17.4317 6.56449 17.2169 6.93394 16.7207 7.26853L12.8328 9.89647L14.3509 14.1556C14.5509 14.7062 14.4768 15.1105 14.1362 15.3545C13.7881 15.6055 13.3512 15.5218 12.8476 15.1802L8.99667 12.5174L5.14574 15.1802C4.64216 15.5218 4.21263 15.6055 3.86457 15.3545Z" 
        fill={color}
      />
    </svg>
  );
};

export default ReviewsIcon; 