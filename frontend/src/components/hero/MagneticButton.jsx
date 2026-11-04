import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export default function MagneticButton({ children, className = '', strength = 0.18, ...props }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = {
    stiffness: 250,
    damping: 20,
    mass: 0.5,
  };

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  function handlePointerMove(event) {
    if (reducedMotion || event.pointerType !== 'mouse' || !ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((event.clientX - centerX) * strength);
    y.set((event.clientY - centerY) * strength);
  }

  function resetPosition() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="magnetic-button-wrapper"
      style={{
        x: reducedMotion ? 0 : springX,
        y: reducedMotion ? 0 : springY,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      onPointerCancel={resetPosition}
    >
      <div className={className} {...props}>
        {children}
      </div>
    </motion.div>
  );
}
