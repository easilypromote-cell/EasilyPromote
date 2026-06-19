import { memo } from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-primary/10 text-text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-caption font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default memo(Badge);
