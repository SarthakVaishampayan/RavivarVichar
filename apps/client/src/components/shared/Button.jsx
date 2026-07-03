import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
};

export default function Button({
  children,
  variant = 'primary',
  href,
  to,
  onClick,
  className = '',
  arrow = false,
  type = 'button',
  disabled = false,
}) {
  const classes = clsx(variants[variant], className);

  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={18} />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
