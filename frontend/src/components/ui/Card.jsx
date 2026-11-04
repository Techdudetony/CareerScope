import './Card.css';

export default function Card({
  children,
  className = '',
  elevated = false,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={['ui-card', elevated ? 'ui-card--elevated' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}
