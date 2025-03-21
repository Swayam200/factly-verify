
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { ResultStatus } from '@/context/FactCheckContext';

interface VerificationBadgeProps {
  status: ResultStatus;
  confidenceScore: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

const statusConfig = {
  true: {
    icon: CheckCircle,
    label: 'True',
    bgColor: 'bg-result-true',
    textColor: 'text-result-true',
    borderColor: 'border-result-true',
    pulseColor: 'pulse-true',
  },
  false: {
    icon: XCircle,
    label: 'False',
    bgColor: 'bg-result-false',
    textColor: 'text-result-false',
    borderColor: 'border-result-false',
    pulseColor: 'pulse-false',
  },
  neutral: {
    icon: AlertCircle,
    label: 'Partially True',
    bgColor: 'bg-result-neutral',
    textColor: 'text-result-neutral',
    borderColor: 'border-result-neutral',
    pulseColor: 'pulse-neutral',
  },
  unknown: {
    icon: HelpCircle,
    label: 'Uncertain',
    bgColor: 'bg-result-unknown',
    textColor: 'text-result-unknown',
    borderColor: 'border-result-unknown',
    pulseColor: 'pulse-unknown',
  },
};

const sizeConfig = {
  sm: {
    container: 'h-8 gap-1.5 px-2.5 text-xs',
    icon: 14,
    score: 'text-xs',
  },
  md: {
    container: 'h-10 gap-2 px-3.5 text-sm',
    icon: 18,
    score: 'text-sm',
  },
  lg: {
    container: 'h-12 gap-2.5 px-5 text-base',
    icon: 22,
    score: 'text-base',
  },
  xl: {
    container: 'h-16 gap-3 px-6 text-lg',
    icon: 28,
    score: 'text-lg',
  },
};

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  confidenceScore,
  size = 'md',
  showLabel = true,
  className,
  animate = false,
}) => {
  const config = statusConfig[status];
  const dimensions = sizeConfig[size];
  const Icon = config.icon;
  
  // Format confidence score as percentage
  const formattedScore = `${Math.round(confidenceScore * 100)}%`;
  
  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center transition-all overflow-visible whitespace-nowrap',
        dimensions.container,
        `${config.textColor} border ${config.borderColor}`,
        animate && 'animate-bounce-in',
        className
      )}
    >
      <Icon 
        size={dimensions.icon} 
        className={cn(
          'flex-shrink-0',
          animate && 'animate-pulse-scale'
        )} 
      />
      
      {showLabel && (
        <span className="font-semibold">{config.label}</span>
      )}
      
      {confidenceScore > 0 && (
        <span className={cn(
          'font-mono font-medium',
          dimensions.score
        )}>
          {formattedScore}
        </span>
      )}
    </div>
  );
};

export default VerificationBadge;
