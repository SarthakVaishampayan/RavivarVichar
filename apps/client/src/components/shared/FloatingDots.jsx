import { clsx } from 'clsx';

const dotConfigs = [
  { color: 'orange', size: 'sm', x: '10%', y: '15%', delay: '0s', duration: '6s' },
  { color: 'green', size: 'md', x: '85%', y: '20%', delay: '1s', duration: '7s' },
  { color: 'blue', size: 'sm', x: '20%', y: '80%', delay: '2s', duration: '5s' },
  { color: 'red', size: 'lg', x: '75%', y: '70%', delay: '0.5s', duration: '8s' },
  { color: 'orange', size: 'md', x: '50%', y: '10%', delay: '1.5s', duration: '6.5s' },
  { color: 'blue', size: 'sm', x: '90%', y: '50%', delay: '3s', duration: '7.5s' },
  { color: 'green', size: 'lg', x: '5%', y: '60%', delay: '2.5s', duration: '6s' },
  { color: 'red', size: 'sm', x: '60%', y: '85%', delay: '1s', duration: '5.5s' },
];

export default function FloatingDots({ count = 5, className = '' }) {
  const dots = dotConfigs.slice(0, count);

  return (
    <div className={clsx('max-lg:hidden absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {dots.map((dot, i) => (
        <div
          key={i}
          className={clsx(
            'absolute',
            `dot-${dot.color}`,
            `dot-${dot.size}`,
            'animate-float'
          )}
          style={{
            left: dot.x,
            top: dot.y,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  );
}
