import { memo } from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

function SectionHeader({ badge, title, subtitle, align = 'center', className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {badge && (
        <span className="inline-block mb-4 px-3 py-1 bg-primary/10 text-text-primary rounded-full text-caption font-medium">
          {badge}
        </span>
      )}
      <h2 className="text-h2 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-body-lg text-text-secondary max-w-reading mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default memo(SectionHeader);
