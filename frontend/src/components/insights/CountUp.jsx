import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export default function CountUp({ value, duration = 1.2, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reducedMotion || duration <= 0) {
      return;
    }

    let frameId;
    let startTime;

    function animate(timestamp) {
      if (startTime === undefined) {
        startTime = timestamp;
      }

      const elapsed = (timestamp - timestamp) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [inView, value, duration, reducedMotion]);

  const currentValue =
    reducedMotion || duration <= 0 || (inView && displayValue === value) ? value : displayValue;

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(currentValue);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {prefix}
        {new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value)}
        {suffix}
      </span>

      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
    </span>
  );
}
