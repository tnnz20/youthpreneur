interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  title,
  description,
  className = '',
  titleClassName = 'text-3xl sm:text-4xl font-extrabold',
}: SectionHeadingProps) {
  return (
    <div className={`mx-auto mb-14 max-w-2xl text-center ${className}`}>
      <h2 className={`${titleClassName} text-brand-dark tracking-tight`}>{title}</h2>
      {description ? (
        <p className="text-brand-muted mt-3 text-sm sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
