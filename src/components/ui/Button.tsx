'use client';

import { trackEvent } from '@/lib/analytics';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  eventName?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  eventName,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]';

  const variants = {
    primary: 'bg-primary text-text-primary hover:bg-primary-hover',
    secondary: 'bg-darkSurface text-white hover:bg-text-primary',
    outline: 'border-2 border-border text-text-primary hover:border-primary hover:text-primary',
  };

  const sizes = {
    sm: 'px-4 py-2 text-caption',
    md: 'px-6 py-3 text-body',
    lg: 'px-8 py-4 text-body-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={(e) => {
        if (eventName) trackEvent(eventName);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
