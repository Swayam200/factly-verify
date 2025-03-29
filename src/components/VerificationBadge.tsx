
import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResultStatus } from '@/context/FactCheckContext';

interface VerificationBadgeProps {
  status: ResultStatus;
  confidenceScore: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  confidenceScore,
  size = 'md',
  animate = false,
  className
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-lg'
  };
  
  // Icon size mappings - adjusted smaller to prevent clipping
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 28
  };
  
  // Status-specific styles
  const statusClasses = {
    true: 'border-result-true bg-result-true/10 text-result-true',
    false: 'border-result-false bg-result-false/10 text-result-false',
    neutral: 'border-result-neutral bg-result-neutral/10 text-result-neutral',
    unknown: 'border-result-unknown bg-result-unknown/10 text-result-unknown'
  };
  
  // Status-specific icons
  const StatusIcon = {
    true: CheckCircle2,
    false: XCircle,
    neutral: AlertTriangle,
    unknown: HelpCircle
  }[status];
  
  // Format confidence as percentage
  const confidencePercent = Math.round(confidenceScore * 100);
  
  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full border-2 shadow-md',
        statusClasses[status],
        sizeClasses[size],
        animate && 'animate-badge-pop',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center p-0.5">
        <StatusIcon 
          size={iconSize[size]} 
          strokeWidth={1.75} 
          className="transform scale-90" 
        />
        {size === 'lg' && (
          <span className="font-bold mt-0.5 text-xs">{confidencePercent}%</span>
        )}
      </div>
    </div>
  );
};

export default VerificationBadge;
