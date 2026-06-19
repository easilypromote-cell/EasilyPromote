import { memo } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'container' | 'content' | 'reading';
  className?: string;
}

function Container({ children, size = 'container', className = '' }: ContainerProps) {
  const sizes = {
    container: 'max-w-container',
    content: 'max-w-content',
    reading: 'max-w-reading',
  };

  return (
    <div className={`mx-auto px-4 tablet:px-6 desktop:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}

export default memo(Container);
