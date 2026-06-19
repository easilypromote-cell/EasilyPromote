import { memo } from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  className?: string;
}

function TestimonialCard({ quote, author, role, avatar, className = '' }: TestimonialCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-border p-8 min-w-[350px] ${className}`}>
      <p className="text-body-lg mb-6 italic text-text-secondary">"{quote}"</p>
      <div className="flex items-center gap-4">
        {avatar ? (
          <Image
            src={avatar}
            alt={author}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {author[0]}
          </div>
        )}
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-caption text-text-secondary">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(TestimonialCard);
