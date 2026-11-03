import './Button.css';

const VARIANTS = ['primary', 'secondary', 'ghost'];
const SIZES = ['sm', 'md', 'lg'];

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    ...props
}) {
    const safeVariant = VARIANTS.includes(variant)
        ? variant
        : 'primary';

    const safeSize = SIZES.includes(size)
        ? size
        : 'md';

    return (
        <button
            type={type}
            className={[
                'ui-button',
                `ui-button--${safeVariant}`,
                `ui-button--${safeSize}`,
                className,
            ].filter(Boolean).join(' ')}
            {...props}
        >
            {children}
        </button>
    );
}
