
import './Badge.css';

const VARIANTS = ['neutral', 'accent', 'success', 'danger'];

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) {
  const safeVariant = VARIANTS.includes(variant)
    ? variant
    : 'neutral';

  return (
    <span
      className={[
        'ui-badge',
        `ui-badge--${safeVariant}`,
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
