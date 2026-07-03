import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Card({
  image,
  category,
  title,
  description,
  date,
  author,
  href,
  to,
  className = '',
  aspectRatio = '4/3',
}) {
  const Wrapper = ({ children }) => {
    if (to) return <Link to={to} className="block group">{children}</Link>;
    if (href) return <a href={href} className="block group" target="_blank" rel="noopener noreferrer">{children}</a>;
    return <div className="group">{children}</div>;
  };

  return (
    <Wrapper>
      <div className={clsx('card-hover overflow-hidden', className)}>
        {image && (
          <div className="relative overflow-hidden" style={{ aspectRatio }}>
            <img
              src={image}
              alt={title || ''}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {category && (
              <span className="absolute top-4 left-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-text-primary shadow-sm backdrop-blur-sm">
                {category}
              </span>
            )}
          </div>
        )}

        <div className="p-7">
          {date && (
            <p className="text-xs text-text-secondary mb-2">
              {new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}

          <h3 className="text-card text-text-primary mb-3 group-hover:text-primary-500 transition-colors duration-300">
            {title}
          </h3>

          {description && (
            <p className="text-body text-text-secondary line-clamp-3 mb-4">
              {description}
            </p>
          )}

          {author && (
            <p className="text-sm text-text-secondary mb-3">By {author}</p>
          )}

          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all duration-300">
            Read More <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Wrapper>
  );
}
