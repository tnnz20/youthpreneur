interface SmartImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}

export function SmartImage({ src, fallbackSrc, alt, className }: SmartImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallbackSrc;
      }}
    />
  );
}
