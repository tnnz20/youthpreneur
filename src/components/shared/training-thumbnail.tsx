import { useState } from 'react';

import { cn, resolveImageUrl } from '@/lib/utils';

interface TrainingThumbnailProps {
  src?: string | null;
  alt?: string;
  category?: string | null;
  className?: string;
  imageClassName?: string;
  aspectRatioClassName?: string;
}

function getCategoryToneClass(category?: string | null): string {
  const cat = (category ?? '').toLowerCase();

  if (cat.includes('digital') || cat.includes('teknologi') || cat.includes('iptek')) {
    return 'bg-brand-yellow';
  }
  if (cat.includes('agri') || cat.includes('wirausaha') || cat.includes('usaha')) {
    return 'bg-brand-purple';
  }
  if (cat.includes('kriya') || cat.includes('kreatif')) {
    return 'bg-brand-blue';
  }
  if (cat.includes('olahraga') || cat.includes('prestasi')) {
    return 'bg-brand-mint';
  }
  if (cat.includes('komunitas') || cat.includes('sosial') || cat.includes('pemuda')) {
    return 'bg-brand-peach';
  }

  return 'bg-brand-yellow';
}

export function TrainingThumbnail({
  src,
  alt = 'Thumbnail Program',
  category,
  className,
  imageClassName,
  aspectRatioClassName = 'h-48',
}: TrainingThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const resolved = resolveImageUrl(src);

  if (resolved && !hasError) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden bg-stone-100',
          aspectRatioClassName,
          className
        )}
      >
        <img
          src={resolved}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className={cn(
            'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
            imageClassName
          )}
        />
      </div>
    );
  }

  const bgColor = getCategoryToneClass(category);
  const displayText = category ? category.replace('&', '\n&') : 'Program Pelatihan';

  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center p-6 text-center select-none',
        bgColor,
        aspectRatioClassName,
        className
      )}
    >
      <span className="text-brand-dark text-lg leading-snug font-black tracking-tight drop-shadow-xs sm:text-xl">
        {displayText}
      </span>
    </div>
  );
}
