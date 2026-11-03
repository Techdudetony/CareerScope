import { motion, useReducedMotion } from "motion/react";
import { motionPresets, motionTransitions } from "./motionPresets";

export default function Reveal({
    children,
    variant = "fadeUp",
    delay = 0,
    className,
}) {
    const reducedMotion = useReducedMotion();

    const selectedPreset = motionPresets[variant] ?? motionPresets.fadeUp;

    const variants = reducedMotion
        ? {
            hidden: { opacity: 1 },
            visible: { opacity: 1 },
          }
        : selectedPreset;

    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={
                reducedMotion ? { duration: 0 } : { ...motionTransitions.smooth, delay }
            }
        >
            {children}
        </motion.div>
    )
}