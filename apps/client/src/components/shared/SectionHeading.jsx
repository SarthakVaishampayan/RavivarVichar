import { clsx } from 'clsx';

export default function SectionHeading({
  label,
  title,
  description,
  align = 'center',
  className = '',
}) {
  return (
    <div
      className={clsx(
        'max-w-3xl mb-16',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      {label && <span className="section-label">{label}</span>}
      {title && <h2 className="section-title">{title}</h2>}
      {description && <p className="section-desc">{description}</p>}
    </div>
  );
}
