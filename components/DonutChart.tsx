import React from 'react';

interface DonutChartProps {
  percentage: number;
  colorClass?: string;
  size?: number;
  strokeWidth?: number;
  label?: React.ReactNode;
  showLabel?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({ 
  percentage, 
  colorClass = "text-primary", 
  size = 56, 
  strokeWidth = 4,
  label,
  showLabel = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle 
          className="text-gray-200 dark:text-gray-700" 
          cx={size / 2} 
          cy={size / 2} 
          fill="transparent" 
          r={radius} 
          stroke="currentColor" 
          strokeWidth={strokeWidth}
        />
        <circle 
          className={colorClass} 
          cx={size / 2} 
          cy={size / 2} 
          fill="transparent" 
          r={radius} 
          stroke="currentColor" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          {label ? (
             label
          ) : (
            <span className={`text-xs font-bold ${colorClass}`}>{percentage}%</span>
          )}
        </div>
      )}
    </div>
  );
};